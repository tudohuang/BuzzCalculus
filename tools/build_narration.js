// 分節模式的旁白：每一句（beat）的 say 用 Azure 語音合成（REST），再把一課的句子接成「一課一支」mp3。
//
// 為什麼一課一支：一個 GitHub Release 最多 1000 個附件，317 課 × 平均 17 句 ≈ 5,500 支逐句的檔放不下；
// 一課一支是 317 支。播放器拿每一句的起訖毫秒數（t）在同一支檔裡跳（Range 串流，不用整支下載）。
//
// 產物：
//   media/narration-cache/<hash8>.mp3          逐句的原始合成檔（不進 git；media/ 整個忽略）。增量與續跑都靠它：
//                                              hash8 = sha1(聲音|語速|say) 的前 8 碼，字沒改就不重合成、不花額度。
//   media/narration/<lessonId>-<f8>.mp3        一課一支（不進 git）：照節、句的順序把逐句檔的音框接起來。
//                                              f8 = 這一支內容的 sha256 前 8 碼 —— 任何一句改了，檔名就換（舊檔不會被快取蓋住）。
//                                              上傳到 Release（make_media_manifest.js --narration），部署時 fetch_media.js 抓。
//   tools/content/course_v2/narration.json     進 git：每一課的 f、總長、大小、sha256，與每一句的 h（hash8）和 t（[起, 訖] 毫秒）。
//                                              build_course_v2.js 照它把 voice（f）與 t 併進出貨的課；hash 對不上（字改了沒重錄）的句子不帶 t。
//
// 接法：Azure 的輸出是固定位元率（audio-24khz-48kbitrate-mono-mp3 = MPEG-2 Layer III、24 kHz、48 kbps、單聲道），
// 每一格 576 個取樣 = 24 ms、144 bytes。接檔只在音框邊界接（去掉 ID3 與 Xing/Info 標頭框），所以每一句的起點都是 24 ms 的整數倍，
// 而且一課那一支的第 k 句就是逐句檔原封不動的位元組 —— --verify 直接比對位元組，再用 ffprobe（WSL 也可以）量總長。
// 每一支逐句檔的格式（版本、取樣率、位元率、聲道）都要一樣，不一樣就不接（報錯）。
//
// 金鑰：環境變數 AZURE_SPEECH_KEY、AZURE_SPEECH_REGION；沒有就讀倉庫根目錄的 azure*.txt（不進版控），照形狀認出金鑰與區域。
// 金鑰與檔案內容一律不印：錯誤訊息也先遮掉。
//
// 穩：同時最多 4 個請求（NARRATION_CONCURRENCY 可以調小）；429／5xx／連線錯誤照 Retry-After 或指數退避重試（最多 8 次）；
// 401／403 直接停（金鑰或區域錯了，重試只會一直被拒）。逐句檔一完成就寫進快取（先寫 .part 再改名），中斷之後再跑一次就從缺的接著做。
// 有句子合成失敗：其他課照樣接好、寫索引（那幾課留著上一版的檔與索引），最後 exit 1。
//
// 用法：node tools/build_narration.js               合成缺的、接成一課一支、寫 narration.json（需要金鑰；全都有了就不碰網路）
//       node tools/build_narration.js --dry-run     不連網：列出要合成幾句、多少字（估額度），不動任何檔
//       node tools/build_narration.js --check       不連網：每一句 say 都有對得上的錄音、每一課的檔在本機且雜湊正確
//       node tools/build_narration.js --verify      --check ＋ 位元組比對每一句的起訖 ＋ ffprobe 量每一支的總長（ffprobe 或 wsl -e ffprobe）
//       node tools/build_narration.js --prune-cache 順便刪掉快取裡已經沒有任何一句在用的逐句檔
//       node tools/build_narration.js --samples     試聽：同兩句話用每一個台灣中文神經語音各念一次 → docs/report/course-review/voice-samples/
"use strict";

const fs = require("fs");
const path = require("path");
const https = require("https");
const crypto = require("crypto");

const ROOT = path.join(__dirname, "..");
const LESSONS = path.join(ROOT, "tools", "content", "course_v2", "lessons");
const INDEX = path.join(ROOT, "tools", "content", "course_v2", "narration.json");
const OUT = path.join(ROOT, "media", "narration");
const CACHE = path.join(ROOT, "media", "narration-cache");
const SAMPLES = path.join(ROOT, "docs", "report", "course-review", "voice-samples");

