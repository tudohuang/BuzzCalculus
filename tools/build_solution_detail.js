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
// 英文介面不抓（這一份還沒有英文；英文照舊用已經翻好的舊解說）。
//
// 用法：node tools/build_solution_detail.js          重產 src/detail/
//       node tools/build_solution_detail.js --check  產物跟來源不同步就失敗
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SOURCE = path.join(ROOT, "tools", "content", "detail");
const OUT = path.join(ROOT, "src", "detail");
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
function loadSource() {
  const table = {};
  const where = {};
  if (!fs.existsSync(SOURCE)) return { table, where };
  fs.readdirSync(SOURCE).filter((n) => n.endsWith(".js")).sort().forEach((name) => {
    const file = path.join(SOURCE, name);
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

function render(table) {
  const shards = Array.from({ length: SHARDS }, () => ({}));
  Object.keys(table).sort().forEach((id) => { shards[shardOf(id)][id] = table[id]; });
  const files = {};
  shards.forEach((part, n) => {
    files[shardName(n)] = `// 產生檔：node tools/build_solution_detail.js（來源 tools/content/detail/）。不要手改。\nwindow.BuzzDetail && window.BuzzDetail.add(${n}, ${JSON.stringify(part)});\n`;
  });
  return files;
}

module.exports = { loadSource, render, shardOf, shardName, SHARDS, OUT, SOURCE };

if (require.main === module) {
  const { table } = loadSource();
  const files = render(table);
  if (process.argv.includes("--check")) {
    const stale = Object.entries(files).filter(([name, text]) => !fs.existsSync(path.join(OUT, name)) || fs.readFileSync(path.join(OUT, name), "utf8") !== text);
    const extra = fs.existsSync(OUT) ? fs.readdirSync(OUT).filter((n) => !files[n]) : [];
    if (stale.length || extra.length) {
      console.error(`src/detail/ 跟 tools/content/detail/ 不同步（${stale.length} 片過期、${extra.length} 片多出來）：跑 node tools/build_solution_detail.js`);
      process.exit(1);
    }
    console.log(`詳解分片同步：${Object.keys(table).length} 份、${SHARDS} 片`);
  } else {
    fs.mkdirSync(OUT, { recursive: true });
    fs.readdirSync(OUT).filter((n) => !files[n]).forEach((n) => fs.rmSync(path.join(OUT, n)));
    Object.entries(files).forEach(([name, text]) => fs.writeFileSync(path.join(OUT, name), text));
    const sizes = Object.values(files).map((t) => Buffer.byteLength(t));
    console.log(`詳解：${Object.keys(table).length} 份 → src/detail/ ${SHARDS} 片（最大 ${(Math.max(...sizes) / 1024).toFixed(1)}KB、合計 ${(sizes.reduce((a, b) => a + b, 0) / 1024).toFixed(0)}KB）`);
  }
}
