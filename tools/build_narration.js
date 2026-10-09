// 分節模式的旁白：每一句（beat）的 say → 一支 mp3（Azure 語音合成，REST）。
//
// 產物：
//   media/narration/<lessonId>/<節>-<句>-<hash8>.mp3   不進 git（media/ 整個忽略）；上傳到 Release（media-v2），部署時 fetch_media.js 抓
//   tools/content/course_v2/narration.json              進 git：每一句的 hash、毫秒數、大小、sha256。
//                                                       build_course_v2.js 照它把 au（hash8）與 ms 併進出貨的 beat，
//                                                       make_media_manifest.js 照它把檔案列進 media/manifest.json。
// hash8 = sha1(聲音|語速|say) 的前 8 碼：字沒改就略過（不重合成、不花額度）；字改了檔名跟著換，舊檔不會被快取蓋住。
// 毫秒數直接數 mp3 的音框（不靠 ffprobe）。
//
// 金鑰：環境變數 AZURE_SPEECH_KEY、AZURE_SPEECH_REGION；沒有就讀倉庫根目錄的 azure*.txt（不進版控），照形狀認出金鑰與區域。
// 金鑰與檔案內容一律不印：錯誤訊息也先遮掉。
//
// 用法：node tools/build_narration.js             合成缺的、字改過的（需要金鑰；全都有了就不碰網路）
//       node tools/build_narration.js --check     不連網：每一句 say 都有對得上的檔（narration.json 與本機檔案），不對 exit 1
//       node tools/build_narration.js --samples   試聽：同兩句話用每一個台灣中文神經語音各念一次 → docs/report/course-review/voice-samples/
"use strict";

const fs = require("fs");
const path = require("path");
const https = require("https");
const crypto = require("crypto");

const ROOT = path.join(__dirname, "..");
const LESSONS = path.join(ROOT, "tools", "content", "course_v2", "lessons");
const INDEX = path.join(ROOT, "tools", "content", "course_v2", "narration.json");
const OUT = path.join(ROOT, "media", "narration");
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
async function credentials() {
  if (SECRET) return SECRET;
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

/* ── 合成 ── */
const escapeXml = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
async function synth(text, voice = VOICE, rate = RATE) {
  const { key, region } = await credentials();
  const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="zh-TW"><voice name="${voice}"><prosody rate="${rate}">${escapeXml(text)}</prosody></voice></speak>`;
  for (let attempt = 1; ; attempt += 1) {
    const res = await request("POST", `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      "Ocp-Apim-Subscription-Key": key,
      "Content-Type": "application/ssml+xml",
      "X-Microsoft-OutputFormat": FORMAT,
      "User-Agent": "buzzcalculus-narration"
    }, Buffer.from(ssml, "utf8"));
    if (res.status === 200 && res.body.length > 1000) return res.body;
    if ((res.status === 429 || res.status >= 500) && attempt < 6) {
      await new Promise((r) => setTimeout(r, 1500 * attempt));
      continue;
    }
    throw new Error(`語音合成失敗：HTTP ${res.status} ${redact(res.body.toString("utf8").slice(0, 160))}`);
  }
}

/* ── mp3 長度：數音框（MPEG-1/2/2.5 Layer III；跳過 ID3 與 Xing/Info 標頭框）── */
const BITRATES = {
  1: [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320],
  2: [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160]
};
const RATES = { 3: [44100, 48000, 32000], 2: [22050, 24000, 16000], 0: [11025, 12000, 8000] };
function mp3Ms(buf) {
  let i = 0;
  if (buf.length > 10 && buf.toString("latin1", 0, 3) === "ID3") {
    i = 10 + ((buf[6] & 0x7f) << 21 | (buf[7] & 0x7f) << 14 | (buf[8] & 0x7f) << 7 | (buf[9] & 0x7f));
  }
  let samples = 0;
  let rate = 0;
  let frames = 0;
  while (i + 4 <= buf.length) {
    if (buf[i] !== 0xff || (buf[i + 1] & 0xe0) !== 0xe0) { i += 1; continue; }
    const ver = (buf[i + 1] >> 3) & 3; // 3 = MPEG-1, 2 = MPEG-2, 0 = MPEG-2.5
    const layer = (buf[i + 1] >> 1) & 3; // 1 = Layer III
    const bri = (buf[i + 2] >> 4) & 15;
    const sri = (buf[i + 2] >> 2) & 3;
    const pad = (buf[i + 2] >> 1) & 1;
    if (ver === 1 || layer !== 1 || bri === 0 || bri === 15 || sri === 3) { i += 1; continue; }
    const sr = RATES[ver][sri];
    const kbps = BITRATES[ver === 3 ? 1 : 2][bri];
    const per = ver === 3 ? 1152 : 576;
    const len = Math.floor(((ver === 3 ? 144 : 72) * kbps * 1000) / sr) + pad;
    if (len < 4) { i += 1; continue; }
    const head = buf.toString("latin1", i + 4, Math.min(i + len, buf.length));
    const info = frames === 0 && (head.includes("Xing") || head.includes("Info"));
    if (!info) samples += per;
    rate = sr;
    frames += 1;
    i += len;
  }
  if (!rate || !samples) throw new Error("不是 mp3（數不到音框）");
  return Math.round((samples / rate) * 1000);
}