// ── 聲音：只在這裡改（改了 hash 全部換掉，整批重合成）──
const VOICE = "zh-TW-HsiaoChenNeural";
const RATE = "+0%"; // SSML prosody rate；播放器另外有 1×／1.25×／1.5×
const FORMAT = "audio-24khz-48kbitrate-mono-mp3";
const SAMPLE_VOICES = ["zh-TW-HsiaoChenNeural", "zh-TW-HsiaoYuNeural", "zh-TW-YunJheNeural"];
const SAMPLE_TEXT = [
  "放二進去，二的平方加一，出來是五。",
  "h 越來越小，Q 就滑向 P，割線斜率一路往二擠。"
];
const CONCURRENCY = Math.max(1, Math.min(4, Number(process.env.NARRATION_CONCURRENCY) || 4));
const MAX_ATTEMPTS = 8;

const hashOf = (voice, rate, text) => crypto.createHash("sha1").update(`${voice}|${rate}|${text}`).digest("hex").slice(0, 8);
const sha256 = (buf) => crypto.createHash("sha256").update(buf).digest("hex");

/* ── 金鑰：不印、不寫、不回傳到任何訊息 ── */
let SECRET = null;
function redact(text) {
  let s = String(text || "");
  if (SECRET && SECRET.key) s = s.split(SECRET.key).join("[key]");
  return s.replace(/[A-Za-z0-9]{32,}/g, "[redacted]");
}
const REGIONS = ["eastasia", "southeastasia", "japaneast", "japanwest", "koreacentral", "eastus", "eastus2", "westus", "westus2", "westus3", "centralus", "northcentralus", "southcentralus", "westcentralus", "westeurope", "northeurope", "uksouth", "francecentral", "germanywestcentral", "switzerlandnorth", "swedencentral", "norwayeast", "australiaeast", "canadacentral", "centralindia", "brazilsouth", "uaenorth", "southafricanorth", "qatarcentral", "italynorth"];
function readSecretFile() {
  const files = fs.readdirSync(ROOT).filter((name) => /^azure.*\.txt$/i.test(name)).sort();
  for (const name of files) {
    const text = fs.readFileSync(path.join(ROOT, name), "utf8");
    let key = null;
    let region = null;
    let host = null;
    for (const raw of text.split(/\r?\n/)) {
      const line = raw.trim();
      if (!line) continue;
      const url = line.match(/https?:\/\/[^\s"'<>]+/);
      if (url) {
        try {
          const h = new URL(url[0]).hostname.toLowerCase();
          const m = h.match(/^([a-z0-9]+)\.(?:api\.cognitive\.microsoft\.com|tts\.speech\.microsoft\.com|stt\.speech\.microsoft\.com)$/);
          if (m && REGIONS.includes(m[1])) region = region || m[1];
          else host = host || h;
        } catch (_) { /* 不是網址 */ }
        continue;
      }
      // 「標籤: 值」或只有值
      const value = line.replace(/^[^:=]{1,24}[:=]\s*/, "").trim();
      const labelled = line !== value ? line.slice(0, line.length - value.length).toLowerCase() : "";
      const flat = value.toLowerCase().replace(/[\s_-]+/g, "");
      if (REGIONS.includes(flat) || (/region|location|區域|地區/.test(labelled) && /^[a-z]+\d?$/.test(flat))) { region = region || flat; continue; }
      if (!key && /^[A-Za-z0-9]{32,}$/.test(value)) key = value;
    }
    if (key) return { key, region, host };
  }
  return null;
}
function request(method, url, headers, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, { method, headers }, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }));
    });
    req.on("error", (e) => reject(new Error(redact(e.message))));
    req.setTimeout(60000, () => req.destroy(new Error("逾時")));
    if (body) req.write(body);
    req.end();
  });
}
let credentialsPromise = null;
function credentials() {
  // 同時好幾個請求：只認一次金鑰與區域
  if (!credentialsPromise) credentialsPromise = findCredentials();
  return credentialsPromise;
}
async function findCredentials() {
  let key = process.env.AZURE_SPEECH_KEY || null;
  let region = (process.env.AZURE_SPEECH_REGION || "").toLowerCase().replace(/\s+/g, "") || null;
  let host = null;
  if (!key) {
    const found = readSecretFile();
    if (found) ({ key, host } = found), (region = region || found.region);
  }
  if (!key) throw new Error("沒有語音金鑰：設 AZURE_SPEECH_KEY／AZURE_SPEECH_REGION，或在倉庫根目錄放 azure*.txt（不進版控）");
  SECRET = { key, region };
  if (!region) {
    // 檔案裡只有自訂網域、沒寫區域：拿聲音清單一個一個區域試（金鑰只對自己的區域回 200）
    for (const r of REGIONS) {
      const res = await request("GET", `https://${r}.tts.speech.microsoft.com/cognitiveservices/voices/list`, { "Ocp-Apim-Subscription-Key": key });
      if (res.status === 200) { region = r; break; }
    }
    if (!region) throw new Error(`認不出語音服務的區域${host ? "（檔案裡只有自訂網域）" : ""}：設 AZURE_SPEECH_REGION`);
    SECRET.region = region;
  }
  return SECRET;
}

