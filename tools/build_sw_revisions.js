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
// 內容雜湊：sw.js 在執行期用 crypto.subtle 算一樣的東西（sha256 的前 10 個 hex）
const revOf = (rel) => crypto.createHash("sha256").update(fs.readFileSync(path.join(ROOT, rel))).digest("hex").slice(0, 10);

function tables() {
  const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  const local = (u) => !/^(https?:)?\/\//.test(u);
  const stylesheets = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map((m) => m[1]).filter(local);
  const deferScripts = [...html.matchAll(/<script\s+defer\s+src="([^"]+)"/g)].map((m) => m[1]).filter(local);
  const lazy = [...html.matchAll(/<script type="text\/lazy" data-lazy="([^"]+)" src="([^"]+)"/g)].map((m) => ({ group: m[1], src: m[2] }));
  const steps = lazy.filter((l) => l.group === "steps").map((l) => l.src);
  const core = [...new Set(["index.html", ...stylesheets, "manifest.webmanifest", "assets/icon.svg", ...deferScripts, ...steps, ...CORE_FONTS])];
  const fontsDir = path.join(ROOT, "assets/vendor/katex/fonts");
  const fonts = fs.readdirSync(fontsDir).filter((n) => n.endsWith(".woff2")).map((n) => `assets/vendor/katex/fonts/${n}`);
  const chapters = fs.readdirSync(path.join(ROOT, "src/course_v2")).filter((n) => /^ch-[a-z0-9-]+\.js$/.test(n)).map((n) => `src/course_v2/${n}`);
  const all = [...new Set([...core, ...lazy.map((l) => l.src), ...fonts, ...PAGES, ...chapters])].sort();
  const missing = all.filter((rel) => !fs.existsSync(path.join(ROOT, rel)));
  if (missing.length) throw new Error(`index.html／sw.js 指到不存在的檔：${missing.join(", ")}`);
  const revisions = Object.fromEntries(all.map((rel) => [`./${rel}`, VOLATILE.has(rel) ? "" : revOf(rel)]));
  return { core: core.map((rel) => `./${rel}`), revisions };
}

function render({ core, revisions }) {
  return [
    START,
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

module.exports = { tables, check, CORE_FONTS };

if (require.main === module) {
  try {
    if (process.argv.includes("--check")) {
      if (!check()) {
        console.error("sw.js 的 APP_SHELL／REVISIONS 跟磁碟上的檔不同步：跑 node tools/build_sw_revisions.js");
        process.exit(1);
      }
      console.log("sw revisions OK");
    } else {
      const source = fs.readFileSync(SW, "utf8");
      const t = tables();
      const { before, after } = generated(source);
      fs.writeFileSync(SW, before + render(t) + after);
      console.log(`sw.js：APP_SHELL ${t.core.length} 支、REVISIONS ${Object.keys(t.revisions).length} 支`);
    }
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
