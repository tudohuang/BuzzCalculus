// 把寫一課需要的東西包成一份文字檔，貼給外部的模型（ChatGPT 等）寫課用。
//   node tools/course_prompt.js <id> [--tags 粗tag,粗tag] [--example chain-rule] [--rewrite]
// id 要先在 OUTLINE.md（新課先加一行）。輸出 tmp/chatgpt/<id>.txt。
// 拿回來的 JSON 存成 tools/content/course_v2/lessons/<id>.json，跑 validate_course_v2.js <id>，錯誤整段貼回去，直到 0 錯。
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const DIR = path.join(ROOT, "tools", "content", "course_v2");
const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };
const id = args.find((a, i) => !a.startsWith("--") && !(i > 0 && args[i - 1].startsWith("--") && args[i - 1] !== "--rewrite"));
if (!id) { console.error("用法：node tools/course_prompt.js <id> [--tags a,b] [--example chain-rule] [--rewrite]"); process.exit(1); }

const outline = fs.readFileSync(path.join(DIR, "OUTLINE.md"), "utf8");
const lines = outline.split(/\r?\n/);
const at = lines.findIndex((l) => l.split("|").map((s) => s.trim())[1] === id);
if (at < 0) { console.error(`「${id}」不在 OUTLINE.md：新課先在對的章底下加一行「- 課號 | ${id} | 課名 | 要點」`); process.exit(1); }
// 前後各三課：先修／下一課多半從這裡挑
const near = lines.slice(Math.max(0, at - 6), at + 7).filter((l) => /^- |^##/.test(l)).join("\n");
const ids = lines.filter((l) => /^- /.test(l)).map((l) => { const p = l.split("|").map((s) => s.trim()); return `${p[1]} | ${p[2]}`; }).join("\n");

const file = path.join(DIR, "lessons", `${id}.json`);
const old = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : null;
const exName = opt("--example") || (id === "chain-rule" ? "limit-rationalize" : "chain-rule");
const example = fs.readFileSync(path.join(DIR, "lessons", `${exName}.json`), "utf8");

// 題庫：推薦題、自己算的 problemId 只能用存在的題號
const tags = (opt("--tags") || (old ? old.skillTags.coarse.join(",") : "")).split(",").filter(Boolean);
const found = tags.map((t) => {
  let out = "";
  try { out = execFileSync(process.execPath, [path.join(__dirname, "find_course_problems.js"), t, "--limit", "40"], { encoding: "utf8" }); } catch (e) { out = String(e.stdout || ""); }
  return `### tag ${t}\n${out.trim()}`;
}).join("\n\n");

const task = old && args.includes("--rewrite")
  ? `重寫這一課（現在的版本在最後「現有版本」）。數學內容可以重組，但每一個數字、答案都要重新算過。`
  : old ? `這一課已經有了（最後「現有版本」）。照使用者在對話裡另外說的要求改它；沒說要改的欄位原樣保留。`
    : `寫這一課，從零開始。`;

const prompt = `# 任務：寫 BuzzCalculus 微積分課程的一課（id：${id}）

${task}

輸出：**只回一個 JSON 物件**（一個 \`\`\`json 程式碼區塊），就是 tools/content/course_v2/lessons/${id}.json 的完整內容。不要解說、不要省略號、不要「其餘同上」。

## 必守
- 格式與寫作規則全部照下面的 SCHEMA.md（欄位、字數、11 條寫作規則）。黑板照 board-style.md 與 board-authoring-brief.md（跑工具的部分你不用做）。
- 要有 sections（4–6 節，證明節的課最多 7 節）、每一句 beat 都要有 show、say、board；每一題 checks 恰好落在一節的結尾。
- 每個範例都要有 claim（step_claims 語法，會被機器實算）；算不了才寫 claim: null ＋ claimNote。
- 畫面上的數字（show／note／board／key）只能是課文、圖的參數裡出現過的數字。
- 台灣繁體中文；不出現學校名稱、「Putnam」、付費字眼、emoji、課號（引用別課寫〈課名〉，id 放 related）。
- prerequisites／next／related 只能用下面「全部課的 id」裡的 id。
- skillTags.coarse 只能用下面「題庫」列出來的 tag；practice 與 solve.problemId 只能用題庫列出來的題號，優先「已驗算」。找不到合適的就 practice 少放、寫進 gaps，不要湊。
- 所有答案自己再驗一次。錯答案比沒答案糟。
- JSON 字串裡的 LaTeX 反斜線要寫兩個（\\\\frac）。

之後我會把驗證器的錯誤貼回來，你照錯誤改，再回完整的 JSON。

## 這一課在大綱的位置
${near}

## 全部課的 id（id | 課名）
${ids}

## 題庫（可用的題號與 tag）
${found || "（沒有給 tag：skillTags.coarse 先寫你認為的 tag、practice 留空陣列，我查完題庫再給你）"}

## SCHEMA.md
${fs.readFileSync(path.join(DIR, "SCHEMA.md"), "utf8")}

## docs/board-style.md
${fs.readFileSync(path.join(ROOT, "docs", "board-style.md"), "utf8")}

## docs/board-authoring-brief.md
${fs.readFileSync(path.join(ROOT, "docs", "board-authoring-brief.md"), "utf8")}

## 範本（照它的格式與密度）：${exName}.json
\`\`\`json
${example}
\`\`\`
${old ? `\n## 現有版本：${id}.json\n\`\`\`json\n${JSON.stringify(old, null, 2)}\n\`\`\`\n` : ""}`;

const outDir = path.join(ROOT, "tmp", "chatgpt");
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `${id}.txt`);
fs.writeFileSync(out, prompt);
console.log(`${path.relative(ROOT, out)}（${Math.round(Buffer.byteLength(prompt) / 1024)} KB${tags.length ? `，題庫 tag：${tags.join("、")}` : "，沒給 --tags"}）`);