/* ── 合成（重試：429／5xx／連線錯誤；401／403 整批停）── */
const escapeXml = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
class Fatal extends Error {}
async function synth(text, voice = VOICE, rate = RATE) {
  const { key, region } = await credentials();
  const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="zh-TW"><voice name="${voice}"><prosody rate="${rate}">${escapeXml(text)}</prosody></voice></speak>`;
  let last = "";
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    let res = null;
    try {
      res = await request("POST", `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
        "Ocp-Apim-Subscription-Key": key,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": FORMAT,
        "User-Agent": "buzzcalculus-narration"
      }, Buffer.from(ssml, "utf8"));
    } catch (error) {
      last = redact(error.message);
    }
    if (res && res.status === 200 && res.body.length > 1000) return res.body;
    if (res && (res.status === 401 || res.status === 403)) throw new Fatal(`語音服務拒絕（HTTP ${res.status}）：金鑰或區域不對`);
    if (res && !(res.status === 429 || res.status >= 500 || res.status === 200)) {
      throw new Error(`語音合成失敗：HTTP ${res.status} ${redact(res.body.toString("utf8").slice(0, 160))}`);
    }
    if (res) last = `HTTP ${res.status}`;
    const after = res && Number(res.headers["retry-after"]);
    const wait = Number.isFinite(after) && after > 0 ? after * 1000 : Math.min(60000, 1000 * 2 ** attempt);
    await sleep(wait + Math.floor(Math.random() * 500));
  }
  throw new Error(`語音合成失敗：重試 ${MAX_ATTEMPTS} 次（最後 ${last}）`);
}