/* ── 課文裡的 say ── */
function beatsWithSay() {
  const list = [];
  fs.readdirSync(LESSONS).filter((n) => n.endsWith(".json")).sort().forEach((name) => {
    const L = JSON.parse(fs.readFileSync(path.join(LESSONS, name), "utf8"));
    (L.sections || []).forEach((sec, si) => (sec.beats || []).forEach((b, bi) => {
      if (typeof b.say === "string" && b.say.trim()) list.push({ lesson: L.id, si, bi, say: b.say.trim(), key: `${L.id}/${si}-${bi}` });
    }));
  });
  return list;
}
const fileOf = (item, h) => path.join(OUT, item.lesson, `${item.si}-${item.bi}-${h}.mp3`);
const readIndex = () => (fs.existsSync(INDEX) ? JSON.parse(fs.readFileSync(INDEX, "utf8")) : { voice: VOICE, rate: RATE, clips: {} });

async function build() {
  const items = beatsWithSay();
  const old = readIndex();
  const clips = {};
  let made = 0;
  let kept = 0;
  for (const item of items) {
    const h = hashOf(VOICE, RATE, item.say);
    const file = fileOf(item, h);
    const prev = old.clips[item.key];
    if (fs.existsSync(file)) {
      const buf = fs.readFileSync(file);
      const sum = sha256(buf);
      if (prev && prev.h === h && prev.sha256 === sum) { clips[item.key] = prev; kept += 1; continue; }
      if (!prev || prev.h !== h || !prev.sha256) { clips[item.key] = { h, ms: mp3Ms(buf), bytes: buf.length, sha256: sum }; kept += 1; continue; }
    }
    const buf = await synth(item.say);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, buf);
    clips[item.key] = { h, ms: mp3Ms(buf), bytes: buf.length, sha256: sha256(buf) };
    made += 1;
    process.stdout.write(`  ${item.key}  ${(clips[item.key].ms / 1000).toFixed(1)}s\n`);
  }
  // 本機留著的舊檔（字改過、句子刪了）清掉：免得被列進 Release
  const want = new Set(items.map((item) => fileOf(item, clips[item.key].h)));
  if (fs.existsSync(OUT)) {
    for (const lesson of fs.readdirSync(OUT)) {
      const dir = path.join(OUT, lesson);
      if (!fs.statSync(dir).isDirectory()) continue;
      for (const name of fs.readdirSync(dir)) if (!want.has(path.join(dir, name))) fs.rmSync(path.join(dir, name));
      if (!fs.readdirSync(dir).length) fs.rmdirSync(dir);
    }
  }
  const sorted = {};
  Object.keys(clips).sort().forEach((k) => { sorted[k] = clips[k]; });
  // 一句一行（diff 好讀）
  const rows = Object.entries(sorted).map(([k, c]) => `    ${JSON.stringify(k)}: ${JSON.stringify(c)}`);
  fs.writeFileSync(INDEX, `{\n  "voice": ${JSON.stringify(VOICE)},\n  "rate": ${JSON.stringify(RATE)},\n  "format": ${JSON.stringify(FORMAT)},\n  "clips": {\n${rows.join(",\n")}\n  }\n}\n`);
  summary(items, sorted);
  console.log(`旁白：${items.length} 句，新合成 ${made}、沿用 ${kept}（${VOICE}）`);
}

function summary(items, clips) {
  const per = {};
  items.forEach((item) => {
    const c = clips[item.key];
    if (!c) return;
    per[item.lesson] = per[item.lesson] || { n: 0, ms: 0, bytes: 0 };
    per[item.lesson].n += 1;
    per[item.lesson].ms += c.ms;
    per[item.lesson].bytes += c.bytes;
  });
  let ms = 0;
  let bytes = 0;
  Object.entries(per).forEach(([id, p]) => {
    ms += p.ms;
    bytes += p.bytes;
    console.log(`  ${id}：${p.n} 句、${(p.ms / 1000).toFixed(1)} 秒、${(p.bytes / 1024).toFixed(0)} KB`);
  });
  console.log(`  合計 ${(ms / 1000).toFixed(1)} 秒、${(bytes / 1048576).toFixed(2)} MB`);
}

function check() {
  const items = beatsWithSay();
  const index = readIndex();
  const bad = [];
  items.forEach((item) => {
    const h = hashOf(VOICE, RATE, item.say);
    const c = index.clips[item.key];
    if (!c || c.h !== h) { bad.push(`${item.key}：narration.json 沒有這一句或字改過了`); return; }
    const file = fileOf(item, h);
    if (!fs.existsSync(file)) bad.push(`${item.key}：本機沒有 ${path.relative(ROOT, file)}`);
    else if (sha256(fs.readFileSync(file)) !== c.sha256) bad.push(`${item.key}：檔案雜湊不符`);
  });
  if (bad.length) {
    bad.forEach((line) => console.error("  " + line));
    console.error(`旁白不同步：${bad.length} 句（node tools/build_narration.js）`);
    process.exit(1);
  }
  console.log(`旁白 check OK：${items.length} 句都有檔`);
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

module.exports = { hashOf, mp3Ms, VOICE, RATE };

if (require.main === module) {
  const run = process.argv.includes("--check") ? Promise.resolve().then(check)
    : process.argv.includes("--samples") ? samples()
    : build();
  run.catch((error) => {
    console.error(redact(error && error.message ? error.message : error));
    process.exit(1);
  });
}
