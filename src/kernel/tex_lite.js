// TeX-lite 渲染器 —— 從 app.js 抽出的第一個純渲染模組（2026-09，#20）。
//
// 它做的事：KaTeX 進不來或字串太長時的輕量 LaTeX → HTML 後備、
// 長題幹的斷行分段、上下標與大運算子的手工排版。
// 全部是純函式＋對傳入節點的操作，對 app 狀態零依賴 —— 這正是它能第一個
// 搬出來的原因。app.js 透過 window.BuzzTexLite 特徵偵測使用，
// 檔案沒載到時退回純文字顯示（醜但看得見，不會白畫面）。

(function () {
  "use strict";

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function splitLongTex(tex) {
    const segments = [];
    let depth = 0;
    let mathStart = 0;
    let i = 0;
    while (i < tex.length) {
      const ch = tex[i];
      if (ch === "\\" && depth === 0 && tex.startsWith("\\text", i) && !/[A-Za-z]/.test(tex[i + 5] || "")) {
        let j = i + 5;
        while (/\s/.test(tex[j] || "")) j += 1;
        if (tex[j] === "{") {
          let braces = 0;
          let k = j;
          for (; k < tex.length; k += 1) {
            if (tex[k] === "{") braces += 1;
            else if (tex[k] === "}") {
              braces -= 1;
              if (!braces) {
                k += 1;
                break;
              }
            }
          }
          if (i > mathStart) segments.push({ math: tex.slice(mathStart, i) });
          segments.push({ text: tex.slice(j + 1, k - 1) });
          i = k;
          mathStart = k;
          continue;
        }
      }
      if (ch === "\\" && /[A-Za-z]/.test(tex[i + 1] || "")) {
        i += 2;
        while (/[A-Za-z]/.test(tex[i] || "")) i += 1;
        continue;
      }
      if (ch === "{") depth += 1;
      if (ch === "}") depth -= 1;
      i += 1;
    }
    if (mathStart < tex.length) segments.push({ math: tex.slice(mathStart) });
    return segments;
  }

  function renderLongTexFlow(node, tex) {
    const segments = splitLongTex(tex).filter((seg) => (seg.text !== undefined ? seg.text.length : seg.math.trim().length));
    if (segments.length < 2) return false;
    node.innerHTML = "";
    for (const seg of segments) {
      const span = document.createElement("span");
      if (seg.text !== undefined) {
        span.className = "long-tex-text";
        span.textContent = seg.text;
      } else {
        span.className = "long-tex-math";
        try {
          window.katex.render(`\\displaystyle ${seg.math}`, span, {
            displayMode: false,
            throwOnError: true,
            strict: "ignore",
            output: "htmlAndMathml"
          });
        } catch (_error) {
          return false;
        }
      }
      node.appendChild(span);
    }
    return true;
  }

  // 這一段 tex 攤開來大概佔幾個字元寬。
  //
  // 不能直接用 tex.length：中文題幹的每個字是 1 個字元但佔 2 欄，
  // 而 \text{ } 這種包裝又幾乎不佔畫面。所以「長 5 公尺的梯子靠牆，
  // 底端以每秒 1 公尺遠離牆…」量起來只有 78 字元 —— 低於門檻，
  // 於是不換行，然後在畫面上撐出一條要橫向捲動才看得完的長條。
  // 應用情境題幾乎全長這樣，所以要量的是「看起來多寬」，不是原始字串多長。
  function texVisualWidth(tex) {
    let width = 0;
    splitLongTex(tex).forEach((seg) => {
      const body = seg.text !== undefined ? seg.text : seg.math;
      for (const ch of body) width += /[ᄀ-ᅟ⺀-꓏가-힣豈-﫿︰-﹏＀-｠￠-￦]/.test(ch) ? 2 : 1;
    });
    return width;
  }

  function renderMathNode(node, displayMode) {
    const tex = node.dataset.tex || "";
    // Long-form prompts (達摩院長題、應用情境題 etc.) wrap onto multiple lines
    // instead of forcing a horizontal scrollbar; the card grows with the content.
    const longform = displayMode && texVisualWidth(tex) > 72;
    node.classList.toggle("is-long-tex", longform);
    if (longform && window.katex && renderLongTexFlow(node, tex)) return;
    if (window.katex) {
      try {
        window.katex.render(tex, node, {
          displayMode,
          throwOnError: false,
          strict: "ignore",
          // htmlAndMathml 會同時輸出視覺 HTML 與給輔助科技用的 MathML。
          // 只有 html 的話，螢幕閱讀器讀到的是一串沒有意義的字元。
          output: "htmlAndMathml"
        });
        return;
      } catch (_error) {
        node.innerHTML = renderLiteTex(tex, displayMode);
      }
    }
    node.innerHTML = renderLiteTex(tex, displayMode);
  }

  function renderLiteTex(tex, displayMode = true) {
    return `<span class="lite-math ${displayMode ? "" : "lite-math-inline"}">${renderLiteTexInline(tex)}</span>`;
  }

  function renderLiteTexInline(source) {
    let text = String(source || "");
    text = replaceTwoGroupCommand(text, "\\frac", (top, bottom) => {
      return `<span class="lite-frac"><span>${renderLiteTexInline(top)}</span><span>${renderLiteTexInline(bottom)}</span></span>`;
    });
    text = replaceOneGroupCommand(text, "\\sqrt", (body) => {
      return `<span class="lite-sqrt"><span>${renderLiteTexInline(body)}</span></span>`;
    });
    text = replaceBigOperator(text, "\\sum", "Σ", "lite-sum");
    text = replaceBigOperator(text, "\\int", "∫", "lite-int");
    text = replaceLimitOperator(text);
    text = replaceScripts(text);
    text = escapeHtml(text);
    text = text
      .replace(/ZZHTMLLTZZ/g, "<")
      .replace(/ZZHTMLGTZZ/g, ">")
      .replace(/ZZHTMLQUOTEZZ/g, '"')
      .replace(/ZZHTMLSLASHZZ/g, "/");
    return text
      .replace(/\\left/g, "")
      .replace(/\\right/g, "")
      .replace(/\\,/g, " ")
      .replace(/\\to/g, "→")
      .replace(/\\infty/g, "∞")
      .replace(/\\pi/g, "π")
      .replace(/\\sin/g, "sin")
      .replace(/\\cos/g, "cos")
      .replace(/\\tan/g, "tan")
      .replace(/\\ln/g, "ln")
      .replace(/\\log/g, "log")
      .replace(/\\arctan/g, "arctan")
      .replace(/\\text\{([^}]*)\}/g, "$1")
      .replace(/\{/g, "")
      .replace(/\}/g, "");
  }

  function protectHtml(html) {
    return html
      .replace(/</g, "ZZHTMLLTZZ")
      .replace(/>/g, "ZZHTMLGTZZ")
      .replace(/"/g, "ZZHTMLQUOTEZZ")
      .replace(/\//g, "ZZHTMLSLASHZZ");
  }

  function replaceOneGroupCommand(source, command, renderer) {
    let output = "";
    let cursor = 0;
    while (cursor < source.length) {
      const index = source.indexOf(command, cursor);
      if (index === -1) {
        output += source.slice(cursor);
        break;
      }
      const group = readGroup(source, index + command.length);
      if (!group) {
        output += source.slice(cursor, index + command.length);
        cursor = index + command.length;
        continue;
      }
      output += source.slice(cursor, index) + protectHtml(renderer(group.value));
      cursor = group.end;
    }
    return output;
  }

  function replaceTwoGroupCommand(source, command, renderer) {
    let output = "";
    let cursor = 0;
    while (cursor < source.length) {
      const index = source.indexOf(command, cursor);
      if (index === -1) {
        output += source.slice(cursor);
        break;
      }
      const first = readGroup(source, index + command.length);
      const second = first ? readGroup(source, first.end) : null;
      if (!first || !second) {
        output += source.slice(cursor, index + command.length);
        cursor = index + command.length;
        continue;
      }
      output += source.slice(cursor, index) + protectHtml(renderer(first.value, second.value));
      cursor = second.end;
    }
    return output;
  }

  function replaceBigOperator(source, command, symbol, className) {
    let output = "";
    let cursor = 0;
    while (cursor < source.length) {
      const index = source.indexOf(command, cursor);
      if (index === -1) {
        output += source.slice(cursor);
        break;
      }
      let next = index + command.length;
      let sub = "";
      let sup = "";
      if (source[next] === "_") {
        const group = readScript(source, next + 1);
        if (group) {
          sub = group.value;
          next = group.end;
        }
      }
      if (source[next] === "^") {
        const group = readScript(source, next + 1);
        if (group) {
          sup = group.value;
          next = group.end;
        }
      }
      const html = `<span class="${className}"><span class="lite-script">${renderLiteTexInline(sup)}</span><span class="lite-symbol">${symbol}</span><span class="lite-script">${renderLiteTexInline(sub)}</span></span>`;
      output += source.slice(cursor, index) + protectHtml(html);
      cursor = next;
    }
    return output;
  }

  function replaceLimitOperator(source) {
    let output = "";
    let cursor = 0;
    const command = "\\lim";
    while (cursor < source.length) {
      const index = source.indexOf(command, cursor);
      if (index === -1) {
        output += source.slice(cursor);
        break;
      }
      let next = index + command.length;
      let sub = "";
      if (source[next] === "_") {
        const group = readScript(source, next + 1);
        if (group) {
          sub = group.value;
          next = group.end;
        }
      }
      const html = `<span class="lite-lim"><span class="lite-symbol">lim</span><span class="lite-script">${renderLiteTexInline(sub)}</span></span>`;
      output += source.slice(cursor, index) + protectHtml(html);
      cursor = next;
    }
    return output;
  }

  function replaceScripts(source) {
    let output = "";
    let cursor = 0;
    while (cursor < source.length) {
      const char = source[cursor];
      if (char !== "^" && char !== "_") {
        output += char;
        cursor += 1;
        continue;
      }
      const script = readScript(source, cursor + 1);
      if (!script) {
        output += char;
        cursor += 1;
        continue;
      }
      const tag = char === "^" ? "sup" : "sub";
      output += protectHtml(`<${tag}>${renderLiteTexInline(script.value)}</${tag}>`);
      cursor = script.end;
    }
    return output;
  }

  function readScript(source, start) {
    if (source[start] === "{") return readGroup(source, start);
    if (start >= source.length) return null;
    if (source[start] === "\\") {
      const match = source.slice(start).match(/^\\[A-Za-z]+/);
      if (match) return { value: match[0], end: start + match[0].length };
    }
    return { value: source[start], end: start + 1 };
  }

  function readGroup(source, start) {
    let cursor = start;
    while (/\s/.test(source[cursor] || "")) cursor += 1;
    if (source[cursor] !== "{") return null;
    let depth = 0;
    for (let index = cursor; index < source.length; index += 1) {
      if (source[index] === "{") depth += 1;
      if (source[index] === "}") depth -= 1;
      if (depth === 0) {
        return {
          value: source.slice(cursor + 1, index),
          end: index + 1
        };
      }
    }
    return null;
  }


  const api = {
    version: 1,
    splitLongTex,
    renderLongTexFlow,
    texVisualWidth,
    renderMathNode,
    renderLiteTex,
    renderLiteTexInline
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.BuzzTexLite = api;
})();
