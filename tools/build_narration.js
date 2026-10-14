// 分節模式的旁白：每一句（beat）的 say 用 Azure 語音合成（REST），再把一課的句子接成「一課一支」mp3。
//
// 為什麼一課一支：一個 GitHub Release 最多 1000 個附件，317 課 × 平均 17 句 ≈ 5,500 支逐句的檔放不下；
// 一課一支是 317 支。播放器拿每一句的起訖毫秒數（t）在同一支檔裡跳（Range 串流，不用整支下載）。
//
// 產物：
//   media/narration-cache/<格式>/<hash8>.mp3   逐句的原始合成檔（不進 git；media/ 整個忽略）。增量與續跑都靠它：
//                                              hash8 = sha1(聲音|語速|say) 的前 8 碼，字沒改就不重合成、不花額度。
//                                              按輸出格式分資料夾（FORMAT_DIR）：換格式＝換資料夾，舊格式的檔不會被混進來接。
//   media/narration/<lessonId>-<f8>.mp3        一課一支（不進 git）：照節、句的順序把逐句檔的音框接起來。女聲在這裡，
//   media/narration/m/<lessonId>-<f8>.mp3      男聲在 m/ 底下（兩個聲音見 VOICES）。
//                                              f8 = 這一支內容的 sha256 前 8 碼 —— 任何一句改了，檔名就換（舊檔不會被快取蓋住）。
//                                              上傳到 Release（make_media_manifest.js --narration），部署時 fetch_media.js 抓。
//   tools/content/course_v2/narration.json     進 git：lessons.<課>.<聲音 f／m> = 那一個聲音那一支的 f、總長、大小、sha256，
//                                              與每一句的 h（hash8）和 t（[起, 訖] 毫秒）。
//                                              build_course_v2.js 照它把 voice（f）與 t 併進出貨的課；hash 對不上（字改了沒重錄）的句子不帶 t。
//
// 接法：Azure 的輸出是固定位元率（audio-16khz-32kbitrate-mono-mp3 = MPEG-2 Layer III、16 kHz、32 kbps、單聲道），
// 每一格 576 個取樣 = 36 ms、144 bytes（格長與毫秒一律從每一格的標頭算，不寫死；舊的 24 kHz／48 kbps 是 24 ms 一格）。
// 2026-10 從 24 kHz／48 kbps 降到 16 kHz／32 kbps：旁白是單人講話，16 kHz 取樣（頻寬 8 kHz）聽得清楚，檔案小三分之一（流量）。
// 接檔只在音框邊界接（去掉 ID3 與 Xing/Info 標頭框），所以每一句的起點都是一格（36 ms）的整數倍，
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
// 逐字時間點（黑板 v2）：有黑板（beat.board）的句子改用 Azure Speech SDK 合成（tools/package.json；cd tools && npm install），
// 同一次合成拿到音訊與每一個詞被念到的毫秒（WordBoundary）。存在快取旁邊的 <hash8>.words.json，索引的那一句多一個
// "w": [[say 裡的字元位置, 從這一句開頭算的毫秒], …]。build_course_v2.js 用它把 board 動作的 on（念到哪個詞）換成毫秒。
// SDK 的音訊跟 REST 不是位元組一樣（同一段字、兩次合成也不一樣，但詞的時間點一樣）：有黑板的課整支 mp3 會換掉（f8 換），要上傳新的 Release。
//
// 上傳之前不能讓網站指到還不存在的檔：一課的 mp3 換了，而舊的那一支有列在 media/manifest.json（已經上傳），
// 索引就把舊的留在那一課的 "prev"（f、t）。build_course_v2.js 只出貨清單上有的那一支：新的還沒上傳就出貨舊的（黑板的時間點
// 照每一句的長度比例換算，差不到一格音框）。新的上傳、跑過 make_media_manifest.js --narration <tag> --add 之後，下一次 build 自動換成新的，
// 再跑一次 build_narration.js 就把 prev 清掉。
//
// 用法：node tools/build_narration.js               合成缺的、接成一課一支、寫 narration.json（需要金鑰；全都有了就不碰網路）
//       node tools/build_narration.js --dry-run     不連網：列出要合成幾句、多少字（估額度），不動任何檔
//       node tools/build_narration.js --check       不連網：每一句 say 都有對得上的錄音、每一課的檔在本機且雜湊正確
//       node tools/build_narration.js --verify      --check ＋ 位元組比對每一句的起訖 ＋ ffprobe 量每一支的總長（ffprobe 或 wsl -e ffprobe）
//       node tools/build_narration.js --prune-cache 順便刪掉快取裡已經沒有任何一句在用的逐句檔
//       --voice f|m|f,m                             上面幾個都可以只做某一個聲音（沒給 = 兩個都做）
//       node tools/build_narration.js --try <課> [--voice m]  試聽一整課（不動快取與索引）→ docs/report/course-review/voice-try/
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
const FORMAT_DIR = "16k32";
const CACHE = path.join(ROOT, "media", "narration-cache", FORMAT_DIR);
const SAMPLES = path.join(ROOT, "docs", "report", "course-review", "voice-samples");