/* ── mp3 音框（MPEG-1/2/2.5 Layer III；跳過 ID3 與 Xing/Info 標頭框）── */
const BITRATES = {
  1: [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320],
  2: [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160]
};
const RATES = { 3: [44100, 48000, 32000], 2: [22050, 24000, 16000], 0: [11025, 12000, 8000] };
// → [{ at, len, samples, rate, sig }]（只有音訊框；Xing/Info 標頭框不算）
function framesOf(buf) {
  let i = 0;
  if (buf.length > 10 && buf.toString("latin1", 0, 3) === "ID3") {
    i = 10 + ((buf[6] & 0x7f) << 21 | (buf[7] & 0x7f) << 14 | (buf[8] & 0x7f) << 7 | (buf[9] & 0x7f));
  }
  const frames = [];
  let first = true;
  while (i + 4 <= buf.length) {
    if (buf[i] !== 0xff || (buf[i + 1] & 0xe0) !== 0xe0) { i += 1; continue; }
    const ver = (buf[i + 1] >> 3) & 3; // 3 = MPEG-1, 2 = MPEG-2, 0 = MPEG-2.5
    const layer = (buf[i + 1] >> 1) & 3; // 1 = Layer III
    const bri = (buf[i + 2] >> 4) & 15;
    const sri = (buf[i + 2] >> 2) & 3;
    const pad = (buf[i + 2] >> 1) & 1;
    if (ver === 1 || layer !== 1 || bri === 0 || bri === 15 || sri === 3) { i += 1; continue; }
    const rate = RATES[ver][sri];
    const kbps = BITRATES[ver === 3 ? 1 : 2][bri];
    const samples = ver === 3 ? 1152 : 576;
    const len = Math.floor(((ver === 3 ? 144 : 72) * kbps * 1000) / rate) + pad;
    if (len < 4) { i += 1; continue; }
    const head = buf.toString("latin1", i + 4, Math.min(i + len, buf.length));
    const info = first && (head.includes("Xing") || head.includes("Info"));
    first = false;
    // 聲道模式在第 4 個位元組的高兩位
    if (!info) frames.push({ at: i, len: Math.min(len, buf.length - i), samples, rate, sig: `${ver}/${rate}/${kbps}/${buf[i + 3] >> 6}` });
    i += len;
  }
  return frames;
}
function mp3Ms(buf) {
  const frames = framesOf(buf);
  if (!frames.length) throw new Error("不是 mp3（數不到音框）");
  const samples = frames.reduce((s, f) => s + f.samples, 0);
  return Math.round((samples / frames[0].rate) * 1000);
}
// 一支逐句檔 → 只留音訊框的位元組（去掉 ID3、Xing/Info、尾巴的雜訊）＋格式簽名
function audioOf(buf) {
  const frames = framesOf(buf);
  if (!frames.length) throw new Error("不是 mp3（數不到音框）");
  const sig = frames[0].sig;
  if (frames.some((f) => f.sig !== sig)) throw new Error("同一支檔裡音框格式不一致（不是固定位元率？）");
  return { data: Buffer.concat(frames.map((f) => buf.subarray(f.at, f.at + f.len))), samples: frames.reduce((s, f) => s + f.samples, 0), rate: frames[0].rate, sig };
}
// 一課的逐句檔（照順序）→ 一支 mp3 ＋ 每一句的 [起, 訖] 毫秒
function pack(clips) {
  let samples = 0;
  let sig = null;
  let rate = 0;
  const parts = [];
  const spans = clips.map((buf) => {
    const a = audioOf(buf);
    if (sig && a.sig !== sig) throw new Error(`逐句檔的格式不一致（${sig} vs ${a.sig}）：不能直接接`);
    sig = a.sig;
    rate = a.rate;
    const start = Math.round((samples / rate) * 1000);
    samples += a.samples;
    parts.push(a.data);
    return [start, Math.round((samples / rate) * 1000)];
  });
  return { buf: Buffer.concat(parts), spans, ms: Math.round((samples / rate) * 1000) };
}

/* ── 課文裡的 say ── */
function lessonsWithSay() {
  const out = [];
  fs.readdirSync(LESSONS).filter((n) => n.endsWith(".json")).sort().forEach((name) => {
    const L = JSON.parse(fs.readFileSync(path.join(LESSONS, name), "utf8"));
    const beats = [];
    (L.sections || []).forEach((sec, si) => (sec.beats || []).forEach((b, bi) => {
      if (typeof b.say === "string" && b.say.trim()) beats.push({ key: `${si}-${bi}`, say: b.say.trim(), h: hashOf(VOICE, RATE, b.say.trim()) });
    }));
    if (beats.length) out.push({ id: L.id, beats });
  });
  return out;
}
const cacheOf = (h) => path.join(CACHE, `${h}.mp3`);
const lessonFile = (id, f) => path.join(OUT, `${id}-${f}.mp3`);
const emptyIndex = () => ({ voice: VOICE, rate: RATE, format: FORMAT, layout: "lesson", lessons: {} });
function readIndex() {
  if (!fs.existsSync(INDEX)) return emptyIndex();
  const index = JSON.parse(fs.readFileSync(INDEX, "utf8"));
  // 舊格式（一句一支，clips）：當作沒有 —— 重跑 build 會從快取（或舊的逐句檔）重接
  return index.lessons ? index : emptyIndex();
}
// 出貨用：這一課的錄音（f）與每一句的 t；字改過（hash 對不上）的句子不給 t。build_course_v2 與 validate_course_v2 共用。
function voiceOf(index, lesson) {
  const entry = index && index.lessons && index.lessons[lesson.id];
  if (!entry) return null;
  const beats = {};
  (lesson.sections || []).forEach((sec, si) => (sec.beats || []).forEach((b, bi) => {
    const got = entry.beats[`${si}-${bi}`];
    if (got && typeof b.say === "string" && got.h === hashOf(VOICE, RATE, b.say.trim())) beats[`${si}-${bi}`] = got.t;
  }));
  return Object.keys(beats).length ? { f: entry.f, beats } : null;
}

