// Proof Input v2：自由書寫層（Natural Proof Normalizer）。
//
// 原則一句話：不要讓 verifier 學自然語言；讓自然語言先被翻譯成 verifier 已經會的語言。
// 這個模組把中文、英文、LaTeX 混寫的證明翻成 proof_lang.js 的句型語言（一行一個動作），
// 並記住每一個動作對應原文的哪一段（sourceRange），再把引擎的報告映回原文。
//
//   Raw text → 保護數學區塊 → 切段落／句子 → 每句拆成動作（可以多個）→ 句型語言 → proof_lang.check
//
// 三色語意不變：能驗證成立綠、驗證不成立紅、讀得懂但驗不了黃。
// 這一層自己只做一件跟顏色有關的事：讀不出是哪種動作的句子標黃（不是紅）——
// 紅只能代表「我理解了這個命題，而且它驗證失敗」。
//
// kernel 模組：純函式、不碰 DOM、不碰儲存。translate(text) 與 check(lang, spec, text)。
// 行為由 tools/validate_proof_surface.js 釘住：同一份證明的中文／自然中文／英文／英文+LaTeX
// 四種寫法要落到同一份句型語言；舊格式（一行一句）翻譯後必須一字不差。

(function () {
  "use strict";

  /* ── 1. LaTeX 表層 → 引擎認得的純文字 ─────────────────────────── */

  // 讀一個以 { 開頭的平衡群組，回傳 [內容, 結束位置（} 之後）]
  function readGroup(text, start) {
    if (text[start] !== "{") return null;
    let depth = 0;
    for (let i = start; i < text.length; i += 1) {
      if (text[i] === "{") depth += 1;
      else if (text[i] === "}") {
        depth -= 1;
        if (depth === 0) return [text.slice(start + 1, i), i + 1];
      }
    }
    return null;
  }

  // \frac{a}{b} → (a)/(b)、\sqrt{a} → sqrt(a)、\text{…} → …、x^{n+1} → x^(n+1)
  function rewriteGroups(text) {
    let out = "";
    let i = 0;
    while (i < text.length) {
      const rest = text.slice(i);
      let m;
      if ((m = rest.match(/^\\(d?frac|tfrac|dfrac)\s*/))) {
        const a = readGroup(text, i + m[0].length);
        const b = a && readGroup(text, a[1]);
        if (a && b) { out += `(${rewriteGroups(a[0])})/(${rewriteGroups(b[0])})`; i = b[1]; continue; }
      }
      if ((m = rest.match(/^\\sqrt\s*/))) {
        const a = readGroup(text, i + m[0].length);
        if (a) { out += `sqrt(${rewriteGroups(a[0])})`; i = a[1]; continue; }
      }
      if ((m = rest.match(/^\\(text|mathrm|textrm|mathit|operatorname)\s*/))) {
        const a = readGroup(text, i + m[0].length);
        if (a) { out += ` ${a[0]} `; i = a[1]; continue; }
      }
      if ((m = rest.match(/^\\(displaystyle|left|right|,|;|!|quad|qquad|limits|nolimits)\b/))) { i += m[0].length; continue; }
      if (rest.startsWith("\\lvert") || rest.startsWith("\\rvert") || rest.startsWith("\\mid")) { out += "|"; i += rest.startsWith("\\mid") ? 4 : 6; continue; }
      if (text[i] === "^" || text[i] === "_") {
        const a = readGroup(text, i + 1);
        if (a) {
          const inner = rewriteGroups(a[0]).trim();
          // lim_{x→2} 的底線群組引擎自己會讀（canonicalText），其他的次方／下標改成括號
          if (text[i] === "_" && /lim\s*$/.test(out)) out += `_{${inner}}`;
          else if (/^[A-Za-z0-9]+$/.test(inner)) out += `${text[i]}${inner}`;
          else out += `${text[i]}(${inner})`;
          i = a[1];
          continue;
        }
      }
      if (text[i] === "{" || text[i] === "}") { i += 1; continue; }
      out += text[i];
      i += 1;
    }
    return out;
  }

  // 指令後面接的可能是數字或底線（\to2、\lim_{…}），所以用「後面不是字母」而不是 \b
  // 一次掃過所有 \指令（一個 token 換一次）。以前是逐條正規式：\varepsilon 先換成 eps，
  // 「\le\varepsilon」就變成 \leeps，\le 再也對不上——ε–δ 收尾鏈的「≤ ε」整段不見。
  /** @type {Record<string, string>} */
  const LATEX_MAP = {
    varepsilon: "eps", epsilon: "eps", delta: "delta", xi: "xi", eta: "eta", theta: "theta", lambda: "lambda", mu: "mu", alpha: "alpha", beta: "beta", gamma: "gamma", pi: "pi",
    le: "<=", leq: "<=", leqslant: "<=", ge: ">=", geq: ">=", geqslant: ">=", ne: "!=", neq: "!=",
    to: "->", rightarrow: "->", longrightarrow: "->", Rightarrow: "=>", implies: "=>", Longrightarrow: "=>", iff: "<=>", Leftrightarrow: "<=>",
    infty: "inf", in: " in ", notin: " notin ", forall: "forall ", exists: "exists ",
    cdot: "*", times: "*", div: "/", pm: "+-",
    sin: "sin", cos: "cos", tan: "tan", sec: "sec", csc: "csc", cot: "cot", sinh: "sinh", cosh: "cosh", tanh: "tanh", exp: "exp", ln: "ln", log: "log", lim: "lim", min: "min", max: "max", sup: "sup", inf: "inf", abs: "abs",
    cdots: "...", ldots: "...", dots: "...", langle: "", rangle: ""
  };
  const braceBalanced = (text) => { let depth = 0; for (const ch of text) { if (ch === "{") depth += 1; else if (ch === "}") { depth -= 1; if (depth < 0) return false; } } return depth === 0; };

  // 數學區塊的內容：LaTeX 指令換成引擎認得的寫法。回傳 { text, unknown: [不認得的指令] }
  function latexToPlain(source) {
    let out = String(source || "");
    out = out.replace(/\\\\/g, " ").replace(/&/g, " ");
    out = rewriteGroups(out);
    out = out.replace(/\\([A-Za-z]+)/g, (whole, name) => (Object.prototype.hasOwnProperty.call(LATEX_MAP, name) ? LATEX_MAP[name] : whole));
    const unknown = Array.from(new Set((out.match(/\\[A-Za-z]+/g) || [])));
    out = out.replace(/\\([{}])/g, "$1").replace(/\\[A-Za-z]+/g, " ");
    return { text: out.replace(/\s+/g, " ").trim(), unknown };
  }

  /* ── 2. 保護數學區塊，切段落與句子，記住原文位置 ────────────────── */

  const MATH_OPEN = [["$$", "$$"], ["\\[", "\\]"], ["\\(", "\\)"], ["$", "$"]];

  // 回傳 { work: 去掉數學區塊之後的字串, map: work 的每個字元對應原文的位置, blocks: [{id, content, start, end}], problems }
  function protectMath(text) {
    const blocks = [];
    const problems = [];
    const work = [];
    const map = [];
    let i = 0;
    const alignRe = /\\begin\{(align\*?|aligned|gather\*?|eqnarray\*?|equation\*?|cases)\}/g;
    while (i < text.length) {
      const rest = text.slice(i);
      let matched = false;
      const env = rest.match(/^\\begin\{(align\*?|aligned|gather\*?|eqnarray\*?|equation\*?|cases)\}/);
      if (env) {
        const endTag = `\\end{${env[1]}}`;
        const endAt = text.indexOf(endTag, i);
        const stop = endAt < 0 ? text.length : endAt + endTag.length;
        problems.push({ start: i, end: stop, note: `目前不支援 ${env[1]} 環境，請改用 $$…$$ 或 \\[…\\]。` });
        blocks.push({ id: blocks.length, content: "", start: i, end: stop, broken: true });
        const token = `⁣${blocks.length - 1}⁣`;
        Array.from(token).forEach((ch, k) => { work.push(ch); map.push(k === 0 ? i : stop - 1); });
        i = stop;
        continue;
      }
      for (const [open, close] of MATH_OPEN) {
        if (!rest.startsWith(open)) continue;
        if (open === "$" && rest.startsWith("$$")) continue;
        const from = i + open.length;
        let endAt = -1;
        if (open === "$") {
          // 單個 $：找下一個不是 $$ 的 $
          for (let j = from; j < text.length; j += 1) { if (text[j] === "$" && text[j + 1] !== "$" && text[j - 1] !== "\\") { endAt = j; break; } }
        } else {
          endAt = text.indexOf(close, from);
        }
        if (endAt < 0) {
          // 沒配對的分隔符：整段到句尾當一個壞掉的數學區塊（黃，不是紅）
          const stop = (() => { const m = text.slice(from).search(/[。\n]/); return m < 0 ? text.length : from + m; })();
          const snippet = text.slice(from, stop);
          problems.push({ start: i, end: stop, note: !braceBalanced(snippet)
            ? `這段 LaTeX 的括號似乎沒有完整關閉：${snippet.trim().slice(0, 40)}。請檢查 { } 是否成對。`
            : `這一段的數學式少了對應的 ${open === "$" ? "$" : close}：${text.slice(i, Math.min(stop, i + 40))}` });
          blocks.push({ id: blocks.length, content: text.slice(from, stop), start: i, end: stop, broken: true });
        } else if (!braceBalanced(text.slice(from, endAt))) {
          // $\frac{\varepsilon}{3$ 這種：分隔符對上了，但括號沒關 —— 黃，講括號，不猜
          problems.push({ start: i, end: endAt + close.length, note: `這段 LaTeX 的括號似乎沒有完整關閉：${text.slice(from, endAt).trim().slice(0, 40)}。請檢查 { } 是否成對。` });
          blocks.push({ id: blocks.length, content: text.slice(from, endAt), start: i, end: endAt + close.length, broken: true });
        } else {
          blocks.push({ id: blocks.length, content: text.slice(from, endAt), start: i, end: endAt + close.length });
        }
        const block = blocks[blocks.length - 1];
        const token = `⁣${block.id}⁣`;
        // 代號的第一個字對到區塊開頭、其餘對到區塊結尾：句子的原文範圍才會涵蓋整個區塊
        Array.from(token).forEach((ch, k) => { work.push(ch); map.push(k === 0 ? block.start : block.end - 1); });
        i = block.end;
        matched = true;
        break;
      }
      if (matched) continue;
      work.push(text[i]);
      map.push(i);
      i += 1;
    }
    alignRe.lastIndex = 0;
    return { work: work.join(""), map, blocks, problems };
  }

  // 把句子裡的區塊代號換回純文字，並回報壞掉的區塊
  function restoreMath(sentence, blocks) {
    const broken = [];
    const unknownCmds = [];
    const text = sentence.replace(/⁣(\d+)⁣/g, (whole, id) => {
      const block = blocks[Number(id)];
      if (!block) return "";
      if (block.broken) { broken.push(block); return " " + latexToPlain(block.content).text + " "; }
      const plain = latexToPlain(block.content);
      plain.unknown.forEach((cmd) => unknownCmds.push(cmd));
      return " " + plain.text + " ";
    });
    return { text: text.replace(/\s+/g, " ").trim(), broken, unknownCmds };
  }

  // 切句：句號（。／.）、！？、分號。ASCII 句點只在後面接空白或結尾、而且不是小數點或縮寫時才算。
  // 段落之間的空行也是界線；連接詞後面接數學區塊（Then\n$$…$$）會被併成同一句，因為區塊已經變成代號。
  function segment(work, map) {
    const sentences = [];
    let start = 0;
    const flush = (end) => {
      const raw = work.slice(start, end);
      if (raw.trim()) {
        const lead = raw.length - raw.replace(/^\s+/, "").length;
        const trail = raw.length - raw.replace(/\s+$/, "").length;
        sentences.push({ text: raw.trim(), start: map[start + lead] ?? 0, end: (map[end - 1 - trail] ?? map[map.length - 1] ?? 0) + 1 });
      }
      start = end;
    };
    for (let i = 0; i < work.length; i += 1) {
      const ch = work[i];
      if (ch === "。" || ch === "！" || ch === "？" || ch === "!" || ch === "?" || ch === "；" || ch === ";") { flush(i + 1); continue; }
      if (ch === "." ) {
        const before = work.slice(Math.max(0, i - 6), i);
        const after = work[i + 1] || "";
        // 省略號 1 + 2 + ... + n 不是句號
        if (work[i - 1] === "." || after === ".") continue;
        const isDecimal = /\d$/.test(before) && /\d/.test(after);
        const isAbbrev = /\b(i\.e|e\.g|q\.e\.d|resp|cf|w\.l\.o\.g|s\.t)$/i.test(before) || /(^|\s)(i|e|Q|E|D|s|t|c|f)$/.test(before);
        if (!isDecimal && !isAbbrev && (after === "" || /\s/.test(after))) { flush(i + 1); continue; }
      }
      if (ch === "\n" && work[i + 1] === "\n") { flush(i); continue; }
      // 舊格式：一行一句、句尾可能沒有句號——單一換行也是界線。
      // 例外：上一行以連接詞或逗號收尾（Then／Therefore, by …,／則），或下一行是數學區塊（Then\n$$…$$）
      if (ch === "\n") {
        const lineText = work.slice(start, i).trim();
        const nextStartsMath = /^\s*⁣/.test(work.slice(i + 1, i + 8));
        // 行尾是連接詞（…and suppose／Then／We want to show that）也算沒寫完
        const danglingConnective = /(?:^|\s)(then|thus|hence|therefore|so|we have|we get|it follows that|choose|let|suppose|assume|that|則|故|所以|因此|於是|取|令|設|假設|可得|得)\s*[,:]?$/i.test(lineText) || /[,，:：]$/.test(lineText);
        if (!danglingConnective && !nextStartsMath && lineText) { flush(i); continue; }
      }
    }
    flush(work.length);
    return sentences;
  }

  /* ── 3. 一句 → 一個或多個動作（句型語言） ──────────────────────── */

  const EN = {
    goal: /^(?:we (?:want|need|wish|aim|have) to (?:show|prove)|we (?:will|shall|now) (?:show|prove)|we (?:prove|show|claim)|it suffices to (?:show|prove)|our goal is to (?:show|prove)|we must (?:show|prove)|claim)\s*(?:that)?\s*[:,]?\s*(.*)$/i,
    conclude: /^(?:(?:therefore|hence|thus|so|then)[,\s]+)?(?:by (?:the )?(?:eps|epsilon|ε)[\s-]*(?:delta|δ)?[\s-]*definition(?: of (?:the )?limit)?|(?:by|from) (?:the )?definition of (?:the )?limit|this (?:proves|shows) that|we conclude that|we have shown that|it follows that|we obtain)\s*[,:]?\s*(?:we (?:have|get|obtain|see)(?: that)?|it follows that|that)?\s*[,:]?\s*(.+)$/i,
    done: /^(?:(?:hence|therefore|thus|so)[,\s]+)?(?:the (?:result|claim|statement) follows|this completes the proof|which completes the proof|we are done|the proof is complete|qed|q\.e\.d\.?)\.?$/i,
    theorem: /^(?:by|using|from|applying|according to|apply)\s+(?:the\s+)?(.+?)(?:\s*[,:]\s*|\s+(?=there (?:exists?|is)\b)|\s+we (?:have|get|obtain|know)\s+(?:that\s+)?)(.+)$/i,
    forAll: /^for (?:any|every|all|each|arbitrary)\s+(.+)$/i,
    intro: /^(?:we\s+(?:now\s+)?)?(?:let|given|fix|take|choose|pick|consider|select)\s+(?:an?\s+|any\s+|some\s+)?(?:arbitrary\s+)?(.+?)(?:\s+be\s+(?:given|arbitrary|fixed|any)|\s+arbitrary|\s+be\s+arbitrary)?\s*$/i,
    define: /^(?:we\s+(?:now\s+)?)?(?:set|define|put|let|choose|take|pick|select)\s+(.+)$/i,
    assume: /^(?:now\s+)?(?:let us\s+)?(?:suppose|assume|if)\s+(?:that\s+)?(.+?)(?:\s*[,;]\s*then\s+(.+))?$/i,
    // v2.4 全稱主張：For all x > 0, g'(x) > 0／Whenever x > 0, g(x) > 0 → 則對所有 …，…（條件只在這一句有效）
    forAllClaim: /^(?:for (?:all|every|any|each)|whenever|when)\s+(.+?)\s*[,:]\s*(?:we have\s+|then\s+)?(.+)$/i,
    because: /^(?:since|because|as)\s+(.+?)\s*[,;]\s*(?:we (?:have|get|obtain|see)(?: that)?|it follows that|then|so|hence|therefore|thus|this gives)?\s*(.+)$/i,
    derive: /^(?:then|thus|hence|therefore|so|it follows that|we (?:have|get|obtain|see|find)(?: that)?|this (?:gives|yields|shows)|consequently|in particular|that is|i\.e\.|which means|note that|observe that)\s*[,:]?\s*(?:that\s+)?(.+)$/i,
    caseN: /^case\s+(\d+|one|two|three|four|i|ii|iii|iv)\s*[:.]?\s*(.*)$/i,
    cases: /^(?:we (?:consider|distinguish)|consider|there are)\s+(two|three|four|\d+)\s+cases\.?$/i,
    induction: /^(?:we (?:proceed|argue|prove (?:this|it))\s+)?by (?:mathematical )?induction(?: on (\w+))?\.?$/i,
    base: /^(?:base case|basis)\s*[:.,]?\s*(.*)$/i,
    step: /^(?:inductive step|induction step)\s*[:.,]?\s*(.*)$/i,
    hypothesis: /^(?:suppose|assume)\s+(?:that\s+)?(?:it|the (?:claim|statement)|this)\s+holds\s+(?:for|when)\s+(\w+)\s*=\s*(\w+)\s*[,.]?\s*(?:(?:that is|i\.e\.)\s*[,:]?\s*(.+))?$/i,
    contra: /^(?:suppose|assume)[,\s]+(?:for|towards|to get|to obtain|for the sake of)\s+(?:a\s+)?contradiction[,\s]+(?:that\s+)?(.+)$/i,
    contraEnd: /^(?:(?:this|which|that) (?:is|gives|yields) (?:a )?contradiction|contradiction|(?:this|which) contradicts\s+(.+))\.?$/i,
    exists: /\bthere (?:exists?|is)\s+(?:an?\s+|some\s+)?(.+?)\s+(?:in|∈)\s+(.+?)\s+(?:such that|with|for which|satisfying)\s+(.+)$/i,
    existsPlain: /\bthere (?:exists?|is)\s+(?:an?\s+|some\s+)?(\w+)\s+(?:such that|with|for which|satisfying)\s+(.+)$/i
  };
  const CASE_WORDS = { one: "一", two: "二", three: "三", four: "四", i: "一", ii: "二", iii: "三", iv: "四", 1: "一", 2: "二", 3: "三", 4: "四", 5: "五", 6: "六" };

  const strip = (s) => String(s || "").replace(/[。.,，:：;；]+$/g, "").trim();
  // 變數名可以是希臘字母（δ、ε）或名字（delta、eps）
  const NAME = "[A-Za-z_δεξηθλμαβγ][A-Za-z_0-9'δεξηθλμαβγ]*";
  const looksLikeDefinition = (s) => new RegExp(`^${NAME}(\\([^)]*\\))?\\s*(:=|=)(?!=)`).test(strip(s));
  const isFunctionDef = (s) => new RegExp(`^${NAME}\\s*\\([^)]*\\)\\s*(:=|=)`).test(strip(s));
  const DEF_WITH_BOUND = new RegExp(`^(${NAME})\\s*=\\s*(.+?)\\s*(>=|<=|>|<)\\s*(.+)$`);

  function englishExistential(text) {
    let m = text.match(EN.exists);
    if (m) return `存在 ${m[1].trim()} ∈ ${m[2].trim()} 使 ${strip(m[3])}`;
    m = text.match(EN.existsPlain);
    if (m) return `存在 ${m[1].trim()} 使 ${strip(m[2])}`;
    return null;
  }

  // 把一句英文／自然中文翻成句型語言。回傳 [{ type, canonical }]；認不出來回傳 null
  function translateSentence(sentence) {
    const s = strip(sentence.replace(/\s+/g, " "));
    if (!s) return [];
    let m;

    // 英文：多動作句先在 and 處拆（and suppose / and let / and then …）
    const andSplit = s.split(/\s*,?\s+and\s+(?=(?:suppose|assume|let|choose|take|set|define|then|hence|thus|so|we have|we get)\b)/i);
    if (andSplit.length > 1) {
      const parts = andSplit.map((part) => translateSentence(part));
      if (parts.every(Boolean)) return parts.flat();
    }
    // 中文：「，並假設／，我們取／，則」處拆
    const zhSplit = s.split(/[，,]\s*(?=(?:並|且|同時)?(?:假設|假定|我們取|我們選|我們令|取|選|令|定義|則|那麼|所以|故|因此|於是|可得))/);
    if (zhSplit.length > 1 && !/^(因為|由|根據|依據|利用|若|如果|假設)/.test(s)) {
      const parts = zhSplit.map((part) => translateSentence(part));
      if (parts.every(Boolean)) return parts.flat();
    }

    if ((m = s.match(EN.goal)) || (m = s.match(/^(?:我們要證明|我們要證|欲證|要證明|要證|目標是證明|目標是|求證|證明)\s*[:：,，]?\s*(.+)$/))) {
      return [{ type: "goal", canonical: "", proposition: strip(m[1]) }];
    }
    if ((m = s.match(EN.done))) return [{ type: "conclude", canonical: "得證。" }];
    if ((m = s.match(EN.conclude))) return [{ type: "conclude", canonical: `故 ${strip(m[1])}。`, rule: /definition|定義/i.test(s) ? "epsilon_delta_definition" : "conclude" }];
    if ((m = s.match(EN.contra))) return [{ type: "contradiction", canonical: `反設 ${strip(m[1])}。` }];
    if ((m = s.match(EN.contraEnd))) return [{ type: "contradiction", canonical: m[1] ? `這與 ${strip(m[1])} 矛盾。` : "矛盾。" }];
    if ((m = s.match(EN.induction))) return [{ type: "induction", canonical: "用歸納法。" }];
    if ((m = s.match(EN.base))) {
      // 「the left side is 1 and the right side is 1(1+1)/2 = 1, so it holds」→「左式 = 1，右式 = 1(1+1)/2 = 1，成立」
      const prose = strip(m[1])
        .replace(/\bthe left(?:-hand)? side (?:is|equals|=)\s*/gi, "左式 = ")
        .replace(/\bthe right(?:-hand)? side (?:is|equals|=)\s*/gi, "右式 = ")
        .replace(/\b(?:LHS|lhs)\s*(?:is|=)\s*/g, "左式 = ")
        .replace(/\b(?:RHS|rhs)\s*(?:is|=)\s*/g, "右式 = ")
        .replace(/[,;]?\s*(?:so|thus|hence|and so|which means)?\s*(?:it|this|the (?:claim|statement|equality|inequality))\s+(?:holds|is true)\s*$/i, "，成立")
        .replace(/[,;]?\s*(?:which|and this) is true\s*$/i, "，成立")
        .replace(/\s+and\s+/gi, "，");
      const eq = prose.match(/^(?:when\s+|for\s+)?(\w+)\s*=\s*([^\s,:]+)\s*[,:]?\s*(.*)$/);
      return [{ type: "induction", canonical: eq ? `當 ${eq[1]} = ${eq[2]} 時${eq[3] ? `，${strip(eq[3])}` : ""}。` : `當 n = 1 時${prose ? `，${prose}` : ""}。` }];
    }
    if ((m = s.match(EN.step))) return m[1] ? translateSentence(m[1]) : [];
    if ((m = s.match(EN.hypothesis))) return [{ type: "induction", canonical: `假設 ${m[1]} = ${m[2]} 時成立${m[3] ? `，即 ${strip(m[3])}` : ""}。` }];
    if ((m = s.match(EN.cases))) return [{ type: "case", canonical: `分${{ two: "兩", three: "三", four: "四" }[m[1].toLowerCase()] || m[1]}種情況。` }];
    if ((m = s.match(EN.caseN))) return [{ type: "case", canonical: `情況${CASE_WORDS[m[1].toLowerCase()] || m[1]}：${strip(m[2]) || "否則"}。` }];
    if ((m = s.match(EN.theorem))) {
      const name = strip(m[1]).replace(/^(?:the )/i, "").replace(/'s\b/i, "");
      const rest = strip(m[2]);
      const ex = englishExistential(rest);
      return [{ type: "theorem", canonical: `由${name}，${ex || rest}。` }];
    }
    if ((m = s.match(EN.because))) return [{ type: "derive", canonical: `因為 ${strip(m[1]).replace(/\s+and\s+/gi, " 且 ")}，所以 ${strip(m[2])}。` }];
    if ((m = s.match(EN.assume))) {
      const out = [{ type: "assume", canonical: `假設 ${strip(m[1]).replace(/\s+and\s+/gi, " 且 ")}。` }];
      if (m[2]) out.push({ type: "derive", canonical: `則 ${strip(m[2])}。` });
      return out;
    }
    // 後半是主張（有關係符號、不是 choose／let／suppose 這種動作）才算全稱主張；「For any ε > 0, choose δ = …」仍是引入
    if ((m = s.match(EN.forAllClaim)) && /(<=|>=|!=|<|>|=)/.test(m[2]) && /(<=|>=|!=|<|>|=| in |∈)/.test(m[1]) && !/^(?:we\s+)?(?:choose|let|take|set|define|put|pick|suppose|assume|fix|select)\b/i.test(strip(m[2]))) return [{ type: "derive", canonical: `則對所有 ${strip(m[1])}，${strip(m[2])}。` }];
    if ((m = s.match(EN.forAll))) return [{ type: "introduce", canonical: `任取 ${strip(m[1])}。` }];
    if (/^(?:we\s+(?:now\s+)?)?(?:set|define|put)\b/i.test(s) && (m = s.match(EN.define))) {
      const body = strip(m[1]);
      const withBound = body.match(DEF_WITH_BOUND);
      if (withBound) return [{ type: "define", canonical: `取 ${withBound[1]} = ${withBound[2]}。` }, { type: "derive", canonical: `則 ${withBound[1]} ${withBound[3]} ${withBound[4]}。` }];
      return [{ type: "define", canonical: `${isFunctionDef(body) ? "設" : "取"} ${body}。` }];
    }
    if ((m = s.match(EN.intro))) {
      // Let x, y ∈ I with x < y：with／such that 後面的是條件，用「且」接上（引擎會分開登記）
      const body = strip(m[1]).replace(/\s+be\s+(?:given|arbitrary|fixed)$/i, "").replace(/\s+(?:with|such that|satisfying|where)\s+/i, " 且 ");
      // Choose δ = ε/3 > 0：定義之後多寫的 > 0 是一個可以驗的主張，拆成「則 δ > 0」
      const defWithBound = body.match(DEF_WITH_BOUND);
      if (defWithBound) return [{ type: "define", canonical: `取 ${defWithBound[1]} = ${defWithBound[2]}。` }, { type: "derive", canonical: `則 ${defWithBound[1]} ${defWithBound[3]} ${defWithBound[4]}。` }];
      if (looksLikeDefinition(body)) return [{ type: "define", canonical: `${isFunctionDef(body) ? "設" : "取"} ${body}。` }];
      return [{ type: "introduce", canonical: `任取 ${body}。` }];
    }
    if ((m = s.match(EN.derive))) {
      const ex = englishExistential(strip(m[1]));
      return [{ type: "derive", canonical: `則 ${ex || strip(m[1])}。` }];
    }

    // 中文同義詞 → 句型語言
    if ((m = s.match(/^(?:取任意|任給|給定任意|給定|任取|任意取|固定)\s*(.+)$/))) return [{ type: "introduce", canonical: `任取 ${strip(m[1])}。` }];
    if ((m = s.match(/^(?:定義|選|選取|我們取|我們選|我們令|令|取)\s*(.+)$/))) {
      const body = strip(m[1]);
      const withBound = body.match(DEF_WITH_BOUND);
      if (withBound) return [{ type: "define", canonical: `取 ${withBound[1]} = ${withBound[2]}。` }, { type: "derive", canonical: `則 ${withBound[1]} ${withBound[3]} ${withBound[4]}。` }];
      return [{ type: "define", canonical: `${isFunctionDef(body) ? "設" : "取"} ${body}。` }];
    }
    if ((m = s.match(/^(?:由|根據|依|依據)\s*(?:極限(?:的)?定義|ε\s*-?\s*δ\s*(?:的)?定義|eps\s*-?\s*delta\s*(?:的)?定義)\s*[，,:：]?\s*(?:我們有|可得|得|有)?\s*(.+)$/))) {
      return [{ type: "conclude", canonical: `故 ${strip(m[1])}。`, rule: "epsilon_delta_definition" }];
    }
    if ((m = s.match(/^設\s*(.+)$/))) {
      const body = strip(m[1]);
      return [{ type: looksLikeDefinition(body) ? "define" : "introduce", canonical: `設 ${body}。` }];
    }
    if ((m = s.match(/^(?:現在)?(?:假定|假設|若|如果)\s*(.+?)(?:[，,]\s*(?:則|那麼)\s*(.+))?$/))) {
      const out = [{ type: "assume", canonical: `假設 ${strip(m[1])}。` }];
      if (m[2]) out.push({ type: "derive", canonical: `則 ${strip(m[2])}。` });
      return out;
    }
    if ((m = s.match(/^在\s*(.+?)\s*(?:之)?下[，,]?\s*(.*)$/))) {
      const out = [{ type: "assume", canonical: `假設 ${strip(m[1])}。` }];
      if (m[2]) out.push({ type: "derive", canonical: `則 ${strip(m[2])}。` });
      return out;
    }
    if ((m = s.match(/^(?:可得|得到|我們有|我們得到|有|推得|於是有)\s*(.+)$/))) return [{ type: "derive", canonical: `則 ${strip(m[1])}。` }];
    if ((m = s.match(/^(?:由|根據|依據|利用|用|由於)\s*(.+?)\s*(?:定理|不等式|公式)?[，,:：]\s*(.+)$/)) && !/^因為/.test(s)) {
      return [{ type: "theorem", canonical: `由${strip(m[1])}，${strip(m[2])}。` }];
    }
    return null;
  }

  /* ── 3b. 目標宣告：跟題目要證的東西對不對得上 ─────────────────── */

  // 「lim_{x->2} 3x = 6」「lim x→2 (3x) = 6」收成同一把鍵；跟引擎 canonicalText 同一個思路，這裡自己算一份
  function limitKey(lang, text) {
    let out = lang.normalize(text);
    out = out.replace(/lim\s*_?\s*[{(]?\s*([A-Za-z]\w*)\s*->\s*([^\s})]+)\s*[})]?\s*/g, "lim[$1->$2] ");
    out = out.replace(/\s+/g, "").toLowerCase().replace(/\*/g, "");
    out = out.replace(/^((?:.*?)lim\[[^\]]+\])\((.+)\)=/, "$1$2=");
    return out;
  }
  const barsToAbs = (text) => { let out = text; for (let i = 0; i < 8; i += 1) { const next = out.replace(/\|([^|]+)\|/, (w, inner) => `abs(${inner})`); if (next === out) break; out = next; } return out; };
  const exprKey = (lang, text) => barsToAbs(lang.normalize(text)).replace(/\s+/g, "").replace(/\*/g, "").toLowerCase();

  // (∀ε>0)(∃δ>0)(0<|x−a|<δ ⇒ |f(x)−L|<ε) → { point, bound }
  function parseEpsilonDeltaGoal(lang, proposition) {
    const t = lang.normalize(proposition).replace(/\s+/g, " ");
    const m = t.match(/forall\s*\(?\s*eps\s*>\s*0.*?exists\s*\(?\s*delta\s*>\s*0.*?0\s*<\s*(\|[^|]+\||abs\([^)]*\))\s*<\s*delta\s*\)?\s*=>\s*\(?\s*(.+?)\s*<\s*eps/i);
    if (!m) return null;
    const near = m[1].match(/^(?:\||abs\()\s*([A-Za-z]\w*)\s*-\s*(.+?)\s*(?:\||\))$/);
    return { variable: near ? near[1] : "x", point: near ? near[2].trim() : "", bound: m[2].trim() };
  }

  /* ── 3c. v2.2 語意目標：lim 形式與 ∀ε∃δ 形式是同一個目標 ─────────────
     題目本身帶一個 semanticGoal（由 spec.goal / spec.bound 算出來）；使用者的
     「We want to show …」只是再宣告一次，對得上綠、對不上紅（不是黃：目標寫錯是明確的錯）。
     結尾的 lim … = L 不拿去取樣（lim 不是可取樣的關係式），而是轉成語意目標再比。 */

  // "lim_{x->3} x^2 = 9" → { kind:"limit", variable, point, functionExpr, value, proofForm }
  function parseLimitGoal(lang, text) {
    const t = lang.normalize(text).replace(/\s+/g, " ").trim();
    const m = t.match(/^lim\s*_?\s*[{(]?\s*([A-Za-z]\w*)\s*->\s*([^\s})]+)\s*[})]?\s*(.+?)\s*=\s*([^=]+)$/i);
    if (!m) return null;
    const fn = m[3].trim().replace(/^\((.*)\)$/, "$1");
    const value = m[4].trim();
    return {
      kind: "limit", variable: m[1], point: m[2].trim(), functionExpr: fn, value,
      proofForm: { kind: "epsilon_delta", epsilon: "eps", delta: "delta", neighborhood: `0 < abs(${m[1]} - ${m[2].trim()}) < delta`, target: `abs((${fn}) - (${value})) < eps` }
    };
  }

  // 使用者寫的任何目標句 → 語意目標。lim 形式、∀ε∃δ 形式、或一般關係式
  function parseSemanticGoal(lang, text) {
    const limit = parseLimitGoal(lang, text);
    if (limit) return limit;
    const eg = parseEpsilonDeltaGoal(lang, text);
    if (eg) {
      // 從 |f(x) − L| 反推 f 與 L 不一定做得到（|x^2-9| 是 x^2 與 9，也可能是別的拆法）：留 bound 就夠比對
      return { kind: "limit", variable: eg.variable, point: eg.point, functionExpr: null, value: null, proofForm: { kind: "epsilon_delta", epsilon: "eps", delta: "delta", neighborhood: `0 < abs(${eg.variable} - ${eg.point}) < delta`, target: `${eg.bound} < eps` }, quantified: true };
    }
    if (/(<=|>=|!=|<|>|=)/.test(text) && !/\blim\b|->|→/.test(text)) return { kind: "relation", relation: lang.normalize(text).trim() };
    return null;
  }

  // 題目自己的語意目標：題庫給 lim 形式（goal.text[0]）與 bound（|f(x) − L| < ε）
  function specSemanticGoal(lang, spec) {
    if (!spec || !spec.goal) return null;
    const texts = spec.goal.text || [];
    for (const text of texts) {
      const limit = parseLimitGoal(lang, text);
      if (limit) {
        if (spec.bound && spec.bound.lhs) limit.proofForm.target = `${spec.bound.lhs} < ${spec.bound.rhs || "eps"}`;
        return limit;
      }
    }
    if (spec.goal.relation) return { kind: "relation", relation: lang.normalize(spec.goal.relation).trim() };
    if (texts.length) return { kind: "text", texts };
    return null;
  }

  const boundKey = (lang, target) => exprKey(lang, String(target || "").replace(/\s*<\s*eps\s*$/i, "")).replace(/^abs\(\((.*)\)-\((.*)\)\)$/, "abs($1-$2)").replace(/[()]/g, "");
  // 兩個語意目標是不是同一件事（不是字串比對：lim 形式 vs ε–δ 形式、x^2 vs (x^2)、9 vs 9.0）
  function goalEquivalent(lang, a, b) {
    if (!a || !b) return false;
    if (a.kind === "limit" && b.kind === "limit") {
      if (a.point && b.point && lang.normalize(a.point) !== lang.normalize(b.point)) return false;
      if (a.variable && b.variable && a.variable !== b.variable) return false;
      if (a.functionExpr && b.functionExpr) return exprKey(lang, a.functionExpr) === exprKey(lang, b.functionExpr) && exprKey(lang, a.value) === exprKey(lang, b.value);
      return boundKey(lang, a.proofForm.target) === boundKey(lang, b.proofForm.target);
    }
    if (a.kind === "relation" && b.kind === "relation") return exprKey(lang, a.relation) === exprKey(lang, b.relation);
    if (a.kind === "text" || b.kind === "text") {
      const texts = (a.kind === "text" ? a : b).texts;
      const other = a.kind === "text" ? b : a;
      return other.kind === "relation" && texts.some((text) => exprKey(lang, text) === exprKey(lang, other.relation));
    }
    return false;
  }

  const showGoal = (goal) => (goal.kind === "limit"
    ? (goal.functionExpr ? `lim_(${goal.variable}→${goal.point}) ${goal.functionExpr} = ${goal.value}` : `(∀ε>0)(∃δ>0)(${goal.proofForm.neighborhood} ⇒ ${goal.proofForm.target})`)
    : goal.kind === "relation" ? goal.relation : (goal.texts || [])[0] || "？");

  // 使用者的目標宣告對不對得上題目。回傳 { ok, status, note, goal }
  function goalAgrees(lang, spec, proposition) {
    const mine = parseSemanticGoal(lang, proposition);
    const theirs = specSemanticGoal(lang, spec);
    if (!theirs) return { ok: true, status: "ok", note: "目標已登記。", goal: mine };
    if (!mine) {
      // 讀不出是哪種命題：舊的字面比對再試一次（題目的 goal.text 別名）
      const key = limitKey(lang, proposition);
      if ((spec.goal.text || []).some((g) => limitKey(lang, g) === key)) return { ok: true, status: "ok", note: `已辨識證明目標：${showGoal(theirs)}。`, goal: theirs };
      return { ok: false, status: "unsure", note: `目標已登記，但我讀不出「${proposition}」是哪種命題（極限、∀ε∃δ、或關係式），沒有跟題目比。`, goal: null };
    }
    if (goalEquivalent(lang, mine, theirs)) {
      const note = `已辨識證明目標：${showGoal(theirs)}。${mine.quantified ? "已辨識為 ε–δ 極限目標。" : ""}`;
      return { ok: true, status: "ok", note, goal: mine };
    }
    return { ok: false, status: "error", note: `你宣告的證明目標與題目不同。題目：${showGoal(theirs)}；你寫：${showGoal(mine)}。`, goal: mine };
  }

  // 結尾句（故 lim … = L）：跟題目的語意目標比，而不是拿去取樣
  function matchConclusionToGoal(lang, spec, proposition) {
    const theirs = specSemanticGoal(lang, spec);
    const mine = parseSemanticGoal(lang, proposition);
    if (!theirs || !mine) return null;
    return goalEquivalent(lang, mine, theirs);
  }

  /* ── 4. 全文翻譯：原文 → 節點（每個節點一行句型語言） ─────────── */

  // 連接詞收尾 + 下一段只有數學區塊 → 併成一句（We want to show that\n\n$$P$$、Then\n\n$$A=B$$）
  function mergeDangling(sentences) {
    const out = [];
    // 一個連接詞（或動詞）自己一行、下一段只有數學：Choose\n\n$$δ=…$$、so\n\n$$2<x<4$$、Hence\n\n$$…$$
    const DANGLING = /(?:\bthat|\bthen|\bthus|\bhence|\btherefore|\bso|\bsince|\bbecause|\bchoose|\blet|\btake|\bset|\bdefine|\bput|\bpick|\bsuppose|\bassume|\band|\bwe have|\bwe get|\bwe obtain|\bwe see|\bit follows that|\bhave|\bget|\bobtain|\bimplies|[:,，：]|=|要證明|欲證|要證|求證|目標是|則|可得|得|於是|所以|因此|故|取|令|設|假設|因為|由於)\s*$/i;
    for (const sentence of sentences) {
      const prev = out[out.length - 1];
      const onlyMath = /^\s*(?:⁣\d+⁣\s*[.,;。]?\s*)+$/.test(sentence.text);
      if (prev && onlyMath && DANGLING.test(prev.text.replace(/⁣\d+⁣/g, "M"))) {
        prev.text = `${prev.text} ${sentence.text}`;
        prev.end = sentence.end;
        continue;
      }
      out.push(Object.assign({}, sentence));
    }
    return out;
  }

  function translate(text, lang, spec) {
    const raw = String(text || "");
    const { work, map, blocks, problems } = protectMath(raw);
    const sentences = mergeDangling(segment(work, map));
    const nodes = [];
    sentences.forEach((sentence) => {
      const restored = restoreMath(sentence.text, blocks);
      const base = { sourceText: raw.slice(sentence.start, sentence.end).trim(), sourceRange: { start: sentence.start, end: sentence.end } };
      if (restored.broken.length) {
        const problem = problems.find((p) => p.start === restored.broken[0].start);
        nodes.push(Object.assign({ type: "unknown", canonical: "", note: problem ? problem.note : "這一段的數學式讀不懂。" }, base));
        return;
      }
      // 沒用 $ 包起來的 LaTeX（取 δ = \frac{ε}{3}）也翻；括號不平衡就黃，不猜
      let plainSource = restored.text;
      if (/\\[A-Za-z]+|[{}]/.test(plainSource)) {
        if (!braceBalanced(plainSource)) {
          nodes.push(Object.assign({ type: "unknown", canonical: "", note: `這一段的數學式目前讀不懂：${strip(plainSource).slice(0, 40)}。請檢查 LaTeX 的括號是否完整。` }, base));
          return;
        }
        const plainLatex = latexToPlain(plainSource);
        plainSource = plainLatex.text;
        plainLatex.unknown.forEach((cmd) => restored.unknownCmds.push(cmd));
      }
      const plain = strip(plainSource);
      if (!plain) return;
      // 舊格式優先：引擎自己認得的中文句型一字不改（一行一句的寫法 100% 相容）。
      // 英文句子一律走翻譯：引擎的英文句型只認固定關鍵字，「Let ε > 0 be given」它讀不完整。
      const known = lang && lang.parse ? lang.parse(plain)[0] : null;
      const knownKind = known && known.kind !== "unknown" && !known.reason && !/^[A-Za-z]/.test(plain);
      const needsSplit = /[，,]\s*(?:並|且|同時)?(?:假設|假定|我們取|我們選|我們令|定義)/.test(plain) || /\s+and\s+(?:suppose|assume|let|choose|then)\b/i.test(plain);
      let actions = null;
      if (knownKind && !needsSplit) actions = [{ type: known.kind, canonical: plain }];
      else actions = translateSentence(plain);
      if (!actions) {
        // 讀不出是哪種動作：黃。引擎會再說一次它看到什麼；這裡先把原句照樣送進去讓它解釋
        nodes.push(Object.assign({ type: "unknown", canonical: plain, note: "" }, base));
        return;
      }
      actions.forEach((action, index) => {
        const node = Object.assign({}, base, action, {
          part: actions.length > 1 ? { index, total: actions.length } : null,
          unknownCommands: restored.unknownCmds
        });
        if (node.type === "goal") {
          const agree = goalAgrees(lang, spec, node.proposition);
          node.status = agree.status || (agree.ok ? "ok" : "unsure");
          node.note = agree.note;
          node.semanticGoal = agree.goal || null;
        }
        nodes.push(node);
      });
    });
    return { nodes, canonicalText: nodes.map((node) => node.canonical).filter(Boolean).join("\n"), problems };
  }

  /* ── 5. 檢查：翻譯 → 引擎 → 報告映回原文 ──────────────────────── */

  // 一個節點沒翻成功時，它原文裡像變數名的東西：後面「δ 沒有宣告」就是連鎖，不是獨立的數學錯
  const symbolsIn = (text) => new Set((String(text || "").match(/[A-Za-z_δεξηθλμαβγ][A-Za-z_0-9δεξηθλμαβγ]*/g) || []).map((s) => ({ δ: "delta", ε: "eps", ξ: "xi", η: "eta", θ: "theta", λ: "lambda", μ: "mu", α: "alpha", β: "beta", γ: "gamma" }[s] || s).toLowerCase()));

  function check(lang, spec, text) {
    const translated = translate(text, lang, spec);
    const nodes = translated.nodes;
    const lines = [];
    const withCanonical = nodes.filter((node) => node.canonical);
    const report = lang.check(spec, withCanonical.map((node) => node.canonical).join("\n"));
    const byLine = new Map(report.lines.map((line) => [line.n, line]));
    let cursor = 0;
    const failedDeclared = new Set();
    nodes.forEach((node, index) => {
      const entry = { n: index + 1, raw: node.sourceText, canonical: node.canonical, kind: node.type, label: "", status: "unsure", note: node.note || "", sourceRange: node.sourceRange, part: node.part || null };
      if (node.type === "goal") {
        entry.status = node.status || "ok";
        entry.label = "目標";
        lines.push(entry);
        return;
      }
      if (node.canonical) {
        cursor += 1;
        const line = byLine.get(cursor);
        if (line) {
          entry.label = line.label || "";
          entry.kind = line.kind || node.type;
          entry.status = line.status;
          entry.note = line.note || "";
          entry.grounding = line.grounding || null;
          // Rule B：讀不出是哪種動作 → 黃，不是紅。紅只留給「理解了而且驗證失敗」。
          if (line.status === "error" && (line.kind === "unknown" || node.type === "unknown")) {
            entry.status = "unsure";
            entry.note = `讀不出這一句在做什麼（引入變數、假設、推導、引用定理…），沒有驗。${line.note ? " " + line.note : ""}`;
          }
          // 連鎖抑制：前面某一句的定義／引入沒翻成功，這一句因為「X 沒有宣告」而紅 → 黃並指回去
          if (entry.status === "error" && failedDeclared.size) {
            const undeclared = (line.note || "").match(/「([A-Za-z_]\w*)」沒有宣告/);
            const used = [...symbolsIn(node.canonical)].filter((name) => failedDeclared.has(name));
            const culprit = undeclared && failedDeclared.has(undeclared[1].toLowerCase()) ? undeclared[1] : used[0];
            if (culprit) {
              entry.status = "unsure";
              entry.note = `無法驗證這一句，因為前面「${culprit}」的定義那一句還沒成功解析；先修好那一句。`;
            }
          }
        }
      }
      // 這一句沒翻成功（或翻了但引擎讀不懂）：把它原文裡的變數名記起來，給後面的連鎖判斷用
      if (entry.status !== "ok" && (node.type === "unknown" || /^(?:define|introduce|assume)$/.test(node.type))) {
        symbolsIn(node.sourceText).forEach((name) => failedDeclared.add(name));
      }
      if (node.unknownCommands && node.unknownCommands.length && entry.status === "ok") {
        entry.note = `${entry.note} 略過了不認得的 LaTeX 指令：${node.unknownCommands.join(" ")}`.trim();
      }
      // v2.2 結論接地：故 lim … = L 對上題目的語意目標、骨架也齊 → 說清楚是這兩件事都成立
      if (node.type === "conclude" && entry.status === "ok" && /對上題目的目標/.test(entry.note)) {
        const skeletonName = { "epsilon-delta": "ε–δ ", induction: "歸納", cases: "分情況", contradiction: "反證", direct: "" }[spec && spec.skeleton ? spec.skeleton : "direct"] || "";
        entry.note = `結論與原證明目標一致。${skeletonName}證明骨架完整。`;
        entry.rule = node.rule || "conclude";
      }
      if (node.part) entry.label = `${entry.label || node.type}（第 ${node.part.index + 1} / ${node.part.total} 段）`;
      lines.push(entry);
    });
    const counts = { ok: 0, unsure: 0, error: 0 };
    lines.forEach((line) => { counts[line.status] = (counts[line.status] || 0) + 1; });
    let verdict = report.verdict;
    let verdictText = report.verdictText;
    if (counts.error !== (report.counts || {}).error || lines.length !== report.lines.length) {
      // 有紅被改成黃：重新總結。順序跟引擎一樣：紅 → 骨架缺 → 黃 → 全綠
      if (!lines.length) verdict = "empty";
      else if (counts.error) verdict = "broken";
      else if (report.missing && report.missing.length) verdict = "incomplete";
      else if (counts.unsure) verdict = "partial";
      else verdict = report.goalDone ? "verified" : "incomplete";
      verdictText = { broken: "有一句不成立或讀不懂。", incomplete: "結構還沒到齊。", partial: `每一句都讀得懂，但有 ${counts.unsure} 句我驗不了（標黃的那幾句請自己確認）。`, verified: "全綠、骨架齊。", empty: "還沒寫。" }[verdict];
    }
    return { lines, counts, missing: report.missing || [], verdict, verdictText, goalDone: report.goalDone, canonicalText: translated.canonicalText, surface: true, facts: report.facts || [], semanticGoal: specSemanticGoal(lang, spec) };
  }

  const api = { version: 2, translate, check, latexToPlain, parseSemanticGoal, specSemanticGoal, goalEquivalent, matchConclusionToGoal, segment: (text) => { const p = protectMath(text); return segment(p.work, p.map).map((s) => restoreMath(s.text, p.blocks).text); } };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.BuzzProofSurface = api;
})();
