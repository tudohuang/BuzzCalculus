// 分節黑板（sections[].beats[].board）的把關：validate_course_v2.js 每一節叫一次 checkSection。
// 照畫面的順序模擬黑板上有哪幾行、每一行有哪些項（{{id:…}}），所以「圈一個不在板上的項」「沒有式子可以變形」在這裡就擋。
// KaTeX 用跟畫面同一組選項（src/course_board.js 的 BuzzBoard.KOPT：只信任 \htmlClass{cvb-t-…}）與同一支 {{id:…}} 轉換。
"use strict";

const TYPES = {
  write: ["line", "color", "tint"],
  transform: ["line", "color", "tint"],
  circle: ["term", "color", "label"],
  underline: ["term", "color", "label"],
  box: ["term", "color", "label"],
  strike: ["term", "color", "label"],
  focus: ["term", "color", "label"],
  arrow: ["from", "to", "color", "label"],
  plot: ["graph", "svg", "nb"],
  clear: [],
  keep: ["n"]
};
const COLORS = ["gold", "red", "blue", "green", "violet"];
const MAX_ACTIONS = 5; // 一句最多幾個動作
// 板上同時最多幾行（一張圖算 2 行）。2026-10-20 4 → 8：板子不擦了，寫滿一塊（5 列）畫面自己換下一塊；真的疊到、出板由 lint_board_layout 在 Chrome 裡量。
// 這裡只擋太誇張的（一口氣寫一大串不分段），也讓擴寫時能在節中間插句子
const MAX_LINES = 8;
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

