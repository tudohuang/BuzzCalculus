// 產品 DM（A4 正反面）：把畫面裁圖內嵌進模板，輸出 HTML 與列印用 PDF。
//
// 用法：node tools/dm/build_dm.js <裁圖資料夾>   輸出 docs/dm/buzzcalculus-dm.html 與 .pdf
"use strict";

const fs = require("fs");
const path = require("path");
const { launch } = require("../lib/cdp.js");
const staticServer = require("../lib/static_server.js");

const ROOT = path.join(__dirname, "..", "..");
const OUT = path.join(ROOT, "docs", "dm");
fs.mkdirSync(OUT, { recursive: true });
const IMG = process.argv[2];
if (!IMG) { console.error("用法：node tools/dm/build_dm.js <裁圖資料夾>"); process.exit(1); }

let html = fs.readFileSync(path.join(__dirname, "template.html"), "utf8");
html = html.replace(/\{\{([\w-]+)\}\}/g, (_m, name) => {
  const file = path.join(IMG, `${name}.jpg`);
  return "data:image/jpeg;base64," + fs.readFileSync(file).toString("base64");
});
const htmlPath = path.join(OUT, "buzzcalculus-dm.html");
fs.writeFileSync(htmlPath, html);
console.log("html", (html.length / 1024).toFixed(0), "KB");

(async () => {
  const server = await staticServer.start(ROOT, 0);
  const chrome = await launch();
  try {
    await chrome.navigate(server.url + "/docs/dm/buzzcalculus-dm.html", { appReady: false });
    for (let i = 0; i < 50; i += 1) {
      if (await chrome.evaluate("return Boolean(window.__qrReady) && document.fonts.status === 'loaded';")) break;
      await chrome.sleep(200);
    }
    await chrome.sleep(400);
    const { data } = await chrome.send("Page.printToPDF", { printBackground: true, preferCSSPageSize: true, marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0 });
    fs.writeFileSync(path.join(OUT, "buzzcalculus-dm.pdf"), Buffer.from(data, "base64"));
    console.log("pdf written");
  } finally {
    // chrome.close() 偶爾等不到 socket 關閉；PDF 已落地，不讓收尾卡住整個流程
    setTimeout(() => process.exit(0), 1500).unref();
    await chrome.close();
    await server.stop();
  }
})().catch((e) => { console.error(e); process.exit(1); });