// 舊版（一句一支：media/narration/<課>/<節>-<句>-<hash8>.mp3）留在本機的檔：搬進快取，不用重合成
function adoptLegacy() {
  if (!fs.existsSync(OUT)) return 0;
  let n = 0;
  for (const dir of fs.readdirSync(OUT)) {
    const full = path.join(OUT, dir);
    if (!fs.statSync(full).isDirectory()) continue;
    for (const name of fs.readdirSync(full)) {
      const m = /^\d+-\d+-([0-9a-f]{8})\.mp3$/.exec(name);
      if (!m || fs.existsSync(cacheOf(m[1]))) continue;
      const buf = fs.readFileSync(path.join(full, name));
      try { audioOf(buf); } catch (_e) { continue; }
      fs.mkdirSync(CACHE, { recursive: true });
      fs.writeFileSync(cacheOf(m[1]), buf);
      n += 1;
    }
  }
  return n;
}
const cached = (h) => {
  if (!fs.existsSync(cacheOf(h))) return false;
  try { audioOf(fs.readFileSync(cacheOf(h))); return true; } catch (_e) { return false; }
};

async function pool(items, limit, work) {
  let next = 0;
  let stop = null;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length && !stop) {
      const item = items[next++];
      try { await work(item); } catch (error) { if (error instanceof Fatal) stop = error; else throw error; }
    }
  });
  await Promise.all(runners);
  if (stop) throw stop;
}

function writeIndex(index) {
  const ids = Object.keys(index.lessons).sort();
  // 一課一段、一句一行（diff 好讀）
  const rows = ids.map((id) => {
    const e = index.lessons[id];
    const beats = Object.entries(e.beats).map(([k, b]) => `        ${JSON.stringify(k)}: ${JSON.stringify(b)}`).join(",\n");
    return `    ${JSON.stringify(id)}: {\n      "f": ${JSON.stringify(e.f)}, "ms": ${e.ms}, "bytes": ${e.bytes}, "sha256": ${JSON.stringify(e.sha256)},\n      "beats": {\n${beats}\n      }\n    }`;
  });
  fs.writeFileSync(INDEX, `{\n  "voice": ${JSON.stringify(VOICE)},\n  "rate": ${JSON.stringify(RATE)},\n  "format": ${JSON.stringify(FORMAT)},\n  "layout": "lesson",\n  "lessons": {\n${rows.join(",\n")}\n  }\n}\n`);
}

