// 課文的「純文字」寫法（.md）→ 課文物件（跟 .json／.js 同一個格式）。規則見 README「怎麼寫課文」。
//
//   # 標題            > 副標（緊接在標題下）       ## 節名
//   一行字 = 一步      + 接在上一步（同一步多一行）    - 條列（寫成 •）
//   $$ 式子 $$        （或 $$ 獨立一行開、獨立一行關）
//   ```plot / ```quiz / ```predict / ```order / ```svg  圍起來的是圖與題目
//   @set 圖id h=0.1 dur=1.5   把圖的滑桿動到某一格      @page  @column  換頁／換欄
//   縮兩格的 key: value 接在上一步：say、note、color、at、dur、box、small、center
//   %% 開頭是註解
"use strict";

const ATTRS = new Set(["say", "note", "color", "at", "dur", "box", "small", "center", "id"]);
const val = (v) => {
  const s = String(v).trim();
  if (s === "true" || s === "yes") return true;
  if (s === "false" || s === "no") return false;
  return s !== "" && Number.isFinite(Number(s)) ? Number(s) : s;
};
const parts = (s) => (s.includes(";") ? s.split(";") : s.trim().split(/\s+/)).map((x) => x.trim()).filter((x) => x !== "");
// 「主體 | color | dash | label=…」
function piped(s) {
  const [head, ...rest] = s.split("|").map((x) => x.trim());
  const o = { head };
  rest.forEach((r) => {
    const m = /^(\w+)\s*=\s*(.*)$/.exec(r);
    if (m) o[m[1]] = m[2];
    else if (r === "dash") o.dash = true;
    else if (r) o.color = r;
  });
  return o;
}

function plotOf(lines) {
  const fig = { type: "plot" };
  lines.forEach((ln) => {
    const m = /^(\w+)\s*:\s*(.*)$/.exec(ln.trim());
    if (!m) return;
    const [, k, v] = m;
    if (k === "fn") {
      const p = piped(v);
      const o = { expr: p.head };
      if (p.color) o.color = p.color;
      if (p.dash) o.dash = true;
      if (p.label) o.label = p.label;
      if (p.domain) o.domain = p.domain.split("..").map(val);
      if (p.width) o.width = Number(p.width);
      (fig.fn = fig.fn || []).push(o);
    } else if (k === "window") fig.window = parts(v).map(val);
    else if (k === "param") {
      const [name, min, max, value, ...label] = parts(v);
      (fig.params = fig.params || {})[name] = { min: Number(min), max: Number(max), value: value == null ? Number(min) : Number(value), label: label.join(" ") || name };
    } else if (k === "point") {
      const p = piped(v);
      const [x, y, ...label] = parts(p.head);
      (fig.points = fig.points || []).push({ x: val(x), y: val(y), label: label.join(" ") || undefined, color: p.color, open: p.open === "true" || undefined });
    } else if (k === "line") {
      const p = piped(v);
      const [a, b, c, d] = parts(p.head).map(val);
      (fig.lines = fig.lines || []).push({ from: [a, b], to: [c, d], color: p.color, dash: p.dash });
    } else if (k === "vline" || k === "hline") {
      const p = piped(v);
      const [at, ...label] = parts(p.head);
      (fig[`${k}s`] = fig[`${k}s`] || []).push({ [k === "vline" ? "x" : "y"]: val(at), label: label.join(" ") || undefined, color: p.color });
    } else if (k === "area") {
      const p = piped(v);
      const [expr, from, to] = parts(p.head);
      (fig.area = fig.area || []).push({ expr, from: val(from), to: val(to), color: p.color, under: p.under });
    } else if (k === "label") {
      const p = piped(v);
      const [x, y, ...text] = parts(p.head);
      (fig.labels = fig.labels || []).push({ x: val(x), y: val(y), text: text.join(" "), color: p.color });
    } else fig[k] = val(v);
  });
  return fig;
}
function quizOf(lines, predict) {
  const q = { ask: "", options: [], answer: 0 };
  const ask = [];
  lines.forEach((ln) => {
    const t = ln.trim();
    const m = /^([-*])\s+(.*)$/.exec(t);
    const kv = /^(think|answer)\s*:\s*(.*)$/.exec(t);
    if (m) {
      const [text, why] = m[2].split(/\s+\/\/\s+/);
      if (m[1] === "*") q.answer = q.options.length;
      q.options.push(why ? { text: text.trim(), why: why.trim() } : { text: text.trim() });
    } else if (kv) q[kv[1]] = Number(kv[2]);
    else if (t) ask.push(t);
  });
  q.ask = ask.join("\n");
  return predict ? { predict: q } : { quiz: q };
}
function orderOf(lines) {
  const o = { ask: "", steps: [] };
  const ask = [];
  lines.forEach((ln) => {
    const t = ln.trim();
    const m = /^(?:\d+[.)]|[-*])\s+(.*)$/.exec(t);
    if (m) o.steps.push(m[1]);
    else if (t) ask.push(t);
  });
  o.ask = ask.join("\n");
  return { order: o };
}

