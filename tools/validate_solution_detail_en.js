// 詳解 v2 英文版（tools/content/detail_en/*.js）的驗證器
//
// 英文詳解是中文詳解的翻譯：步驟的驗算宣稱不重寫（式子沒動，宣稱就照樣成立），所以這裡守的是「翻譯只准動字」：
//   1. 對得上：每一份都有對應的中文詳解；欄位一樣（中文有 trap 英文才有、反之亦然）、步驟數一樣
//   2. 式子一個字都不准動：每個欄位的 $…$ 去掉 \text{…} 跟空白之後，跟中文那一欄的是同一包（順序可以換，句子語序本來就不同）
//   3. 是英文：任何一欄都不准有中文字或全形標點
//   4. 排得出來：$ 成對、每段過 KaTeX、$ 外面沒有 LaTeX 指令（跟中文版同一條規則）
//   5. 沒過期：中文詳解改過了（stamps.json 記的雜湊對不上），英文要跟著改再 --stamp
//   6. 反向：故意改一個式子、塞一個中文字、少一步，這支要紅
//
// 用法：node tools/validate_solution_detail_en.js [--file 草稿.js]   （--file：只驗一批，不查分片與 stamps）
"use strict";

const fs = require("fs");
const path = require("path");
const katex = require(path.join(__dirname, "..", "assets", "vendor", "katex", "katex.min.js"));
const build = require("./build_solution_detail.js");

const args = process.argv.slice(2);
const fileArg = args.includes("--file") ? args[args.indexOf("--file") + 1] : null;
const zh = build.loadSource().table;
const en = fileArg ? require(path.resolve(fileArg)) : build.loadSource(build.SOURCE_EN).table;
const CJK = /[　-〿＀-￯㐀-䶿一-鿿]/;

function texProblems(text) {
  const out = [];
  if (typeof text !== "string" || !text.trim()) return ["is empty"];
  const parts = text.split("$");
  if (parts.length % 2 === 0) return ["unpaired $"];
  parts.forEach((part, i) => {
    if (i % 2 === 1) {
      if (!part.trim()) { out.push("empty $$"); return; }
      try { katex.renderToString(part, { throwOnError: true }); } catch (e) { out.push(`$${part}$ does not typeset: ${String(e.message).slice(0, 80)}`); }
    } else if (/\\[A-Za-z]/.test(part)) {
      out.push(`LaTeX command outside $…$: ${part.trim().slice(0, 40)}`);
    }
  });
  return out;
}

// 一段文字裡的式子，拿掉 \text{…} 的內容（那是可以翻的字）跟空白，排序後接起來
const stripText = (tex) => tex.replace(/\\text\{(?:[^{}]|\{[^{}]*\})*\}/g, "\\text{}");
function mathBag(text) {
  const parts = String(text || "").split("$");
  return parts.filter((_, i) => i % 2 === 1).map((m) => stripText(m).replace(/\s+/g, "")).sort();
}
function sameBag(a, b) {
  const x = mathBag(a);
  const y = mathBag(b);
  if (x.length !== y.length) return `has ${y.length} math spans, the Chinese has ${x.length}`;
  for (let i = 0; i < x.length; i += 1) {
    if (x[i] !== y[i]) {
      const missing = x.filter((m) => !y.includes(m));
      const extra = y.filter((m) => !x.includes(m));
      return `math changed — Chinese has $${missing.join("$, $")}$, English has $${extra.join("$, $")}$`;
    }
  }
  return "";
}

const textOf = (v) => (Array.isArray(v) ? v[0] : v);

function validate(id, d) {
  const failures = [];
  const fail = (m) => failures.push(`${id}: ${m}`);
  const z = zh[id];
  if (!z) { fail("no Chinese detail with this id"); return failures; }
  if (!d || typeof d !== "object" || Array.isArray(d)) { fail("must be { spot, why, steps, trap?, check? }"); return failures; }
  const extra = Object.keys(d).filter((k) => !["spot", "why", "steps", "trap", "check"].includes(k));
  if (extra.length) fail(`unknown fields: ${extra.join(", ")}`);
  const field = (where, zhText, enText) => {
    if (typeof enText !== "string" || !enText.trim()) { fail(`${where} must be a non-empty string`); return; }
    if (CJK.test(enText)) fail(`${where} still has Chinese characters or full-width punctuation: ${(enText.match(CJK) || [""])[0]}`);
    texProblems(enText).forEach((m) => fail(`${where}: ${m}`));
    const bag = sameBag(zhText, enText);
    if (bag) fail(`${where}: ${bag}`);
  };
  field("spot", z.spot, d.spot);
  field("why", z.why, d.why);
  ["trap", "check"].forEach((key) => {
    if ((z[key] === undefined) !== (d[key] === undefined)) fail(`${key}: ${z[key] === undefined ? "the Chinese has none" : "missing (the Chinese has one)"}`);
    else if (z[key] !== undefined) field(key, textOf(z[key]), d[key]);
  });
  if (!Array.isArray(d.steps)) { fail("steps must be an array of strings"); return failures; }
  if (d.steps.length !== z.steps.length) fail(`has ${d.steps.length} steps, the Chinese has ${z.steps.length}`);
  d.steps.forEach((step, i) => {
    if (i < z.steps.length) field(`step ${i + 1}`, z.steps[i][0], step);
  });
  return failures;
}

const failures = [];
Object.entries(en).forEach(([id, d]) => failures.push(...validate(id, d)));

if (!fileArg) {
  // 反向
  const [firstId, first] = Object.entries(en)[0] || [];
  if (first) {
    const clone = () => JSON.parse(JSON.stringify(first));
    const a = clone();
    a.steps[0] = a.steps[0].includes("$") ? a.steps[0].replace(/\$([^$]*)\$/, (m, x) => `$${x}+1$`) : `${a.steps[0]} $x+1$`;
    if (!validate(firstId, a).length) failures.push("reverse test: changed math was not caught");
    const b = clone();
    b.spot = `${b.spot}，`;
    if (!validate(firstId, b).length) failures.push("reverse test: a Chinese character was not caught");
    const c = clone();
    c.steps.pop();
    if (!validate(firstId, c).length) failures.push("reverse test: a missing step was not caught");
  }
  // 過期：中文改了英文沒跟
  const stamps = build.loadStamps();
  Object.keys(en).forEach((id) => {
    if (!zh[id]) return;
    if (stamps[id] !== build.zhStamp(zh[id])) failures.push(`${id}: the Chinese detail changed after this was translated — update the English, then run node tools/build_solution_detail.js --stamp`);
  });
  // 分片同步
  const files = build.render(en, "en");
  Object.entries(files).forEach(([name, text]) => {
    const file = path.join(build.OUT_EN, name);
    if (!fs.existsSync(file) || fs.readFileSync(file, "utf8") !== text) failures.push(`src/detail/en/${name} is out of sync: run node tools/build_solution_detail.js`);
  });
}

if (failures.length) {
  console.error(`English detail check failed (${failures.length}):`);
  failures.slice(0, 200).forEach((f) => console.error(`  ${f}`));
  if (failures.length > 200) console.error(`  … ${failures.length - 200} more`);
  process.exit(1);
}
const missing = Object.keys(zh).filter((id) => !en[id]);
console.log(`solution detail (en) OK: ${Object.keys(en).length} translated${fileArg ? "" : `, ${missing.length} Chinese details without English`}`);