// ── 聲音：只在這裡改（改了 hash 全部換掉，整批重合成）──
// 兩個聲音，學的人自己選（records.settings.narrVoice）：f 女聲（預設）、m 男聲。每一句每一個聲音各錄一次（hash 含聲音名，快取不會混）。
// 檔案：女聲 media/narration/<課>-<f8>.mp3（跟只有一個聲音的時候同一個位置，已上傳的舊檔照樣當 prev）、
//       男聲 media/narration/m/<課>-<f8>.mp3（Release 附件名 narration.m.<課>-<f8>.mp3）。兩個聲音 317 × 2 = 634 支，一個 Release 放得下。
const VOICES = { f: "zh-TW-HsiaoChenNeural", m: "zh-TW-YunJheNeural" };
const VKEYS = Object.keys(VOICES);
const VOICE = VOICES.f;
const RATE = "+0%"; // SSML prosody rate；播放器另外有 1×／1.25×／1.5×
const FORMAT = "audio-16khz-32kbitrate-mono-mp3";
// 每一支逐句檔的音框都要是這個格式（MPEG 版本/取樣率/kbps/聲道模式；2 = MPEG-2、3 = 單聲道）：Azure 哪天回了別的格式，不接、重合成
const EXPECT_SIG = "2/16000/32/3";
const SAMPLE_VOICES = ["zh-TW-HsiaoChenNeural", "zh-TW-HsiaoYuNeural", "zh-TW-YunJheNeural"];
const SAMPLE_TEXT = [
  "放二進去，二的平方加一，出來是五。",
  "h 越來越小，Q 就滑向 P，割線斜率一路往二擠。"
];
const CONCURRENCY = Math.max(1, Math.min(4, Number(process.env.NARRATION_CONCURRENCY) || 4));
const MAX_ATTEMPTS = 8;