// on：「字」或「字#2」（第 2 次出現）→ 在 say 裡的字元位置（以字元算，不是 UTF-16）；找不到 -1。src/course_board_layout.js 的 charOf 同一條規則
function charOf(on, say) {
  const m = /^(.*?)(?:#(\d+))?$/.exec(String(on));
  let at = -1;
  for (let k = 0; k < (Number(m[2]) || 1); k += 1) { at = String(say).indexOf(m[1], at + 1); if (at < 0) return -1; }
  return [...String(say).slice(0, at)].length;
}
const occurrences = (word, say) => { let n = 0; for (let at = String(say).indexOf(word); at >= 0; at = String(say).indexOf(word, at + 1)) n += 1; return n; };
// 那個詞被念到的毫秒：逐字時間點 w = [[字元位置, 毫秒], …]（build_narration.js）；落在一個詞的中間就照字數內插
function anchorMs(on, say, w) {
  const c = charOf(on, say);
  if (c < 0 || !Array.isArray(w) || !w.length) return null;
  let k = -1;
  w.forEach(([wc], i) => { if (wc <= c) k = i; });
  if (k < 0) return w[0][1];
  const [c0, m0] = w[k];
  const nx = w[k + 1];
  if (c === c0 || !nx) return m0;
  return Math.round(m0 + ((c - c0) / (nx[0] - c0)) * (nx[1] - m0));
}

function create({ katex, board, cjkLen, checkGraph, layout }) {
  // 拿掉 {{id:…}} 的標記，剩下畫面上的數學（數字規則、一般的 KaTeX 檢查用這個）
  const plain = (line) => board.tex(String(line)).replace(/\\htmlClass\{cvb-t-[a-z0-9]+\}/g, "");
  const idsIn = (line) => [...String(line).matchAll(ID)].map((m) => m[1]);
  function checkLine(err, at, line, loose) {
    if (typeof line !== "string" || !line.trim()) { err(`${at} 的 line 是空的`); return null; }
    if (!loose && cjkLen(plain(line)) > LINE_MAX) err(`${at} 的 line「${line}」超過 ${LINE_MAX} 字`);
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
  // narrated：這一課有旁白（say）→ 動作要錨在念到的詞上
  // loose：交付的筆記本課（source: "notebook"，tools/import_notebook.js 轉的）—— 筆記本一課一塊、往下寫，
  //   一行的字數、一句的動作數、板上的行數、一次一張圖都不限（版面由 lint_board_layout 在 Chrome 裡量）
  function checkSection(sec, where, err, narrated, loose) {
    const texts = [];
    let lines = []; // [{ ids: [...], plot: bool }]
    const wrong = []; // [{ id, line }]：標成錯的項與它所在的那一行（同一個物件）
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
      if (!loose && b.board.length > MAX_ACTIONS) err(`${at0} 有 ${b.board.length} 個動作（一句 ≤ ${MAX_ACTIONS}）`);
      let lastAt = -1;
      let held = false;
      const lastOn = {};
      const clipCount = {};
      b.board.forEach((a, k) => {
        const at = `${at0}[${k}]`;
        if (!a || typeof a !== "object" || !TYPES[a.do]) { err(`${at} 的 do 要是 ${Object.keys(TYPES).join("／")}`); return; }
        const odd = Object.keys(a).filter((key) => key !== "do" && key !== "at" && key !== "on" && key !== "why" && !TYPES[a.do].includes(key));
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
        // on：這個動作在念到哪個詞時開始。問著「為什麼」時（有 why 的句子、不是 why: true 的動作）念的是問句 why.say
        const clip = b.why && !a.why ? "q" : "s";
        const say = String((clip === "q" ? b.why && b.why.say : b.say) || "");
        if (a.on !== undefined) {
          if (a.at !== undefined) err(`${at}：on 跟 at 只能寫一個`);
          const word = String(a.on).replace(/#\d+$/, "");
          if (typeof a.on !== "string" || !word.trim()) err(`${at} 的 on 要是 say 裡的一小段字`);
          else if (!say) err(`${at} 的 on：這一句沒有${clip === "q" ? "問句的旁白（why.say）" : " say"}`);
          else if (charOf(a.on, say) < 0) err(`${at} 的 on「${a.on}」不在${clip === "q" ? "問句（why.say）" : " say"}裡：「${say}」`);
          else if (!/#\d+$/.test(a.on) && occurrences(word, say) > 1) err(`${at} 的 on「${a.on}」在${clip === "q" ? "問句" : " say"}裡出現 ${occurrences(word, say)} 次：寫「${word}#2」指定第幾次`);
          else {
            const c = charOf(a.on, say);
            if (c <= (lastOn[clip] === undefined ? -1 : lastOn[clip])) err(`${at} 的 on「${a.on}」要在前一個動作的 on 之後（照念的順序）`);
            lastOn[clip] = c;
          }
        } else if (narrated && (clipCount[clip] || 0) > 0 && a.at === undefined) err(`${at}（${a.do}）：有旁白的課，每一段第一個以外的動作要寫 on（念到哪個詞開始）`);
        clipCount[clip] = (clipCount[clip] || 0) + 1;
        if (a.tint !== undefined) {
          if (!a.tint || typeof a.tint !== "object" || Array.isArray(a.tint)) err(`${at} 的 tint 要是 { id: 顏色 }`);
          else Object.entries(a.tint).forEach(([id, col]) => {
            if (!COLORS.includes(col)) err(`${at} 的 tint.${id} 要是 ${COLORS.join("／")}`);
            if (typeof a.line === "string" && !idsIn(a.line).includes(id)) err(`${at} 的 tint.${id}：這一行沒有 {{${id}:…}}`);
          });
        }
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
          const terms = checkLine(err, at, a.line, loose);
          if (typeof a.line === "string") texts.push(plain(a.line));
          if (terms) same(at, terms, -1);
          // 劃掉（或紅色記號）標成「錯」的項：那一行還在板上時，不能在別的行（或變形後的同一行）沒標記地再出現
          if (terms) wrong.filter((x) => lines.includes(x.line)).forEach((x) => { if (terms.some(([k]) => k === x.id)) err(`${at}：{{${x.id}:…}} 已經被標成錯的（劃掉／紅色），不能再寫進${a.do === "transform" && lines[eq] === x.line ? "變形後的這一行" : "別的行"}（會變成一個沒標記的錯式子）；先 clear／keep 擦掉，或換一個 id 寫對的式子`); });
          if (terms && a.do === "write") lines.push({ terms, plot: false });
          else if (terms && eq >= 0) lines[eq] = { terms, plot: false };
        } else if (["circle", "underline", "box", "strike", "focus"].includes(a.do)) {
          need(a.term, "term");
          // 「錯」的記號跟著那一行活（畫面上下一句不會收掉）：記下來，之後這個項不能沒標記地出現
          if ((a.do === "strike" || a.color === "red") && has(a.term)) wrong.push({ id: a.term, line: [...lines].reverse().find((l) => l.terms.some(([k]) => k === a.term)) });
        }
        else if (a.do === "arrow") {
          need(a.from, "from");
          need(a.to, "to");
          if (a.from && a.from === a.to) err(`${at}（arrow）的 from 跟 to 一樣`);
        } else if (a.do === "plot") {
          if (!loose && lines.some((l) => l.plot)) err(`${at}：板上已經有一張圖（先 clear／keep）`);
          // svg：交付的筆記本課，圖在匯入時就畫好了（只收一整個 <svg>…</svg>，不收 script、事件、外部連結）
          if (a.nb !== undefined) {
            // nb：交付的筆記本課的函數圖（BuzzNotebook 的 plot 規格；網站上 src/course_board_nbplot.js 畫，匯入時畫過一次）
            if (a.graph !== undefined || a.svg !== undefined) err(`${at}（plot）graph、svg、nb 只能寫一個`);
            if (!a.nb || typeof a.nb !== "object" || !a.nb.spec || !Array.isArray(a.nb.spec.window)) err(`${at}（plot）的 nb 要有 spec.window`);
          } else if (a.svg !== undefined) {
            if (a.graph !== undefined) err(`${at}（plot）graph 跟 svg 只能寫一個`);
            if (typeof a.svg !== "string" || !/^<svg[\s>][\s\S]*<\/svg>$/.test(a.svg.trim())) err(`${at}（plot）的 svg 要是一整個 <svg>…</svg>`);
            else if (/<script|\son\w+\s*=|javascript:|<foreignObject|href\s*=\s*["']?(?!#)/i.test(a.svg)) err(`${at}（plot）的 svg 有 script、事件或外部連結`);
          } else if (!a.graph || typeof a.graph !== "object") err(`${at}（plot）沒有 graph`);
          else {
            // 第三個參數是收錯誤的函式；以前漏傳，圖一有錯驗證器就丟 TypeError「e is not a function」而不是印出哪裡錯
            checkGraph(at, a.graph, err);
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
        if (!loose && load > MAX_LINES) err(`${at}：板上 ${load} 行（一張圖算 2 行；最多 ${MAX_LINES}，先 clear／keep）`);
      });
    });
    return texts;
  }

  // 自測：每一條壞的都要被擋、好的那一條要零錯誤（規則改壞了在這裡就紅，不等某一課碰到）
  function selfTest() {
    const fails = [];
    const run = (beats, narrated) => { const got = []; checkSection({ beats }, "自測", (m) => got.push(m), narrated); return got; };
    const w = (line) => ({ do: "write", line });
    const good = run([
      { board: [w("$\\frac{d}{dx}{{o:(x^2+1)}}^{{{n:4}}}$"), { do: "circle", term: "o", label: "外層" }] },
      { board: [{ do: "transform", line: "${{n:4}}{{o:(x^2+1)}}^3$" }, { do: "underline", term: "n", at: 0.7 }] },
      { board: [w("裡層：${{i:2x}}$"), { do: "arrow", from: "o", to: "i" }, { do: "keep", n: 1 }] },
      { board: [{ do: "clear" }, { do: "plot", graph: { window: [0, 6, -2, 2], curves: [{ expr: "cos(x)" }] } }] },
      { why: {}, board: [w("$a$"), { ...w("$b$"), why: true }] }
    ]);
    if (good.length) fails.push(`自測：好的黑板被擋了：${good[0]}`);
    const said = run([
      { say: "外層微分，裡層原封不動，外層再乘。", board: [{ ...w("$\\frac{d}{dx}{{o:(x^2+1)}}^{{{n:4}}}$"), tint: { o: "blue", n: "violet" } }, { do: "circle", term: "o", on: "裡層" }, { do: "focus", term: "n", on: "外層#2" }] },
      { say: "先問。", why: { say: "為什麼可以？" }, board: [{ do: "clear" }, { ...w("$b$"), on: "可以" }, { ...w("$c$"), why: true }, { ...w("$d$"), why: true, on: "問" }] }
    ], true);
    if (said.length) fails.push(`自測：好的旁白錨點被擋了：${said[0]}`);
    if (anchorMs("外層", "外層微分", [[0, 50], [2, 400]]) !== 50 || anchorMs("層", "外層微分", [[0, 50], [2, 400]]) !== 225 || charOf("層#2", "外層裡層") !== 3) fails.push("自測：anchorMs／charOf 算錯");
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
      ["太多動作", [{ board: [w("$a$"), w("$b$"), { do: "keep", n: 1 }, w("$c$"), w("$d$"), { do: "keep", n: 1 }] }], /一句 ≤ 5/],
      ["板上太多行", [{ board: [w("$a$"), w("$b$"), w("$c$")] }, { board: [w("$d$"), w("$e$")] }, { board: [w("$f$"), w("$g$")] }, { board: [w("$h$"), w("$i$")] }], /最多 8/],
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
      ["空的 board", [{ board: [] }], /非空/],
      ["on 不在 say 裡", [{ say: "外層微分。", board: [w("$a$"), { ...w("$b$"), on: "裡層" }] }], /不在/, true],
      ["on 出現兩次沒寫 #n", [{ say: "外層，外層。", board: [w("$a$"), { ...w("$b$"), on: "外層" }] }], /出現 2 次/, true],
      ["on 倒退", [{ say: "外層，裡層。", board: [{ ...w("$a$"), on: "裡層" }, { ...w("$b$"), on: "外層" }] }], /之後/, true],
      ["on 跟 at 都寫", [{ say: "外層。", board: [{ ...w("$a$"), on: "外層", at: 0.2 }] }], /只能寫一個/, true],
      ["有旁白沒錨", [{ say: "外層，裡層。", board: [w("$a$"), w("$b$")] }], /要寫 on/, true],
      ["問著的動作錨在 say", [{ say: "裡層。", why: { say: "為什麼？" }, board: [w("$a$"), { ...w("$b$"), on: "裡層" }] }], /問句/, true],
      ["tint 的 id 不在這一行", [{ board: [{ ...w("${{a:x}}$"), tint: { b: "blue" } }] }], /tint\.b/],
      ["tint 顏色", [{ board: [{ ...w("${{a:x}}$"), tint: { a: "pink" } }] }], /tint\.a/],
      ["劃掉的項又被寫進別的行", [{ board: [w("${{w:x}}$"), { do: "strike", term: "w" }] }, { board: [w("$y={{w:x}}$")] }], /標成錯的/],
      ["劃掉的那一行變形之後還留著那一項", [{ board: [w("${{w:x}}$"), { do: "strike", term: "w" }, { do: "transform", line: "${{w:x}}+1$" }] }], /標成錯的/],
      ["紅色記號標的項又被寫進別的行", [{ board: [w("${{w:x}}$"), { do: "circle", term: "w", color: "red" }, w("$z={{w:x}}$")] }], /標成錯的/]
    ].forEach(([name, beats, want, narrated]) => {
      const got = run(beats, narrated);
      if (!got.some((m) => want.test(m))) fails.push(`自測：「${name}」沒有被擋（${got.join("；") || "零錯誤"}）`);
    });
    if (layout) fails.push(...layoutSelfTest(layout));
    return fails;
  }

  // 畫面的排版純函式（src/course_board_layout.js）：切式子、換行、時間表、記號的壽命、標籤避讓。改壞了這裡先紅（畫面要到 lint 才看得到）
  function layoutSelfTest(LY) {
    const f = [];
    const eq = (name, got, want) => { if (JSON.stringify(got) !== JSON.stringify(want)) f.push(`自測（排版）：${name}：${JSON.stringify(got)}，要 ${JSON.stringify(want)}`); };
    eq("最外層的 = 切開", LY.relSplit("\\frac{d}{dx}f(g(x))=f'(g(x))\\cdot g'(x)").length, 2);
    eq("下標裡的 \\to 不切", LY.relSplit("\\lim_{h\\to0}\\frac{A}{h}=f(x)").length, 2);
    eq("\\left( … \\right) 裡的 = 不切", LY.relSplit("\\left(a=b\\right)'=c").length, 2);
    eq("\\le 與 \\left 分得開", LY.relSplit("0\\le f_n\\le\\frac{1}{2}").length, 3);
    const u = LY.units("取 $k=g(x+h)-g(x)$，除以 $h$");
    eq("字＋式子：在 = 前、最外層的 − 前、中文標點後可以換行", u.units.length, 4);
    const us = (x) => LY.units(x).units.map((y) => (y.hard ? "|" : "") + y.toks.map((t) => t.s).join(""));
    eq("+ − 只在括號、絕對值外面切；正負號不切", us("$a=-b+(c-d)+|e-f|$"), ["a", "=-b", "{}+(c-d)", "{}+|e-f|"]);
    eq("框起來的長式子（{{bxN:）拆開、每塊各包一次；別的 id 不拆", [us("${{bx1:a=b+c}}$"), us("${{t:a=b+c}}$").length], [["{{bx1:a}}", "{{bx1:=b}}", "{{bx1:{}+c}}"], 1]);
    eq("aligned：\\\\ 一定換行、& 換成空白", us("$\\displaystyle {\\begin{aligned}a&=b\\\\&=c\\end{aligned}}$"), ["a ", "=b", "|=c"]);
    eq("橫的表轉直的：欄的直線變列的橫線", LY.flip("$\\begin{array}{c|ccc}x&1&2&3\\\\\\hline y&4&5&6\\end{array}$"), "$\\begin{array}{c|c}x& y\\\\\\hline 1&4\\\\2&5\\\\3&6\\\\\\end{array}$");
    eq("直的表：沒有格線的攤成一欄、有格線的不動", [LY.flip("$\\begin{array}{cc}1&2\\\\3&4\\\\5&6\\end{array}$"), LY.flip("$\\begin{array}{c|c}1&2\\\\3&4\\end{array}$")], ["$\\begin{array}{l}1\\\\2\\\\3\\\\4\\\\5\\\\6\\end{array}$", null]);
    eq("一定換行的列：放得下就不再換", LY.compose([50, 50, 50], 200, 0.84, 1, [false, false, true]).rows, [[0, 1], [2]]);
    eq("長的一串中文每四個字可以換行（標點、空白黏前面）", LY.units("一二三四五六七八，九").units.map((x) => x.toks.map((t) => t.s).join("")), ["一二三四", "五六七八，", "九"]);
    eq("有中文的行不對齊", u.align, -1);
    eq("純式子對齊到第一個關係符號", LY.units("$y=f(u)$").align, 1);
    eq("⇒ 開頭的行不對齊", LY.units("$\\Rightarrow0\\le f_n$").align, -1);
    const k = LY.compose([100, 100, 100], 250, 0.84, 1);
    eq("太寬：換行、接續的那一列對齊到 = 底下", [k.rows, k.ind, k.s], [[[0, 1], [2]], [0, 100], 1]);
    eq("只寬一點：縮（≥ 0.9）不換行", LY.compose([100, 120], 210, 0.84, 1).rows.length, 1);
    const sc = LY.schedule([{ do: "write", line: "$a$" }, { do: "circle" }, { do: "circle" }], 3000, (a) => (a.do === "write" ? null : a === undefined ? null : 1000));
    eq("時間表：錨點擠在一起 → 後一個往後推 160ms、前一個縮短", sc.map((x) => x[0]), [0, 1000, 1160]);
    eq("時間表：最後一個在這一段結束前做完", sc[2][0] + sc[2][1] <= 2940, true);
    eq("charOf：#2 是第二次出現", LY.charOf("層#2", "外層裡層"), charOf("層#2", "外層裡層"));
    const M = LY.compile([{ board: [{ do: "write", line: "${{a:x}}$" }, { do: "circle", term: "a" }] }, { board: [{ do: "transform", line: "${{a:x}}+1$" }] }]);
    eq("compile（不擦的板）：變形寫在下一行、上一行留著，同 id 的項飛過去", [M.states.map((s) => s.length), M.items[1].fly], [[1, 1, 2], [["a", 0]]]);
    eq("compile（erase：舊的會擦的板）：變形取代同一個位置", LY.compile([{ board: [{ do: "write", line: "${{a:x}}$" }] }, { board: [{ do: "transform", line: "${{a:x}}+1$" }] }], { erase: true }).states.map((s) => s.length), [1, 1]);
    const P = LY.compile([{ board: [{ do: "write", line: "$a$" }, { do: "clear" }, { do: "write", line: "$b$" }, { do: "keep", n: 1 }, { do: "write", line: "$c$" }] }]);
    eq("compile（不擦的板）：clear 換一塊接著寫、keep 原地接著寫、什麼都不擦", [P.items.map((it) => it.panel), P.states[P.states.length - 1].length, P.items.every((it) => it.die === Infinity)], [[0, 1, 1], 3, true]);
    eq("compile：記號只活到下一句", M.anns[0].dieBeat, 1);
    const lab = LY.placeLabel(20, 10, [50, 0, 60, 10], [0, 0, 100, 10], "below", [[30, 14, 80, 30]], [0, 0, 200, 100]);
    eq("標籤：正下方有字就換位置（不碰任何障礙）", lab && !LY.hit(lab, [30, 14, 80, 30], 2), true);
    return f;
  }

  return { checkSection, selfTest, plain };
}

module.exports = { create, tagsClosed, termsIn, charOf, anchorMs, TYPES, MAX_ACTIONS, MAX_LINES, LINE_MAX, COLORS };