async function build({ dryRun = false, pruneCache = false } = {}) {
  const lessons = lessonsWithSay();
  const adopted = dryRun ? 0 : adoptLegacy();
  if (adopted) console.log(`舊版逐句檔搬進快取：${adopted} 支`);
  const say = new Map();
  lessons.forEach((L) => L.beats.forEach((b) => say.set(b.h, b.say)));
  const missing = [...say.keys()].filter((h) => !cached(h));
  const chars = missing.reduce((n, h) => n + say.get(h).length, 0);
  console.log(`旁白：${lessons.length} 課、${lessons.reduce((n, L) => n + L.beats.length, 0)} 句（不重複 ${say.size}），要合成 ${missing.length} 句、${chars} 字（${VOICE}，同時 ${CONCURRENCY} 個）`);
  if (dryRun) return;

  const failed = new Map();
  let made = 0;
  if (missing.length) {
    fs.mkdirSync(CACHE, { recursive: true });
    try {
      await pool(missing, CONCURRENCY, async (h) => {
        try {
          const buf = await synth(say.get(h));
          audioOf(buf);
          fs.writeFileSync(`${cacheOf(h)}.part`, buf);
          fs.renameSync(`${cacheOf(h)}.part`, cacheOf(h));
          made += 1;
          if (made % 25 === 0 || made === missing.length) process.stdout.write(`  合成 ${made} / ${missing.length}\n`);
        } catch (error) {
          if (error instanceof Fatal) throw error;
          failed.set(h, redact(error.message));
        }
      });
    } catch (error) {
      console.error(redact(error.message));
      console.error(`已合成的 ${made} 句都在 media/narration-cache/；修好之後再跑一次會從缺的接著做。`);
      process.exit(1);
    }
  }

  // 接成一課一支：句子都有錄音的課才接；缺句子的課留著上一版（播放器只會播 hash 對得上的句子）
  const old = readIndex();
  const index = emptyIndex();
  let packed = 0;
  let kept = 0;
  const partial = [];
  for (const L of lessons) {
    if (L.beats.some((b) => !cached(b.h))) {
      partial.push(L.id);
      if (old.lessons[L.id]) index.lessons[L.id] = old.lessons[L.id];
      continue;
    }
    const { buf, spans, ms } = pack(L.beats.map((b) => fs.readFileSync(cacheOf(b.h))));
    const sum = sha256(buf);
    const f = sum.slice(0, 8);
    const prev = old.lessons[L.id];
    const file = lessonFile(L.id, f);
    if (!fs.existsSync(file) || sha256(fs.readFileSync(file)) !== sum) {
      fs.mkdirSync(OUT, { recursive: true });
      fs.writeFileSync(`${file}.part`, buf);
      fs.renameSync(`${file}.part`, file);
    }
    if (prev && prev.sha256 === sum) kept += 1; else packed += 1;
    index.lessons[L.id] = { f, ms, bytes: buf.length, sha256: sum, beats: Object.fromEntries(L.beats.map((b, k) => [b.key, { h: b.h, t: spans[k] }])) };
  }
  // 本機留著的舊檔（字改過、句子刪了、舊的逐句資料夾）清掉：免得被列進 Release
  const want = new Set(Object.entries(index.lessons).map(([id, e]) => path.basename(lessonFile(id, e.f))));
  if (fs.existsSync(OUT)) {
    for (const name of fs.readdirSync(OUT)) {
      const full = path.join(OUT, name);
      if (fs.statSync(full).isDirectory()) fs.rmSync(full, { recursive: true, force: true });
      else if (!want.has(name)) fs.rmSync(full);
    }
  }
  if (pruneCache && fs.existsSync(CACHE)) {
    let n = 0;
    for (const name of fs.readdirSync(CACHE)) if (!say.has(name.replace(/\.mp3(\.part)?$/, ""))) { fs.rmSync(path.join(CACHE, name)); n += 1; }
    console.log(`快取清掉 ${n} 支沒在用的逐句檔`);
  }
  writeIndex(index);
  summary(index);
  console.log(`一課一支：新接 ${packed}、沒變 ${kept}${partial.length ? `、缺句子沒接 ${partial.length}（${partial.slice(0, 5).join("、")}${partial.length > 5 ? "…" : ""}）` : ""}`);
  if (failed.size) {
    [...failed.entries()].slice(0, 10).forEach(([h, msg]) => console.error(`  ${say.get(h).slice(0, 16)}…：${msg}`));
    console.error(`合成失敗 ${failed.size} 句。其他的都已存進快取，再跑一次只補這幾句。`);
    process.exit(1);
  }
}

function summary(index) {
  let ms = 0;
  let bytes = 0;
  const ids = Object.keys(index.lessons);
  ids.forEach((id) => {
    const e = index.lessons[id];
    ms += e.ms;
    bytes += e.bytes;
    if (ids.length <= 12) console.log(`  ${id}：${Object.keys(e.beats).length} 句、${(e.ms / 1000).toFixed(1)} 秒、${(e.bytes / 1024).toFixed(0)} KB`);
  });
  console.log(`  合計 ${ids.length} 支、${(ms / 60000).toFixed(1)} 分鐘、${(bytes / 1048576).toFixed(2)} MB`);
}