// 念之前的清洗：語音引擎會把冒號後面接字母讀成表情（「：P」念成吐舌頭）、把破折號與引號念怪。
// 冒號／分號換成逗號（一樣是停頓）、破折號與引號換成空白 —— 一個字換一個字，長度不變，逐字時間點與黑板錨點的字位置照舊對得上。
// 字幕顯示的還是原稿；只有送去念的字被清洗。改這裡要把 SPEAK_VERSION 加一（hash 會換、整批重錄）。
const SPEAK_VERSION = "s1";
// 連字號要跳脫：寫成 [–—-「] 會變成 U+2014 到 U+300C 的「範圍」，把「、」「。」與一大段符號都換成空白（停頓整個不見）。
const speakable = (text) => String(text).replace(/[：:；;]/g, "，").replace(/[–—\-「」『』]/g, " ");
const hashOf = (voice, rate, text) => crypto.createHash("sha1").update(`${voice}|${rate}|${SPEAK_VERSION}|${text}`).digest("hex").slice(0, 8);
// SPEAK_VERSION 之前（沒清洗）的 hash：只用來認「已上傳的舊錄音（prev）是不是同一段字」，新錄音一律用 hashOf
const legacyHashOf = (voice, rate, text) => crypto.createHash("sha1").update(`${voice}|${rate}|${text}`).digest("hex").slice(0, 8);
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
  const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="zh-TW"><voice name="${voice}"><prosody rate="${rate}">${escapeXml(speakable(text))}</prosody></voice></speak>`;
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

/* ── 逐字時間點：Azure Speech SDK（tools/package.json 的開發依賴；REST 不回 WordBoundary）──
   同一段 SSML、同一個輸出格式，SDK 一邊回音訊、一邊回每一個詞的 audioOffset（100ns 為單位，從這一句的開頭算）。
   textOffset 是在 SSML 字串裡的位置：減掉 say 在 SSML 裡的起點、再把跳脫字元（&amp; 之類）換回 say 的字元位置。
   回傳 { audio, words: [[字元位置, 毫秒], …] }（只收 Word，不收標點與句子）。 */
let SDK = null;
function sdk() {
  if (SDK) return SDK;
  try { SDK = require(path.join(__dirname, "node_modules", "microsoft-cognitiveservices-speech-sdk")); } catch (_e) {
    throw new Fatal("逐字時間點要 Azure Speech SDK：cd tools && npm install（只裝在 tools/，不進部署）");
  }
  return SDK;
}
// 跳脫後的位置 → 原字串的位置
function unescapeMap(text) {
  const map = [];
  [...String(text)].forEach((ch, i) => { const e = escapeXml(ch); for (let k = 0; k < e.length; k += 1) map.push(i); });
  map.push([...String(text)].length);
  return map;
}
async function synthWords(text, voice = VOICE, rate = RATE) {
  const S = sdk();
  const { key, region } = await credentials();
  const body = escapeXml(speakable(text));
  const head = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="zh-TW"><voice name="${voice}"><prosody rate="${rate}">`;
  const ssml = `${head}${body}</prosody></voice></speak>`;
  const map = unescapeMap(text);
  let last = "";
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const cfg = S.SpeechConfig.fromSubscription(key, region);
    cfg.speechSynthesisOutputFormat = S.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;
    cfg.setProperty("SpeechServiceResponse_RequestWordBoundary", "true");
    const synthz = new S.SpeechSynthesizer(cfg, null);
    const words = [];
    synthz.wordBoundary = (_s, e) => {
      if (e.boundaryType !== undefined && String(e.boundaryType) !== "WordBoundary" && e.boundaryType !== S.SpeechSynthesisBoundaryType.Word) return;
      const at = e.textOffset - head.length;
      if (at < 0 || at >= map.length) return;
      words.push([map[at], Math.round(e.audioOffset / 10000)]);
    };
    const res = await new Promise((resolve) => {
      synthz.speakSsmlAsync(ssml, (r) => { synthz.close(); resolve(r); }, (err) => { synthz.close(); resolve({ errorDetails: String(err) }); });
    });
    if (res && res.reason === S.ResultReason.SynthesizingAudioCompleted && res.audioData && res.audioData.byteLength > 1000) {
      words.sort((a, b) => a[0] - b[0]);
      return { audio: Buffer.from(res.audioData), words: words.filter((w, i) => !i || w[0] !== words[i - 1][0]) };
    }
    last = redact((res && res.errorDetails) || "沒有音訊");
    if (/401|403|Unauthorized|Forbidden|authentication/i.test(last)) throw new Fatal(`語音服務拒絕：金鑰或區域不對（${last.slice(0, 80)}）`);
    await sleep(Math.min(60000, 1000 * 2 ** attempt) + Math.floor(Math.random() * 500));
  }
  throw new Error(`語音合成（SDK）失敗：重試 ${MAX_ATTEMPTS} 次（最後 ${last.slice(0, 120)}）`);
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
  if (sig !== EXPECT_SIG) throw new Error(`音框格式是 ${sig}，要的是 ${EXPECT_SIG}（${FORMAT}）`);
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
// 每一句：key（節-句，問句多一個 q）、say、要不要逐字時間點、每一個聲音的 hash（h.f、h.m）
function lessonsWithSay() {
  const out = [];
  const hs = (text) => Object.fromEntries(VKEYS.map((v) => [v, hashOf(VOICES[v], RATE, text)]));
  fs.readdirSync(LESSONS).filter((n) => n.endsWith(".json")).sort().forEach((name) => {
    const L = JSON.parse(fs.readFileSync(path.join(LESSONS, name), "utf8"));
    const beats = [];
    (L.sections || []).forEach((sec, si) => (sec.beats || []).forEach((b, bi) => {
      // 證明節的句子可以帶問句（why.say，key 是「節-句q」）：照播放的順序接在這一句的 say 前面（先問、答了才講）
      // 有黑板的句子要逐字時間點（問句也要：問著的時候黑板照問句的詞走）
      const words = Array.isArray(b.board) && b.board.length > 0;
      const q = b.why && typeof b.why.say === "string" ? b.why.say.trim() : "";
      if (q) beats.push({ key: `${si}-${bi}q`, say: q, h: hs(q), words });
      if (typeof b.say === "string" && b.say.trim()) beats.push({ key: `${si}-${bi}`, say: b.say.trim(), h: hs(b.say.trim()), words });
    }));
    if (beats.length) out.push({ id: L.id, beats });
  });
  return out;
}
const cacheOf = (h) => path.join(CACHE, `${h}.mp3`);
const wordsOf = (h) => path.join(CACHE, `${h}.words.json`);
const readWords = (h) => { try { return JSON.parse(fs.readFileSync(wordsOf(h), "utf8")); } catch (_e) { return null; } };
// 已經上傳（列在 media/manifest.json）的旁白檔名
function publishedNames() {
  try { return new Set(JSON.parse(fs.readFileSync(path.join(ROOT, "media", "manifest.json"), "utf8")).assets.map((a) => a.name)); } catch (_e) { return new Set(); }
}
// 一課一支的檔名（media/ 底下）：女聲在 narration/ 底下、其他聲音在 narration/<聲音>/ 底下
const relName = (v, id, f) => `narration/${v === "f" ? "" : `${v}/`}${lessonName(id, f)}`;
const lessonName = (id, f) => `${id}-${f}.mp3`;
const isPublished = (pub, v, id, f) => pub.has(relName(v, id, f));
const lessonFile = (v, id, f) => path.join(ROOT, "media", ...relName(v, id, f).split("/"));
const emptyIndex = () => ({ voices: { ...VOICES }, rate: RATE, format: FORMAT, speak: SPEAK_VERSION, layout: "lesson", lessons: {} });
// narration.json：lessons.<課>.<聲音> = { f, ms, bytes, sha256, beats: { "節-句": { h, t, w? } }, prev? }
function readIndex() {
  if (!fs.existsSync(INDEX)) return emptyIndex();
  const index = JSON.parse(fs.readFileSync(INDEX, "utf8"));
  // 更舊的格式（一句一支，clips）：當作沒有 —— 重跑 build 會從快取（或舊的逐句檔）重接
  if (!index.lessons) return emptyIndex();
  // 只有一個聲音的格式（lessons.<課> 直接是那一支）：當作那一個聲音的
  if (!index.voices) {
    const v = VKEYS.find((k) => VOICES[k] === index.voice) || "f";
    return { ...emptyIndex(), lessons: Object.fromEntries(Object.entries(index.lessons).map(([id, e]) => [id, { [v]: e }])) };
  }
  return index;
}
// 出貨用：這一課某一個聲音的錄音（f）與每一句的 t、w；字改過（hash 對不上）的句子不給 t。build_course_v2 與 validate_course_v2 共用。
// pub（已上傳的檔名）有給的時候：
//   新的那一支還沒上傳、舊的（prev）有 → 出貨舊的；詞的時間點照每一句的長度比例換到舊的錄音上。
//     舊錄音可能是 SPEAK_VERSION 之前錄的（hash 是 legacyHashOf）：字一樣就算數（念法差一點，例如冒號的停頓）。
//   女聲以外的聲音一支都沒上傳 → null（這個聲音這一課先沒有，播放器用另一個）。
function voiceOf(index, lesson, pub, v = "f") {
  let entry = index && index.lessons && index.lessons[lesson.id] && index.lessons[lesson.id][v];
  if (!entry) return null;
  const voice = VOICES[v];
  const texts = {};
  (lesson.sections || []).forEach((sec, si) => (sec.beats || []).forEach((b, bi) => {
    if (typeof b.say === "string") texts[`${si}-${bi}`] = b.say.trim();
    if (b.why && typeof b.why.say === "string") texts[`${si}-${bi}q`] = b.why.say.trim();
  }));
  const fresh = (h, k) => texts[k] !== undefined && h === hashOf(voice, RATE, texts[k]);
  // SPEAK_VERSION 之前錄的（沒清洗）也算：字一樣、念法差一點（冒號的停頓）。重錄完、上傳之後自然換掉
  const ok = (h, k) => fresh(h, k) || (texts[k] !== undefined && h === legacyHashOf(voice, RATE, texts[k]));
  if (pub && !isPublished(pub, v, lesson.id, entry.f)) {
    if (entry.prev && isPublished(pub, v, lesson.id, entry.prev.f)) {
      const cur = entry;
      entry = { ...entry.prev, beats: Object.fromEntries(Object.entries(entry.prev.beats).map(([k, b]) => {
        const n = cur.beats[k];
        if (!n || !n.w || !ok(n.h, k) || !ok(b.h, k)) return [k, b];
        const r = (b.t[1] - b.t[0]) / (n.t[1] - n.t[0]);
        return [k, { ...b, w: n.w.map(([c, ms]) => [c, Math.round(ms * r)]) }];
      })) };
    } else if (v !== "f") return null;
  }
  const beats = {};
  const words = {};
  Object.keys(texts).forEach((k) => {
    const got = entry.beats[k];
    if (got && ok(got.h, k)) { beats[k] = got.t; if (got.w) words[k] = got.w; }
  });
  return Object.keys(beats).length ? { f: entry.f, beats, words } : null;
}

