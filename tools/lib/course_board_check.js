// 分節黑板（sections[].beats[].board）的把關：validate_course_v2.js 每一節叫一次 checkSection。
// 照畫面的順序模擬黑板上有哪幾行、每一行有哪些項（{{id:…}}），所以「圈一個不在板上的項」「沒有式子可以變形」在這裡就擋。
// KaTeX 用跟畫面同一組選項（src/course_board.js 的 BuzzBoard.KOPT：只信任 \htmlClass{cvb-t-…}）與同一支 {{id:…}} 轉換。
"use strict";

const TYPES = {
  write: ["line", "color"],
  transform: ["line", "color"],
  circle: ["term", "color", "label"],
  underline: ["term", "color", "label"],
  box: ["term", "color", "label"],
  strike: ["term", "color", "label"],
  arrow: ["from", "to", "color", "label"],
  plot: ["graph"],
  clear: [],
  keep: ["n"]
};
const COLORS = ["gold", "red", "blue", "green"];
const MAX_ACTIONS = 4; // 一句最多幾個動作
const MAX_LINES = 4; // 板上同時最多幾行（一張圖算 2 行）
const LINE_MAX = 32; // 一行看得到的字（TeX 原始碼不算）
const LABEL_MAX = 8;
const ID = /\{\{([a-z][a-z0-9]{0,7}):/g;
const ID1 = /^\{\{[a-z][a-z0-9]{0,7}:/;

// {{id: 要用 }} 收尾：被單一個 } 收掉、或到最後都沒收，畫面上會安靜地少一層（KaTeX 不會報錯）
function tagsClosed(src) {
  const stack = [];
  for (let i = 0; i < src.length; i += 1) {
    const c = src[i];
    const m = c === "{" && ID1.exec(src.slice(i, i + 12));
    if (c === "\\") i += 1;
    else if (m) { stack.push(1); i += m[0].length - 1; } else if (c === "{") stack.push(0);
    else if (c === "}") {
      const top = stack.pop();
      if (top === 1) { if (src[i + 1] !== "}") return false; i += 1; }
    }
  }
  return !stack.includes(1);
}
// 每一個 {{id:內容}} → [id, 內容]（巢狀的也列；內容照原文，比對「同一個 id 是不是同一個式子」用）
function termsIn(src) {
  const out = [];
  const open = [];
  const stack = [];
  for (let i = 0; i < src.length; i += 1) {
    const c = src[i];
    const m = c === "{" && ID1.exec(src.slice(i, i + 12));
    if (c === "\\") i += 1;
    else if (m) { stack.push(1); open.push([m[0].slice(2, -1), i + m[0].length]); i += m[0].length - 1; } else if (c === "{") stack.push(0);
    else if (c === "}") {
      const top = stack.pop();
      if (top === 1 && src[i + 1] === "}") { const [id, from] = open.pop(); out.push([id, src.slice(from, i).replace(/\s+/g, "")]); i += 1; }
    }
  }
  return out;
}

function create({ katex, board, cjkLen, checkGraph }) {
  // 拿掉 {{id:…}} 的標記，剩下畫面上的數學（數字規則、一般的 KaTeX 檢查用這個）
  const plain = (line) => board.tex(String(line)).replace(/\\htmlClass\{cvb-t-[a-z0-9]+\}/g, "");
  const idsIn = (line) => [...String(line).matchAll(ID)].map((m) => m[1]);
  function checkLine(err, at, line) {
    if (typeof line !== "string" || !line.trim()) { err(`${at} 的 line 是空的`); return null; }
    if (cjkLen(plain(line)) > LINE_MAX) err(`${at} 的 line「${line}」超過 ${LINE_MAX} 字`);
    if (/\\(html|href|url|includegraphics|class|cssId|style|data)/.test(line)) err(`${at} 的 line 不能直接寫 \\html… 之類的指令：項的 id 用 {{id:…}}`);
    const parts = line.split(/(?<!\\)\$/);
    if (parts.length % 2 === 0) { err(`${at} 的 line「${line}」$ 不成對`); return null; }
    if (parts.some((p, i) => i % 2 === 0 && /\{\{[a-z][a-z0-9]*:/.test(p))) err(`${at} 的 {{id:…}} 要寫在 $…$ 裡面`);
    if (!tagsClosed(line)) err(`${at} 的 line「${line}」有沒收好的 {{id:…}}（要用 }} 收尾）`);
    const ids = idsIn(line);
    const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
    if (dup.length) err(`${at} 的 line 裡 id「${dup[0]}」重複`);
    parts.forEach((p, i) => {
      if (i % 2 === 0) return;
      try {
        const html = katex.renderToString(`\\displaystyle ${board.tex(p)}`, { ...board.KOPT, throwOnError: true });
        const got = [...html.matchAll(/cvb-t-([a-z][a-z0-9]*)/g)].map((m) => m[1]);
        idsIn(p).forEach((id) => { if (!got.includes(id)) err(`${at} 的 {{${id}:…}} 沒有變成項（括號沒對好？）`); });
      } catch (e) {
        err(`${at} 的 $${p}$ KaTeX 渲染失敗（${String(e.message).slice(0, 70)}）`);
      }
    });
    return termsIn(line);
  }

  // 一節：照順序走每一句的動作；回傳要算進數字規則的字（標記拿掉）
  function checkSection(sec, where, err) {
    const texts = [];
    let lines = []; // [{ ids: [...], plot: bool }]
    const has = (id) => lines.some((l) => l.terms.some(([k]) => k === id));
    // 板上已經有的 id：新的一行（或變形）會把那個元素搬過來／複製一份飛過來，所以內容要一模一樣
    const same = (at, terms, skip) => terms.forEach(([id, body]) => {
      const old = lines.filter((l, i) => i !== skip).flatMap((l) => l.terms).filter(([k]) => k === id).pop();
      if (old && old[1] !== body) err(`${at} 的 {{${id}:…}} 跟板上同一個 id 的內容不一樣（${old[1]} → ${body}）：同一個 id 會被搬過來，內容要一樣；不同的式子換一個 id`);
    });
    (sec.beats || []).forEach((b, bi) => {
      if (b.board === undefined) return;
      const at0 = `${where}第 ${bi + 1} 句的 board`;
      if (!Array.isArray(b.board) || !b.board.length) { err(`${at0} 要是非空的陣列`); return; }
      if (b.board.length > MAX_ACTIONS) err(`${at0} 有 ${b.board.length} 個動作（一句 ≤ ${MAX_ACTIONS}）`);
      let lastAt = -1;
      let held = false;
      b.board.forEach((a, k) => {
        const at = `${at0}[${k}]`;
        if (!a || typeof a !== "object" || !TYPES[a.do]) { err(`${at} 的 do 要是 ${Object.keys(TYPES).join("／")}`); return; }
        const odd = Object.keys(a).filter((key) => key !== "do" && key !== "at" && key !== "why" && !TYPES[a.do].includes(key));
        if (odd.length) err(`${at}（${a.do}）多了不認得的欄位：${odd.join("、")}`);
        if (a.at !== undefined) {
          if (typeof a.at !== "number" || !(a.at >= 0 && a.at < 1)) err(`${at} 的 at 要是 0 到 1 之間（不含 1）的數`);
          else if (a.at <= lastAt) err(`${at} 的 at 要比前面的動作大`);
          else lastAt = a.at;
        }
        // why: true ＝「為什麼」的答案：答了才畫。只能用在有 why 的句子，而且要接在最後（之後的動作也都是）
        if (a.why !== undefined) {
          if (a.why !== true) err(`${at} 的 why 只能寫 true`);
          else if (!b.why) err(`${at} 的 why: true 只能用在有「為什麼」（why）的句子`);
          held = true;
        } else if (held) err(`${at}：why: true 的動作要放在最後（答了才畫的接在後面）`);
        if (a.color !== undefined && !COLORS.includes(a.color)) err(`${at} 的 color 要是 ${COLORS.join("／")}`);
        if (a.label !== undefined) {
          if (typeof a.label !== "string" || !a.label.trim() || /\$/.test(a.label)) err(`${at} 的 label 要是一小段純文字（不寫 $）`);
          else if (cjkLen(a.label) > LABEL_MAX) err(`${at} 的 label「${a.label}」超過 ${LABEL_MAX} 字`);
          else texts.push(a.label);
        }
        const need = (id, key) => {
          if (typeof id !== "string" || !id) err(`${at}（${a.do}）沒有 ${key}`);
          else if (!has(id)) err(`${at}（${a.do}）的 ${key}「${id}」不在板上的式子裡（要先用 {{${id}:…}} 寫上去）`);
        };
        if (a.do === "write" || a.do === "transform") {
          const eq = lines.map((l) => !l.plot).lastIndexOf(true);
          if (a.do === "transform" && eq < 0) err(`${at}：板上沒有式子可以變形（先 write）`);
          const terms = checkLine(err, at, a.line);
          if (typeof a.line === "string") texts.push(plain(a.line));
          if (terms) same(at, terms, -1);
          if (terms && a.do === "write") lines.push({ terms, plot: false });
          else if (terms && eq >= 0) lines[eq] = { terms, plot: false };
        } else if (["circle", "underline", "box", "strike"].includes(a.do)) need(a.term, "term");
        else if (a.do === "arrow") {
          need(a.from, "from");
          need(a.to, "to");
          if (a.from && a.from === a.to) err(`${at}（arrow）的 from 跟 to 一樣`);
        } else if (a.do === "plot") {
          if (lines.some((l) => l.plot)) err(`${at}：板上已經有一張圖（先 clear／keep）`);
          if (!a.graph || typeof a.graph !== "object") err(`${at}（plot）沒有 graph`);
          else {
            checkGraph(at, a.graph);
            // 圖的座標（窗、塗色範圍、標籤位置）是畫法不是內容；式子與標籤的字才守數字規則
            const g = a.graph;
            texts.push(...[...(g.curves || []), ...(g.fills || [])].map((c) => [c.expr, c.expr2].filter(Boolean).join(" ")), ...(g.labels || []).map((l) => l.text || ""));
          }
          lines.push({ terms: [], plot: true });
        } else if (a.do === "clear") lines = [];
        else if (a.do === "keep") {
          if (!Number.isInteger(a.n) || a.n < 1 || a.n >= lines.length) err(`${at}（keep）的 n 要是 1 到 板上行數−1（現在 ${lines.length} 行）`);
          else lines = lines.slice(-a.n);
        }
        const load = lines.reduce((n, l) => n + (l.plot ? 2 : 1), 0);
        if (load > MAX_LINES) err(`${at}：板上 ${load} 行（一張圖算 2 行；最多 ${MAX_LINES}，先 clear／keep）`);
      });
    });
    return texts;
  }

  // 自測：每一條壞的都要被擋、好的那一條要零錯誤（規則改壞了在這裡就紅，不等某一課碰到）
  function selfTest() {
    const fails = [];
    const run = (beats) => { const got = []; checkSection({ beats }, "自測", (m) => got.push(m)); return got; };
    const w = (line) => ({ do: "write", line });
    const good = run([
      { board: [w("$\\frac{d}{dx}{{o:(x^2+1)}}^{{{n:4}}}$"), { do: "circle", term: "o", label: "外層" }] },
      { board: [{ do: "transform", line: "${{n:4}}{{o:(x^2+1)}}^3$" }, { do: "underline", term: "n", at: 0.7 }] },
      { board: [w("裡層：${{i:2x}}$"), { do: "arrow", from: "o", to: "i" }, { do: "keep", n: 1 }] },
      { board: [{ do: "clear" }, { do: "plot", graph: { window: [0, 6, -2, 2], curves: [{ expr: "cos(x)" }] } }] },
      { why: {}, board: [w("$a$"), { ...w("$b$"), why: true }] }
    ]);
    if (good.length) fails.push(`自測：好的黑板被擋了：${good[0]}`);
    const plot = { do: "plot", graph: { window: [0, 1, 0, 1], curves: [{ expr: "x" }] } };
    [
      ["不認得的動作", [{ board: [{ do: "fade", line: "$x$" }] }], /do 要是/],
      ["圈不在板上的項", [{ board: [w("$x$"), { do: "circle", term: "q" }] }], /不在板上/],
      ["箭頭指到被擦掉的項", [{ board: [w("${{a:x}}$"), w("${{b:y}}$"), { do: "keep", n: 1 }, { do: "arrow", from: "a", to: "b" }] }], /不在板上/],
      ["沒有式子就變形", [{ board: [{ do: "transform", line: "$x$" }] }], /沒有式子可以變形/],
      ["KaTeX 壞掉", [{ board: [w("$\\frac{1}{$")] }], /KaTeX/],
      ["$ 不成對", [{ board: [w("$x")] }], /不成對/],
      ["{{ 被單一個 } 收掉", [{ board: [w("${{a:x+1}$")] }], /沒收好/],
      ["{{ 到最後都沒收", [{ board: [w("${{a:x+1$")] }], /沒收好|KaTeX/],
      ["{{ 寫在 $ 外面", [{ board: [w("{{a:x}} 是 $x$")] }], /要寫在/],
      ["太多動作", [{ board: [w("$a$"), w("$b$"), { do: "keep", n: 1 }, w("$c$"), w("$d$")] }], /一句 ≤ 4/],
      ["板上太多行", [{ board: [w("$a$"), w("$b$"), w("$c$")] }, { board: [w("$d$"), w("$e$")] }], /最多 4/],
      ["一行太長", [{ board: [w("這一行寫得實在太長了".repeat(4))] }], /超過 32 字/],
      ["at 倒退", [{ board: [{ ...w("$a$"), at: 0.5 }, { ...w("$b$"), at: 0.2 }] }], /要比前面的動作大/],
      ["at 超出", [{ board: [{ ...w("$a$"), at: 1 }] }], /0 到 1/],
      ["直接寫 \\htmlClass", [{ board: [w("$\\htmlClass{cvb-t-a}{x}$")] }], /不能直接寫/],
      ["id 重複", [{ board: [w("${{a:x}}+{{a:y}}$")] }], /重複/],
      ["顏色", [{ board: [{ ...w("$a$"), color: "pink" }] }], /color/],
      ["多的欄位", [{ board: [{ ...w("$a$"), term: "a" }] }], /不認得的欄位/],
      ["keep 太多", [{ board: [w("$a$"), { do: "keep", n: 1 }] }], /keep/],
      ["兩張圖", [{ board: [plot, plot] }], /已經有一張圖/],
      ["label 有 $", [{ board: [w("${{a:x}}$"), { do: "box", term: "a", label: "$x$" }] }], /label/],
      ["label 太長", [{ board: [w("${{a:x}}$"), { do: "box", term: "a", label: "這是一個很長的標籤文字" }] }], /label/],
      ["同一個 id 不同內容", [{ board: [w("${{a:x}}$"), w("${{a:y}}$")] }], /內容不一樣/],
      ["變形時同一個 id 不同內容", [{ board: [w("${{a:x+1}}$"), { do: "transform", line: "${{a:x+2}}$" }] }], /內容不一樣/],
      ["why: true 用在沒有 why 的句子", [{ board: [{ ...w("$a$"), why: true }] }], /只能用在有/],
      ["why: true 不在最後", [{ why: {}, board: [{ ...w("$a$"), why: true }, w("$b$")] }], /要放在最後/],
      ["空的 board", [{ board: [] }], /非空/]
    ].forEach(([name, beats, want]) => {
      const got = run(beats);
      if (!got.some((m) => want.test(m))) fails.push(`自測：「${name}」沒有被擋（${got.join("；") || "零錯誤"}）`);
    });
    return fails;
  }

  return { checkSection, selfTest, plain };
}

module.exports = { create, tagsClosed, termsIn, TYPES, MAX_ACTIONS, MAX_LINES, LINE_MAX };
