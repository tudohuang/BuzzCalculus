// 產生 sw.js 的兩張表：APP_SHELL（安裝時預快取的核心）與 REVISIONS（Service Worker 管得到的每一支檔 → 內容雜湊）。
//
// 為什麼要有 revision：Service Worker 是 cache-first（流量：回訪不再整站重抓）。新版 sw.js 安裝時，舊快取裡內容沒變的檔
// （回應上的 x-buzz-rev ＝ 內容的 sha256 前 10 碼，跟這張表一樣）直接搬進新快取、零請求；只有變了的才上網抓。
// 部署一次只改 app.js，回訪的人只多兩個請求（sw.js、app.js），不是整個 APP_SHELL 重新驗證一遍。
//
// APP_SHELL（核心）：離線也要能練題 —— index.html、CSS、index.html 裡每一支 defer 的 script、逐步解答側表（每次開站閒下來都會載）、
//   manifest、圖示、常用的 KaTeX 字型。其他（lazy 群組：課程、證明、地圖、英文側表…；課文 ch-*.js；說明頁；少用的字型）
//   只進 REVISIONS：用到才快取（cache-first、存進同一個版本的快取），用過的離線也能用。
// 不進表的：sw.js 自己、/media/（影片、旁白：交給 HTTP 快取）、media/manifest.json。
// daily_one_history.js 的 revision 留空：CI 的 regen 每天會長一格，雜湊對不上 —— 空的 revision 永遠不搬、每次安裝都重抓（一個請求）。
//
// 用法：node tools/build_sw_revisions.js           寫入 sw.js 的產生區
//       node tools/build_sw_revisions.js --check   只檢查（sw.js 跟磁碟上的檔不同步就 exit 1）
"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.join(__dirname, "..");
const SW = path.join(ROOT, "sw.js");
const START = "// ── 產生區：node tools/build_sw_revisions.js（不要手改）──";
const END = "// ── 產生區結束 ──";

// 預快取的 KaTeX 字型：一般式子（Main、Math）、粗體、𝔸𝕄𝕊 符號、大括號與大型運算子（Size1–4）。
// 其他（花體、德文尖角、無襯線、打字機、粗斜體）用到才快取。
const CORE_FONTS = ["AMS-Regular", "Main-Bold", "Main-Italic", "Main-Regular", "Math-Italic", "Size1-Regular", "Size2-Regular", "Size3-Regular", "Size4-Regular"]
  .map((n) => `assets/vendor/katex/fonts/KaTeX_${n}.woff2`);
const PAGES = ["about.html", "guide.html", "privacy.html", "terms.html"];
const VOLATILE = new Set(["src/kernel/daily_one_history.js"]);
// 每次開站都會載的 lazy 群組：進 APP_SHELL（離線也要有）。steps＝逐步解答側表；pwa＝更新檢查與版本（src/kernel/app_update.js）；
// metrics＝量測漏斗與回訪（src/kernel/metrics.js，只有分析開著才載）。
// sampler＝題目側寫與兩段式抽題（src/kernel/problem_profiles.js＋sampler.js）：離線練題也要照方法家族抽、課程練習也要擋先修。
// settings＝設定頁的畫面（src/settings_page.js）：離線也要能改設定、匯出備份。
const CORE_LAZY = ["steps", "pwa", "metrics", "sampler", "settings"];
// 讀檔：預設讀磁碟；E2E（tools/e2e_update.js）傳入覆寫，產生「改了一支檔之後」的 sw.js 而不動到磁碟
const diskRead = (rel) => fs.readFileSync(path.join(ROOT, rel));
// 內容雜湊：sw.js 在執行期用 crypto.subtle 算一樣的東西（sha256 的前 10 個 hex）
const hashOf = (buf) => crypto.createHash("sha256").update(buf).digest("hex").slice(0, 10);

// 版本：APP_VERSION（人訂的 vX.Y.Z）與 BUILD_DATE（tools/stamp_build.js 蓋的）從 app.js 讀；
// id ＝ 整張 REVISIONS 的雜湊 —— 不用任何人記得去改，任何一支檔變了它就變，快取名跟著變。
function buildInfo(revisions, read = diskRead) {
  const app = String(read("src/app.js"));
  const version = (app.match(/const APP_VERSION = "([^"]+)"/) || [])[1];
  const date = (app.match(/const BUILD_DATE = "([^"]+)"/) || [])[1];
  if (!version || !date) throw new Error("src/app.js 裡找不到 APP_VERSION 或 BUILD_DATE");
  const id = crypto.createHash("sha256").update(JSON.stringify(revisions)).digest("hex").slice(0, 8);
  return { version, id, date };
}