// 舊版（一句一支：media/narration/<課>/<節>-<句>-<hash8>.mp3）留在本機的檔：搬進快取，不用重合成
function adoptLegacy() {
  if (!fs.existsSync(OUT)) return 0;
  let n = 0;
  for (const dir of fs.readdirSync(OUT)) {
    const full = path.join(OUT, dir);
    if (VOICES[dir] || !fs.statSync(full).isDirectory()) continue;
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
  // 一課一段、一個聲音一小段、一句一行（diff 好讀）
  const rows = ids.map((id) => {
    const per = VKEYS.filter((v) => index.lessons[id][v]).map((v) => {
      const e = index.lessons[id][v];
      const beats = Object.entries(e.beats).map(([k, b]) => `          ${JSON.stringify(k)}: ${JSON.stringify(b)}`).join(",\n");
      const prev = e.prev ? `,\n        "prev": ${JSON.stringify(e.prev)}` : "";
      return `      ${JSON.stringify(v)}: {\n        "f": ${JSON.stringify(e.f)}, "ms": ${e.ms}, "bytes": ${e.bytes}, "sha256": ${JSON.stringify(e.sha256)},\n        "beats": {\n${beats}\n        }${prev}\n      }`;
    });
    return `    ${JSON.stringify(id)}: {\n${per.join(",\n")}\n    }`;
  });
  fs.writeFileSync(INDEX, `{\n  "voices": ${JSON.stringify(VOICES)},\n  "rate": ${JSON.stringify(RATE)},\n  "format": ${JSON.stringify(FORMAT)},\n  "speak": ${JSON.stringify(SPEAK_VERSION)},\n  "layout": "lesson",\n  "lessons": {\n${rows.join(",\n")}\n  }\n}\n`);
}

// --voice f,m：只做這幾個聲音（沒給就全部）
function voicesArg(argv) {
  const i = argv.indexOf("--voice");
  if (i < 0) return VKEYS;
  const list = String(argv[i + 1] || "").split(",").filter(Boolean);
  if (!list.length || list.some((v) => !VOICES[v])) throw new Error(`--voice 要給 ${VKEYS.join("、")}（逗號分隔）`);
  return list;
}

async function build({ dryRun = false, pruneCache = false, voices = VKEYS } = {}) {
  const lessons = lessonsWithSay();
  const adopted = dryRun ? 0 : adoptLegacy();
  if (adopted) console.log(`舊版逐句檔搬進快取：${adopted} 支`);
  // 每一個聲音的每一句：hash → { say, voice, words }。say 對所有聲音都列（--prune-cache 才不會刪掉沒選的聲音的快取）
  const all = new Map();
  lessons.forEach((L) => L.beats.forEach((b) => VKEYS.forEach((v) => {
    const prev = all.get(b.h[v]);
    all.set(b.h[v], { say: b.say, v, words: Boolean(b.words || (prev && prev.words)) });
  })));
  const mine = [...all.entries()].filter(([, x]) => voices.includes(x.v));
  // 缺錄音的，或要逐字時間點卻還沒有的（舊的 REST 錄音要用 SDK 重錄一次，整句換掉）
  const missing = mine.filter(([h, x]) => !cached(h) || (x.words && !readWords(h))).map(([h]) => h);
  const chars = missing.reduce((n, h) => n + all.get(h).say.length, 0);
  const viaSdk = missing.filter((h) => all.get(h).words).length;
  const perVoice = voices.map((v) => `${v} ${missing.filter((h) => all.get(h).v === v).length}`).join("、");
  console.log(`旁白：${lessons.length} 課、${lessons.reduce((n, L) => n + L.beats.length, 0)} 句 × ${voices.length} 個聲音（${voices.map((v) => `${v}=${VOICES[v]}`).join("、")}），要合成 ${missing.length} 句（${perVoice}）、${chars} 字（其中要逐字時間點的 ${viaSdk} 句走 SDK；同時 ${CONCURRENCY} 個）`);
  if (dryRun) return;

  const failed = new Map();
  let made = 0;
  if (missing.length) {
    fs.mkdirSync(CACHE, { recursive: true });
    try {
      await pool(missing, CONCURRENCY, async (h) => {
        const x = all.get(h);
        try {
          let buf;
          let words = null;
          if (x.words) ({ audio: buf, words } = await synthWords(x.say, VOICES[x.v]));
          else buf = await synth(x.say, VOICES[x.v]);
          audioOf(buf);
          fs.writeFileSync(`${cacheOf(h)}.part`, buf);
          fs.renameSync(`${cacheOf(h)}.part`, cacheOf(h));
          // 錄音與時間點是同一次合成：先寫錄音、再寫時間點（只有錄音沒有時間點 = 下次重錄）
          if (words) fs.writeFileSync(wordsOf(h), JSON.stringify(words));
          else fs.rmSync(wordsOf(h), { force: true });
          made += 1;
          if (made % 50 === 0 || made === missing.length) process.stdout.write(`  合成 ${made} / ${missing.length}\n`);
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
  const pub = publishedNames();
  const changed = [];
  const counts = {};
  for (const L of lessons) {
    const oldL = old.lessons[L.id] || {};
    const row = {};
    for (const v of VKEYS) {
      const c = (counts[v] = counts[v] || { packed: 0, kept: 0, partial: [] });
      const prev = oldL[v];
      if (!voices.includes(v) || L.beats.some((b) => !cached(b.h[v]))) {
        if (voices.includes(v)) c.partial.push(L.id);
        if (prev) row[v] = prev;
        continue;
      }
      const { buf, spans, ms } = pack(L.beats.map((b) => fs.readFileSync(cacheOf(b.h[v]))));
      const sum = sha256(buf);
      const f = sum.slice(0, 8);
      const file = lessonFile(v, L.id, f);
      if (!fs.existsSync(file) || sha256(fs.readFileSync(file)) !== sum) {
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(`${file}.part`, buf);
        fs.renameSync(`${file}.part`, file);
      }
      if (prev && prev.sha256 === sum) c.kept += 1; else { c.packed += 1; changed.push(path.relative(ROOT, file).replace(/\\/g, "/")); }
      row[v] = { f, ms, bytes: buf.length, sha256: sum, beats: Object.fromEntries(L.beats.map((b, k) => { const w = readWords(b.h[v]); return [b.key, { h: b.h[v], t: spans[k], ...(w ? { w } : {}) }]; })) };
      // 換了一支、而上傳過的是舊的：舊的留在 prev（新的上傳、清單換過之前，網站照舊用舊的）
      const live = prev && (isPublished(pub, v, L.id, prev.f) ? prev : prev.prev && isPublished(pub, v, L.id, prev.prev.f) ? prev.prev : null);
      if (live && live.f !== f && !isPublished(pub, v, L.id, f)) row[v].prev = { f: live.f, ms: live.ms, bytes: live.bytes, sha256: live.sha256, beats: Object.fromEntries(Object.entries(live.beats).map(([k, b]) => [k, { h: b.h, t: b.t }])) };
    }
    if (Object.keys(row).length) index.lessons[L.id] = row;
  }
  // 本機留著的舊檔（字改過、句子刪了、舊的逐句資料夾）清掉：免得被列進 Release
  const want = new Set(Object.entries(index.lessons).flatMap(([id, row]) => Object.entries(row).flatMap(([v, e]) => [relName(v, id, e.f)].concat(e.prev ? [relName(v, id, e.prev.f)] : []))));
  if (fs.existsSync(OUT)) {
    for (const name of fs.readdirSync(OUT)) {
      const full = path.join(OUT, name);
      if (fs.statSync(full).isDirectory()) {
        if (!VOICES[name] || name === "f") { fs.rmSync(full, { recursive: true, force: true }); continue; }
        for (const sub of fs.readdirSync(full)) if (!want.has(`narration/${name}/${sub}`)) fs.rmSync(path.join(full, sub), { recursive: true, force: true });
      } else if (!want.has(`narration/${name}`)) fs.rmSync(full);
    }
  }
  if (pruneCache && fs.existsSync(CACHE)) {
    let n = 0;
    for (const name of fs.readdirSync(CACHE)) if (!all.has(name.replace(/\.(mp3|words\.json)(\.part)?$/, ""))) { fs.rmSync(path.join(CACHE, name)); n += 1; }
    console.log(`快取清掉 ${n} 支沒在用的逐句檔`);
  }
  writeIndex(index);
  summary(index);
  if (changed.length) {
    console.log(`換了的檔（要上傳）：${changed.length} 支${changed.length <= 20 ? `\n${changed.map((x) => "  " + x).join("\n")}` : ""}`);
    const waiting = Object.entries(index.lessons).filter(([, row]) => Object.values(row).some((e) => e.prev)).map(([id]) => id);
    if (waiting.length) console.log(`  ${waiting.length} 課在新檔上傳之前照舊用已上傳的那一支（prev）${waiting.length <= 12 ? `：${waiting.join("、")}` : ""}\n  上傳：node tools/make_media_manifest.js --narration <新 tag> --plan，照它印的 gh 指令上傳，再不加 --plan 跑一次、node tools/build_course_v2.js`);
  }
  voices.forEach((v) => {
    const c = counts[v] || { packed: 0, kept: 0, partial: [] };
    console.log(`一課一支（${v}）：新接 ${c.packed}、沒變 ${c.kept}${c.partial.length ? `、缺句子沒接 ${c.partial.length}（${c.partial.slice(0, 5).join("、")}${c.partial.length > 5 ? "…" : ""}）` : ""}`);
  });
  if (failed.size) {
    [...failed.entries()].slice(0, 10).forEach(([h, msg]) => console.error(`  ${all.get(h).v}：${all.get(h).say.slice(0, 16)}…：${msg}`));
    console.error(`合成失敗 ${failed.size} 句。其他的都已存進快取，再跑一次只補這幾句。`);
    process.exit(1);
  }
}

function summary(index) {
  VKEYS.forEach((v) => {
    let ms = 0;
    let bytes = 0;
    let beats = 0;
    let prev = 0;
    const ids = Object.keys(index.lessons).filter((id) => index.lessons[id][v]);
    ids.forEach((id) => {
      const e = index.lessons[id][v];
      ms += e.ms;
      bytes += e.bytes;
      beats += Object.keys(e.beats).length;
      if (e.prev) prev += 1;
    });
    console.log(`  ${v}（${VOICES[v]}）：${ids.length} 支、${beats} 句、${(ms / 60000).toFixed(1)} 分鐘、${(bytes / 1048576).toFixed(2)} MB${prev ? `（${prev} 課還在用 prev）` : ""}`);
  });
}

function check({ verify = false, voices = VKEYS } = {}) {
  const lessons = lessonsWithSay();
  const index = readIndex();
  const bad = [];
  const beats = {};
  voices.forEach((v) => lessons.forEach((L) => {
    const e = index.lessons[L.id] && index.lessons[L.id][v];
    if (!e) { bad.push(`${v} ${L.id}：narration.json 沒有這一課`); return; }
    L.beats.forEach((b) => {
      beats[v] = (beats[v] || 0) + 1;
      if (!e.beats[b.key] || e.beats[b.key].h !== b.h[v]) bad.push(`${v} ${L.id}/${b.key}：沒有這一句或字改過了`);
    });
    const file = lessonFile(v, L.id, e.f);
    if (!fs.existsSync(file)) { bad.push(`${v} ${L.id}：本機沒有 ${path.relative(ROOT, file)}`); return; }
    const buf = fs.readFileSync(file);
    if (sha256(buf) !== e.sha256) { bad.push(`${v} ${L.id}：檔案雜湊不符`); return; }
    if (!verify) return;
    // 每一句的起訖：起點是一格（從標頭算：16 kHz 是 36 ms）整數倍的音框邊界；那一段位元組就是逐句檔（快取有的話）
    const frames = framesOf(buf);
    const per = frames.length ? (frames[0].samples / frames[0].rate) * 1000 : 0;
    const total = Math.round(frames.length * per);
    if (Math.abs(total - e.ms) > 1) bad.push(`${v} ${L.id}：音框數出 ${total} ms，索引寫 ${e.ms}`);
    Object.entries(e.beats).forEach(([key, b]) => {
      const [s, t] = b.t;
      if (!(t > s) || Math.abs(s / per - Math.round(s / per)) > 1e-6) { bad.push(`${v} ${L.id}/${key}：起訖 ${s}–${t} 不在音框邊界`); return; }
      if (!cached(b.h)) return;
      const clip = audioOf(fs.readFileSync(cacheOf(b.h)));
      const from = frames[Math.round(s / per)];
      if (!from || !buf.subarray(from.at, from.at + clip.data.length).equals(clip.data)) bad.push(`${v} ${L.id}/${key}：${s} ms 那一段的位元組跟逐句檔不同`);
      else if (Math.round((clip.samples / clip.rate) * 1000) !== t - s) bad.push(`${v} ${L.id}/${key}：長度 ${t - s} ms 跟逐句檔不同`);
    });
    const probed = ffprobeMs(file);
    if (probed === null) { if (!check.warned) console.warn("  （沒有 ffprobe，也沒有 wsl -e ffprobe：略過 ffprobe 量長度）"); check.warned = true; }
    else if (Math.abs(probed - e.ms) > 30) bad.push(`${v} ${L.id}：ffprobe 量出 ${probed} ms，索引寫 ${e.ms}`);
  }));
  if (bad.length) {
    bad.slice(0, 40).forEach((line) => console.error("  " + line));
    console.error(`旁白不同步：${bad.length} 處（node tools/build_narration.js）`);
    process.exit(1);
  }
  console.log(`旁白 ${verify ? "verify" : "check"} OK：${lessons.length} 課 × ${voices.map((v) => `${v} ${beats[v] || 0} 句`).join("、")}都有檔${verify ? "（位元組逐句比對、ffprobe 量長度）" : ""}`);
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

// 試聽一整課：--try <課 id> [--voice zh-TW-YunJheNeural] → docs/report/course-review/voice-try/<聲音>-<課>.mp3（逐句接起來；不動快取、不動 narration.json）
async function tryLesson(id, voice) {
  const L = JSON.parse(fs.readFileSync(path.join(ROOT, "tools", "content", "course_v2", "lessons", `${id}.json`), "utf8"));
  const says = [];
  (L.sections || []).forEach((s) => s.beats.forEach((b) => { if (b.why && b.why.say) says.push(b.why.say); if (b.say) says.push(b.say); }));
  const bufs = [];
  for (const text of says) bufs.push(await synth(text, voice, RATE));
  const dir = path.join(SAMPLES, "..", "voice-try");
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${voice.replace(/^zh-TW-|Neural$/g, "")}-${id}.mp3`);
  const all = Buffer.concat(bufs);
  fs.writeFileSync(file, all);
  console.log(`  ${path.relative(ROOT, file)}  ${says.length} 句、${(mp3Ms(all) / 1000).toFixed(1)}s`);
}

module.exports = { hashOf, legacyHashOf, speakable, mp3Ms, framesOf, pack, voiceOf, readIndex, relName, synthWords, audioOf, cacheOf, VOICE, VOICES, VKEYS, RATE };

if (require.main === module) {
  const argv = process.argv;
  // --try 的 --voice 可以給 f／m 或完整的聲音名（沒給：BUZZ_TTS_VOICE 或女聲）
  const tryVoice = () => { const v = argv.includes("--voice") ? argv[argv.indexOf("--voice") + 1] : ""; return VOICES[v] || v || process.env.BUZZ_TTS_VOICE || VOICE; };
  const run = argv.includes("--check") ? Promise.resolve().then(() => check({ voices: voicesArg(argv) }))
    : argv.includes("--verify") ? Promise.resolve().then(() => check({ verify: true, voices: voicesArg(argv) }))
    : argv.includes("--samples") ? samples()
    : argv.includes("--try") ? (async () => { const skip = argv.includes("--voice") ? argv[argv.indexOf("--voice") + 1] : null; for (const id of argv.slice(argv.indexOf("--try") + 1).filter((a) => !a.startsWith("--") && a !== skip)) await tryLesson(id, tryVoice()); })()
    : Promise.resolve().then(() => build({ dryRun: argv.includes("--dry-run"), pruneCache: argv.includes("--prune-cache"), voices: voicesArg(argv) }));
  run.catch((error) => {
    console.error(redact(error && error.message ? error.message : error));
    process.exit(1);
  });
}
