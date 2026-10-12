// 整台機器同一時間只跑一顆「量版面的 Chrome」：鎖檔在 os.tmpdir()，誰拿著、從什麼時候。
// 為什麼：Chrome 很吃記憶體，好幾個 agent 平行跑 lint 會把機器擠爆（被 OOM 殺掉的 Chrome 看起來像測試紅）。
// 拿不到就等（每 2 秒看一次）；拿著的程序已經不在、或拿超過 STALE 分鐘（當掉沒放），就把鎖收回來。
"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");

const FILE = path.join(os.tmpdir(), "buzzcalculus-chrome-lint.lock");
const STALE_MIN = 30;

function alive(pid) {
  try { process.kill(pid, 0); return true; } catch (e) { return e.code === "EPERM"; }
}
function read() {
  try { return JSON.parse(fs.readFileSync(FILE, "utf8")); } catch (_e) { return null; }
}
async function acquire(label, { wait = 45 * 60000, log = console.log } = {}) {
  const deadline = Date.now() + wait;
  let told = false;
  for (;;) {
    try {
      const fd = fs.openSync(FILE, "wx");
      fs.writeSync(fd, JSON.stringify({ pid: process.pid, label, host: os.hostname(), since: new Date().toISOString() }));
      fs.closeSync(fd);
      const release = () => { const h = read(); if (h && h.pid === process.pid) fs.rmSync(FILE, { force: true }); };
      process.once("exit", release);
      ["SIGINT", "SIGTERM"].forEach((sig) => process.once(sig, () => { release(); process.exit(130); }));
      return release;
    } catch (e) {
      if (e.code !== "EEXIST") throw e;
    }
    const h = read();
    const age = h && h.since ? (Date.now() - Date.parse(h.since)) / 60000 : Infinity;
    if (!h || !alive(h.pid) || age > STALE_MIN) {
      log(`  （收回沒人在用的鎖：${h ? `pid ${h.pid}、${Math.round(age)} 分鐘` : "內容壞了"}）`);
      fs.rmSync(FILE, { force: true });
      continue;
    }
    if (Date.now() > deadline) throw new Error(`等不到 Chrome 的鎖（${FILE}，pid ${h.pid}「${h.label}」拿著）`);
    if (!told) { log(`  等別的 Chrome 跑完（pid ${h.pid}「${h.label}」，從 ${h.since}）…`); told = true; }
    await new Promise((r) => setTimeout(r, 2000));
  }
}

module.exports = { acquire, FILE };
