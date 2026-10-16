// 詳解 v2：tools/content/detail/*.js（人寫、一批一檔）→ src/detail/d-XX.js（瀏覽器按需抓的分片）
//
// 詳解是照 Buzz 的核心寫的：看題 → 認出題型 → 選招 → 穩定算完。每一份：
//   spot   一眼看出：題目的哪個特徵在告訴你該用哪一招（畫面第一層「該用什麼技巧」）
//   why    為什麼是這招：一句話，必要時說另一條路為什麼比較差（第二層）
//   steps  3–8 步，每步 [文字, 驗算宣稱]；文字裡 $…$ 是 KaTeX；宣稱見 tools/lib/step_claims.js。最後一步接回 ANS
//   trap   常見錯（選填）
//   check  驗算（選填）：文字或 [文字, 宣稱]
// 驗證：tools/validate_solution_detail.js（每條宣稱重算、每段 $…$ 試排、分片跟來源同步）。
//
// 為什麼分片：全題庫約 3,000 份、4MB 上下，不能一支檔。照題號的 FNV-1a 雜湊分成 SHARDS 片，
// 開一局練習時只抓這一局的題目在的那幾片（src/problem_authored_solutions.js 的 BuzzDetail.prefetch）。
// 分片怎麼分（雜湊、片數）瀏覽器那邊算一樣的東西 —— 改這裡要一起改那裡，validate_solution_detail 會比對。
// 英文：tools/content/detail_en/*.js 是逐份翻譯（只有字，步驟是字串、沒有宣稱 —— 式子沒動，宣稱照中文那份成立）→ src/detail/en/d-XX.js，
// 同一個雜湊、同一個片號；英文介面抓 en/ 那一套。validate_solution_detail_en.js 守「式子一個字都不准動」，
// stamps.json 記每份翻的時候中文長什麼樣（雜湊），中文改了英文沒跟就會紅：改完英文跑 --stamp。
//
// 用法：node tools/build_solution_detail.js          重產 src/detail/ 與 src/detail/en/
//       node tools/build_solution_detail.js --check  產物跟來源不同步就失敗
//       node tools/build_solution_detail.js --stamp  英文翻好（或跟著中文改好）之後，記下現在的中文雜湊
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SOURCE = path.join(ROOT, "tools", "content", "detail");
const OUT = path.join(ROOT, "src", "detail");
const SOURCE_EN = path.join(ROOT, "tools", "content", "detail_en");
const OUT_EN = path.join(OUT, "en");
const STAMPS = path.join(SOURCE_EN, "stamps.json");
const SHARDS = 64;

function shardOf(id) {
  let h = 0x811c9dc5;
  for (let i = 0; i < id.length; i += 1) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h % SHARDS;
}
const shardName = (n) => `d-${String(n).padStart(2, "0")}.js`;

// 讀全部來源批次；同一題出現在兩批是錯（後寫的會安靜地蓋掉前面的）
function loadSource(dir = SOURCE) {
  const table = {};
  const where = {};
  if (!fs.existsSync(dir)) return { table, where };
  fs.readdirSync(dir).filter((n) => n.endsWith(".js")).sort().forEach((name) => {
    const file = path.join(dir, name);
    delete require.cache[require.resolve(file)];
    const batch = require(file);
    Object.entries(batch).forEach(([id, detail]) => {
      if (where[id]) throw new Error(`${id} 同時在 ${where[id]} 與 ${name}`);
      where[id] = name;
      table[id] = detail;
    });
  });
  return { table, where };
}

// 英文那一套：步驟是字串（瀏覽器的 BuzzDetail.add 會整理成跟中文一樣的 [文字] 形狀）
function render(table, lang) {
  const shards = Array.from({ length: SHARDS }, () => ({}));
  Object.keys(table).sort().forEach((id) => { shards[shardOf(id)][id] = table[id]; });
  const files = {};
  const from = lang === "en" ? "tools/content/detail_en/" : "tools/content/detail/";
  const tail = lang === "en" ? `, "en"` : "";
  shards.forEach((part, n) => {
    files[shardName(n)] = `// 產生檔：node tools/build_solution_detail.js（來源 ${from}）。不要手改。\nwindow.BuzzDetail && window.BuzzDetail.add(${n}, ${JSON.stringify(part)}${tail});\n`;
  });
  return files;
}

// 中文那份的「字」的雜湊（宣稱不算：只改宣稱、字沒動，英文不用重翻）
function zhStamp(d) {
  const text = JSON.stringify([d.spot, d.why, (d.steps || []).map((s) => s[0]), d.trap || "", Array.isArray(d.check) ? d.check[0] : d.check || ""]);
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) { h ^= text.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(36);
}
function loadStamps() {
  try { return JSON.parse(fs.readFileSync(STAMPS, "utf8")); } catch (_e) { return {}; }
}

module.exports = { loadSource, render, shardOf, shardName, zhStamp, loadStamps, SHARDS, OUT, SOURCE, SOURCE_EN, OUT_EN, STAMPS };

if (require.main === module) {
  const { table } = loadSource();
  const en = loadSource(SOURCE_EN).table;
  if (process.argv.includes("--stamp")) {
    const stamps = loadStamps();
    const sorted = {};
    Object.keys(en).filter((id) => table[id]).sort().forEach((id) => { sorted[id] = zhStamp(table[id]); });
    const changed = Object.keys(sorted).filter((id) => stamps[id] !== sorted[id]).length;
    fs.writeFileSync(STAMPS, JSON.stringify(sorted, null, 1) + "\n");
    console.log(`stamps.json：${Object.keys(sorted).length} 份（這次新記或更新 ${changed} 份）`);
    process.exit(0);
  }
  const sets = [
    { label: "src/detail/", dir: OUT, files: render(table), count: Object.keys(table).length },
    { label: "src/detail/en/", dir: OUT_EN, files: render(en, "en"), count: Object.keys(en).length }
  ];
  if (process.argv.includes("--check")) {
    sets.forEach(({ label, dir, files, count }) => {
      const stale = Object.entries(files).filter(([name, text]) => !fs.existsSync(path.join(dir, name)) || fs.readFileSync(path.join(dir, name), "utf8") !== text);
      const extra = fs.existsSync(dir) ? fs.readdirSync(dir).filter((n) => n.endsWith(".js") && !files[n]) : [];
      if (stale.length || extra.length) {
        console.error(`${label} 跟來源不同步（${stale.length} 片過期、${extra.length} 片多出來）：跑 node tools/build_solution_detail.js`);
        process.exit(1);
      }
      console.log(`詳解分片同步（${label}）：${count} 份、${SHARDS} 片`);
    });
  } else {
    sets.forEach(({ label, dir, files, count }) => {
      fs.mkdirSync(dir, { recursive: true });
      fs.readdirSync(dir).filter((n) => n.endsWith(".js") && !files[n]).forEach((n) => fs.rmSync(path.join(dir, n)));
      Object.entries(files).forEach(([name, text]) => fs.writeFileSync(path.join(dir, name), text));
      const sizes = Object.values(files).map((t) => Buffer.byteLength(t));
      console.log(`詳解：${count} 份 → ${label} ${SHARDS} 片（最大 ${(Math.max(...sizes) / 1024).toFixed(1)}KB、合計 ${(sizes.reduce((a, b) => a + b, 0) / 1024).toFixed(0)}KB）`);
    });
  }
}
