const fs = require("fs");
const path = require("path");

// The service worker precache list is hand-maintained; make sure it covers
// every script index.html ships, so a new problem pack can't miss offline mode.
const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const sw = fs.readFileSync(path.join(root, "sw.js"), "utf8");

const shippedScripts = [...html.matchAll(/src="(src\/[^"]+\.js)"/g)].map((m) => m[1]);
const shippedStyles = [...html.matchAll(/href="(styles\.css|manifest\.webmanifest|assets\/[^"]+)"/g)].map((m) => m[1]);
const cached = new Set([...sw.matchAll(/"\.\/([^"]+)"/g)].map((m) => m[1]));

const failures = [];
[...shippedScripts, ...shippedStyles].forEach((file) => {
  if (!cached.has(file)) failures.push(`sw.js APP_SHELL is missing ${file}`);
});
cached.forEach((file) => {
  if (file === "") return;
  if (!fs.existsSync(path.join(root, file))) failures.push(`sw.js APP_SHELL caches missing file ${file}`);
});

// Markdown 粗體不能出現在 HTML 模板裡。
// 實際踩過：刪除確認的文案寫成 `**這個動作無法復原。**`，
// 但那是 HTML 模板不是 markdown，使用者看到的就是一排星號。
// 這種錯誤不會讓任何東西壞掉，只會讓產品看起來很業餘 —— 所以只能靠 lint 抓。
const uiSources = ["src/app.js", "index.html", "privacy.html", "terms.html", "about.html", "changelog.html"];
uiSources.forEach((file) => {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  source.split("\n").forEach((line, index) => {
    const trimmed = line.trim();
    // 註解裡的 **強調** 是給人看的，不會被 render
    if (trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("<!--")) return;
    // 只抓「成對星號包住一段不含標籤的短文字」，避開數學式與正規表達式
    const hit = line.match(/\*\*[^*<>\n]{1,40}\*\*/);
    if (hit) {
      failures.push(`${file}:${index + 1} 有 markdown 粗體 ${hit[0]} —— HTML 模板要用 <strong>`);
    }
  });
});

if (failures.length) {
  failures.forEach((failure) => console.error(`FAIL ${failure}`));
  process.exit(1);
}
console.log(`Validated app shell: ${cached.size} cached entries cover ${shippedScripts.length} scripts`);
console.log(`Validated UI copy: ${uiSources.length} 個檔案沒有外洩的 markdown 星號`);