function check({ verify = false } = {}) {
  const lessons = lessonsWithSay();
  const index = readIndex();
  const bad = [];
  let beats = 0;
  lessons.forEach((L) => {
    const e = index.lessons[L.id];
    if (!e) { bad.push(`${L.id}：narration.json 沒有這一課`); return; }
    L.beats.forEach((b) => {
      beats += 1;
      if (!e.beats[b.key] || e.beats[b.key].h !== b.h) bad.push(`${L.id}/${b.key}：沒有這一句或字改過了`);
    });
    const file = lessonFile(L.id, e.f);
    if (!fs.existsSync(file)) { bad.push(`${L.id}：本機沒有 ${path.relative(ROOT, file)}`); return; }
    const buf = fs.readFileSync(file);
    if (sha256(buf) !== e.sha256) { bad.push(`${L.id}：檔案雜湊不符`); return; }
    if (!verify) return;
    // 每一句的起訖：起點是 24ms 整數倍的音框邊界；那一段位元組就是逐句檔（快取有的話）
    const frames = framesOf(buf);
    const per = frames.length ? (frames[0].samples / frames[0].rate) * 1000 : 0;
    const total = Math.round(frames.length * per);
    if (Math.abs(total - e.ms) > 1) bad.push(`${L.id}：音框數出 ${total} ms，索引寫 ${e.ms}`);
    Object.entries(e.beats).forEach(([key, b]) => {
      const [s, t] = b.t;
      if (!(t > s) || Math.abs(s / per - Math.round(s / per)) > 1e-6) { bad.push(`${L.id}/${key}：起訖 ${s}–${t} 不在音框邊界`); return; }
      if (!cached(b.h)) return;
      const clip = audioOf(fs.readFileSync(cacheOf(b.h)));
      const from = frames[Math.round(s / per)];
      if (!from || !buf.subarray(from.at, from.at + clip.data.length).equals(clip.data)) bad.push(`${L.id}/${key}：${s} ms 那一段的位元組跟逐句檔不同`);
      else if (Math.round((clip.samples / clip.rate) * 1000) !== t - s) bad.push(`${L.id}/${key}：長度 ${t - s} ms 跟逐句檔不同`);
    });
    const probed = ffprobeMs(file);
    if (probed === null) { if (!check.warned) console.warn("  （沒有 ffprobe，也沒有 wsl -e ffprobe：略過 ffprobe 量長度）"); check.warned = true; }
    else if (Math.abs(probed - e.ms) > 30) bad.push(`${L.id}：ffprobe 量出 ${probed} ms，索引寫 ${e.ms}`);
  });
  if (bad.length) {
    bad.slice(0, 40).forEach((line) => console.error("  " + line));
    console.error(`旁白不同步：${bad.length} 處（node tools/build_narration.js）`);
    process.exit(1);
  }
  console.log(`旁白 ${verify ? "verify" : "check"} OK：${lessons.length} 課、${beats} 句都有檔${verify ? "（位元組逐句比對、ffprobe 量長度）" : ""}`);
}
function ffprobeMs(file) {
  const { spawnSync } = require("child_process");
  const args = ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1"];
  let r = spawnSync("ffprobe", [...args, file], { encoding: "utf8" });
  if (r.error || r.status !== 0) {
    const wslPath = file.replace(/^([A-Za-z]):[\\/]/, (_m, d) => `/mnt/${d.toLowerCase()}/`).replace(/\\/g, "/");
    r = spawnSync("wsl", ["-e", "ffprobe", ...args, wslPath], { encoding: "utf8" });
    if (r.error || r.status !== 0) return null;
  }
  const s = Number(String(r.stdout).trim());
  return Number.isFinite(s) ? Math.round(s * 1000) : null;
}

async function samples() {
  fs.mkdirSync(SAMPLES, { recursive: true });
  for (const voice of SAMPLE_VOICES) {
    const buf = await synth(SAMPLE_TEXT.join(""), voice, RATE);
    const file = path.join(SAMPLES, `${voice.replace(/^zh-TW-|Neural$/g, "")}.mp3`);
    fs.writeFileSync(file, buf);
    console.log(`  ${path.relative(ROOT, file)}  ${(mp3Ms(buf) / 1000).toFixed(1)}s`);
  }
}

module.exports = { hashOf, mp3Ms, framesOf, pack, voiceOf, readIndex, VOICE, RATE };

if (require.main === module) {
  const argv = process.argv;
  const run = argv.includes("--check") ? Promise.resolve().then(() => check())
    : argv.includes("--verify") ? Promise.resolve().then(() => check({ verify: true }))
    : argv.includes("--samples") ? samples()
    : build({ dryRun: argv.includes("--dry-run"), pruneCache: argv.includes("--prune-cache") });
  run.catch((error) => {
    console.error(redact(error && error.message ? error.message : error));
    process.exit(1);
  });
}