function parseMd(src) {
  const lesson = { sections: [] };
  const lines = String(src).replace(/\r\n?/g, "\n").split("\n");
  let i = 0;
  if (lines[0] && lines[0].trim() === "---") {
    i = 1;
    for (; i < lines.length && lines[i].trim() !== "---"; i += 1) {
      const m = /^(\w+)\s*:\s*(.*)$/.exec(lines[i]);
      if (m) lesson[m[1]] = m[1] === "size" ? parts(m[2]).map(Number) : val(m[2]);
    }
    i += 1;
  }
  let sec = null;
  let last = null;
  const section = () => { if (!sec) { sec = { title: "", steps: [] }; lesson.sections.push(sec); } return sec; };
  const push = (st) => { section().steps.push(st); last = st; return st; };
  for (; i < lines.length; i += 1) {
    const raw = lines[i];
    const line = raw.trim();
    if (!line || line.startsWith("%%")) continue;
    // 縮排的 key: value → 上一步的屬性
    const attr = /^\s{2,}(\w+)\s*:\s*(.*)$/.exec(raw);
    if (attr && last && ATTRS.has(attr[1])) { last[attr[1]] = attr[1] === "say" || attr[1] === "note" ? attr[2].trim() : val(attr[2]); continue; }
    if (/^#\s/.test(line)) { lesson.title = line.replace(/^#\s+/, ""); continue; }
    if (/^>\s/.test(line) && !lesson.sections.length) { lesson.subtitle = line.replace(/^>\s+/, ""); continue; }
    if (/^##\s/.test(line)) { sec = { title: line.replace(/^##\s+/, ""), steps: [] }; lesson.sections.push(sec); last = null; continue; }
    const fence = /^```(\w+)\s*$/.exec(line);
    if (fence) {
      const body = [];
      for (i += 1; i < lines.length && lines[i].trim() !== "```"; i += 1) body.push(lines[i]);
      const kind = fence[1];
      if (kind === "plot") push({ figure: plotOf(body) });
      else if (kind === "quiz" || kind === "predict") push(quizOf(body, kind === "predict"));
      else if (kind === "order") push(orderOf(body));
      else if (kind === "svg") push({ figure: { type: "svg", svg: body.join("\n") } });
      else throw new Error(`第 ${i + 1} 行附近：不認得的區塊 \`\`\`${kind}`);
      continue;
    }
    if (line === "$$") {
      const body = [];
      for (i += 1; i < lines.length && lines[i].trim() !== "$$"; i += 1) body.push(lines[i]);
      push({ math: body.join("\n").trim() });
      continue;
    }
    const disp = /^\$\$(.+)\$\$$/.exec(line);
    if (disp) { push({ math: disp[1].trim() }); continue; }
    if (line === "@page" || line === "@column") { push({ break: line.slice(1) }); continue; }
    const set = /^@set\s+(\S+)\s+(.*)$/.exec(line);
    if (set) {
      const st = { set: { fig: set[1] } };
      set[2].trim().split(/\s+/).forEach((kv) => { const [k, v] = kv.split("="); if (k === "dur") st.dur = Number(v); else st.set[k] = Number(v); });
      push(st);
      continue;
    }
    const img = /^@image\s+(.+)$/.exec(line);
    if (img) { const p = piped(img[1]); push({ figure: { type: "image", src: p.head, caption: p.caption, height: p.height ? Number(p.height) : undefined } }); continue; }
    if (/^\+\s/.test(line) && last && last.text != null) { last.text += `\n${line.replace(/^\+\s+/, "")}`; continue; }
    if (/^[-*]\s/.test(line)) { push({ text: `• ${line.replace(/^[-*]\s+/, "")}` }); continue; }
    push({ text: line });
  }
  return lesson;
}

module.exports = { parseMd };
