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
    if (!segments.length) return false;
    // 單一純數學段沒有可斷行的點，走回 KaTeX 原路（display 置中 + 橫向捲）。
    // 但單一 \text{} 段**要留下來**：它就是一句可以正常換行的文字 ——
    // 第一版寫 length < 2 直接退回，Bessel 那種整句 \text 的題幹
    // 在 390px 上被切掉後半句，而且不能捲（二輪實測抓到）。
    if (segments.length === 1 && segments[0].text === undefined) return false;
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

  // 這段 tex 的寬度有多少比例來自 \text{}（文字）段。
  //
  // 為什麼要另外量：門檻 72 是給「真的數學式」設的 —— 式子不能亂斷行。
  // 但文字為主的題幹（\text{Bessel functions most often appear...}、
  // 「在圖上點出 ... 的三個臨界點位置」）完全可以換行，而它們在 390px
  // 的手機上 40 個字就爆版 —— 實測整句被 clip，後半題直接讀不到。
  // 文字段佔比高的題幹，用低得多的門檻提早進換行模式。
  function texTextShare(tex) {
    let text = 0;
    let math = 0;
    splitLongTex(tex).forEach((seg) => {
      const body = seg.text !== undefined ? seg.text : seg.math;
      let w = 0;
      for (const ch of body) w += /[ᄀ-ᅟ⺀-꓏가-힣豈-﫿︰-﹏＀-｠￠-￦]/.test(ch) ? 2 : 1;
      if (seg.text !== undefined) text += w; else math += w;
    });
    const total = text + math;
    return total ? text / total : 0;
  }

  // 排完量一次：字元數門檻是猜的，真正的裁判是畫面。
  //
  // 390px 的手機上「x²+y²=25 在點 (3,4) 的切線斜率」量起來只有 40 欄，
  // 沒過長題門檻，於是走 display 模式一行到底 —— 題幹後半要橫向捲才看得到，
  // 而使用者不會捲，他看到的是「在點 (3,4) 的」就沒了。
  // 所以排完以後量 scrollWidth：真的超寬，有文字段就改走換行流；
  // 純式子換不了行就把字縮小到剛好塞進去（最多縮到 55%），再不行才留橫向捲。
  function fitDisplayMath(node, tex) {
    if (!node.isConnected || !node.clientWidth) return;
    const need = () => Math.max(node.scrollWidth, (node.querySelector(".katex-display") || node).scrollWidth);
    const have = node.clientWidth;
    if (need() <= have + 1) return;
    const segments = splitLongTex(tex);
    if (segments.some((seg) => seg.text !== undefined && seg.text.trim()) && segments.length > 1 && renderLongTexFlow(node, tex)) {
      node.classList.add("is-long-tex");
      if (need() <= node.clientWidth + 1) return;
    }
    // 「f(x)=x²+1, \qquad f(2)=5, \qquad f(-3)=10」這種用 \qquad 排成一列的好幾個式子：
    // 拆成一式一行，比縮字或橫向捲都好讀。
    const lines = splitAtQuad(tex);
    if (lines.length > 1 && renderStackedLines(node, lines)) {
      if (need() <= node.clientWidth + 1) return;
    }
    // 縮字有底線：縮完不能小於 13px（概念卡的式子本來就只有 1rem，縮到 55% 就讀不了）。
    const fontPx = parseFloat(getComputedStyle(node).fontSize) || 16;
    const floor = Math.max(0.55, Math.min(1, 13 / fontPx));
    const ratio = Math.max(floor, Math.min(1, (node.clientWidth - 2) / need()));
    if (ratio < 0.995) node.style.fontSize = ratio.toFixed(3) + "em";
  }

  function splitAtQuad(tex) {
    const parts = [];
    let depth = 0;
    let start = 0;
    for (let i = 0; i < tex.length; i += 1) {
      const ch = tex[i];
      if (ch === "\\" && /[A-Za-z]/.test(tex[i + 1] || "")) {
        let j = i + 1;
        while (/[A-Za-z]/.test(tex[j] || "")) j += 1;
        const word = tex.slice(i, j);
        if (depth === 0 && (word === "\\qquad" || word === "\\quad")) {
          parts.push(tex.slice(start, i));
          start = j;
        }
        i = j - 1;
        continue;
      }
      if (ch === "{") depth += 1;
      if (ch === "}") depth -= 1;
    }
    parts.push(tex.slice(start));
    return parts.map((p) => p.trim().replace(/^,\s*|,\s*$/g, "").trim()).filter(Boolean);
  }

  function renderStackedLines(node, lines) {
    const html = [];
    for (const line of lines) {
      try {
        html.push('<div class="tex-line">' + window.katex.renderToString(line, { displayMode: true, throwOnError: true, strict: "ignore", output: "htmlAndMathml" }) + "</div>");
      } catch (_error) {
        return false;
      }
    }
    node.innerHTML = html.join("");
    node.classList.add("is-stacked-tex");
    return true;
  }

  function renderMathNode(node, displayMode) {
    const tex = node.dataset.tex || "";
    // Long-form prompts (長題、應用情境題 etc.) wrap onto multiple lines
    // instead of forcing a horizontal scrollbar; the card grows with the content.
    const width = texVisualWidth(tex);
    const longform = displayMode && (width > 72 || (width > 34 && texTextShare(tex) > 0.55));
    node.classList.toggle("is-long-tex", longform);
    node.classList.remove("is-stacked-tex");
    node.style.fontSize = "";
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
        if (displayMode) fitDisplayMath(node, tex);
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