function tables(read = diskRead) {
  const revOf = (rel) => hashOf(read(rel));
  const html = String(read("index.html"));
  const local = (u) => !/^(https?:)?\/\//.test(u);
  const stylesheets = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map((m) => m[1]).filter(local);
  const deferScripts = [...html.matchAll(/<script\s+defer\s+src="([^"]+)"/g)].map((m) => m[1]).filter(local);
  const lazy = [...html.matchAll(/<script type="text\/lazy" data-lazy="([^"]+)" src="([^"]+)"/g)].map((m) => ({ group: m[1], src: m[2] }));
  const steps = lazy.filter((l) => CORE_LAZY.includes(l.group)).map((l) => l.src);
  const core = [...new Set(["index.html", ...stylesheets, "manifest.webmanifest", "assets/icon.svg", ...deferScripts, ...steps, ...CORE_FONTS])];
  const fontsDir = path.join(ROOT, "assets/vendor/katex/fonts");
  const fonts = fs.readdirSync(fontsDir).filter((n) => n.endsWith(".woff2")).map((n) => `assets/vendor/katex/fonts/${n}`);
  const chapters = fs.readdirSync(path.join(ROOT, "src/course_v2")).filter((n) => /^ch-[a-z0-9-]+\.js$/.test(n)).map((n) => `src/course_v2/${n}`);
  // 詳解 v2 的分片（src/detail/d-XX.js 與英文的 src/detail/en/d-XX.js，開局按需抓）：跟課文一樣不預快取、進 REVISIONS 用內容雜湊管版本
  const detailShards = ["src/detail", "src/detail/en"].flatMap((dir) => (fs.existsSync(path.join(ROOT, dir)) ? fs.readdirSync(path.join(ROOT, dir)).filter((n) => /^d-\d{2}\.js$/.test(n)).map((n) => `${dir}/${n}`) : []));
  const all = [...new Set([...core, ...lazy.map((l) => l.src), ...fonts, ...PAGES, ...chapters, ...detailShards])].sort();
  const missing = all.filter((rel) => !fs.existsSync(path.join(ROOT, rel)));
  if (missing.length) throw new Error(`index.html／sw.js 指到不存在的檔：${missing.join(", ")}`);
  const revisions = Object.fromEntries(all.map((rel) => [`./${rel}`, VOLATILE.has(rel) ? "" : revOf(rel)]));
  return { core: core.map((rel) => `./${rel}`), revisions, build: buildInfo(revisions, read) };
}

function render({ core, revisions, build }) {
  return [
    START,
    "// 這一版：設定頁顯示「版本 v… · id · 日期」；id 是下面 REVISIONS 的雜湊，快取名跟著它變（每次部署內容有變就一定是新快取）。",
    `const BUILD = ${JSON.stringify(build)};`,
    `const CACHE_NAME = ${JSON.stringify(`buzzcalculus-${build.version}-${build.id}`)};`,
    "// 安裝時預快取的核心（離線也能練題）。其他檔用到才快取 —— 見 REVISIONS。",
    "const APP_SHELL = [",
    core.map((k) => `  ${JSON.stringify(k)}`).join(",\n"),
    "];",
    "// Service Worker 管的每一支檔 → 內容的 sha256 前 10 碼（空字串 = 每次安裝都重抓）。不在表上的請求交給瀏覽器。",
    "const REVISIONS = {",
    Object.entries(revisions).map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)}`).join(",\n"),
    "};",
    END
  ].join("\n");
}

function generated(source) {
  const a = source.indexOf(START);
  const b = source.indexOf(END);
  if (a < 0 || b < a) throw new Error("sw.js 裡找不到產生區的起訖標記");
  return { before: source.slice(0, a), block: source.slice(a, b + END.length), after: source.slice(b + END.length) };
}

function check() {
  const source = fs.readFileSync(SW, "utf8");
  const want = render(tables());
  return generated(source).block === want;
}

// 整支 sw.js 的內容（read 可以覆寫某幾支檔）
function swSource(read = diskRead) {
  const { before, after } = generated(fs.readFileSync(SW, "utf8"));
  return before + render(tables(read)) + after;
}

module.exports = { tables, check, swSource, CORE_FONTS, CORE_LAZY };

if (require.main === module) {
  try {
    if (process.argv.includes("--check")) {
      if (!check()) {
        console.error("sw.js 的 APP_SHELL／REVISIONS 跟磁碟上的檔不同步：跑 node tools/build_sw_revisions.js");
        process.exit(1);
      }
      console.log("sw revisions OK");
    } else {
      const t = tables();
      fs.writeFileSync(SW, swSource());
      console.log(`sw.js：APP_SHELL ${t.core.length} 支、REVISIONS ${Object.keys(t.revisions).length} 支、版本 ${t.build.version} · ${t.build.id} · ${t.build.date}`);
    }
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
