// 微積分 20 講隨堂測驗（2026-09-30）：由 tools/build_lecture_pack.js 產生，不要手改。
// 來源：GPA 戰士的 caNN.tex（20 份 60 分鐘卷，每份 5 選擇 + 4 計算題），骨架由 tools/import_lecture_exams.js 拆出，
// 判分層（answerKind／答案語法／rank／tags／驗算描述子）在 tools/content/lecture_exams_answers.json 手寫。
// 證明小題：引擎釘得住的做成 answerKind "proof"（指向 src/proof_lang_content.js 的 pl-lec-* spec，照考卷題序排在卷上）；
// 釘不住的證明、畫圖題與「說明為什麼」這類小題不進題庫（skip）。其餘小題各自獨立成題、題幹帶著原題的設定。
// window.BUZZ_LECTURE_PAPERS 是 20 張固定卷的題序：第 N 講隨堂測驗照考卷順序出題，不抽籤。
(function () {
  "use strict";

  const problems = [
    {
      "id": "lec-01-m2",
      "topic": "limits",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\lim_{x\\to0}\\frac{\\sin3x}{x}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "trig-limit",
        "standard-limit",
        "lecture",
        "lecture-01",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "sin3x/x=3· sin3x/3x→3·1=3。常見錯誤是把 sin3x 當成 3sin x 或直接約掉 x。",
      "source": "微積分 20 講 · 第 01 講隨堂測驗",
      "lecture": "01",
      "examPart": "mc",
      "answer": "3",
      "distractors": [
        "0",
        "1",
        "1/3"
      ]
    },
    {
      "id": "lec-01-m3",
      "topic": "limits",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\lim_{x\\to\\infty}\\frac{3x^2+1}{2x^2-x}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "rational",
        "asymptote",
        "lecture",
        "lecture-01",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "分子分母同除以 x^2：(3+1/x^2)/(2-1/x)→ 3/2。",
      "source": "微積分 20 講 · 第 01 講隨堂測驗",
      "lecture": "01",
      "examPart": "mc",
      "answer": "3/2",
      "distractors": [
        "0",
        "3",
        "inf"
      ]
    },
    {
      "id": "lec-01-m4",
      "topic": "limits",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{下列哪一個函數在 }\\,x=0\\text{ 連續？}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "continuity",
        "squeeze",
        "lecture",
        "lecture-01",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "(A) |xsin1/x|≤ |x|→0，由夾擠 lim_(x→0)f=0=f(0)，連續。\n(B) 在 ±1 之間無限振盪，極限不存在。(C) 左極限 -1、右極限 1，跳躍不連續。(D) 無窮不連續。",
      "source": "微積分 20 講 · 第 01 講隨堂測驗",
      "lecture": "01",
      "examPart": "mc",
      "answers": [
        "f(x)=x·sin(1/x)（x≠0），f(0)=0"
      ],
      "canonical": "f(x)=x·sin(1/x)（x≠0），f(0)=0",
      "answer": "f(x)=x·sin(1/x)（x≠0），f(0)=0",
      "distractors": [
        "f(x)=sin(1/x)（x≠0），f(0)=0",
        "f(x)=|x|/x（x≠0），f(0)=0",
        "f(x)=1/x²（x≠0），f(0)=0"
      ]
    },
    {
      "id": "lec-01-m5",
      "topic": "limits",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\text{由中間值定理，方程式 }\\,x^3+x-1=0\\text{ 必有一根落在哪個區間？}",
      "answerKind": "interval",
      "timeLimit": 120,
      "tags": [
        "ivt",
        "continuity",
        "lecture",
        "lecture-01",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "f(x)=x^3+x-1 為多項式，處處連續。f(0)=-1<0、f(1)=1>0，由中間值定理在 (0,1) 內有根。\n（f 遞增，其他區間端點同號，且 f 只有一個實根。）",
      "source": "微積分 20 講 · 第 01 講隨堂測驗",
      "lecture": "01",
      "examPart": "mc",
      "answer": "(0, 1)",
      "distractors": [
        "(-1, 0)",
        "(1, 2)",
        "(2, 3)"
      ]
    },
    {
      "id": "lec-01-q1b",
      "topic": "limits",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\lim_{x\\to1}\\frac{x^3-1}{x^2-1}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "rational",
        "factoring",
        "lecture",
        "lecture-01",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "((x-1)(x^2+x+1))/((x-1)(x+1))=(x^2+x+1)/(x+1)→ 3/2。",
      "source": "微積分 20 講 · 第 01 講隨堂測驗",
      "lecture": "01",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-01-q1",
      "examTitle": "求極限。",
      "answer": "3/2"
    },
    {
      "id": "lec-01-q1c",
      "topic": "limits",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\lim_{x\\to\\infty}\\bigl(\\sqrt{x^2+x}-x\\bigr)",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "radical",
        "limit-trap",
        "lecture",
        "lecture-01",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "√(x^2+x)-x=x/(√(x^2+x)+x)=1/(√(1+1/x)+1)→ 1/2。\n（「∞ -∞ 」不能直接當作 0。）",
      "source": "微積分 20 講 · 第 01 講隨堂測驗",
      "lecture": "01",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-01-q1",
      "examTitle": "求極限。",
      "answer": "1/2"
    },
    {
      "id": "lec-01-q2a",
      "topic": "limits",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{用夾擠定理證明 }\\lim_{x\\to0}x^2\\cos\\frac{1}{x}=0",
      "answerKind": "proof",
      "timeLimit": 300,
      "tags": [
        "proof",
        "written-proof",
        "squeeze",
        "trig-limit",
        "lecture",
        "lecture-01",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "-1≤ cos1/x≤1⇒-x^2≤ x^2cos1/x≤ x^2（x≠0）。\nlim_(x→0)(± x^2)=0，由夾擠定理極限為 0。\n注意不能用「極限的乘積＝乘積的極限」，因為 limcos1/x 不存在。",
      "source": "微積分 20 講 · 第 01 講隨堂測驗",
      "lecture": "01",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-01-q2",
      "examTitle": "夾擠定理。",
      "proofSpec": "pl-lec-squeeze-cos",
      "answer": "（白話證明．機器判分）",
      "hints": [
        "一行一句，每句用一種句型開頭：任取／取／假設／則／由…／因為…所以／故。",
        "先寫出要證的東西長什麼樣，再一步一步扣回去。",
        "每一行都會被檢查：站不住的那一行會標紅。"
      ]
    },
    {
      "id": "lec-01-q2b",
      "topic": "limits",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{求 }\\lim_{x\\to\\infty}\\frac{\\sin x}{x}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "squeeze",
        "lecture",
        "lecture-01",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "|(sin x)/x|≤ 1/(|x|)→0，故極限為 0。x→ ∞ 時分子有界、分母發散；x→0 時分子分母同時趨近 0，比值趨近 1。兩者是不同的極限過程。",
      "source": "微積分 20 講 · 第 01 講隨堂測驗",
      "lecture": "01",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-01-q2",
      "examTitle": "夾擠定理。",
      "answer": "0",
      "verify": {
        "m": "limit",
        "f": "\\frac{\\sin x}{x}",
        "at": "inf"
      }
    },
    {
      "id": "lec-01-q2c",
      "topic": "limits",
      "difficulty": 4,
      "rank": 4,
      "authoredRank": 4,
      "prompt": "\\text{以 }\\lfloor t\\rfloor\\text{ 表示不超過 }\\,t\\text{ 的最大整數。利用 }\\,t-1<\\lfloor t\\rfloor\\le t\\text{，求 }\\lim_{x\\to0}x\\Bigl\\lfloor\\frac1x\\Bigr\\rfloor",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "squeeze",
        "limit-trap",
        "lecture",
        "lecture-01",
        "exam-style",
        "midterm-style",
        "rank-4"
      ],
      "solution": "令 t=1/x：1/x-1<⌊1/x⌋≤ 1/x。\n\nx>0：乘以 x 不等號不變，1-x<x⌊1/x⌋≤1，右極限為 1。\n\nx<0：乘以 x 不等號反向，1≤ x⌊1/x⌋<1-x，左極限為 1。\n\n左右極限相等，故極限為 1。",
      "source": "微積分 20 講 · 第 01 講隨堂測驗",
      "lecture": "01",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-01-q2",
      "examTitle": "夾擠定理。",
      "answer": "1",
      "verify": {
        "m": "limit",
        "f": "x\\left\\lfloor\\frac{1}{x}\\right\\rfloor",
        "at": 0
      }
    },
    {
      "id": "lec-01-q3a",
      "topic": "limits",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{設 }\\,f(x)=ax+3\\ (x<1)\\text{、 }\\,f(x)=x^2+b\\ (1\\le x\\le2)\\text{、 }\\,f(x)=4x-1\\ (x>2)\\text{。若 }\\,f\\text{ 在所有實數上連續，求 }\\,a",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "continuity",
        "lecture",
        "lecture-01",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "各段都是多項式，只需檢查接點。\n\nx=2：lim_(x→2^-)f=4+b，lim_(x→2^+)f=7，f(2)=4+b，得 b=3。\n\nx=1：lim_(x→1^-)f=a+3，lim_(x→1^+)f=1+b=4=f(1)，得 a=1。",
      "source": "微積分 20 講 · 第 01 講隨堂測驗",
      "lecture": "01",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-01-q3",
      "examTitle": "連續性與中間值定理。",
      "answer": "1"
    },
    {
      "id": "lec-01-q3b",
      "topic": "limits",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{證明方程式 }\\cos x=x\\text{ 在 }\\bigl(0,\\frac\\pi2\\bigr)\\text{ 內至少有一個解。}",
      "answerKind": "proof",
      "timeLimit": 300,
      "tags": [
        "proof",
        "written-proof",
        "ivt",
        "continuity",
        "lecture",
        "lecture-01",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "g(x)=cos x-x 在 [0,(π)/2] 連續，g(0)=1>0，g((π)/2)=-(π)/2<0。由中間值定理存在 c∈(0,(π)/2) 使 g(c)=0，即 cos c=c。",
      "source": "微積分 20 講 · 第 01 講隨堂測驗",
      "lecture": "01",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-01-q3",
      "examTitle": "連續性與中間值定理。",
      "proofSpec": "pl-lec-ivt-cos",
      "answer": "（白話證明．機器判分）",
      "hints": [
        "一行一句，每句用一種句型開頭：任取／取／假設／則／由…／因為…所以／故。",
        "先寫出要證的東西長什麼樣，再一步一步扣回去。",
        "每一行都會被檢查：站不住的那一行會標紅。"
      ]
    },
    {
      "id": "lec-01-q4a",
      "topic": "limits",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{設 }\\,g(x)=\\dfrac{x^2-1}{x^2-3x+2}\\text{。求 }\\,g\\text{ 的所有不連續點（寫成集合）}",
      "answerKind": "set",
      "timeLimit": 120,
      "tags": [
        "continuity",
        "rational",
        "lecture",
        "lecture-01",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "g(x)=((x-1)(x+1))/((x-1)(x-2))，在 x=1,2 無定義。\nx=1：lim_(x→1)g=lim(x+1)/(x-2)=-2 存在，為可移除不連續（圖上為空心點 (1,-2)）。\nx=2：無窮不連續。",
      "source": "微積分 20 講 · 第 01 講隨堂測驗",
      "lecture": "01",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-01-q4",
      "examTitle": "漸近線與 $\\varepsilon$–$\\delta$ 定義。",
      "answer": "{1, 2}",
      "verify": {
        "m": "zeros",
        "f": "x^2-3x+2",
        "range": [
          -10,
          10
        ]
      }
    },
    {
      "id": "lec-01-q4b",
      "topic": "limits",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{設 }\\,g(x)=\\dfrac{x^2-1}{x^2-3x+2}\\text{。求 }\\lim_{x\\to\\infty}g(x)\\text{（即水平漸近線 }\\,y=L\\text{ 的 }\\,L\\text{）}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "asymptote",
        "rational",
        "lecture",
        "lecture-01",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "垂直漸近線 x=2；lim_(x→ ± ∞ )g=1，水平漸近線 y=1。\nx→2^+：(x+1)/(x-2)→ 3/(0^+)=+∞ ；x→2^-：→ -∞ 。",
      "source": "微積分 20 講 · 第 01 講隨堂測驗",
      "lecture": "01",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-01-q4",
      "examTitle": "漸近線與 $\\varepsilon$–$\\delta$ 定義。",
      "answer": "1",
      "verify": {
        "m": "limit",
        "f": "\\frac{x^2-1}{x^2-3x+2}",
        "at": "inf"
      }
    },
    {
      "id": "lec-01-q4d",
      "topic": "limits",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{用 }\\varepsilon\\text{ – }\\delta\\text{ 定義證明 }\\lim_{x\\to3}(2x-1)=5\\text{。}",
      "answerKind": "proof",
      "timeLimit": 300,
      "tags": [
        "proof",
        "written-proof",
        "epsilon-delta",
        "continuity",
        "lecture",
        "lecture-01",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "任給 ε>0，取 δ=ε/2。則當 0<|x-3|<δ 時，\n|(2x-1)-5|=2|x-3|<2δ=ε，故得證。",
      "source": "微積分 20 講 · 第 01 講隨堂測驗",
      "lecture": "01",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-01-q4",
      "examTitle": "漸近線與 $\\varepsilon$–$\\delta$ 定義。",
      "proofSpec": "pl-lec-limit-2x-1",
      "answer": "（白話證明．機器判分）",
      "hints": [
        "一行一句，每句用一種句型開頭：任取／取／假設／則／由…／因為…所以／故。",
        "先寫出要證的東西長什麼樣，再一步一步扣回去。",
        "每一行都會被檢查：站不住的那一行會標紅。"
      ]
    },
    {
      "id": "lec-02-m1",
      "topic": "derivatives",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\text{設 }\\,f(x)=x^3-2x\\text{，則 }\\,f'(1)",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "power-rule",
        "lecture",
        "lecture-02",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "f'(x)=3x^2-2，f'(1)=1。注意 f(1)=-1 是函數值，不是斜率，所以 (A) 錯。",
      "source": "微積分 20 講 · 第 02 講隨堂測驗",
      "lecture": "02",
      "examPart": "mc",
      "answer": "1",
      "distractors": [
        "-1",
        "3",
        "-2"
      ],
      "verify": {
        "m": "deriv",
        "f": "x^3-2x",
        "at": [
          1
        ]
      }
    },
    {
      "id": "lec-02-m2",
      "topic": "derivatives",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\dfrac{d}{dx}(\\sin x\\cos x)",
      "answerKind": "expression",
      "timeLimit": 120,
      "tags": [
        "product-rule",
        "trig",
        "lecture",
        "lecture-02",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "乘法法則：cos x· cos x+sin x· (-sin x)=cos^2x-sin^2x=cos2x。\n(B) 是把導數「分別相乘」的錯誤：(fg)'≠ f'g'。",
      "source": "微積分 20 講 · 第 02 講隨堂測驗",
      "lecture": "02",
      "examPart": "mc",
      "answer": "cos(2*x)",
      "distractors": [
        "cos(x)^2+sin(x)^2",
        "-sin(x)*cos(x)",
        "2*sin(x)*cos(x)"
      ]
    },
    {
      "id": "lec-02-m3",
      "topic": "derivatives",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{關於 }\\,f(x)=\\left|x\\right|\\text{ 在 }\\,x=0\\text{ 的敘述，何者正確？}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "derivative-definition",
        "continuity",
        "lecture",
        "lecture-02",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "lim_(x→0)|x|=0=f(0)，連續。差商 (|h|)/h 在 h→0^+ 時為 1、h→0^- 時為 -1，極限不存在，故不可微（圖形有尖角）。\n(B) 不可能發生：可微必連續。",
      "source": "微積分 20 講 · 第 02 講隨堂測驗",
      "lecture": "02",
      "examPart": "mc",
      "answers": [
        "連續但不可微",
        "連續不可微",
        "continuous but not differentiable"
      ],
      "canonical": "連續但不可微",
      "answer": "連續但不可微",
      "distractors": [
        "可微但不連續",
        "既連續又可微，f′(0)=0",
        "既不連續也不可微"
      ]
    },
    {
      "id": "lec-02-q1b",
      "topic": "derivatives",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{設 }\\,g(x)=\\dfrac1x\\text{，由導數的定義求 }\\,g'(a)\\text{ （}\\,a\\neq0\\text{）}",
      "answerKind": "expression",
      "timeLimit": 120,
      "tags": [
        "derivative-definition",
        "lecture",
        "lecture-02",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "(1/(a+h)-1/a)/h=(a-(a+h))/(ha(a+h))=(-1)/(a(a+h))→ -1/(a^2)。",
      "source": "微積分 20 講 · 第 02 講隨堂測驗",
      "lecture": "02",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-02-q1",
      "examTitle": "由定義求導數。",
      "answer": "-1/a^2",
      "variable": "a",
      "verify": {
        "m": "fn",
        "vars": [
          "a"
        ],
        "kind": "deriv",
        "f": "\\frac{1}{a}"
      }
    },
    {
      "id": "lec-02-q1c",
      "topic": "derivatives",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{設 }\\,k(x)=\\sqrt x\\text{，由導數的定義求 }\\,k'(a)\\text{ （}\\,a>0\\text{）}",
      "answerKind": "expression",
      "timeLimit": 120,
      "tags": [
        "derivative-definition",
        "radical",
        "lecture",
        "lecture-02",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "分子有理化：(√(a+h)-√(a))/h=((a+h)-a)/(h(√(a+h)+√(a)))=1/(√(a+h)+√(a))→ 1/(2√(a))。",
      "source": "微積分 20 講 · 第 02 講隨堂測驗",
      "lecture": "02",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-02-q1",
      "examTitle": "由定義求導數。",
      "answer": "1/(2*sqrt(a))",
      "variable": "a",
      "verify": {
        "m": "fn",
        "vars": [
          "a"
        ],
        "kind": "deriv",
        "f": "\\sqrt{a}",
        "pts": [
          [
            0.37
          ],
          [
            0.81
          ],
          [
            1.23
          ],
          [
            1.77
          ],
          [
            2.41
          ],
          [
            3.13
          ]
        ]
      }
    },
    {
      "id": "lec-02-q1d",
      "topic": "derivatives",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{求曲線 }\\,y=\\sqrt x\\text{ 在 }\\,x=4\\text{ 處的切線方程式 }\\,y",
      "answerKind": "expression",
      "timeLimit": 120,
      "tags": [
        "tangent-normal",
        "lecture",
        "lecture-02",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "切點 (4,2)，斜率 k'(4)=1/4：y-2=1/4(x-4)，即 y=1/4x+1。",
      "source": "微積分 20 講 · 第 02 講隨堂測驗",
      "lecture": "02",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-02-q1",
      "examTitle": "由定義求導數。",
      "answer": "x/4+1",
      "verify": {
        "m": "fn",
        "cases": [
          {
            "at": {
              "x": 0
            },
            "v": {
              "m": "tangentNormal",
              "f": "\\sqrt{x}",
              "a": 4,
              "kind": "yIntercept"
            }
          },
          {
            "at": {
              "x": 0
            },
            "d": "x",
            "v": {
              "m": "tangentNormal",
              "f": "\\sqrt{x}",
              "a": 4,
              "kind": "slope"
            }
          }
        ]
      }
    },
    {
      "id": "lec-02-q2a",
      "topic": "derivatives",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\text{求 }\\,y=(x^2+1)(x^3-x)\\text{ 的導數 }\\,y'",
      "answerKind": "expression",
      "timeLimit": 120,
      "tags": [
        "product-rule",
        "lecture",
        "lecture-02",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "2x(x^3-x)+(x^2+1)(3x^2-1)=(2x^4-2x^2)+(3x^4+2x^2-1)=5x^4-1。\n驗證：y=x^5-x，y'=5x^4-1，一致。",
      "source": "微積分 20 講 · 第 02 講隨堂測驗",
      "lecture": "02",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-02-q2",
      "examTitle": "微分法則。",
      "answer": "5*x^4-1",
      "verify": {
        "m": "fn",
        "kind": "deriv",
        "f": "(x^2+1)(x^3-x)"
      }
    },
    {
      "id": "lec-02-q2b",
      "topic": "derivatives",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{求 }\\,y=\\dfrac{x-1}{x+1}\\text{ 的導數 }\\,y'",
      "answerKind": "expression",
      "timeLimit": 120,
      "tags": [
        "quotient-rule",
        "lecture",
        "lecture-02",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "((x+1)-(x-1))/((x+1)^2)=2/((x+1)^2)。",
      "source": "微積分 20 講 · 第 02 講隨堂測驗",
      "lecture": "02",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-02-q2",
      "examTitle": "微分法則。",
      "answer": "2/(x+1)^2",
      "verify": {
        "m": "fn",
        "kind": "deriv",
        "f": "\\frac{x-1}{x+1}"
      }
    },
    {
      "id": "lec-02-q2c",
      "topic": "derivatives",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{求 }\\,y=\\sin^3(2x)\\text{ 的導數 }\\,y'",
      "answerKind": "expression",
      "timeLimit": 120,
      "tags": [
        "chain-rule",
        "trig",
        "lecture",
        "lecture-02",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "連鎖律用兩次：3sin^2(2x)· cos(2x)·2=6sin^2(2x)cos(2x)。",
      "source": "微積分 20 講 · 第 02 講隨堂測驗",
      "lecture": "02",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-02-q2",
      "examTitle": "微分法則。",
      "answer": "6*sin(2*x)^2*cos(2*x)",
      "verify": {
        "m": "fn",
        "kind": "deriv",
        "f": "(\\sin(2x))^3"
      }
    },
    {
      "id": "lec-02-q2d",
      "topic": "derivatives",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{求 }\\,y=\\sqrt{1+\\cos^2x}\\text{ 的導數 }\\,y'",
      "answerKind": "expression",
      "timeLimit": 120,
      "tags": [
        "chain-rule",
        "radical",
        "lecture",
        "lecture-02",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "1/(2√(1+cos^2x))·2cos x· (-sin x)=-(sin xcos x)/(√(1+cos^2x))。",
      "source": "微積分 20 講 · 第 02 講隨堂測驗",
      "lecture": "02",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-02-q2",
      "examTitle": "微分法則。",
      "answer": "-sin(x)*cos(x)/sqrt(1+cos(x)^2)",
      "verify": {
        "m": "fn",
        "kind": "deriv",
        "f": "\\sqrt{1+(\\cos x)^2}"
      }
    },
    {
      "id": "lec-02-q3a",
      "topic": "derivatives",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{設 }\\,g(x)=x^2\\ (x\\le1)\\text{、 }\\,g(x)=ax+b\\ (x>1)\\text{。若 }\\,g\\text{ 在 }\\,x=1\\text{ 可微，求 }\\,a",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "derivative-definition",
        "continuity",
        "lecture",
        "lecture-02",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "可微必連續：1=a+b。左右導數相等：左導數 2x|_(x=1)=2，右導數 a，故 a=2, b=-1。\n（此時 y=2x-1 正是 y=x^2 在 x=1 的切線。）",
      "source": "微積分 20 講 · 第 02 講隨堂測驗",
      "lecture": "02",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-02-q3",
      "examTitle": "可微性。",
      "answer": "2",
      "verify": {
        "m": "deriv",
        "f": "x^2",
        "at": [
          1
        ]
      }
    },
    {
      "id": "lec-02-q3b",
      "topic": "derivatives",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{設 }\\,f(x)=x^2\\sin\\dfrac1x\\ (x\\neq0)\\text{， }\\,f(0)=0\\text{。由定義求 }\\,f'(0)",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "derivative-definition",
        "squeeze",
        "lecture",
        "lecture-02",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "f'(0)=lim_(h→0)(h^2sin(1/h))/h=lim_(h→0)hsin1/h=0（夾擠：|hsin1/h|≤ |h|）。",
      "source": "微積分 20 講 · 第 02 講隨堂測驗",
      "lecture": "02",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-02-q3",
      "examTitle": "可微性。",
      "answer": "0",
      "verify": {
        "m": "limit",
        "f": "\\frac{x^2\\sin(1/x)-0}{x}",
        "at": 0
      }
    },
    {
      "id": "lec-02-q3c",
      "topic": "derivatives",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{設 }\\,f(x)=x^2\\sin\\dfrac1x\\ (x\\neq0)\\text{。求 }\\,x\\neq0\\text{ 時的 }\\,f'(x)",
      "answerKind": "expression",
      "timeLimit": 120,
      "tags": [
        "chain-rule",
        "product-rule",
        "lecture",
        "lecture-02",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "f'(x)=2xsin1/x+x^2cos1/x· (-1/(x^2))=2xsin1/x-cos1/x。",
      "source": "微積分 20 講 · 第 02 講隨堂測驗",
      "lecture": "02",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-02-q3",
      "examTitle": "可微性。",
      "answer": "2*x*sin(1/x)-cos(1/x)",
      "verify": {
        "m": "fn",
        "kind": "deriv",
        "f": "x^2\\sin(1/x)"
      }
    },
    {
      "id": "lec-02-q3d",
      "topic": "derivatives",
      "difficulty": 4,
      "rank": 4,
      "authoredRank": 4,
      "prompt": "\\text{設 }\\,f(x)=x^2\\sin\\dfrac1x\\ (x\\neq0)\\text{， }\\,f(0)=0\\text{。 }\\lim_{x\\to0}f'(x)\\text{ 存在嗎？（填「存在」或「不存在」）}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "limit-trap",
        "continuity",
        "lecture",
        "lecture-02",
        "exam-style",
        "midterm-style",
        "rank-4"
      ],
      "solution": "2xsin1/x→0，但 cos1/x 在 ±1 間振盪無極限，故 lim_(x→0)f'(x) 不存在。\n所以 f 處處可微（f'(0)=0），但 f' 在 0 不連續。",
      "source": "微積分 20 講 · 第 02 講隨堂測驗",
      "lecture": "02",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-02-q3",
      "examTitle": "可微性。",
      "answers": [
        "不存在",
        "DNE",
        "does not exist"
      ],
      "canonical": "不存在",
      "answer": "不存在",
      "distractors": [
        "存在，等於 0",
        "存在，等於 1"
      ]
    },
    {
      "id": "lec-02-q4a",
      "topic": "derivatives",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\text{一質點沿直線運動，位置為 }\\,s(t)=t^3-6t^2+9t\\text{ （公尺， }\\,t\\ge0\\text{ 秒）。求加速度 }\\,a(t)",
      "answerKind": "expression",
      "timeLimit": 120,
      "tags": [
        "kinematics",
        "lecture",
        "lecture-02",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "v=3t^2-12t+9=3(t-1)(t-3)，a=6t-12。",
      "source": "微積分 20 講 · 第 02 講隨堂測驗",
      "lecture": "02",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-02-q4",
      "examTitle": "直線運動。",
      "answer": "6*t-12",
      "variable": "t",
      "verify": {
        "m": "fn",
        "vars": [
          "t"
        ],
        "kind": "deriv",
        "order": 2,
        "f": "t^3-6t^2+9t"
      }
    },
    {
      "id": "lec-02-q4b",
      "topic": "derivatives",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{一質點沿直線運動，位置為 }\\,s(t)=t^3-6t^2+9t\\text{ （公尺， }\\,t\\ge0\\text{ 秒）。求質點靜止的所有時刻 }\\,t\\text{（寫成集合）}",
      "answerKind": "set",
      "timeLimit": 120,
      "tags": [
        "kinematics",
        "lecture",
        "lecture-02",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "v=0：t=1,3。v>0：0≤ t<1 或 t>3。",
      "source": "微積分 20 講 · 第 02 講隨堂測驗",
      "lecture": "02",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-02-q4",
      "examTitle": "直線運動。",
      "answer": "{1, 3}",
      "verify": {
        "m": "critical",
        "f": "x^3-6x^2+9x",
        "range": [
          0,
          10
        ]
      }
    },
    {
      "id": "lec-02-q4c",
      "topic": "derivatives",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{一質點沿直線運動，位置為 }\\,s(t)=t^3-6t^2+9t\\text{ （公尺， }\\,t\\ge0\\text{ 秒）。求 }0\\le t\\le4\\text{ 期間走過的總距離（公尺）}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "kinematics",
        "lecture",
        "lecture-02",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "s(0)=0, s(1)=4, s(3)=0, s(4)=4。位移 s(4)-s(0)=4m；\n總距離 =|4-0|+|0-4|+|4-0|=12m（在 t=1,3 折返，要分段）。",
      "source": "微積分 20 講 · 第 02 講隨堂測驗",
      "lecture": "02",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-02-q4",
      "examTitle": "直線運動。",
      "answer": "12",
      "verify": {
        "m": "integral",
        "f": "|3x^2-12x+9|",
        "a": 0,
        "b": 4,
        "breaks": [
          1,
          3
        ]
      }
    },
    {
      "id": "lec-02-q4d",
      "topic": "derivatives",
      "difficulty": 4,
      "rank": 4,
      "authoredRank": 4,
      "prompt": "\\text{一質點沿直線運動，位置為 }\\,s(t)=t^3-6t^2+9t\\text{ （公尺， }\\,t\\ge0\\text{ 秒）。求質點速率增加（加速）的時段（寫成區間，多段用 U）}",
      "answerKind": "interval",
      "timeLimit": 120,
      "tags": [
        "kinematics",
        "lecture",
        "lecture-02",
        "exam-style",
        "midterm-style",
        "rank-4"
      ],
      "solution": "速率增加 ⇔ v,a 同號。a>0⇔ t>2。\nv<0,a<0：1<t<2；v>0,a>0：t>3。故在 1<t<2 與 t>3 時加速。\n常見錯誤是以為「a>0 就是加速」：2<t<3 時 a>0 但 v<0，速率其實在減少。",
      "source": "微積分 20 講 · 第 02 講隨堂測驗",
      "lecture": "02",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-02-q4",
      "examTitle": "直線運動。",
      "answer": "(1, 2) U (3, inf)",
      "verify": {
        "m": "increasing",
        "f": "|3x^2-12x+9|",
        "range": [
          0,
          40
        ]
      }
    },
    {
      "id": "lec-03-m2",
      "topic": "derivatives",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\dfrac{d}{dx}\\ln(x^2+1)",
      "answerKind": "expression",
      "timeLimit": 120,
      "tags": [
        "log",
        "chain-rule",
        "lecture",
        "lecture-03",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "(ln u)'=(u')/u=2x/(x^2+1)。(B) 忘了乘上內函數的導數。",
      "source": "微積分 20 講 · 第 03 講隨堂測驗",
      "lecture": "03",
      "examPart": "mc",
      "answer": "2*x/(x^2+1)",
      "distractors": [
        "1/(x^2+1)",
        "2*x/x^2",
        "1/(2*x)"
      ]
    },
    {
      "id": "lec-03-m4",
      "topic": "derivatives",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{設 }\\,f(x)=x^3+x\\text{，則 }(f^{-1})'(2)",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "inverse-function",
        "lecture",
        "lecture-03",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "先找 a 使 f(a)=2：a=1。f'(x)=3x^2+1，f'(1)=4，故 (f^(-1))'(2)=1/4。\n(B) 是錯把 f' 在 x=2 取值的結果：f'(2)=13。",
      "source": "微積分 20 講 · 第 03 講隨堂測驗",
      "lecture": "03",
      "examPart": "mc",
      "answer": "1/4",
      "distractors": [
        "13",
        "1/13",
        "4"
      ],
      "verify": {
        "m": "inverseDeriv",
        "f": "x^3+x",
        "at": 2,
        "x0": 1
      }
    },
    {
      "id": "lec-03-m5",
      "topic": "derivatives",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\dfrac{d}{dx}2^x",
      "answerKind": "expression",
      "timeLimit": 120,
      "tags": [
        "exponential",
        "chain-rule",
        "lecture",
        "lecture-03",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "2^x=e^(xln2)，導數 e^(xln2)· ln2=2^xln2。(A) 是把冪次法則誤用（冪次法則只適用於底數是變數、指數是常數）。",
      "source": "微積分 20 講 · 第 03 講隨堂測驗",
      "lecture": "03",
      "examPart": "mc",
      "answer": "2^x*ln(2)",
      "distractors": [
        "x*2^(x-1)",
        "2^x",
        "2^x/ln(2)"
      ]
    },
    {
      "id": "lec-03-q1a",
      "topic": "derivatives",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{曲線 }\\,x^2+xy+y^2=7\\text{。以隱函數微分求 }\\dfrac{dy}{dx}\\text{ 在點 }(1,2)\\text{ 的值}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "implicit-differentiation",
        "lecture",
        "lecture-03",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "對 x 微分：2x+(y+xy')+2yy'=0⇒ y'=-(2x+y)/(x+2y)。",
      "source": "微積分 20 講 · 第 03 講隨堂測驗",
      "lecture": "03",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-03-q1",
      "examTitle": "隱函數微分。",
      "answer": "-4/5",
      "verify": {
        "m": "implicit",
        "F": "x^2+xy+y^2-7",
        "at": [
          1,
          2
        ]
      }
    },
    {
      "id": "lec-03-q1b",
      "topic": "derivatives",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{曲線 }\\,x^2+xy+y^2=7\\text{。求在點 }(1,2)\\text{ 的切線方程式 }\\,y",
      "answerKind": "expression",
      "timeLimit": 120,
      "tags": [
        "implicit-differentiation",
        "tangent-normal",
        "lecture",
        "lecture-03",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "y'(1,2)=-4/5，切線 y-2=-4/5(x-1)，即 4x+5y=14。",
      "source": "微積分 20 講 · 第 03 講隨堂測驗",
      "lecture": "03",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-03-q1",
      "examTitle": "隱函數微分。",
      "answer": "(14-4*x)/5",
      "verify": {
        "m": "fn",
        "cases": [
          {
            "at": {
              "x": 1
            },
            "v": {
              "m": "value",
              "f": "2"
            }
          },
          {
            "at": {
              "x": 1
            },
            "d": "x",
            "v": {
              "m": "implicit",
              "F": "x^2+xy+y^2-7",
              "at": [
                1,
                2
              ]
            }
          }
        ]
      }
    },
    {
      "id": "lec-03-q1c",
      "topic": "derivatives",
      "difficulty": 4,
      "rank": 4,
      "authoredRank": 4,
      "prompt": "\\text{曲線 }\\,x^2+xy+y^2=7\\text{。求曲線上所有切線為水平的點的 }\\,x\\text{ 座標（寫成集合）}",
      "answerKind": "set",
      "timeLimit": 120,
      "tags": [
        "implicit-differentiation",
        "critical-points",
        "lecture",
        "lecture-03",
        "exam-style",
        "midterm-style",
        "rank-4"
      ],
      "solution": "水平切線：2x+y=0（且分母 x+2y≠0）。代入 y=-2x：x^2-2x^2+4x^2=7，x=± √(7/3)。\n兩點為 (√(7/3),-2√(7/3)) 與 (-√(7/3),2√(7/3))。",
      "source": "微積分 20 講 · 第 03 講隨堂測驗",
      "lecture": "03",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-03-q1",
      "examTitle": "隱函數微分。",
      "answer": "{sqrt(7/3), -sqrt(7/3)}"
    },
    {
      "id": "lec-03-q1d",
      "topic": "derivatives",
      "difficulty": 4,
      "rank": 5,
      "authoredRank": 5,
      "prompt": "\\text{曲線 }\\,x^2+xy+y^2=7\\text{。求 }\\dfrac{d^2y}{dx^2}\\text{ 在點 }(1,2)\\text{ 的值}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "implicit-differentiation",
        "second-derivative",
        "lecture",
        "lecture-03",
        "exam-style",
        "midterm-style",
        "rank-5",
        "boss-rank"
      ],
      "solution": "對 y'=-(2x+y)/(x+2y) 再用除法法則：\n y''=-((2+y')(x+2y)-(2x+y)(1+2y'))/((x+2y)^2). \n代入 x=1,y=2,y'=-4/5：分子 =6/5·5-4· (-3/5)=6+12/5=42/5，\n故 y''=-(42/5)/25=-42/125。",
      "source": "微積分 20 講 · 第 03 講隨堂測驗",
      "lecture": "03",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-03-q1",
      "examTitle": "隱函數微分。",
      "answer": "-42/125",
      "verify": {
        "m": "implicitDeriv",
        "F": "x^2+xy+y^2-7",
        "at": [
          1,
          2
        ],
        "order": 2,
        "tol": 0.0001
      }
    },
    {
      "id": "lec-03-q2a",
      "topic": "derivatives",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{求 }\\,y=x^x\\ (x>0)\\text{ 的導數 }\\,y'",
      "answerKind": "expression",
      "timeLimit": 120,
      "tags": [
        "log-differentiation",
        "lecture",
        "lecture-03",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "ln y=xln x⇒(y')/y=ln x+1⇒ y'=x^x(ln x+1)。\n（x^x 既不是冪函數也不是指數函數，兩種公式都不能直接用。）",
      "source": "微積分 20 講 · 第 03 講隨堂測驗",
      "lecture": "03",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-03-q2",
      "examTitle": "對數微分法。",
      "answer": "x^x*(ln(x)+1)",
      "verify": {
        "m": "fn",
        "kind": "deriv",
        "f": "x^x",
        "pts": [
          [
            0.37
          ],
          [
            0.81
          ],
          [
            1.23
          ],
          [
            1.77
          ],
          [
            2.41
          ],
          [
            3.13
          ]
        ]
      }
    },
    {
      "id": "lec-03-q2b",
      "topic": "derivatives",
      "difficulty": 4,
      "rank": 4,
      "authoredRank": 4,
      "prompt": "\\text{求 }\\,y=x^{\\sin x}\\ (x>0)\\text{ 的導數 }\\,y'",
      "answerKind": "expression",
      "timeLimit": 120,
      "tags": [
        "log-differentiation",
        "lecture",
        "lecture-03",
        "exam-style",
        "midterm-style",
        "rank-4"
      ],
      "solution": "ln y=sin xln x⇒(y')/y=cos xln x+(sin x)/x，\ny'=x^(sin x)(cos xln x+(sin x)/x)。",
      "source": "微積分 20 講 · 第 03 講隨堂測驗",
      "lecture": "03",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-03-q2",
      "examTitle": "對數微分法。",
      "answer": "x^sin(x)*(cos(x)*ln(x)+sin(x)/x)",
      "verify": {
        "m": "fn",
        "kind": "deriv",
        "f": "x^{\\sin x}",
        "pts": [
          [
            0.37
          ],
          [
            0.81
          ],
          [
            1.23
          ],
          [
            1.77
          ],
          [
            2.41
          ],
          [
            3.13
          ]
        ]
      }
    },
    {
      "id": "lec-03-q2c",
      "topic": "derivatives",
      "difficulty": 4,
      "rank": 4,
      "authoredRank": 4,
      "prompt": "\\text{用對數微分法求 }\\,y=\\dfrac{x^2\\sqrt{x+1}}{(x-1)^3}\\text{ 的導數 }\\,y'\\quad (x>1)",
      "answerKind": "expression",
      "timeLimit": 120,
      "tags": [
        "log-differentiation",
        "lecture",
        "lecture-03",
        "exam-style",
        "midterm-style",
        "rank-4"
      ],
      "solution": "ln y=2ln x+1/2ln(x+1)-3ln(x-1)，\n y'=(x^2√(x+1))/((x-1)^3)(2/x+1/(2(x+1))-3/(x-1)).",
      "source": "微積分 20 講 · 第 03 講隨堂測驗",
      "lecture": "03",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-03-q2",
      "examTitle": "對數微分法。",
      "answer": "x^2*sqrt(x+1)/(x-1)^3*(2/x+1/(2*(x+1))-3/(x-1))",
      "verify": {
        "m": "fn",
        "kind": "deriv",
        "f": "\\frac{x^2\\sqrt{x+1}}{(x-1)^3}",
        "pts": [
          [
            1.37
          ],
          [
            1.81
          ],
          [
            2.23
          ],
          [
            2.77
          ],
          [
            3.41
          ],
          [
            4.13
          ]
        ]
      }
    },
    {
      "id": "lec-03-q2d",
      "topic": "derivatives",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{求 }\\,y=\\log_2(x^3)\\text{ 的導數 }\\,y'\\quad (x>0)",
      "answerKind": "expression",
      "timeLimit": 120,
      "tags": [
        "log",
        "chain-rule",
        "lecture",
        "lecture-03",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "y=(3ln x)/ln2，y'=3/xln2。",
      "source": "微積分 20 講 · 第 03 講隨堂測驗",
      "lecture": "03",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-03-q2",
      "examTitle": "對數微分法。",
      "answer": "3/(x*ln(2))",
      "verify": {
        "m": "fn",
        "kind": "deriv",
        "f": "\\frac{\\ln(x^3)}{\\ln 2}",
        "pts": [
          [
            0.37
          ],
          [
            0.81
          ],
          [
            1.23
          ],
          [
            1.77
          ],
          [
            2.41
          ],
          [
            3.13
          ]
        ]
      }
    },
    {
      "id": "lec-03-q3b",
      "topic": "derivatives",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{求 }\\dfrac{d}{dx}\\arcsin\\dfrac{x}{4}",
      "answerKind": "expression",
      "timeLimit": 120,
      "tags": [
        "inverse-trig",
        "chain-rule",
        "lecture",
        "lecture-03",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "令 u=x/4：(arcsin u)′=u′/√(1-u^2)=(1/4)/√(1-x^2/16)=1/√(16-x^2)。",
      "source": "微積分 20 講 · 第 03 講隨堂測驗",
      "lecture": "03",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-03-q3",
      "examTitle": "反函數與反三角函數。",
      "answer": "1/sqrt(16-x^2)",
      "verify": {
        "m": "fn",
        "kind": "deriv",
        "f": "\\arcsin\\frac{x}{4}"
      }
    },
    {
      "id": "lec-03-q3c",
      "topic": "derivatives",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{求 }\\dfrac{d}{dx}\\arctan\\dfrac1x\\quad (x>0)",
      "answerKind": "expression",
      "timeLimit": 120,
      "tags": [
        "inverse-trig",
        "chain-rule",
        "lecture",
        "lecture-03",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "1/(1+1/x^2)· (-1/(x^2))=-1/(x^2+1)，恰為 (arctan x)' 的相反數，所以兩者之和的導數為 0。\n在 x=1：arctan1+arctan1=(π)/2，故猜測 arctan x+arctan1/x=(π)/2（x>0）。\n（「導數為 0 則為常數」要到第 4 講用均值定理才嚴格證明。）",
      "source": "微積分 20 講 · 第 03 講隨堂測驗",
      "lecture": "03",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-03-q3",
      "examTitle": "反函數與反三角函數。",
      "answer": "-1/(1+x^2)",
      "verify": {
        "m": "fn",
        "kind": "deriv",
        "f": "\\arctan\\frac{1}{x}",
        "pts": [
          [
            0.37
          ],
          [
            0.81
          ],
          [
            1.23
          ],
          [
            1.77
          ],
          [
            2.41
          ],
          [
            3.13
          ]
        ]
      }
    },
    {
      "id": "lec-03-q3d",
      "topic": "derivatives",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{設 }\\,f(x)=x+e^x\\text{。求 }(f^{-1})'(1)\\text{。}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "inverse-function",
        "exponential",
        "lecture",
        "lecture-03",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "f(0)=1，f'(x)=1+e^x，f'(0)=2，所以 (f^(-1))'(1)=1/2。",
      "source": "微積分 20 講 · 第 03 講隨堂測驗",
      "lecture": "03",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-03-q3",
      "examTitle": "反函數與反三角函數。",
      "answer": "1/2",
      "verify": {
        "m": "inverseDeriv",
        "f": "x+e^x",
        "at": 1,
        "x0": 0
      }
    },
    {
      "id": "lec-03-q4a",
      "topic": "derivatives",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{一把長 }5\\,\\text{m}\\text{ 的梯子靠在鉛直牆上，梯腳以 }1\\,\\text{m/s}\\text{ 的速率被拉離牆壁。當梯腳離牆 }3\\,\\text{m}\\text{ 時，梯頂沿牆下滑的速率（m/s）}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "related-rates",
        "lecture",
        "lecture-03",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "x^2+y^2=25⇒2xx′+2yy′=0。x=3 時 y=4：y′=-(xx′)/y=-3/4m/s，梯頂以 0.75m/s 下滑。",
      "source": "微積分 20 講 · 第 03 講隨堂測驗",
      "lecture": "03",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-03-q4",
      "examTitle": "相關變率：滑動的梯子。",
      "answer": "3/4",
      "verify": {
        "m": "chainRate",
        "f": "-\\sqrt{25-x^2}",
        "at": 3,
        "given": 1
      }
    },
    {
      "id": "lec-03-q4b",
      "topic": "derivatives",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{一把長 }5\\,\\text{m}\\text{ 的梯子靠在鉛直牆上，梯腳以 }1\\,\\text{m/s}\\text{ 的速率被拉離牆壁。當梯腳離牆 }3\\,\\text{m}\\text{ 時，梯子與地面夾角 }\\theta\\text{ 的變化率 }\\dfrac{d\\theta}{dt}\\text{（rad/s，減少為負）}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "related-rates",
        "lecture",
        "lecture-03",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "cosθ=x/5⇒-sinθθ′=(x′)/5。sinθ=4/5：θ′=-(1/5)/(4/5)=-1/4rad/s。",
      "source": "微積分 20 講 · 第 03 講隨堂測驗",
      "lecture": "03",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-03-q4",
      "examTitle": "相關變率：滑動的梯子。",
      "answer": "-1/4",
      "verify": {
        "m": "chainRate",
        "f": "\\arccos\\frac{x}{5}",
        "at": 3,
        "given": 1
      }
    },
    {
      "id": "lec-04-m1",
      "topic": "derivatives",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "f(x)=x^3-3x\\text{ 的臨界點為}",
      "answerKind": "set",
      "timeLimit": 120,
      "tags": [
        "critical-points",
        "lecture",
        "lecture-04",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "f'(x)=3x^2-3=0⇒ x=±1。(B)(D) 是 f(x)=0 的根（零點），不是臨界點。",
      "source": "微積分 20 講 · 第 04 講隨堂測驗",
      "lecture": "04",
      "examPart": "mc",
      "answer": "{-1, 1}",
      "distractors": [
        "{0}",
        "{sqrt(3), -sqrt(3)}",
        "{0, sqrt(3), -sqrt(3)}"
      ],
      "verify": {
        "m": "critical",
        "f": "x^3-3x",
        "range": [
          -10,
          10
        ]
      }
    },
    {
      "id": "lec-04-m2",
      "topic": "derivatives",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{下列哪個函數在 }[-1,1]\\text{ 上滿足 Rolle 定理的所有條件？}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "mean-value-theorem",
        "lecture",
        "lecture-04",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "Rolle 定理要求：[-1,1] 連續、(-1,1) 可微、f(-1)=f(1)。\nx^2 全部滿足（c=0）。|x| 在 0 不可微；x^3 的 f(-1)≠ f(1)；1/x 在 0 不連續。",
      "source": "微積分 20 講 · 第 04 講隨堂測驗",
      "lecture": "04",
      "examPart": "mc",
      "answers": [
        "x²",
        "x^2"
      ],
      "canonical": "x²",
      "answer": "x²",
      "distractors": [
        "|x|",
        "x³",
        "1/x"
      ]
    },
    {
      "id": "lec-04-m3",
      "topic": "derivatives",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{關於相對極值與反曲點，下列敘述何者正確？}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "extrema",
        "concavity",
        "lecture",
        "lecture-04",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "(D) 為二階導數判別法。\n(A) 反例 f=x^4：f''(0)=0，但 f 處處凹向上。\n(B) 反例 f=x^3：f'(0)=0，但 f 遞增，沒有極值。\n(C) 反例 f=|x|：x=0 有極小，但 f'(0) 不存在。",
      "source": "微積分 20 講 · 第 04 講隨堂測驗",
      "lecture": "04",
      "examPart": "mc",
      "answers": [
        "若 f′(c)=0 且 f″(c)<0，則 f 在 c 有相對極大"
      ],
      "canonical": "若 f′(c)=0 且 f″(c)<0，則 f 在 c 有相對極大",
      "answer": "若 f′(c)=0 且 f″(c)<0，則 f 在 c 有相對極大",
      "distractors": [
        "若 f″(c)=0，則 (c, f(c)) 必為反曲點",
        "若 f′(c)=0，則 f 在 c 必有相對極值",
        "若 f 在 c 有相對極值，則必有 f′(c)=0"
      ]
    },
    {
      "id": "lec-04-m4",
      "topic": "derivatives",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\text{對 }\\,f(x)=x^2\\text{ 在 }[0,2]\\text{ 使用均值定理，保證存在的 }\\,c\\text{ 為}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "mean-value-theorem",
        "lecture",
        "lecture-04",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "平均變化率 (4-0)/(2-0)=2，f'(c)=2c=2⇒ c=1。",
      "source": "微積分 20 講 · 第 04 講隨堂測驗",
      "lecture": "04",
      "examPart": "mc",
      "answer": "1",
      "distractors": [
        "1/2",
        "sqrt(2)",
        "2"
      ],
      "verify": {
        "m": "mvtPoint",
        "f": "x^2",
        "a": 0,
        "b": 2
      }
    },
    {
      "id": "lec-04-m5",
      "topic": "derivatives",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "f(x)=xe^{-x}\\text{ 在下列哪個區間遞增？}",
      "answerKind": "interval",
      "timeLimit": 120,
      "tags": [
        "first-derivative",
        "exponential",
        "lecture",
        "lecture-04",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "f'(x)=e^(-x)-xe^(-x)=(1-x)e^(-x)。e^(-x)>0，所以 f'>0⇔ x<1。(C)(D) 都包含 x>1 的部分，那裡 f 遞減。(B) 是把 f' 的正負號看反了。",
      "source": "微積分 20 講 · 第 04 講隨堂測驗",
      "lecture": "04",
      "examPart": "mc",
      "answer": "(-inf, 1)",
      "distractors": [
        "(1, inf)",
        "(0, inf)",
        "(-1, inf)"
      ],
      "verify": {
        "m": "increasing",
        "f": "xe^{-x}",
        "range": [
          -20,
          10
        ]
      }
    },
    {
      "id": "lec-04-q1a",
      "topic": "derivatives",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{求 }\\,f(x)=x^3-3x^2-9x+5\\text{ 在 }[-2,4]\\text{ 上的絕對極大值}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "extrema",
        "lecture",
        "lecture-04",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "f'=3x^2-6x-9=3(x-3)(x+1)，臨界點 x=-1,3，都在區間內。\nf(-2)=3，f(-1)=10，f(3)=-22，f(4)=-15。\n絕對極大 10（x=-1），絕對極小 -22（x=3）。",
      "source": "微積分 20 講 · 第 04 講隨堂測驗",
      "lecture": "04",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-04-q1",
      "examTitle": "閉區間上的絕對極值。",
      "answer": "10",
      "verify": {
        "m": "extremum1d",
        "f": "x^3-3x^2-9x+5",
        "v": "x",
        "lo": -2,
        "hi": 4,
        "kind": "max"
      }
    },
    {
      "id": "lec-04-q1b",
      "topic": "derivatives",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{求 }\\,g(x)=x^{2/3}(5-x)\\text{ 在 }[-1,5]\\text{ 上的絕對極大值（注意 }\\,g'\\text{ 不存在的點）}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "extrema",
        "radical",
        "lecture",
        "lecture-04",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "g=5x^(2/3)-x^(5/3)，g'=10/3x^(-1/3)-5/3x^(2/3)=(5(2-x))/(3x^(1/3))。\n臨界點：x=2（g'=0）與 x=0（g' 不存在）。\ng(-1)=1·6=6，g(0)=0，g(2)=3√([)3]4，g(5)=0。\n因 √([)3]4<2，3√([)3]4<6。絕對極大 6（x=-1），絕對極小 0（x=0 與 x=5）。\n漏掉 x=0 仍會得到最小值 0（來自端點 5），但遺漏的臨界點在其他題目中常造成錯誤。",
      "source": "微積分 20 講 · 第 04 講隨堂測驗",
      "lecture": "04",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-04-q1",
      "examTitle": "閉區間上的絕對極值。",
      "answer": "6",
      "verify": {
        "m": "extremum1d",
        "f": "(x^2)^{1/3}(5-x)",
        "v": "x",
        "lo": -1,
        "hi": 5,
        "kind": "max"
      }
    },
    {
      "id": "lec-04-q2a",
      "topic": "derivatives",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{證明：對所有實數 }\\,a,b\\text{， }\\left|\\sin a-\\sin b\\right|\\le\\left|a-b\\right|\\text{。}",
      "answerKind": "proof",
      "timeLimit": 330,
      "tags": [
        "proof",
        "written-proof",
        "mean-value",
        "mvt",
        "lecture",
        "lecture-04",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "a=b 顯然成立。a≠ b 時，由均值定理存在 c 使 sin a-sin b=cos c(a-b)，而 |cos c|≤1，得證。",
      "source": "微積分 20 講 · 第 04 講隨堂測驗",
      "lecture": "04",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-04-q2",
      "examTitle": "均值定理與 Rolle 定理的應用。",
      "proofSpec": "pl-lec-sin-lipschitz",
      "answer": "（白話證明．機器判分）",
      "hints": [
        "一行一句，每句用一種句型開頭：任取／取／假設／則／由…／因為…所以／故。",
        "先寫出要證的東西長什麼樣，再一步一步扣回去。",
        "每一行都會被檢查：站不住的那一行會標紅。"
      ]
    },
    {
      "id": "lec-04-q2b",
      "topic": "derivatives",
      "difficulty": 4,
      "rank": 4,
      "authoredRank": 4,
      "prompt": "\\text{證明：對所有 }\\,x\\neq0\\text{， }\\,e^x>1+x\\text{。}",
      "answerKind": "proof",
      "timeLimit": 420,
      "tags": [
        "proof",
        "written-proof",
        "mean-value",
        "mvt",
        "inequality",
        "lecture",
        "lecture-04",
        "exam-style",
        "midterm-style",
        "rank-4"
      ],
      "solution": "對 e^t 在 0 與 x 之間用均值定理：e^x-1=e^cx，c 介於 0 與 x 之間。\n\nx>0：c>0⇒ e^c>1⇒ e^cx>x。\n\nx<0：c<0⇒ e^c<1，乘以負數 x 反向：e^cx>x。\n\n兩種情形都有 e^x-1>x。",
      "source": "微積分 20 講 · 第 04 講隨堂測驗",
      "lecture": "04",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-04-q2",
      "examTitle": "均值定理與 Rolle 定理的應用。",
      "proofSpec": "pl-lec-exp-cases",
      "answer": "（白話證明．機器判分）",
      "hints": [
        "一行一句，每句用一種句型開頭：任取／取／假設／則／由…／因為…所以／故。",
        "先寫出要證的東西長什麼樣，再一步一步扣回去。",
        "每一行都會被檢查：站不住的那一行會標紅。"
      ]
    },
    {
      "id": "lec-04-q3a",
      "topic": "derivatives",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\text{設 }\\,f(x)=\\dfrac{x^2}{x-1}\\text{。求垂直漸近線 }\\,x=c\\text{ 的 }\\,c",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "asymptote",
        "lecture",
        "lecture-04",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "定義域 x≠1；唯一截距 (0,0)。x→1^+：f→ +∞ ；x→1^-：f→ -∞ ，垂直漸近線 x=1。",
      "source": "微積分 20 講 · 第 04 講隨堂測驗",
      "lecture": "04",
      "examPart": "long",
      "examPoints": 25,
      "examGroup": "lec-04-q3",
      "examTitle": "曲線描繪。",
      "answer": "1"
    },
    {
      "id": "lec-04-q3b",
      "topic": "derivatives",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{設 }\\,f(x)=\\dfrac{x^2}{x-1}\\text{。求斜漸近線 }\\,y",
      "answerKind": "expression",
      "timeLimit": 120,
      "tags": [
        "asymptote",
        "lecture",
        "lecture-04",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "x^2=(x-1)(x+1)+1，f=x+1+1/(x-1)。x→ ± ∞ 時 f-(x+1)=1/(x-1)→0，斜漸近線 y=x+1。",
      "source": "微積分 20 講 · 第 04 講隨堂測驗",
      "lecture": "04",
      "examPart": "long",
      "examPoints": 25,
      "examGroup": "lec-04-q3",
      "examTitle": "曲線描繪。",
      "answer": "x+1",
      "verify": {
        "m": "fn",
        "cases": [
          {
            "at": {
              "x": 0
            },
            "d": "x",
            "v": {
              "m": "limit",
              "f": "\\frac{x^2}{(x-1)x}",
              "at": "inf"
            }
          },
          {
            "at": {
              "x": 0
            },
            "v": {
              "m": "limit",
              "f": "\\frac{x^2}{x-1}-x",
              "at": "inf"
            }
          }
        ]
      }
    },
    {
      "id": "lec-04-q3c",
      "topic": "derivatives",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{設 }\\,f(x)=\\dfrac{x^2}{x-1}\\text{。求 }\\,f\\text{ 的遞減區間（寫成區間，多段用 U）}",
      "answerKind": "interval",
      "timeLimit": 120,
      "tags": [
        "first-derivative",
        "curve-sketching",
        "lecture",
        "lecture-04",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "f'=1-1/((x-1)^2)=(x(x-2))/((x-1)^2)。\n遞增：(-∞ ,0)、(2,∞ )；遞減：(0,1)、(1,2)。\n相對極大 f(0)=0，相對極小 f(2)=4。",
      "source": "微積分 20 講 · 第 04 講隨堂測驗",
      "lecture": "04",
      "examPart": "long",
      "examPoints": 25,
      "examGroup": "lec-04-q3",
      "examTitle": "曲線描繪。",
      "answer": "(0, 1) U (1, 2)"
    },
    {
      "id": "lec-04-q3d",
      "topic": "derivatives",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{設 }\\,f(x)=\\dfrac{x^2}{x-1}\\text{。求 }\\,f\\text{ 凹向上的區間}",
      "answerKind": "interval",
      "timeLimit": 120,
      "tags": [
        "concavity",
        "lecture",
        "lecture-04",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "f''=2/((x-1)^3)：x<1 凹向下，x>1 凹向上。凹性改變的地方 x=1 不在定義域內，故無反曲點。",
      "source": "微積分 20 講 · 第 04 講隨堂測驗",
      "lecture": "04",
      "examPart": "long",
      "examPoints": 25,
      "examGroup": "lec-04-q3",
      "examTitle": "曲線描繪。",
      "answer": "(1, inf)",
      "verify": {
        "m": "concaveUp",
        "f": "\\frac{x^2}{x-1}",
        "range": [
          -20,
          40
        ]
      }
    },
    {
      "id": "lec-04-q4a",
      "topic": "derivatives",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{某函數 }\\,f\\text{ 的導函數為 }\\,f'(x)=(x+2)(x-1)^2\\text{。求 }\\,f\\text{ 相對極小值點的 }\\,x\\text{ 座標}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "derivative-graph",
        "extrema",
        "lecture",
        "lecture-04",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "f'<0：x<-2，遞減；f'>0：x>-2（x=1 除外，該點 f'=0），遞增。\nx=-2 處 f' 由負變正，相對極小。",
      "source": "微積分 20 講 · 第 04 講隨堂測驗",
      "lecture": "04",
      "examPart": "long",
      "examPoints": 15,
      "examGroup": "lec-04-q4",
      "examTitle": "由導函數的圖形讀出函數的性質。",
      "answer": "-2"
    },
    {
      "id": "lec-04-q4b",
      "topic": "derivatives",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{某函數 }\\,f\\text{ 的導函數為 }\\,f'(x)=(x+2)(x-1)^2\\text{。 }\\,x=1\\text{ 是不是 }\\,f\\text{ 的相對極值點？（填「是」或「不是」）}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "derivative-graph",
        "extrema",
        "lecture",
        "lecture-04",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "不是。f' 在 x=1 兩側都為正，不變號，f 持續遞增，x=1 只是水平切線的點。",
      "source": "微積分 20 講 · 第 04 講隨堂測驗",
      "lecture": "04",
      "examPart": "long",
      "examPoints": 15,
      "examGroup": "lec-04-q4",
      "examTitle": "由導函數的圖形讀出函數的性質。",
      "answers": [
        "不是",
        "否",
        "no"
      ],
      "canonical": "不是",
      "answer": "不是",
      "distractors": [
        "是，相對極大",
        "是，相對極小"
      ]
    },
    {
      "id": "lec-04-q4c",
      "topic": "derivatives",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{某函數 }\\,f\\text{ 的導函數為 }\\,f'(x)=(x+2)(x-1)^2\\text{。求 }\\,f\\text{ 所有反曲點的 }\\,x\\text{ 座標（寫成集合）}",
      "answerKind": "set",
      "timeLimit": 120,
      "tags": [
        "concavity",
        "inflection",
        "lecture",
        "lecture-04",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "f 凹向上 ⇔ f' 遞增。由圖，f' 在 x<-1 與 x>1 遞增，在 (-1,1) 遞減。\n驗證：f''=(x-1)^2+2(x+2)(x-1)=3(x-1)(x+1)。\n凹向上：(-∞ ,-1)、(1,∞ )；凹向下：(-1,1)；反曲點 x=-1 與 x=1。",
      "source": "微積分 20 講 · 第 04 講隨堂測驗",
      "lecture": "04",
      "examPart": "long",
      "examPoints": 15,
      "examGroup": "lec-04-q4",
      "examTitle": "由導函數的圖形讀出函數的性質。",
      "answer": "{-1, 1}",
      "verify": {
        "m": "critical",
        "f": "(x+2)(x-1)^2",
        "range": [
          -10,
          10
        ]
      }
    },
    {
      "id": "lec-05-m2",
      "topic": "limits",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\lim_{x\\to\\infty}xe^{-x}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "lhopital",
        "exponential-limit",
        "lecture",
        "lecture-05",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "改寫成 x/(e^x)（(∞)/(∞) ），L'Hôpital：lim1/(e^x)=0。指數函數成長得比任何多項式都快。",
      "source": "微積分 20 講 · 第 05 講隨堂測驗",
      "lecture": "05",
      "examPart": "mc",
      "answer": "0",
      "distractors": [
        "1",
        "inf",
        "DNE"
      ]
    },
    {
      "id": "lec-05-m3",
      "topic": "derivatives",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\text{用 }\\,f(x)=\\sqrt x\\text{ 在 }\\,x=4\\text{ 的線性近似估計 }\\sqrt{4.1}\\text{，結果為}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "linear-approximation",
        "lecture",
        "lecture-05",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "f(4)=2，f'(4)=1/(2√(4))=1/4。√(4.1)≈2+1/4(0.1)=2.025（真值 2.0248…）。",
      "source": "微積分 20 講 · 第 05 講隨堂測驗",
      "lecture": "05",
      "examPart": "mc",
      "answer": "2.025",
      "distractors": [
        "2.01",
        "2.02",
        "2.05"
      ],
      "verify": {
        "m": "linApprox",
        "f": "\\sqrt{x}",
        "a": 4,
        "dx": 0.1
      }
    },
    {
      "id": "lec-05-m5",
      "topic": "derivatives",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\text{以 Newton 法解 }\\,x^2-2=0\\text{，取 }\\,x_1=1\\text{，則 }\\,x_2",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "newton-method",
        "lecture",
        "lecture-05",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "x_2=1-(1^2-2)/(2·1)=1+1/2=1.5。",
      "source": "微積分 20 講 · 第 05 講隨堂測驗",
      "lecture": "05",
      "examPart": "mc",
      "answer": "3/2",
      "distractors": [
        "5/4",
        "1.414",
        "2"
      ],
      "verify": {
        "m": "root",
        "f": "x^2-2",
        "x0": 1,
        "n": 1
      }
    },
    {
      "id": "lec-05-q1b",
      "topic": "limits",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\lim_{x\\to\\infty}\\frac{\\ln x}{\\sqrt x}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "lhopital",
        "log",
        "lecture",
        "lecture-05",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "(1/x)/(1/(2√(x)))=2/(√(x))→0。",
      "source": "微積分 20 講 · 第 05 講隨堂測驗",
      "lecture": "05",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-05-q1",
      "examTitle": "L'Hôpital 法則與不定型。",
      "answer": "0",
      "verify": {
        "m": "limit",
        "f": "\\frac{\\ln x}{\\sqrt{x}}",
        "at": "inf"
      }
    },
    {
      "id": "lec-05-q1d",
      "topic": "limits",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\lim_{x\\to\\infty}\\Bigl(1+\\frac{3}{x}\\Bigr)^x",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "exponential-limit",
        "lecture",
        "lecture-05",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "1^∞ 型：ln y=xln(1+3/x)=(ln(1+3/x))/(1/x)，\nL'Hôpital：(1/(1+3/x)· (-3/x^2))/(-1/x^2)=3/(1+3/x)→3，故 y→ e^3。",
      "source": "微積分 20 講 · 第 05 講隨堂測驗",
      "lecture": "05",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-05-q1",
      "examTitle": "L'Hôpital 法則與不定型。",
      "answer": "exp(3)"
    },
    {
      "id": "lec-05-q1e",
      "topic": "limits",
      "difficulty": 4,
      "rank": 4,
      "authoredRank": 4,
      "prompt": "\\lim_{x\\to0}\\Bigl(\\frac{1}{x}-\\frac1{\\sin x}\\Bigr)",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "lhopital",
        "limit-trap",
        "lecture",
        "lecture-05",
        "exam-style",
        "midterm-style",
        "rank-4"
      ],
      "solution": "∞ -∞ 型，通分：(sin x-x)/(xsin x)（0/0）\n→ (cos x-1)/(sin x+xcos x)（0/0）→ (-sin x)/(2cos x-xsin x)→ 0/2=0。",
      "source": "微積分 20 講 · 第 05 講隨堂測驗",
      "lecture": "05",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-05-q1",
      "examTitle": "L'Hôpital 法則與不定型。",
      "answer": "0"
    },
    {
      "id": "lec-05-q2a",
      "topic": "derivatives",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\text{用一張邊長 }12\\,\\text{cm}\\text{ 的正方形紙板，在四角各剪去邊長 }\\,x\\text{ 的小正方形，再把四邊摺起來做成無蓋盒子。寫出盒子體積 }\\,V(x)",
      "answerKind": "expression",
      "timeLimit": 120,
      "tags": [
        "optimization",
        "lecture",
        "lecture-05",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "底為 (12-2x)× (12-2x)，高 x：V=x(12-2x)^2，0≤ x≤6。",
      "source": "微積分 20 講 · 第 05 講隨堂測驗",
      "lecture": "05",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-05-q2",
      "examTitle": "無蓋紙盒。",
      "answer": "x*(12-2*x)^2"
    },
    {
      "id": "lec-05-q2b",
      "topic": "derivatives",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{用一張邊長 }12\\,\\text{cm}\\text{ 的正方形紙板，在四角各剪去邊長 }\\,x\\text{ 的小正方形，再把四邊摺起來做成無蓋盒子。求最大體積（}\\text{cm}^3\\text{）}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "optimization",
        "lecture",
        "lecture-05",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "V'=(12-2x)^2+x·2(12-2x)(-2)=(12-2x)(12-6x)=12(x-6)(x-2)。\n(0,6) 內的臨界點為 x=2，V(2)=2·8^2=128cm^3。",
      "source": "微積分 20 講 · 第 05 講隨堂測驗",
      "lecture": "05",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-05-q2",
      "examTitle": "無蓋紙盒。",
      "answer": "128",
      "verify": {
        "m": "extremum1d",
        "f": "x(12-2x)^2",
        "v": "x",
        "lo": 0,
        "hi": 6,
        "kind": "max"
      }
    },
    {
      "id": "lec-05-q3b",
      "topic": "derivatives",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{令 }\\,D(x)\\text{ 為拋物線 }\\,y=x^2\\text{ 上的點 }(x,x^2)\\text{ 到 }(0,3)\\text{ 的距離平方。求 }\\,D\\text{ 的所有臨界點（寫成集合）}",
      "answerKind": "set",
      "timeLimit": 120,
      "tags": [
        "optimization",
        "critical-points",
        "lecture",
        "lecture-05",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "D'=2x+4x(x^2-3)=2x(2x^2-5)，臨界點 x=0, ± √(5/2)。\nD''=12x^2-10：D''(0)=-10<0，相對極大；D''(± √(5/2))=20>0，相對極小。",
      "source": "微積分 20 講 · 第 05 講隨堂測驗",
      "lecture": "05",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-05-q3",
      "examTitle": "拋物線上最近的點。",
      "answer": "{0, sqrt(5/2), -sqrt(5/2)}",
      "verify": {
        "m": "critical",
        "f": "x^2+(x^2-3)^2",
        "range": [
          -10,
          10
        ]
      }
    },
    {
      "id": "lec-05-q3c",
      "topic": "derivatives",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{求拋物線 }\\,y=x^2\\text{ 上的點到 }(0,3)\\text{ 的最短距離}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "optimization",
        "lecture",
        "lecture-05",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "D(± √(5/2))=5/2+(5/2-3)^2=11/4，D(0)=9。\n最近點 (± √(5/2),5/2)，最短距離 (√(11))/2。",
      "source": "微積分 20 講 · 第 05 講隨堂測驗",
      "lecture": "05",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-05-q3",
      "examTitle": "拋物線上最近的點。",
      "answer": "sqrt(11)/2",
      "verify": {
        "m": "extremum1d",
        "f": "\\sqrt{x^2+(x^2-3)^2}",
        "v": "x",
        "lo": -5,
        "hi": 5,
        "kind": "min"
      }
    },
    {
      "id": "lec-05-q3d",
      "topic": "derivatives",
      "difficulty": 4,
      "rank": 5,
      "authoredRank": 5,
      "prompt": "\\text{考慮拋物線 }\\,y=x^2\\text{ 上與點 }(0,a)\\text{ 最近的點。當 }\\,a\\le a_0\\text{ 時最近點就是原點，求臨界值 }\\,a_0",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "optimization",
        "lecture",
        "lecture-05",
        "exam-style",
        "midterm-style",
        "rank-5",
        "boss-rank"
      ],
      "solution": "D=x^2+(x^2-a)^2，D'=2x(2x^2+1-2a)。若 a≤ 1/2，2x^2+1-2a>0（x≠0），唯一臨界點 x=0，且 D 在 x<0 遞減、x>0 遞增，最近點為原點。\na>1/2 時會出現 x=± √(a-1/2) 兩個更近的點。",
      "source": "微積分 20 講 · 第 05 講隨堂測驗",
      "lecture": "05",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-05-q3",
      "examTitle": "拋物線上最近的點。",
      "answer": "1/2"
    },
    {
      "id": "lec-05-q4a",
      "topic": "derivatives",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{用 }\\,f(x)=\\sqrt[3]{x}\\text{ 在 }\\,x=8\\text{ 的線性近似估計 }\\sqrt[3]{8.06}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "linear-approximation",
        "lecture",
        "lecture-05",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "f'(x)=1/3x^(-2/3)，f'(8)=1/12。L(x)=2+(x-8)/12，(8.06)^(1/3)≈2+0.06/12=2.005。",
      "source": "微積分 20 講 · 第 05 講隨堂測驗",
      "lecture": "05",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-05-q4",
      "examTitle": "線性近似、微分與 Newton 法。",
      "answer": "2.005",
      "verify": {
        "m": "linApprox",
        "f": "x^{1/3}",
        "a": 8,
        "dx": 0.06
      }
    },
    {
      "id": "lec-05-q4b",
      "topic": "derivatives",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{量得球的半徑為 }10\\,\\text{cm}\\text{，最大誤差 }0.05\\,\\text{cm}\\text{。用微分估計體積計算的最大誤差（}\\text{cm}^3\\text{）}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "linear-approximation",
        "lecture",
        "lecture-05",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "V=4/3π r^3，dV=4π r^2dr=4π(100)(0.05)=20π≈63cm^3。\n相對誤差 dV/V=3dr/r=3(0.005)=1.5%。",
      "source": "微積分 20 講 · 第 05 講隨堂測驗",
      "lecture": "05",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-05-q4",
      "examTitle": "線性近似、微分與 Newton 法。",
      "answer": "20*pi",
      "verify": {
        "m": "differential",
        "f": "\\frac{4}{3}\\pi x^3",
        "a": 10,
        "dx": 0.05
      }
    },
    {
      "id": "lec-05-q4c",
      "topic": "derivatives",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{用 Newton 法求 }\\sqrt5\\text{：取 }\\,f(x)=x^2-5\\text{、 }\\,x_1=2\\text{，求 }\\,x_3\\text{（用分數表示）}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "newton-method",
        "lecture",
        "lecture-05",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "x_(n+1)=x_n-(x_n^2-5)/2x_n=1/2(x_n+5/x_n)。\nx_2=1/2(2+5/2)=9/4=2.25；\nx_3=1/2(9/4+20/9)=161/72≈2.23611（真值 2.23607，兩步就準確到 10^(-4)）。",
      "source": "微積分 20 講 · 第 05 講隨堂測驗",
      "lecture": "05",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-05-q4",
      "examTitle": "線性近似、微分與 Newton 法。",
      "answer": "161/72",
      "verify": {
        "m": "root",
        "f": "x^2-5",
        "x0": 2,
        "n": 2
      }
    },
    {
      "id": "lec-06-m1",
      "topic": "integrals",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\frac{d}{dx}\\int_0^{x^2}\\cos t\\,dt",
      "answerKind": "expression",
      "timeLimit": 120,
      "tags": [
        "ftc",
        "chain-rule",
        "lecture",
        "lecture-06",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "令 G(u)=∫_0^ucos td t，則 G'(u)=cos u。由連鎖律 d/(d x)G(x^2)=cos(x^2)·2x。\n(A) 忘了乘上限的導數 2x，是最常見的錯誤。",
      "source": "微積分 20 講 · 第 06 講隨堂測驗",
      "lecture": "06",
      "examPart": "mc",
      "answer": "2*x*cos(x^2)",
      "distractors": [
        "cos(x^2)",
        "cos(x)",
        "sin(x^2)"
      ]
    },
    {
      "id": "lec-06-m2",
      "topic": "integrals",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\int_0^2(3x^2-2x)\\,dx",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "definite-integral",
        "ftc",
        "lecture",
        "lecture-06",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "[x^3-x^2]_0^2=8-4=4。",
      "source": "微積分 20 講 · 第 06 講隨堂測驗",
      "lecture": "06",
      "examPart": "mc",
      "answer": "4",
      "distractors": [
        "2",
        "8",
        "12"
      ]
    },
    {
      "id": "lec-06-m3",
      "topic": "integrals",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\int_{-1}^{1}x^3\\cos x\\,dx",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "definite-integral",
        "symmetry",
        "ftc",
        "lecture",
        "lecture-06",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "f(x)=x^3cos x 滿足 f(-x)=-f(x)，是奇函數，在對稱區間 [-1,1] 上的積分為 0。不需要真的求出反導數。",
      "source": "微積分 20 講 · 第 06 講隨堂測驗",
      "lecture": "06",
      "examPart": "mc",
      "answer": "0",
      "distractors": [
        "2*cos(1)",
        "1",
        "-1"
      ]
    },
    {
      "id": "lec-06-m4",
      "topic": "integrals",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\int\\frac{x}{x^2+1}\\,dx",
      "answerKind": "antiderivative",
      "timeLimit": 150,
      "tags": [
        "substitution",
        "lecture",
        "lecture-06",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "令 u=x^2+1，d u=2x dx：\\intx/(x^2+1) dx=1/2∫(d u)/u=1/2ln(x^2+1)+C。\n(A) 少了 1/2；(C) 是 ∫1/(x^2+1) dx。",
      "source": "微積分 20 講 · 第 06 講隨堂測驗",
      "lecture": "06",
      "examPart": "mc",
      "answer": "ln(x^2+1)/2",
      "distractors": [
        "ln(x^2+1)",
        "x^2/2*ln(x^2+1)",
        "atan(x)"
      ]
    },
    {
      "id": "lec-06-m5",
      "topic": "integrals",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\lim_{n\\to\\infty}\\sum_{i=1}^n\\frac{1}{n}\\Bigl(1+\\frac{i}{n}\\Bigr)^2",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "riemann-sum",
        "lecture",
        "lecture-06",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "這是 f(x)=x^2 在 [1,2] 上、Δ x=1/n、取右端點 x_i=1+i/n 的 Riemann 和，\n極限為 ∫_1^2x^2 dx=(8-1)/3=7/3。\n若誤認為 [0,1] 上 ∫_0^1x^2 dx 則會選 (A)。",
      "source": "微積分 20 講 · 第 06 講隨堂測驗",
      "lecture": "06",
      "examPart": "mc",
      "answer": "7/3",
      "distractors": [
        "1/3",
        "8/3",
        "inf"
      ]
    },
    {
      "id": "lec-06-q1a",
      "topic": "integrals",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{考慮 }\\int_0^2x^2\\,dx\\text{。將 }[0,2]\\text{ 分成 }\\,n\\text{ 等分並取右端點，計算 }\\,n=4\\text{ 時的 Riemann 和 }\\,R_4",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "riemann-sum",
        "lecture",
        "lecture-06",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "Δ x=1/2，R_4=1/2(0.5^2+1^2+1.5^2+2^2)=1/2(7.5)=15/4。",
      "source": "微積分 20 講 · 第 06 講隨堂測驗",
      "lecture": "06",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-06-q1",
      "examTitle": "用 Riemann 和定義計算積分。",
      "answer": "15/4",
      "verify": {
        "m": "riemannRule",
        "f": "x^2",
        "a": 0,
        "b": 2,
        "n": 4,
        "rule": "right"
      }
    },
    {
      "id": "lec-06-q1b",
      "topic": "integrals",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{考慮 }\\int_0^2x^2\\,dx\\text{。將 }[0,2]\\text{ 分成 }\\,n\\text{ 等分並取右端點，求一般 }\\,n\\text{ 的 Riemann 和 }\\,R_n\\text{（化成 }\\,n\\text{ 的有理式）}",
      "answerKind": "expression",
      "timeLimit": 120,
      "tags": [
        "riemann-sum",
        "lecture",
        "lecture-06",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "Δ x=2/n，x_i=2i/n：\nR_n=Σ_(i=1)^n2/n(2i/n)^2=8/(n^3)· (n(n+1)(2n+1))/6；=(4(n+1)(2n+1))/(3n^2)=8/3+4/n+4/(3n^2).\n（檢查：n=4 時 (4·5·9)/48=15/4，與 (a) 相符。）",
      "source": "微積分 20 講 · 第 06 講隨堂測驗",
      "lecture": "06",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-06-q1",
      "examTitle": "用 Riemann 和定義計算積分。",
      "answer": "4*(n+1)*(2*n+1)/(3*n^2)",
      "variable": "n",
      "verify": {
        "m": "fn",
        "vars": [
          "n"
        ],
        "cases": [
          {
            "at": {
              "n": 4
            },
            "v": {
              "m": "riemannRule",
              "f": "x^2",
              "a": 0,
              "b": 2,
              "n": 4,
              "rule": "right"
            }
          },
          {
            "at": {
              "n": 7
            },
            "v": {
              "m": "riemannRule",
              "f": "x^2",
              "a": 0,
              "b": 2,
              "n": 7,
              "rule": "right"
            }
          },
          {
            "at": {
              "n": 13
            },
            "v": {
              "m": "riemannRule",
              "f": "x^2",
              "a": 0,
              "b": 2,
              "n": 13,
              "rule": "right"
            }
          }
        ]
      }
    },
    {
      "id": "lec-06-q1c",
      "topic": "integrals",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\text{考慮 }\\int_0^2x^2\\,dx\\text{。將 }[0,2]\\text{ 分成 }\\,n\\text{ 等分並取右端點得 Riemann 和 }\\,R_n\\text{，求 }\\lim_{n\\to\\infty}R_n",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "riemann-sum",
        "definite-integral",
        "lecture",
        "lecture-06",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "lim R_n=8/3。",
      "source": "微積分 20 講 · 第 06 講隨堂測驗",
      "lecture": "06",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-06-q1",
      "examTitle": "用 Riemann 和定義計算積分。",
      "answer": "8/3",
      "verify": {
        "m": "integral",
        "f": "x^2",
        "a": 0,
        "b": 2
      }
    },
    {
      "id": "lec-06-q2a",
      "topic": "integrals",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{設 }\\,F(x)=\\int_1^x\\sqrt{1+t^3}\\,dt\\text{，求 }\\,F'(2)",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "ftc",
        "lecture",
        "lecture-06",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "F(1)=∫_1^1(… )=0；由 FTC，F'(x)=√(1+x^3)，F'(2)=√(9)=3。\n（√(1+t^3) 沒有初等反導數，但求 F' 完全不需要反導數。）",
      "source": "微積分 20 講 · 第 06 講隨堂測驗",
      "lecture": "06",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-06-q2",
      "examTitle": "微積分基本定理第一部分。",
      "answer": "3",
      "verify": {
        "m": "ftcDeriv",
        "g": "\\sqrt{1+t^3}",
        "lo": 1,
        "hi": "x",
        "at": 2
      }
    },
    {
      "id": "lec-06-q2b",
      "topic": "integrals",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{求 }\\frac{d}{dx}\\int_x^{x^2}\\frac{\\sin t}{t}\\,dt\\text{ （}\\,x>0\\text{）。}",
      "answerKind": "expression",
      "timeLimit": 120,
      "tags": [
        "ftc",
        "chain-rule",
        "lecture",
        "lecture-06",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "拆成 ∫_0^(x^2)-∫_0^x（下限 0 處被積函數可補定義為 1 而連續）：\n (sin(x^2))/(x^2)·2x-(sin x)/x=(2sin(x^2)-sin x)/x.",
      "source": "微積分 20 講 · 第 06 講隨堂測驗",
      "lecture": "06",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-06-q2",
      "examTitle": "微積分基本定理第一部分。",
      "answer": "(2*sin(x^2)-sin(x))/x",
      "verify": {
        "m": "fn",
        "cases": [
          {
            "at": {
              "x": 0.7
            },
            "v": {
              "m": "ftcDeriv",
              "g": "\\frac{\\sin t}{t}",
              "lo": "x",
              "hi": "x^2",
              "at": 0.7
            }
          },
          {
            "at": {
              "x": 1.3
            },
            "v": {
              "m": "ftcDeriv",
              "g": "\\frac{\\sin t}{t}",
              "lo": "x",
              "hi": "x^2",
              "at": 1.3
            }
          },
          {
            "at": {
              "x": 2.1
            },
            "v": {
              "m": "ftcDeriv",
              "g": "\\frac{\\sin t}{t}",
              "lo": "x",
              "hi": "x^2",
              "at": 2.1
            }
          }
        ]
      }
    },
    {
      "id": "lec-06-q2c",
      "topic": "integrals",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{設 }\\,f\\text{ 連續且對所有 }\\,x\\text{ 都有 }\\int_0^xf(t)\\,dt=x\\sin x\\text{，求 }\\,f\\bigl(\\tfrac\\pi2\\bigr)",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "ftc",
        "lecture",
        "lecture-06",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "兩邊對 x 微分：f(x)=sin x+xcos x，f((π)/2)=1+0=1。",
      "source": "微積分 20 講 · 第 06 講隨堂測驗",
      "lecture": "06",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-06-q2",
      "examTitle": "微積分基本定理第一部分。",
      "answer": "1",
      "verify": {
        "m": "deriv",
        "f": "x\\sin x",
        "at": [
          "\\pi/2"
        ]
      }
    },
    {
      "id": "lec-06-q2d",
      "topic": "integrals",
      "difficulty": 4,
      "rank": 4,
      "authoredRank": 4,
      "prompt": "\\text{求 }\\lim_{x\\to0}\\frac1{x^3}\\int_0^x\\sin(t^2)\\,dt\\text{。}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "ftc",
        "lhopital",
        "lecture",
        "lecture-06",
        "exam-style",
        "midterm-style",
        "rank-4"
      ],
      "solution": "分子分母都趨近 0，用 L'Hôpital 法則，分子的導數由 FTC 得到：\n lim_(x→0)(sin(x^2))/(3x^2)=1/3.",
      "source": "微積分 20 講 · 第 06 講隨堂測驗",
      "lecture": "06",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-06-q2",
      "examTitle": "微積分基本定理第一部分。",
      "answer": "1/3",
      "verify": {
        "m": "limit",
        "f": "\\frac{1}{x^3}\\int_0^x\\sin(t^2)\\,dt",
        "at": 0
      }
    },
    {
      "id": "lec-06-q3a",
      "topic": "integrals",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\int x\\sqrt{x^2+1}\\,dx",
      "answerKind": "antiderivative",
      "timeLimit": 150,
      "tags": [
        "substitution",
        "lecture",
        "lecture-06",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "u=x^2+1，d u=2x dx：1/2∫ u^(1/2)d u=1/3(x^2+1)^(3/2)+C。",
      "source": "微積分 20 講 · 第 06 講隨堂測驗",
      "lecture": "06",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-06-q3",
      "examTitle": "代換法。",
      "answer": "(x^2+1)^(3/2)/3"
    },
    {
      "id": "lec-06-q3c",
      "topic": "integrals",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\int_1^{e}\\frac{(\\ln x)^2}{x}\\,dx",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "substitution",
        "log",
        "lecture",
        "lecture-06",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "u=ln x，d u=(d x)/x，u:0→1：∫_0^1u^2d u=1/3。",
      "source": "微積分 20 講 · 第 06 講隨堂測驗",
      "lecture": "06",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-06-q3",
      "examTitle": "代換法。",
      "answer": "1/3"
    },
    {
      "id": "lec-06-q3d",
      "topic": "integrals",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\int_0^4\\frac{x}{\\sqrt{2x+1}}\\,dx",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "substitution",
        "radical",
        "lecture",
        "lecture-06",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "u=2x+1，x=(u-1)/2，d x=(d u)/2，u:1→9：\n∫_1^9((u-1)/2)/(√(u))· (d u)/2=1/4∫_1^9(u^(1/2)-u^(-1/2))d u；\n=1/4[2/3u^(3/2)-2u^(1/2)]_1^9=1/4(12+4/3)=10/3.\n換元後要換積分上下限，就不必再換回 x。",
      "source": "微積分 20 講 · 第 06 講隨堂測驗",
      "lecture": "06",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-06-q3",
      "examTitle": "代換法。",
      "answer": "10/3"
    },
    {
      "id": "lec-06-q4a",
      "topic": "integrals",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{一質點沿直線運動，速度為 }\\,v(t)=t^2-2t-3\\text{ （m/s）， }0\\le t\\le5\\text{。求這段期間的位移（m）}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "definite-integral",
        "kinematics",
        "lecture",
        "lecture-06",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "位移 =∫_0^5vd t=[(t^3)/3-t^2-3t]_0^5=125/3-40=5/3 m。",
      "source": "微積分 20 講 · 第 06 講隨堂測驗",
      "lecture": "06",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-06-q4",
      "examTitle": "淨變化與總路程。",
      "answer": "5/3",
      "verify": {
        "m": "integral",
        "f": "x^2-2x-3",
        "a": 0,
        "b": 5
      }
    },
    {
      "id": "lec-06-q4b",
      "topic": "integrals",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{一質點沿直線運動，速度為 }\\,v(t)=t^2-2t-3\\text{ （m/s）， }0\\le t\\le5\\text{。求這段期間走過的總路程（m）}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "definite-integral",
        "kinematics",
        "lecture",
        "lecture-06",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "v=(t-3)(t+1)，在 [0,3) 為負、(3,5] 為正。\n∫_0^3vd t=9-9-9=-9，∫_3^5vd t=5/3-(-9)=32/3。\n總路程 =9+32/3=59/3 m。位移是有號面積的和，路程要取 |v|。",
      "source": "微積分 20 講 · 第 06 講隨堂測驗",
      "lecture": "06",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-06-q4",
      "examTitle": "淨變化與總路程。",
      "answer": "59/3",
      "verify": {
        "m": "integral",
        "f": "|x^2-2x-3|",
        "a": 0,
        "b": 5,
        "breaks": [
          3
        ]
      }
    },
    {
      "id": "lec-06-q4c",
      "topic": "integrals",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\text{一質點沿直線運動，速度為 }\\,v(t)=t^2-2t-3\\text{ （m/s）， }0\\le t\\le5\\text{。求這段期間的平均速度（m/s）}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "definite-integral",
        "kinematics",
        "lecture",
        "lecture-06",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "平均速度 =(位移)/5=1/3 m/s。",
      "source": "微積分 20 講 · 第 06 講隨堂測驗",
      "lecture": "06",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-06-q4",
      "examTitle": "淨變化與總路程。",
      "answer": "1/3",
      "verify": {
        "m": "integral",
        "f": "\\frac{x^2-2x-3}{5}",
        "a": 0,
        "b": 5
      }
    },
    {
      "id": "lec-07-m1",
      "topic": "integrals",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\int xe^x\\,dx",
      "answerKind": "antiderivative",
      "timeLimit": 150,
      "tags": [
        "integration-by-parts",
        "lecture",
        "lecture-07",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "取 u=x，d v=e^x dx：xe^x-∫ e^x dx=(x-1)e^x+C。\n驗證：d/(d x)(x-1)e^x=e^x+(x-1)e^x=xe^x。(A) 是把兩個因子分開積分的錯誤。",
      "source": "微積分 20 講 · 第 07 講隨堂測驗",
      "lecture": "07",
      "examPart": "mc",
      "answer": "(x-1)*exp(x)",
      "distractors": [
        "x^2*exp(x)/2",
        "(x+1)*exp(x)",
        "x*exp(x)"
      ]
    },
    {
      "id": "lec-07-m3",
      "topic": "integrals",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\text{計算 }\\int\\frac{dx}{\\sqrt{4-x^2}}\\text{ 時，最適當的代換是}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "trig-substitution",
        "technique-recognition",
        "lecture",
        "lecture-07",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "√(a^2-x^2) 用 x=asinθ，因為 a^2-a^2sin^2θ=a^2cos^2θ。\n√(a^2+x^2) 用 tan，√(x^2-a^2) 用 sec。(D) 在分子沒有 x 時行不通。",
      "source": "微積分 20 講 · 第 07 講隨堂測驗",
      "lecture": "07",
      "examPart": "mc",
      "answers": [
        "x=2sinθ",
        "x=2sin(θ)",
        "x=2 sin theta",
        "2sinθ"
      ],
      "canonical": "x=2sinθ",
      "answer": "x=2sinθ",
      "distractors": [
        "x=2tanθ",
        "x=2secθ",
        "u=4−x²"
      ]
    },
    {
      "id": "lec-07-m4",
      "topic": "integrals",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\int_0^{\\pi}\\sin^2x\\,dx",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "trig-power",
        "lecture",
        "lecture-07",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "∫_0^π(1-cos2x)/2 dx=[x/2-sin2x/4]_0^π=(π)/2。\n直觀上 sin^2 與 cos^2 在 [0,π] 上積分相等且和為 π。",
      "source": "微積分 20 講 · 第 07 講隨堂測驗",
      "lecture": "07",
      "examPart": "mc",
      "answer": "pi/2",
      "distractors": [
        "0",
        "1",
        "pi"
      ]
    },
    {
      "id": "lec-07-m5",
      "topic": "integrals",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\int\\tan x\\,dx",
      "answerKind": "antiderivative",
      "timeLimit": 150,
      "tags": [
        "substitution",
        "trig",
        "lecture",
        "lecture-07",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "∫(sin x)/(cos x) dx，令 u=cos x：-ln|cos x|+C=ln|sec x|+C。\n(C) 差一個負號；(A) 是 tan x 的導數。",
      "source": "微積分 20 講 · 第 07 講隨堂測驗",
      "lecture": "07",
      "examPart": "mc",
      "answer": "-ln(cos(x))",
      "distractors": [
        "sec(x)^2",
        "ln(cos(x))",
        "tan(x)^2/2"
      ]
    },
    {
      "id": "lec-07-q1c",
      "topic": "integrals",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\int_0^1\\arctan x\\,dx",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "integration-by-parts",
        "inverse-trig",
        "lecture",
        "lecture-07",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "u=arctan x，d v=d x：[xarctan x]_0^1-∫_0^1x/(1+x^2) dx=(π)/4-1/2ln2。",
      "source": "微積分 20 講 · 第 07 講隨堂測驗",
      "lecture": "07",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-07-q1",
      "examTitle": "分部積分。",
      "answer": "pi/4-ln(2)/2"
    },
    {
      "id": "lec-07-q1d",
      "topic": "integrals",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\int_1^ex\\ln x\\,dx",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "integration-by-parts",
        "log",
        "lecture",
        "lecture-07",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "u=ln x，d v=x dx：[(x^2)/2ln x]_1^e-∫_1^ex/2 dx=(e^2)/2-(e^2-1)/4=(e^2+1)/4。",
      "source": "微積分 20 講 · 第 07 講隨堂測驗",
      "lecture": "07",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-07-q1",
      "examTitle": "分部積分。",
      "answer": "(exp(2)+1)/4"
    },
    {
      "id": "lec-07-q2a",
      "topic": "integrals",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\text{令 }\\,I_n=\\int_0^{\\pi/2}\\sin^nx\\,dx\\text{ （}\\,n\\ge0\\text{ 整數）。求 }\\,I_0",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "wallis",
        "lecture",
        "lecture-07",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "I_0=(π)/2，I_1=[-cos x]_0^(π/2)=1。",
      "source": "微積分 20 講 · 第 07 講隨堂測驗",
      "lecture": "07",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-07-q2",
      "examTitle": "遞迴公式。",
      "answer": "pi/2",
      "verify": {
        "m": "integral",
        "f": "(\\sin x)^0",
        "a": 0,
        "b": "\\pi/2"
      }
    },
    {
      "id": "lec-07-q2c",
      "topic": "integrals",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{令 }\\,I_n=\\int_0^{\\pi/2}\\sin^nx\\,dx\\text{。已知 }\\,I_n=\\dfrac{n-1}{n}I_{n-2}\\text{，求 }\\,I_5",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "wallis",
        "lecture",
        "lecture-07",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "I_2=1/2· (π)/2=(π)/4，I_4=3/4· (π)/4=(3π)/16；\nI_3=2/3，I_5=4/5· 2/3=8/15。",
      "source": "微積分 20 講 · 第 07 講隨堂測驗",
      "lecture": "07",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-07-q2",
      "examTitle": "遞迴公式。",
      "answer": "8/15",
      "verify": {
        "m": "integral",
        "f": "(\\sin x)^5",
        "a": 0,
        "b": "\\pi/2"
      }
    },
    {
      "id": "lec-07-q3a",
      "topic": "integrals",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\int\\sin^3x\\cos^2x\\,dx",
      "answerKind": "antiderivative",
      "timeLimit": 150,
      "tags": [
        "trig-power",
        "lecture",
        "lecture-07",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "sin 為奇次，留一個 sin x 給 d u，令 u=cos x：\n∫(1-u^2)u^2(-d u)=-(u^3)/3+(u^5)/5+C=-(cos^3x)/3+(cos^5x)/5+C。",
      "source": "微積分 20 講 · 第 07 講隨堂測驗",
      "lecture": "07",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-07-q3",
      "examTitle": "三角積分。",
      "answer": "-cos(x)^3/3+cos(x)^5/5"
    },
    {
      "id": "lec-07-q3b",
      "topic": "integrals",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\int_0^{\\pi/4}\\tan^2x\\sec^2x\\,dx",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "trig-power",
        "substitution",
        "lecture",
        "lecture-07",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "u=tan x，d u=sec^2x dx：∫_0^1u^2d u=1/3。",
      "source": "微積分 20 講 · 第 07 講隨堂測驗",
      "lecture": "07",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-07-q3",
      "examTitle": "三角積分。",
      "answer": "1/3"
    },
    {
      "id": "lec-07-q3c",
      "topic": "integrals",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\int_0^{\\pi/4}\\tan^3x\\sec x\\,dx",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "trig-power",
        "substitution",
        "lecture",
        "lecture-07",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "tan 為奇次，留 sec xtan x 給 d u，令 u=sec x，tan^2x=u^2-1，u:1→ √(2)：\n ∫_1^(√(2))(u^2-1)d u=[(u^3)/3-u]_1^(√(2))=((2√(2))/3-√(2))+2/3=(2-√(2))/3.",
      "source": "微積分 20 講 · 第 07 講隨堂測驗",
      "lecture": "07",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-07-q3",
      "examTitle": "三角積分。",
      "answer": "(2-sqrt(2))/3"
    },
    {
      "id": "lec-07-q3d",
      "topic": "integrals",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\int_0^{\\pi}\\sin^2x\\cos^2x\\,dx",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "trig-power",
        "lecture",
        "lecture-07",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "兩者皆偶次，用倍角：sin^2xcos^2x=1/4sin^22x=(1-cos4x)/8。\n∫_0^π(1-cos4x)/8 dx=(π)/8。",
      "source": "微積分 20 講 · 第 07 講隨堂測驗",
      "lecture": "07",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-07-q3",
      "examTitle": "三角積分。",
      "answer": "pi/8"
    },
    {
      "id": "lec-07-q4a",
      "topic": "integrals",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{以 }\\,x=2\\sin\\theta\\text{ 計算 }\\int_0^2\\sqrt{4-x^2}\\,dx",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "trig-substitution",
        "lecture",
        "lecture-07",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "d x=2cosθdθ，θ:0→ (π)/2，√(4-4sin^2θ)=2cosθ：\n∫_0^(π/2)4cos^2θdθ=4· (π)/4=π。\n圖中區域是半徑 2 的四分之一圓，面積 1/4π·2^2=π，相符。",
      "source": "微積分 20 講 · 第 07 講隨堂測驗",
      "lecture": "07",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-07-q4",
      "examTitle": "三角代換。",
      "answer": "pi",
      "verify": {
        "m": "integral",
        "f": "\\sqrt{4-x^2}",
        "a": 0,
        "b": 2
      }
    },
    {
      "id": "lec-07-q4b",
      "topic": "integrals",
      "difficulty": 4,
      "rank": 4,
      "authoredRank": 4,
      "prompt": "\\text{求 }\\int\\frac{dx}{x^2\\sqrt{x^2+9}}\\quad (x>0)",
      "answerKind": "antiderivative",
      "timeLimit": 150,
      "tags": [
        "trig-substitution",
        "lecture",
        "lecture-07",
        "exam-style",
        "midterm-style",
        "rank-4"
      ],
      "solution": "x=3tanθ，d x=3sec^2θdθ，√(x^2+9)=3secθ：\n ∫(3sec^2θ)/(9tan^2θ·3secθ)dθ=1/9∫(cosθ)/(sin^2θ)dθ=-1/(9sinθ)+C. \n由直角三角形（對邊 x、鄰邊 3、斜邊 √(x^2+9)），sinθ=x/(√(x^2+9))，\n答案為 -(√(x^2+9))/9x+C。",
      "source": "微積分 20 講 · 第 07 講隨堂測驗",
      "lecture": "07",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-07-q4",
      "examTitle": "三角代換。",
      "answer": "-sqrt(x^2+9)/(9*x)",
      "verify": {
        "m": "fn",
        "kind": "antideriv",
        "f": "\\frac{1}{x^2\\sqrt{x^2+9}}",
        "pts": [
          [
            0.37
          ],
          [
            0.81
          ],
          [
            1.23
          ],
          [
            1.77
          ],
          [
            2.41
          ],
          [
            3.13
          ]
        ]
      }
    },
    {
      "id": "lec-07-q4c",
      "topic": "integrals",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{計算 }\\int_0^1\\frac{dx}{(1+x^2)^{3/2}}\\text{。}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "trig-substitution",
        "lecture",
        "lecture-07",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "x=tanθ，θ:0→ (π)/4，(1+tan^2θ)^(3/2)=sec^3θ：\n∫_0^(π/4)(sec^2θ)/(sec^3θ)dθ=∫_0^(π/4)cosθdθ=(√(2))/2。",
      "source": "微積分 20 講 · 第 07 講隨堂測驗",
      "lecture": "07",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-07-q4",
      "examTitle": "三角代換。",
      "answer": "sqrt(2)/2",
      "verify": {
        "m": "integral",
        "f": "\\frac{1}{(1+x^2)^{3/2}}",
        "a": 0,
        "b": 1
      }
    },
    {
      "id": "lec-08-m1",
      "topic": "integrals",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\dfrac{x+1}{x^2(x-1)}\\text{ 的部分分式分解應設為}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "partial-fraction",
        "technique-recognition",
        "lecture",
        "lecture-08",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "重根 x^2 要有 A/x+B/(x^2) 兩項，一次因式 x-1 一項。(A) 少了 A/x，一般無法湊出分子 x+1。\n（實際上 A=-2, B=-1, C=2。）",
      "source": "微積分 20 講 · 第 08 講隨堂測驗",
      "lecture": "08",
      "examPart": "mc",
      "answers": [
        "A/x + B/x² + C/(x−1)",
        "A/x+B/x^2+C/(x-1)"
      ],
      "canonical": "A/x + B/x² + C/(x−1)",
      "answer": "A/x + B/x² + C/(x−1)",
      "distractors": [
        "A/x² + B/(x−1)",
        "(Ax+B)/x² + C/(x−1)²",
        "A/x + B/(x−1)"
      ]
    },
    {
      "id": "lec-08-m2",
      "topic": "integrals",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\int_0^1\\frac{dx}{\\sqrt x}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "improper-integral",
        "lecture",
        "lecture-08",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "x=0 處無界，是瑕積分：lim_(t→0^+)[2√(x)]_t^1=2。\n雖然函數無界，面積仍有限。",
      "source": "微積分 20 講 · 第 08 講隨堂測驗",
      "lecture": "08",
      "examPart": "mc",
      "answer": "2",
      "distractors": [
        "1",
        "1/2",
        "DNE"
      ]
    },
    {
      "id": "lec-08-m3",
      "topic": "integrals",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\int_{-1}^{1}\\frac{dx}{x^2}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "improper-integral",
        "limit-trap",
        "lecture",
        "lecture-08",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "x=0 在區間內部且被積函數無界，必須拆成 ∫_(-1)^0+∫_0^1。\n∫_0^1(d x)/(x^2)=lim_(t→0^+)(1/t-1)=∞ ，故發散。\n(A) 是直接代 [-1/x]_(-1)^1 的經典錯誤：正函數的積分怎麼可能是負的？",
      "source": "微積分 20 講 · 第 08 講隨堂測驗",
      "lecture": "08",
      "examPart": "mc",
      "answer": "DNE",
      "distractors": [
        "-2",
        "0",
        "2"
      ]
    },
    {
      "id": "lec-08-m5",
      "topic": "integrals",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{下列瑕積分中，哪一個發散？}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "improper-integral",
        "comparison-test",
        "lecture",
        "lecture-08",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "(D) 1/(√(x+1))≥ 1/(√(2x))（x≥1），而 ∫_1^∞ x^(-1/2) dx 發散（p=1/2≤1），由比較判別發散。\n(A)(B) 都 ≤ 1/(x^2)；(C) e^(-x^2)≤ e^(-x)（x≥1），皆收斂。",
      "source": "微積分 20 講 · 第 08 講隨堂測驗",
      "lecture": "08",
      "examPart": "mc",
      "answers": [
        "∫ 1/√(x+1) dx（從 1 到 ∞）"
      ],
      "canonical": "∫ 1/√(x+1) dx（從 1 到 ∞）",
      "answer": "∫ 1/√(x+1) dx（從 1 到 ∞）",
      "distractors": [
        "∫ 1/(x²+1) dx（從 1 到 ∞）",
        "∫ sin²x/x² dx（從 1 到 ∞）",
        "∫ e^(−x²) dx（從 1 到 ∞）"
      ]
    },
    {
      "id": "lec-08-q1a",
      "topic": "integrals",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{求 }\\int\\frac{5x-3}{x^2-2x-3}\\,dx\\quad (-1<x<3)",
      "answerKind": "antiderivative",
      "timeLimit": 150,
      "tags": [
        "partial-fraction",
        "lecture",
        "lecture-08",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "(5x-3)/((x-3)(x+1))=A/(x-3)+B/(x+1)。令 x=3：A=12/4=3；令 x=-1：B=(-8)/(-4)=2。\n積分 =3ln|x-3|+2ln|x+1|+C。",
      "source": "微積分 20 講 · 第 08 講隨堂測驗",
      "lecture": "08",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-08-q1",
      "examTitle": "部分分式。",
      "answer": "3*ln(3-x)+2*ln(x+1)",
      "domain": {
        "variable": "x",
        "operator": ">",
        "value": -1
      },
      "verify": {
        "m": "fn",
        "kind": "antideriv",
        "f": "\\frac{5x-3}{x^2-2x-3}",
        "pts": [
          [
            -0.63
          ],
          [
            0.37
          ],
          [
            0.81
          ],
          [
            1.23
          ],
          [
            1.77
          ],
          [
            2.41
          ]
        ]
      }
    },
    {
      "id": "lec-08-q1b",
      "topic": "integrals",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\int_2^3\\frac{dx}{x^2(x-1)}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "partial-fraction",
        "lecture",
        "lecture-08",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "1/(x^2(x-1))=A/x+B/(x^2)+C/(x-1)，得 A=-1，B=-1，C=1\n（檢查：-x(x-1)-(x-1)+x^2=1）。\n ∫_2^3=[-ln x+1/x+ln(x-1)]_2^3=(-ln3+1/3+ln2)-(-ln2+1/2)=ln4/3-1/6.",
      "source": "微積分 20 講 · 第 08 講隨堂測驗",
      "lecture": "08",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-08-q1",
      "examTitle": "部分分式。",
      "answer": "ln(4/3)-1/6"
    },
    {
      "id": "lec-08-q1c",
      "topic": "integrals",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{求 }\\int\\frac{2x^2+x+1}{(x+1)(x^2+1)}\\,dx\\quad (x>-1)",
      "answerKind": "antiderivative",
      "timeLimit": 150,
      "tags": [
        "partial-fraction",
        "lecture",
        "lecture-08",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "(2x^2+x+1)/((x+1)(x^2+1))=A/(x+1)+(Bx+C)/(x^2+1)。令 x=-1：2A=2，A=1。\n則 2x^2+x+1-(x^2+1)=x^2+x=(Bx+C)(x+1)，得 B=1, C=0。\n積分 =ln|x+1|+1/2ln(x^2+1)+C。",
      "source": "微積分 20 講 · 第 08 講隨堂測驗",
      "lecture": "08",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-08-q1",
      "examTitle": "部分分式。",
      "answer": "ln(x+1)+ln(x^2+1)/2",
      "verify": {
        "m": "fn",
        "kind": "antideriv",
        "f": "\\frac{2x^2+x+1}{(x+1)(x^2+1)}",
        "pts": [
          [
            -0.63
          ],
          [
            0.37
          ],
          [
            0.81
          ],
          [
            1.23
          ],
          [
            1.77
          ],
          [
            2.41
          ]
        ]
      }
    },
    {
      "id": "lec-08-q2a",
      "topic": "integrals",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\int_1^\\infty\\frac{\\ln x}{x^2}\\,dx",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "improper-integral",
        "integration-by-parts",
        "lecture",
        "lecture-08",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "分部：u=ln x，d v=x^(-2) dx：∫_1^t(ln x)/(x^2) dx=[-(ln x)/x-1/x]_1^t=-(ln t)/t-1/t+1→1。",
      "source": "微積分 20 講 · 第 08 講隨堂測驗",
      "lecture": "08",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-08-q2",
      "examTitle": "瑕積分的計算。",
      "answer": "1"
    },
    {
      "id": "lec-08-q2c",
      "topic": "integrals",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{求 }\\int_{-\\infty}^{\\infty}\\frac{dx}{1+x^2}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "improper-integral",
        "inverse-trig",
        "lecture",
        "lecture-08",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "必須拆成 ∫_(-∞ )^0+∫_0^∞ ，兩者都要收斂：\n∫_0^∞ (d x)/(1+x^2)=lim_(t→ ∞ )arctan t=(π)/2，由對稱性另一半也是 (π)/2，總和 π。\n（不能只算 lim_(t→ ∞ )∫_(-t)^t 就下結論，那只在兩半各自收斂時才等於原積分。）",
      "source": "微積分 20 講 · 第 08 講隨堂測驗",
      "lecture": "08",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-08-q2",
      "examTitle": "瑕積分的計算。",
      "answer": "pi"
    },
    {
      "id": "lec-08-q2d",
      "topic": "integrals",
      "difficulty": 4,
      "rank": 4,
      "authoredRank": 4,
      "prompt": "\\text{計算瑕積分 }\\int_0^3\\frac{dx}{(x-1)^{2/3}}\\text{（被積函數在 }\\,x=1\\text{ 無界）}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "improper-integral",
        "lecture",
        "lecture-08",
        "exam-style",
        "midterm-style",
        "rank-4"
      ],
      "solution": "x=1 在區間內部，拆成兩段。反導數 3(x-1)^(1/3)：\n ∫_0^1=lim_(t→1^-)3(t-1)^(1/3)-3(-1)^(1/3)=0+3=3, ∫_1^3=3·2^(1/3)-0. \n兩段都收斂，積分 =3+3√([)3]2。",
      "source": "微積分 20 講 · 第 08 講隨堂測驗",
      "lecture": "08",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-08-q2",
      "examTitle": "瑕積分的計算。",
      "answer": "3+3*2^(1/3)"
    },
    {
      "id": "lec-08-q3a",
      "topic": "integrals",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{判斷 }\\int_1^\\infty\\frac{2+\\cos x}{x}\\,dx\\text{ 收斂或發散}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "improper-integral",
        "comparison-test",
        "lecture",
        "lecture-08",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "2+cos x≥1，所以 (2+cos x)/x≥ 1/x>0，而 ∫_1^∞ (d x)/x 發散，由比較判別發散。",
      "source": "微積分 20 講 · 第 08 講隨堂測驗",
      "lecture": "08",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-08-q3",
      "examTitle": "比較判別。",
      "answers": [
        "發散",
        "diverges",
        "divergent"
      ],
      "canonical": "發散",
      "answer": "發散"
    },
    {
      "id": "lec-08-q3b",
      "topic": "integrals",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{判斷 }\\int_1^\\infty\\frac{dx}{x^3+x+1}\\text{ 收斂或發散}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "improper-integral",
        "comparison-test",
        "lecture",
        "lecture-08",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "0<1/(x^3+x+1)<1/(x^3)，∫_1^∞ x^(-3) dx 收斂（p=3>1），故收斂。",
      "source": "微積分 20 講 · 第 08 講隨堂測驗",
      "lecture": "08",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-08-q3",
      "examTitle": "比較判別。",
      "answers": [
        "收斂",
        "converges",
        "convergent"
      ],
      "canonical": "收斂",
      "answer": "收斂"
    },
    {
      "id": "lec-08-q3c",
      "topic": "integrals",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{判斷 }\\int_0^1\\frac{e^x}{\\sqrt x}\\,dx\\text{ 收斂或發散}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "improper-integral",
        "comparison-test",
        "lecture",
        "lecture-08",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "在 (0,1] 上 0<(e^x)/(√(x))≤ e/(√(x))，而 ∫_0^1(d x)/(√(x))=2 收斂，故收斂。",
      "source": "微積分 20 講 · 第 08 講隨堂測驗",
      "lecture": "08",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-08-q3",
      "examTitle": "比較判別。",
      "answers": [
        "收斂",
        "converges",
        "convergent"
      ],
      "canonical": "收斂",
      "answer": "收斂"
    },
    {
      "id": "lec-08-q3d",
      "topic": "integrals",
      "difficulty": 4,
      "rank": 4,
      "authoredRank": 4,
      "prompt": "\\text{求所有使 }\\int_2^\\infty\\frac{dx}{x(\\ln x)^p}\\text{ 收斂的 }\\,p\\text{ 值（寫成區間）}",
      "answerKind": "interval",
      "timeLimit": 120,
      "tags": [
        "improper-integral",
        "substitution",
        "lecture",
        "lecture-08",
        "exam-style",
        "midterm-style",
        "rank-4"
      ],
      "solution": "令 u=ln x，d u=(d x)/x，u:ln2→ ∞ ：積分變為 ∫_(ln2)^∞ (d u)/(u^p)。\n這是 p 積分（下限 ln2>0 不影響收斂性），故收斂 ⇔ p>1。",
      "source": "微積分 20 講 · 第 08 講隨堂測驗",
      "lecture": "08",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-08-q3",
      "examTitle": "比較判別。",
      "answer": "(1, inf)"
    },
    {
      "id": "lec-08-q4a",
      "topic": "integrals",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{以 }\\,u=\\sqrt x\\text{ 求 }\\int\\frac{dx}{1+\\sqrt x}\\quad (x>0)",
      "answerKind": "antiderivative",
      "timeLimit": 150,
      "tags": [
        "substitution",
        "radical",
        "lecture",
        "lecture-08",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "x=u^2，d x=2ud u：∫2u/(1+u)d u=∫(2-2/(1+u))d u=2√(x)-2ln(1+√(x))+C。",
      "source": "微積分 20 講 · 第 08 講隨堂測驗",
      "lecture": "08",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-08-q4",
      "examTitle": "有理化代換與遞迴。",
      "answer": "2*sqrt(x)-2*ln(1+sqrt(x))",
      "verify": {
        "m": "fn",
        "kind": "antideriv",
        "f": "\\frac{1}{1+\\sqrt{x}}",
        "pts": [
          [
            0.37
          ],
          [
            0.81
          ],
          [
            1.23
          ],
          [
            1.77
          ],
          [
            2.41
          ],
          [
            3.13
          ]
        ]
      }
    },
    {
      "id": "lec-08-q4b",
      "topic": "integrals",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\text{令 }\\,I_n=\\int_0^\\infty x^ne^{-x}\\,dx\\text{ （}\\,n\\ge0\\text{ 整數）。求 }\\,I_0",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "improper-integral",
        "gamma-function",
        "lecture",
        "lecture-08",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "I_0=lim_(t→ ∞ )[-e^(-x)]_0^t=1。",
      "source": "微積分 20 講 · 第 08 講隨堂測驗",
      "lecture": "08",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-08-q4",
      "examTitle": "有理化代換與遞迴。",
      "answer": "1",
      "verify": {
        "m": "integral",
        "f": "e^{-x}",
        "a": 0,
        "b": "\\infty"
      }
    },
    {
      "id": "lec-08-q4d",
      "topic": "integrals",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{令 }\\,I_n=\\int_0^\\infty x^ne^{-x}\\,dx\\text{。已知 }\\,I_n=n\\,I_{n-1}\\text{ 且 }\\,I_0=1\\text{，求 }\\int_0^\\infty x^3e^{-x}\\,dx",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "improper-integral",
        "gamma-function",
        "lecture",
        "lecture-08",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "I_n=n(n-1)…1· I_0=n!。∫_0^∞ x^3e^(-x) dx=3!=6。",
      "source": "微積分 20 講 · 第 08 講隨堂測驗",
      "lecture": "08",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-08-q4",
      "examTitle": "有理化代換與遞迴。",
      "answer": "6"
    },
    {
      "id": "lec-09-m1",
      "topic": "integrals",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\text{曲線 }\\,y=x\\text{ 與 }\\,y=x^2\\text{ 所圍區域的面積為}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "area",
        "lecture",
        "lecture-09",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "交點 x=0,1；在 (0,1) 上 x>x^2：∫_0^1(x-x^2) dx=1/2-1/3=1/6。",
      "source": "微積分 20 講 · 第 09 講隨堂測驗",
      "lecture": "09",
      "examPart": "mc",
      "answer": "1/6",
      "distractors": [
        "1/3",
        "1/2",
        "5/6"
      ],
      "verify": {
        "m": "integral",
        "f": "x-x^2",
        "a": 0,
        "b": 1
      }
    },
    {
      "id": "lec-09-m2",
      "topic": "integrals",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\text{將 }\\,y=\\sqrt x\\text{ （}0\\le x\\le1\\text{）與 }\\,x\\text{ 軸所圍區域繞 }\\,x\\text{ 軸旋轉，所得體積為}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "volume",
        "lecture",
        "lecture-09",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "圓盤法：π∫_0^1(√(x))^2 dx=π∫_0^1x dx=(π)/2。",
      "source": "微積分 20 講 · 第 09 講隨堂測驗",
      "lecture": "09",
      "examPart": "mc",
      "answer": "pi/2",
      "distractors": [
        "pi/3",
        "pi",
        "2*pi/3"
      ],
      "verify": {
        "m": "integral",
        "f": "\\pi(\\sqrt{x})^2",
        "a": 0,
        "b": 1
      }
    },
    {
      "id": "lec-09-m3",
      "topic": "integrals",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\text{函數 }\\sin x\\text{ 在 }[0,\\pi]\\text{ 上的平均值為}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "average-value",
        "lecture",
        "lecture-09",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "1/(π)∫_0^πsin x dx=1/(π)·2=2/(π)。(B) 是把 sin x 的最大與最小值平均，不是積分平均。",
      "source": "微積分 20 講 · 第 09 講隨堂測驗",
      "lecture": "09",
      "examPart": "mc",
      "answer": "2/pi",
      "distractors": [
        "0",
        "1/2",
        "1/pi"
      ],
      "verify": {
        "m": "integral",
        "f": "\\frac{\\sin x}{\\pi}",
        "a": 0,
        "b": "\\pi"
      }
    },
    {
      "id": "lec-09-m4",
      "topic": "integrals",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{由 }\\,y=x\\text{、 }\\,y=0\\text{、 }\\,x=1\\text{ 所圍的三角形繞 }\\,y\\text{ 軸旋轉，體積為}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "volume",
        "shell-method",
        "lecture",
        "lecture-09",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "薄殼法：半徑 x、高 x：2π∫_0^1x· x dx=(2π)/3。\n檢查：這是圓柱（半徑 1、高 1，體積 π）挖掉一個圓錐（體積 (π)/3），剩 (2π)/3。\n(A) 是繞 x 軸得到的圓錐體積。",
      "source": "微積分 20 講 · 第 09 講隨堂測驗",
      "lecture": "09",
      "examPart": "mc",
      "answer": "2*pi/3",
      "distractors": [
        "pi/3",
        "pi/2",
        "pi"
      ],
      "verify": {
        "m": "integral",
        "v": "y",
        "f": "\\pi(1^2-y^2)",
        "a": 0,
        "b": 1
      }
    },
    {
      "id": "lec-09-m5",
      "topic": "integrals",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{曲線 }\\,y=f(x)\\text{ 在 }\\,a\\le x\\le b\\text{ 的弧長公式中，被積函數 }\\sqrt{1+(f')^2}\\text{ 的來源是}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "arc-length",
        "lecture",
        "lecture-09",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "弧長是折線長度的極限，每段長 √((Δ x)^2+(Δ y)^2)，由均值定理 Δ y=f'(x_i^*)Δ x，取極限得 ∫√(1+(f')^2) dx。",
      "source": "微積分 20 講 · 第 09 講隨堂測驗",
      "lecture": "09",
      "examPart": "mc",
      "answers": [
        "小段曲線以線段近似，長度 √((Δx)²+(Δy)²)=√(1+(Δy/Δx)²)·Δx"
      ],
      "canonical": "小段曲線以線段近似，長度 √((Δx)²+(Δy)²)=√(1+(Δy/Δx)²)·Δx",
      "answer": "小段曲線以線段近似，長度 √((Δx)²+(Δy)²)=√(1+(Δy/Δx)²)·Δx",
      "distractors": [
        "曲線下的面積對 x 的導數",
        "以圓弧近似每一小段曲線",
        "旋轉曲面面積除以 2π"
      ]
    },
    {
      "id": "lec-09-q1a",
      "topic": "integrals",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{求曲線 }\\,y=x^2\\text{ 與 }\\,y=2x-x^2\\text{ 所圍區域的面積。}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "area",
        "lecture",
        "lecture-09",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "交點：x^2=2x-x^2⇒ x=0,1。在 (0,1) 上 2x-x^2≥ x^2：\n∫_0^1(2x-2x^2) dx=1-2/3=1/3。",
      "source": "微積分 20 講 · 第 09 講隨堂測驗",
      "lecture": "09",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-09-q1",
      "examTitle": "面積：對 $x$ 或對 $y$ 積分。",
      "answer": "1/3",
      "verify": {
        "m": "integral",
        "f": "(2x-x^2)-x^2",
        "a": 0,
        "b": 1
      }
    },
    {
      "id": "lec-09-q1b",
      "topic": "integrals",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{求拋物線 }\\,x=y^2\\text{ 與直線 }\\,y=x-2\\text{ 所圍區域的面積}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "area",
        "lecture",
        "lecture-09",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "交點：y^2=y+2⇒ y=-1,2，即 (1,-1)、(4,2)。對 y 積分，右邊界 x=y+2，左邊界 x=y^2：\n ∫_(-1)^2(y+2-y^2) dy=[(y^2)/2+2y-(y^3)/3]_(-1)^2=10/3+7/6=9/2.",
      "source": "微積分 20 講 · 第 09 講隨堂測驗",
      "lecture": "09",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-09-q1",
      "examTitle": "面積：對 $x$ 或對 $y$ 積分。",
      "answer": "9/2",
      "verify": {
        "m": "integral",
        "v": "y",
        "f": "(y+2)-y^2",
        "a": -1,
        "b": 2
      }
    },
    {
      "id": "lec-09-q2a",
      "topic": "integrals",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{區域 }\\,R\\text{ 由 }\\,y=2x-x^2\\text{ 與 }\\,x\\text{ 軸圍成。求 }\\,R\\text{ 繞 }\\,x\\text{ 軸旋轉的體積}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "volume",
        "lecture",
        "lecture-09",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "π∫_0^2(2x-x^2)^2 dx=π∫_0^2(4x^2-4x^3+x^4) dx=π(32/3-16+32/5)=(16π)/15。",
      "source": "微積分 20 講 · 第 09 講隨堂測驗",
      "lecture": "09",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-09-q2",
      "examTitle": "旋轉體積。",
      "answer": "16*pi/15",
      "verify": {
        "m": "integral",
        "f": "\\pi(2x-x^2)^2",
        "a": 0,
        "b": 2
      }
    },
    {
      "id": "lec-09-q2b",
      "topic": "integrals",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{區域 }\\,R\\text{ 由 }\\,y=2x-x^2\\text{ 與 }\\,x\\text{ 軸圍成。求 }\\,R\\text{ 繞 }\\,y\\text{ 軸旋轉的體積}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "volume",
        "shell-method",
        "lecture",
        "lecture-09",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "2π∫_0^2x(2x-x^2) dx=2π(16/3-4)=(8π)/3。",
      "source": "微積分 20 講 · 第 09 講隨堂測驗",
      "lecture": "09",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-09-q2",
      "examTitle": "旋轉體積。",
      "answer": "8*pi/3",
      "verify": {
        "m": "integral",
        "f": "2\\pi x(2x-x^2)",
        "a": 0,
        "b": 2
      }
    },
    {
      "id": "lec-09-q2c",
      "topic": "integrals",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{區域 }\\,R\\text{ 由 }\\,y=2x-x^2\\text{ 與 }\\,x\\text{ 軸圍成。求 }\\,R\\text{ 繞直線 }\\,x=-1\\text{ 旋轉的體積}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "volume",
        "shell-method",
        "lecture",
        "lecture-09",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "半徑改為 x+1：2π∫_0^2(x+1)(2x-x^2) dx=2π(4/3+4/3)=(16π)/3。",
      "source": "微積分 20 講 · 第 09 講隨堂測驗",
      "lecture": "09",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-09-q2",
      "examTitle": "旋轉體積。",
      "answer": "16*pi/3",
      "verify": {
        "m": "integral",
        "f": "2\\pi(x+1)(2x-x^2)",
        "a": 0,
        "b": 2
      }
    },
    {
      "id": "lec-09-q2d",
      "topic": "integrals",
      "difficulty": 4,
      "rank": 4,
      "authoredRank": 4,
      "prompt": "\\text{區域 }\\,R\\text{ 由 }\\,y=2x-x^2\\text{ 與 }\\,x\\text{ 軸圍成。求 }\\,R\\text{ 繞直線 }\\,y=1\\text{ 旋轉的體積}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "volume",
        "lecture",
        "lecture-09",
        "exam-style",
        "midterm-style",
        "rank-4"
      ],
      "solution": "R 全在 y≤1 下方（頂點 (1,1) 剛好碰到）。墊圈法：外半徑 1-0=1，內半徑 1-(2x-x^2)=(1-x)^2：\n π∫_0^2[1-(1-x)^4] dx=π(2-2/5)=(8π)/5.",
      "source": "微積分 20 講 · 第 09 講隨堂測驗",
      "lecture": "09",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-09-q2",
      "examTitle": "旋轉體積。",
      "answer": "8*pi/5",
      "verify": {
        "m": "integral",
        "f": "\\pi(1^2-(1-(2x-x^2))^2)",
        "a": 0,
        "b": 2
      }
    },
    {
      "id": "lec-09-q3a",
      "topic": "integrals",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{求 }\\,y=\\tfrac23x^{3/2}\\text{ 在 }0\\le x\\le3\\text{ 的弧長。}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "arc-length",
        "lecture",
        "lecture-09",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "y'=x^(1/2)，∫_0^3√(1+x) dx=2/3[(1+x)^(3/2)]_0^3=2/3(8-1)=14/3。",
      "source": "微積分 20 講 · 第 09 講隨堂測驗",
      "lecture": "09",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-09-q3",
      "examTitle": "弧長與旋轉曲面。",
      "answer": "14/3",
      "verify": {
        "m": "lineIntegral",
        "kind": "ds",
        "f": "1",
        "path": {
          "x": "t",
          "y": "\\frac{2}{3}t^{3/2}",
          "from": 0,
          "to": 3
        }
      }
    },
    {
      "id": "lec-09-q3b",
      "topic": "integrals",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{求 }\\,y=\\dfrac{x^2}2-\\dfrac{\\ln x}4\\text{ 在 }1\\le x\\le e\\text{ 的弧長（提示： }1+(y')^2\\text{ 是完全平方）}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "arc-length",
        "lecture",
        "lecture-09",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "y'=x-1/4x，1+(y')^2=x^2-1/2+1/(16x^2)+1=(x+1/4x)^2。\n L=∫_1^e(x+1/4x) dx=(e^2-1)/2+1/4=(e^2)/2-1/4.",
      "source": "微積分 20 講 · 第 09 講隨堂測驗",
      "lecture": "09",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-09-q3",
      "examTitle": "弧長與旋轉曲面。",
      "answer": "exp(2)/2-1/4",
      "verify": {
        "m": "lineIntegral",
        "kind": "ds",
        "f": "1",
        "path": {
          "x": "t",
          "y": "\\frac{t^2}{2}-\\frac{\\ln t}{4}",
          "from": 1,
          "to": "e"
        }
      }
    },
    {
      "id": "lec-09-q4a",
      "topic": "integrals",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{求 }\\,f(x)=x^2\\text{ 在 }[0,3]\\text{ 上滿足積分均值定理的 }\\,c\\text{（即 }\\,f(c)\\text{ 等於 }\\,f\\text{ 在該區間的平均值）}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "average-value",
        "lecture",
        "lecture-09",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "f_( avg)=1/3∫_0^3x^2 dx=1/3·9=3；c^2=3，c=√(3)∈[0,3]。",
      "source": "微積分 20 講 · 第 09 講隨堂測驗",
      "lecture": "09",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-09-q4",
      "examTitle": "截面法與平均值。",
      "answer": "sqrt(3)",
      "verify": {
        "m": "root",
        "f": "x^2-\\frac{1}{3}\\int_0^3t^2\\,dt",
        "x0": 1
      }
    },
    {
      "id": "lec-09-q4b",
      "topic": "integrals",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{一立體的底面是圓盤 }\\,x^2+y^2\\le4\\text{，垂直於 }\\,x\\text{ 軸的每個截面都是正方形（一邊落在底面上）。求其體積。}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "volume",
        "cross-section",
        "lecture",
        "lecture-09",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "在 x 處，截面邊長為弦長 2√(4-x^2)，面積 A(x)=4(4-x^2)：\n V=∫_(-2)^24(4-x^2) dx=4(16-16/3)=128/3.",
      "source": "微積分 20 講 · 第 09 講隨堂測驗",
      "lecture": "09",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-09-q4",
      "examTitle": "截面法與平均值。",
      "answer": "128/3",
      "verify": {
        "m": "integral",
        "f": "(2\\sqrt{4-x^2})^2",
        "a": -2,
        "b": 2
      }
    },
    {
      "id": "lec-09-q4c",
      "topic": "integrals",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{一立體的底面是圓盤 }\\,x^2+y^2\\le4\\text{，垂直於 }\\,x\\text{ 軸的每個截面都是正三角形（一邊落在底面上）。求其體積}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "volume",
        "cross-section",
        "lecture",
        "lecture-09",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "邊長 s 的正三角形面積 (√(3))/4s^2，是正方形的 (√(3))/4 倍：V=(√(3))/4· 128/3=(32√(3))/3。",
      "source": "微積分 20 講 · 第 09 講隨堂測驗",
      "lecture": "09",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-09-q4",
      "examTitle": "截面法與平均值。",
      "answer": "32*sqrt(3)/3",
      "verify": {
        "m": "integral",
        "f": "\\frac{\\sqrt{3}}{4}(2\\sqrt{4-x^2})^2",
        "a": -2,
        "b": 2
      }
    },
    {
      "id": "lec-10-m1",
      "topic": "integrals",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\text{參數曲線 }\\,x=t^2\\text{， }\\,y=t^3\\text{ 的 }\\dfrac{dy}{dx}",
      "answerKind": "expression",
      "timeLimit": 120,
      "tags": [
        "parametric",
        "lecture",
        "lecture-10",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "(d y)/(d x)=(d y/d t)/(d x/d t)=(3t^2)/2t=3t/2（t≠0）。(A) 是分子分母顛倒。",
      "source": "微積分 20 講 · 第 10 講隨堂測驗",
      "lecture": "10",
      "examPart": "mc",
      "answer": "3*t/2",
      "variable": "t",
      "distractors": [
        "2/(3*t)",
        "3*t^2",
        "3*t^2/2"
      ],
      "verify": {
        "m": "fn",
        "vars": [
          "t"
        ],
        "cases": [
          {
            "at": {
              "t": 0.7
            },
            "v": {
              "m": "paramSlope",
              "x": "t^2",
              "y": "t^3",
              "at": 0.7
            }
          },
          {
            "at": {
              "t": 1.3
            },
            "v": {
              "m": "paramSlope",
              "x": "t^2",
              "y": "t^3",
              "at": 1.3
            }
          },
          {
            "at": {
              "t": 2.2
            },
            "v": {
              "m": "paramSlope",
              "x": "t^2",
              "y": "t^3",
              "at": 2.2
            }
          }
        ]
      }
    },
    {
      "id": "lec-10-m2",
      "topic": "integrals",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\text{極座標點 }(r,\\theta)=\\bigl(2,\\frac\\pi3\\bigr)\\text{ 的直角座標為}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "polar",
        "lecture",
        "lecture-10",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "x=rcosθ=2· 1/2=1，y=rsinθ=2· (√(3))/2=√(3)。",
      "source": "微積分 20 講 · 第 10 講隨堂測驗",
      "lecture": "10",
      "examPart": "mc",
      "answers": [
        "(1, √3)",
        "(1,√3)",
        "(1, sqrt(3))",
        "(1,sqrt(3))"
      ],
      "canonical": "(1, √3)",
      "answer": "(1, √3)",
      "distractors": [
        "(√3, 1)",
        "(2, π/3)",
        "(−1, √3)"
      ]
    },
    {
      "id": "lec-10-m3",
      "topic": "integrals",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{極座標曲線 }\\,r=2\\cos\\theta\\text{ 是}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "polar",
        "lecture",
        "lecture-10",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "乘以 r：r^2=2rcosθ，即 x^2+y^2=2x，(x-1)^2+y^2=1。",
      "source": "微積分 20 講 · 第 10 講隨堂測驗",
      "lecture": "10",
      "examPart": "mc",
      "answers": [
        "以 (1, 0) 為圓心、半徑 1 的圓"
      ],
      "canonical": "以 (1, 0) 為圓心、半徑 1 的圓",
      "answer": "以 (1, 0) 為圓心、半徑 1 的圓",
      "distractors": [
        "以原點為圓心、半徑 2 的圓",
        "以 (0, 1) 為圓心、半徑 1 的圓",
        "心臟線"
      ]
    },
    {
      "id": "lec-10-m4",
      "topic": "integrals",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{心臟線 }\\,r=1+\\cos\\theta\\text{ 所圍面積為}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "polar",
        "area",
        "lecture",
        "lecture-10",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "1/2∫_0^(2π)(1+cosθ)^2dθ=1/2∫_0^(2π)(1+2cosθ+cos^2θ)dθ=1/2(2π+0+π)=(3π)/2。",
      "source": "微積分 20 講 · 第 10 講隨堂測驗",
      "lecture": "10",
      "examPart": "mc",
      "answer": "3*pi/2",
      "distractors": [
        "pi",
        "2*pi",
        "pi/2"
      ],
      "verify": {
        "m": "integral",
        "f": "\\frac{1}{2}(1+\\cos x)^2",
        "a": 0,
        "b": "2\\pi"
      }
    },
    {
      "id": "lec-10-m5",
      "topic": "integrals",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{一彈簧受力 }10\\,\\text{N}\\text{ 時伸長 }0.2\\,\\text{m}\\text{ （遵守 Hooke 定律）。把它從自然長度拉長 }0.3\\,\\text{m}\\text{ 需作功幾焦耳？}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "work",
        "lecture",
        "lecture-10",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "k=10/0.2=50 N/m，W=∫_0^(0.3)50x dx=25(0.09)=2.25 J。\n(C) 是誤用「力 × 距離」=10×0.3；力隨伸長量改變，必須積分。",
      "source": "微積分 20 講 · 第 10 講隨堂測驗",
      "lecture": "10",
      "examPart": "mc",
      "answer": "2.25",
      "distractors": [
        "1.5",
        "3",
        "4.5"
      ],
      "verify": {
        "m": "integral",
        "f": "\\frac{10}{0.2}x",
        "a": 0,
        "b": 0.3
      }
    },
    {
      "id": "lec-10-q1a",
      "topic": "integrals",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{擺線 }\\,x=t-\\sin t\\text{， }\\,y=1-\\cos t\\text{。求 }\\,t=\\frac\\pi2\\text{ 處的切線方程式 }\\,y",
      "answerKind": "expression",
      "timeLimit": 120,
      "tags": [
        "parametric",
        "tangent-normal",
        "lecture",
        "lecture-10",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "(d y)/(d x)=(sin t)/(1-cos t)。t=(π)/2：斜率 1，點 ((π)/2-1,1)，\n切線 y-1=x-(π)/2+1，即 y=x+2-(π)/2。",
      "source": "微積分 20 講 · 第 10 講隨堂測驗",
      "lecture": "10",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-10-q1",
      "examTitle": "擺線。",
      "answer": "x+2-pi/2",
      "verify": {
        "m": "fn",
        "cases": [
          {
            "at": {
              "x": "\\pi/2-1"
            },
            "v": {
              "m": "value",
              "f": "1-\\cos\\frac{\\pi}{2}"
            }
          },
          {
            "at": {
              "x": "\\pi/2-1"
            },
            "d": "x",
            "v": {
              "m": "paramSlope",
              "x": "t-\\sin t",
              "y": "1-\\cos t",
              "at": "\\pi/2"
            }
          }
        ]
      }
    },
    {
      "id": "lec-10-q1b",
      "topic": "integrals",
      "difficulty": 4,
      "rank": 4,
      "authoredRank": 4,
      "prompt": "\\text{擺線 }\\,x=t-\\sin t\\text{， }\\,y=1-\\cos t\\text{。求 }\\dfrac{d^2y}{dx^2}\\text{（以 }\\,t\\text{ 表示， }0<t<2\\pi\\text{）}",
      "answerKind": "expression",
      "timeLimit": 120,
      "tags": [
        "parametric",
        "second-derivative",
        "lecture",
        "lecture-10",
        "exam-style",
        "midterm-style",
        "rank-4"
      ],
      "solution": "d/(d t)((sin t)/(1-cos t))=(cos t(1-cos t)-sin^2t)/((1-cos t)^2)=(cos t-1)/((1-cos t)^2)=-1/(1-cos t)。\n再除以 (d x)/(d t)=1-cos t：\n (d^2y)/(d x^2)=-1/((1-cos t)^2)<0, \n凹向下。（注意二階導數不是 (d^2y/d t^2)/(d^2x/d t^2)。）",
      "source": "微積分 20 講 · 第 10 講隨堂測驗",
      "lecture": "10",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-10-q1",
      "examTitle": "擺線。",
      "answer": "-1/(1-cos(t))^2",
      "variable": "t",
      "verify": {
        "m": "fn",
        "vars": [
          "t"
        ],
        "tol": 0.0001,
        "cases": [
          {
            "at": {
              "t": 0.9
            },
            "v": {
              "m": "paramSecond",
              "x": "t-\\sin t",
              "y": "1-\\cos t",
              "at": 0.9
            }
          },
          {
            "at": {
              "t": 2
            },
            "v": {
              "m": "paramSecond",
              "x": "t-\\sin t",
              "y": "1-\\cos t",
              "at": 2
            }
          },
          {
            "at": {
              "t": 4.1
            },
            "v": {
              "m": "paramSecond",
              "x": "t-\\sin t",
              "y": "1-\\cos t",
              "at": 4.1
            }
          }
        ]
      }
    },
    {
      "id": "lec-10-q1c",
      "topic": "integrals",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{擺線 }\\,x=t-\\sin t\\text{， }\\,y=1-\\cos t\\text{。求一個拱（}0\\le t\\le2\\pi\\text{）的弧長}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "parametric",
        "arc-length",
        "lecture",
        "lecture-10",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "x′^2+y′^2=(1-cos t)^2+sin^2t=2-2cos t=4sin^2t/2。\n在 [0,2π] 上 \\sint/2≥0：L=∫_0^(2π)2\\sint/2d t=[-4\\cost/2]_0^(2π)=8。",
      "source": "微積分 20 講 · 第 10 講隨堂測驗",
      "lecture": "10",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-10-q1",
      "examTitle": "擺線。",
      "answer": "8",
      "verify": {
        "m": "lineIntegral",
        "kind": "ds",
        "f": "1",
        "path": {
          "x": "t-\\sin t",
          "y": "1-\\cos t",
          "from": 0,
          "to": "2\\pi"
        }
      }
    },
    {
      "id": "lec-10-q2a",
      "topic": "integrals",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{極座標曲線 }\\,r=4\\sin\\theta\\text{ 化成直角座標後是什麼圖形？}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "polar",
        "lecture",
        "lecture-10",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "r^2=4rsinθ⇒ x^2+y^2=4y⇒ x^2+(y-2)^2=4，圓心 (0,2)、半徑 2 的圓。",
      "source": "微積分 20 講 · 第 10 講隨堂測驗",
      "lecture": "10",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-10-q2",
      "examTitle": "極座標的面積與弧長。",
      "answers": [
        "圓心 (0, 2)、半徑 2 的圓",
        "x²+(y−2)²=4",
        "x^2+(y-2)^2=4"
      ],
      "canonical": "圓心 (0, 2)、半徑 2 的圓",
      "answer": "圓心 (0, 2)、半徑 2 的圓",
      "distractors": [
        "圓心 (2, 0)、半徑 2 的圓",
        "圓心原點、半徑 4 的圓",
        "圓心 (0, 4)、半徑 4 的圓"
      ]
    },
    {
      "id": "lec-10-q2b",
      "topic": "integrals",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{求曲線 }\\,r=3\\cos\\theta\\text{ 與 }\\,r=1+\\cos\\theta\\text{ 在原點以外的交點的 }\\,r\\text{ 值}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "polar",
        "lecture",
        "lecture-10",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "3cosθ=1+cosθ⇒cosθ=1/2，θ=± (π)/3，r=3/2，\n即 (3/4,± (3√(3))/4)。另外兩曲線都經過原點（但在不同的 θ 值，解方程式找不到）。",
      "source": "微積分 20 講 · 第 10 講隨堂測驗",
      "lecture": "10",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-10-q2",
      "examTitle": "極座標的面積與弧長。",
      "answer": "3/2"
    },
    {
      "id": "lec-10-q2c",
      "topic": "integrals",
      "difficulty": 4,
      "rank": 4,
      "authoredRank": 4,
      "prompt": "\\text{求在圓 }\\,r=3\\cos\\theta\\text{ 內、心臟線 }\\,r=1+\\cos\\theta\\text{ 外的區域面積}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "polar",
        "area",
        "lecture",
        "lecture-10",
        "exam-style",
        "midterm-style",
        "rank-4"
      ],
      "solution": "所求區域是 -(π)/3≤ θ≤ (π)/3 間、1+cosθ≤ r≤3cosθ：\n\nA=1/2∫_(-π/3)^(π/3)[9cos^2θ-(1+cosθ)^2]dθ\n=∫_0^(π/3)(8cos^2θ-2cosθ-1)dθ；\n=[3θ+2sin2θ-2sinθ]_0^(π/3)=π+√(3)-√(3)=π.",
      "source": "微積分 20 講 · 第 10 講隨堂測驗",
      "lecture": "10",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-10-q2",
      "examTitle": "極座標的面積與弧長。",
      "answer": "pi",
      "verify": {
        "m": "integral",
        "f": "(3\\cos x)^2-(1+\\cos x)^2",
        "a": 0,
        "b": "\\pi/3"
      }
    },
    {
      "id": "lec-10-q2d",
      "topic": "integrals",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{求心臟線 }\\,r=1+\\cos\\theta\\text{ 的全長}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "polar",
        "arc-length",
        "lecture",
        "lecture-10",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "r^2+(r')^2=(1+cosθ)^2+sin^2θ=2+2cosθ=4cos^2(θ)/2。\n由對稱性：L=2∫_0^π2cos(θ)/2dθ=2[4sin(θ)/2]_0^π=8。\n（在 [0,2π] 上直接寫 2cos(θ)/2 會出錯，因為 θ>π 時 cos(θ)/2<0，要取絕對值。）",
      "source": "微積分 20 講 · 第 10 講隨堂測驗",
      "lecture": "10",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-10-q2",
      "examTitle": "極座標的面積與弧長。",
      "answer": "8",
      "verify": {
        "m": "lineIntegral",
        "kind": "ds",
        "f": "1",
        "path": {
          "x": "(1+\\cos t)\\cos t",
          "y": "(1+\\cos t)\\sin t",
          "from": 0,
          "to": "2\\pi"
        }
      }
    },
    {
      "id": "lec-10-q3a",
      "topic": "integrals",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{把一彈簧從自然長度拉長 }0.1\\,\\text{m}\\text{ 需作功 }2\\,\\text{J}\\text{。再從伸長 }0.1\\,\\text{m}\\text{ 拉到伸長 }0.2\\,\\text{m}\\text{，需再作多少功（J）？}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "work",
        "lecture",
        "lecture-10",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "∫_0^(0.1)kx dx=k/2(0.01)=2⇒ k=400 N/m。\nW=∫_(0.1)^(0.2)400x dx=200(0.04-0.01)=6 J。\n（不是 2 J：越拉越費力。）",
      "source": "微積分 20 講 · 第 10 講隨堂測驗",
      "lecture": "10",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-10-q3",
      "examTitle": "功。",
      "answer": "6",
      "verify": {
        "m": "integral",
        "f": "\\frac{2}{0.1^2/2}x",
        "a": 0.1,
        "b": 0.2
      }
    },
    {
      "id": "lec-10-q3b",
      "topic": "integrals",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{一個圓柱形水槽半徑 }1\\,\\text{m}\\text{、高 }4\\,\\text{m}\\text{，裝滿水（密度 }1000\\,\\text{kg/m}^3\\text{， }\\,g=9.8\\text{）。把水全部從槽頂抽出需作多少功（J）？答案可保留 }\\pi",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "work",
        "lecture",
        "lecture-10",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "取高度 y 處厚 d y 的薄層，重量 1000·9.8· π·1^2d y，需上升 4-y：\n W=9800π∫_0^4(4-y) dy=9800π·8=78400π J.",
      "source": "微積分 20 講 · 第 10 講隨堂測驗",
      "lecture": "10",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-10-q3",
      "examTitle": "功。",
      "answer": "78400*pi",
      "verify": {
        "m": "integral",
        "f": "1000\\cdot9.8\\cdot\\pi\\cdot1^2(4-x)",
        "a": 0,
        "b": 4
      }
    },
    {
      "id": "lec-10-q3c",
      "topic": "integrals",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{一條長 }20\\,\\text{m}\\text{、線密度 }2\\,\\text{kg/m}\\text{ 的鏈條從樓頂垂下（}\\,g=9.8\\text{）。把整條鏈條拉上樓頂需作多少功（J）？}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "work",
        "lecture",
        "lecture-10",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "樓頂下方 y 處長 d y 的一段，重量 2(9.8) dy，需上升 y：\nW=∫_0^(20)19.6y dy=19.6·200=3920 J。\n檢查：鏈條總重 392 N，質心在樓頂下 10 m，392×10=3920。",
      "source": "微積分 20 講 · 第 10 講隨堂測驗",
      "lecture": "10",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-10-q3",
      "examTitle": "功。",
      "answer": "3920",
      "verify": {
        "m": "integral",
        "f": "2\\cdot9.8\\cdot x",
        "a": 0,
        "b": 20
      }
    },
    {
      "id": "lec-10-q4a",
      "topic": "integrals",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{求 }\\,y=4-x^2\\text{ 與 }\\,x\\text{ 軸所圍區域（均勻薄板）質心的 }\\,y\\text{ 座標 }\\bar y",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "centroid",
        "lecture",
        "lecture-10",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "A=∫_(-2)^2(4-x^2) dx=32/3。區域對 y 軸對稱，x=0。\n y=1/A∫_(-2)^21/2(4-x^2)^2 dx=3/32· 1/2· 512/15=8/5.",
      "source": "微積分 20 講 · 第 10 講隨堂測驗",
      "lecture": "10",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-10-q4",
      "examTitle": "質心。",
      "answer": "8/5",
      "verify": {
        "m": "value",
        "f": "\\frac{\\int_{-2}^{2}\\frac{1}{2}(4-x^2)^2\\,dx}{\\int_{-2}^{2}(4-x^2)\\,dx}"
      }
    },
    {
      "id": "lec-10-q4c",
      "topic": "integrals",
      "difficulty": 4,
      "rank": 4,
      "authoredRank": 4,
      "prompt": "\\text{求四分之一圓盤 }\\,x^2+y^2\\le r^2\\text{， }\\,x,y\\ge0\\text{ 質心的 }\\,x\\text{ 座標 }\\bar x\\text{（以 }\\,r\\text{ 表示）}",
      "answerKind": "expression",
      "timeLimit": 120,
      "tags": [
        "centroid",
        "lecture",
        "lecture-10",
        "exam-style",
        "midterm-style",
        "rank-4"
      ],
      "solution": "由對稱性 x=y。A=(π r^2)/4，\nx=1/A∫_0^rx√(r^2-x^2) dx=4/(π r^2)· [-1/3(r^2-x^2)^(3/2)]_0^r=4/(π r^2)· (r^3)/3=4r/(3π)。\n質心為 (4r/(3π),4r/(3π))。",
      "source": "微積分 20 講 · 第 10 講隨堂測驗",
      "lecture": "10",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-10-q4",
      "examTitle": "質心。",
      "answer": "4*r/(3*pi)",
      "variable": "r",
      "verify": {
        "m": "fn",
        "vars": [
          "r"
        ],
        "cases": [
          {
            "at": {
              "r": 1
            },
            "v": {
              "m": "value",
              "f": "\\frac{\\int_0^{1}x\\sqrt{1^2-x^2}\\,dx}{\\int_0^{1}\\sqrt{1^2-x^2}\\,dx}"
            }
          },
          {
            "at": {
              "r": 2.5
            },
            "v": {
              "m": "value",
              "f": "\\frac{\\int_0^{2.5}x\\sqrt{2.5^2-x^2}\\,dx}{\\int_0^{2.5}\\sqrt{2.5^2-x^2}\\,dx}"
            }
          }
        ]
      }
    },
    {
      "id": "lec-11-m1",
      "topic": "series",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\lim_{n\\to\\infty}\\frac{2n^2+1}{n^2-3n}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "sequence",
        "lecture",
        "lecture-11",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "分子分母同除 n^2：(2+1/n^2)/(1-3/n)→2。",
      "source": "微積分 20 講 · 第 11 講隨堂測驗",
      "lecture": "11",
      "examPart": "mc",
      "answer": "2",
      "distractors": [
        "0",
        "1",
        "inf"
      ]
    },
    {
      "id": "lec-11-m2",
      "topic": "series",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{數列 }\\{r^n\\}\\text{ 收斂的充要條件為}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "sequence",
        "limit-trap",
        "lecture",
        "lecture-11",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "|r|<1 時 r^n→0；r=1 時恆為 1，收斂。r=-1 時在 ±1 間跳動，發散；|r|>1 時 |r^n|→ ∞ 。\n常見錯誤是漏掉 r=1（選 A）或誤把 r=-1 算進去（選 C）。",
      "source": "微積分 20 講 · 第 11 講隨堂測驗",
      "lecture": "11",
      "examPart": "mc",
      "answers": [
        "−1 < r ≤ 1",
        "-1<r<=1",
        "-1<r≤1"
      ],
      "canonical": "−1 < r ≤ 1",
      "answer": "−1 < r ≤ 1",
      "distractors": [
        "|r| < 1",
        "−1 ≤ r ≤ 1",
        "r ≥ 0"
      ]
    },
    {
      "id": "lec-11-m3",
      "topic": "series",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\lim_{n\\to\\infty}\\sqrt[n]{5n}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "sequence",
        "lecture",
        "lecture-11",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "(5n)^(1/n)=5^(1/n)· n^(1/n)→1·1=1。",
      "source": "微積分 20 講 · 第 11 講隨堂測驗",
      "lecture": "11",
      "examPart": "mc",
      "answer": "1",
      "distractors": [
        "0",
        "5",
        "inf"
      ]
    },
    {
      "id": "lec-11-m4",
      "topic": "series",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\lim_{n\\to\\infty}\\Bigl(1+\\frac{2}{n}\\Bigr)^n",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "sequence",
        "exponential-limit",
        "lecture",
        "lecture-11",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "令 m=n/2：(1+2/n)^n=[(1+1/m)^m]^2→ e^2。\n「底數趨近 1 所以答案是 1」是典型的 1^∞ 誤判。",
      "source": "微積分 20 講 · 第 11 講隨堂測驗",
      "lecture": "11",
      "examPart": "mc",
      "answer": "exp(2)",
      "distractors": [
        "1",
        "2",
        "exp(1)"
      ]
    },
    {
      "id": "lec-11-m5",
      "topic": "series",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{關於數列的收斂，下列敘述何者正確？}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "sequence",
        "lecture",
        "lecture-11",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "(C) 即單調有界定理。反例：(A)(B) a_n=(-1)^n 有界但發散；(D) a_n=(-1)^n/n→0 但不單調。",
      "source": "微積分 20 講 · 第 11 講隨堂測驗",
      "lecture": "11",
      "examPart": "mc",
      "answers": [
        "單調且有界的數列必收斂"
      ],
      "canonical": "單調且有界的數列必收斂",
      "answer": "單調且有界的數列必收斂",
      "distractors": [
        "有界數列必收斂",
        "發散數列必無界",
        "收斂數列必為單調數列"
      ]
    },
    {
      "id": "lec-11-q1a",
      "topic": "series",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\lim_{n\\to\\infty}\\bigl(\\sqrt{n^2+n}-n\\bigr)",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "sequence",
        "radical",
        "lecture",
        "lecture-11",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "有理化：n/(√(n^2+n)+n)=1/(√(1+1/n)+1)→ 1/2。",
      "source": "微積分 20 講 · 第 11 講隨堂測驗",
      "lecture": "11",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-11-q1",
      "examTitle": "求數列極限。",
      "answer": "1/2"
    },
    {
      "id": "lec-11-q1b",
      "topic": "series",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{求 }\\lim_{n\\to\\infty}\\frac{\\ln n}{n}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "sequence",
        "log",
        "lecture",
        "lecture-11",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "考慮 f(x)=(ln x)/x，由 L'Hôpital：lim_(x→ ∞ )(1/x)/1=0，故數列極限為 0。\n（不能直接對數列用 L'Hôpital，要先換成連續變數 x。）",
      "source": "微積分 20 講 · 第 11 講隨堂測驗",
      "lecture": "11",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-11-q1",
      "examTitle": "求數列極限。",
      "answer": "0",
      "verify": {
        "m": "limit",
        "f": "\\frac{\\ln x}{x}",
        "at": "inf"
      }
    },
    {
      "id": "lec-11-q1c",
      "topic": "series",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\lim_{n\\to\\infty}n\\sin\\frac{1}{n}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "sequence",
        "trig-limit",
        "lecture",
        "lecture-11",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "令 t=1/n→0^+：nsin1/n=(sin t)/t→1。",
      "source": "微積分 20 講 · 第 11 講隨堂測驗",
      "lecture": "11",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-11-q1",
      "examTitle": "求數列極限。",
      "answer": "1"
    },
    {
      "id": "lec-11-q1d",
      "topic": "series",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\lim_{n\\to\\infty}\\bigl(3^n+4^n\\bigr)^{1/n}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "sequence",
        "squeeze",
        "lecture",
        "lecture-11",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "4^n≤3^n+4^n≤2·4^n，開 n 次方：4≤ (3^n+4^n)^(1/n)≤4·2^(1/n)。2^(1/n)→1，由夾擠極限為 4。\n（一般地，(a^n+b^n)^(1/n)→ max(a,b)。）",
      "source": "微積分 20 講 · 第 11 講隨堂測驗",
      "lecture": "11",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-11-q1",
      "examTitle": "求數列極限。",
      "answer": "4"
    },
    {
      "id": "lec-11-q2a",
      "topic": "series",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\text{求 }\\lim_{n\\to\\infty}\\frac{\\cos n}{n}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "sequence",
        "squeeze",
        "lecture",
        "lecture-11",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "-1/n≤ (cos n)/n≤ 1/n，兩側 →0，極限為 0。",
      "source": "微積分 20 講 · 第 11 講隨堂測驗",
      "lecture": "11",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-11-q2",
      "examTitle": "夾擠定理與階乘。",
      "answer": "0",
      "verify": {
        "m": "limit",
        "f": "\\frac{\\cos x}{x}",
        "at": "inf"
      }
    },
    {
      "id": "lec-11-q2d",
      "topic": "series",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{將 }2^n,\\ n!,\\ n^n\\text{ 依「 }\\,n\\to\\infty\\text{ 時增長快慢」由慢到快排序}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "sequence",
        "lecture",
        "lecture-11",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "2^n≪ n!≪ n^n（「≪」表示比值趨近 0）。",
      "source": "微積分 20 講 · 第 11 講隨堂測驗",
      "lecture": "11",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-11-q2",
      "examTitle": "夾擠定理與階乘。",
      "answers": [
        "2ⁿ ≪ n! ≪ nⁿ",
        "2^n<n!<n^n",
        "2^n, n!, n^n"
      ],
      "canonical": "2ⁿ ≪ n! ≪ nⁿ",
      "answer": "2ⁿ ≪ n! ≪ nⁿ",
      "distractors": [
        "n! ≪ 2ⁿ ≪ nⁿ",
        "2ⁿ ≪ nⁿ ≪ n!",
        "nⁿ ≪ n! ≪ 2ⁿ"
      ]
    },
    {
      "id": "lec-11-q3a",
      "topic": "series",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{設 }\\,a_1=\\sqrt2\\text{， }\\,a_{n+1}=\\sqrt{2+a_n}\\text{，即 }\\sqrt2,\\quad \\sqrt{2+\\sqrt2},\\quad \\sqrt{2+\\sqrt{2+\\sqrt2}},\\quad \\dots \\text{用數學歸納法證明 }\\,a_n<2\\text{ 對所有 }\\,n\\text{ 成立。}",
      "answerKind": "proof",
      "timeLimit": 300,
      "tags": [
        "proof",
        "written-proof",
        "induction",
        "recursive-sequence",
        "lecture",
        "lecture-11",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "a_1=√(2)<2。設 a_k<2，則 a_(k+1)=√(2+a_k)<√(4)=2。由歸納法得證。",
      "source": "微積分 20 講 · 第 11 講隨堂測驗",
      "lecture": "11",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-11-q3",
      "examTitle": "遞迴數列。",
      "proofSpec": "pl-lec-recursive-bound",
      "answer": "（白話證明．機器判分）",
      "hints": [
        "一行一句，每句用一種句型開頭：任取／取／假設／則／由…／因為…所以／故。",
        "先寫出要證的東西長什麼樣，再一步一步扣回去。",
        "每一行都會被檢查：站不住的那一行會標紅。"
      ]
    },
    {
      "id": "lec-11-q3b",
      "topic": "series",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{設 }\\,a_1=\\sqrt2\\text{，}\\,a_{n+1}=\\sqrt{2+a_n}\\text{。已知 }0<a_n<2\\text{ 對所有 }\\,n\\text{ 成立，證明 }\\{a_n\\}\\text{ 遞增。}",
      "answerKind": "proof",
      "timeLimit": 300,
      "tags": [
        "proof",
        "written-proof",
        "sequence",
        "recursive-sequence",
        "lecture",
        "lecture-11",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "a_(n+1)^2-a_n^2=2+a_n-a_n^2=(2-a_n)(1+a_n)>0（由 (a) 且 a_n>0），又 a_n>0，故 a_(n+1)>a_n。",
      "source": "微積分 20 講 · 第 11 講隨堂測驗",
      "lecture": "11",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-11-q3",
      "examTitle": "遞迴數列。",
      "proofSpec": "pl-lec-recursive-increasing",
      "answer": "（白話證明．機器判分）",
      "hints": [
        "一行一句，每句用一種句型開頭：任取／取／假設／則／由…／因為…所以／故。",
        "先寫出要證的東西長什麼樣，再一步一步扣回去。",
        "每一行都會被檢查：站不住的那一行會標紅。"
      ]
    },
    {
      "id": "lec-11-q3c",
      "topic": "series",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{設 }\\,a_1=\\sqrt2\\text{， }\\,a_{n+1}=\\sqrt{2+a_n}\\text{。已知 }\\{a_n\\}\\text{ 遞增且有上界，求 }\\lim_{n\\to\\infty}a_n",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "sequence",
        "recursive-sequence",
        "lecture",
        "lecture-11",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "遞增且上有界 2，由單調有界定理收斂，設極限為 L。對 a_(n+1)=√(2+a_n) 兩邊取極限：L=√(2+L)，\nL^2-L-2=0，L=2 或 -1。因 a_n>0，L≥0，故 L=2。\n（必須先證明收斂，才能對遞迴式取極限。）",
      "source": "微積分 20 講 · 第 11 講隨堂測驗",
      "lecture": "11",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-11-q3",
      "examTitle": "遞迴數列。",
      "answer": "2",
      "verify": {
        "m": "recurrence",
        "f": "\\sqrt{2+a}",
        "a0": "\\sqrt{2}"
      }
    },
    {
      "id": "lec-11-q4a",
      "topic": "series",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\lim_{n\\to\\infty}\\Bigl(1-\\frac{1}{n}\\Bigr)^n",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "sequence",
        "exponential-limit",
        "lecture",
        "lecture-11",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "nln(1-1/n)：令 t=1/n，(ln(1-t))/t→ -1（L'Hôpital），極限 e^(-1)。",
      "source": "微積分 20 講 · 第 11 講隨堂測驗",
      "lecture": "11",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-11-q4",
      "examTitle": "$1^\\infty$ 型與 $e$。",
      "answer": "exp(-1)"
    },
    {
      "id": "lec-11-q4b",
      "topic": "series",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\lim_{n\\to\\infty}\\Bigl(1+\\frac{3}{n}\\Bigr)^{2n}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "sequence",
        "exponential-limit",
        "lecture",
        "lecture-11",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "2nln(1+3/n)=6· (ln(1+3/n))/(3/n)→6，極限 e^6。",
      "source": "微積分 20 講 · 第 11 講隨堂測驗",
      "lecture": "11",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-11-q4",
      "examTitle": "$1^\\infty$ 型與 $e$。",
      "answer": "exp(6)"
    },
    {
      "id": "lec-11-q4c",
      "topic": "series",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\lim_{n\\to\\infty}\\Bigl(\\frac{n+1}{n-1}\\Bigr)^n",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "sequence",
        "exponential-limit",
        "lecture",
        "lecture-11",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "(n+1)/(n-1)=1+2/(n-1)，nln(1+2/(n-1))=2n/(n-1)· (ln(1+2/(n-1)))/(2/(n-1))→2·1，極限 e^2。",
      "source": "微積分 20 講 · 第 11 講隨堂測驗",
      "lecture": "11",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-11-q4",
      "examTitle": "$1^\\infty$ 型與 $e$。",
      "answer": "exp(2)"
    },
    {
      "id": "lec-11-q4d",
      "topic": "series",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{求 }\\lim_{n\\to\\infty}\\Bigl(1+\\frac1{n^2}\\Bigr)^n",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "sequence",
        "exponential-limit",
        "limit-trap",
        "lecture",
        "lecture-11",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "nln(1+1/(n^2))=1/n· (ln(1+1/n^2))/(1/n^2)→0·1=0，極限 e^0=1。\n底數與 1 的差距 1/n^2 縮小得比指數 n 增大得快，乘積 n· 1/(n^2)→0；要得到 e，兩者需「剛好抵消」（差距 1/n 配指數 n）。",
      "source": "微積分 20 講 · 第 11 講隨堂測驗",
      "lecture": "11",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-11-q4",
      "examTitle": "$1^\\infty$ 型與 $e$。",
      "answer": "1",
      "verify": {
        "m": "seqLimit",
        "f": "\\left(1+\\frac{1}{n^2}\\right)^n"
      }
    },
    {
      "id": "lec-12-m1",
      "topic": "series",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\sum_{n=0}^{\\infty}\\Bigl(\\frac{2}{3}\\Bigr)^n",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "geometric-series",
        "lecture",
        "lecture-12",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "首項 a=1、公比 r=2/3：1/(1-2/3)=3。若從 n=1 起加則為 2，要注意起始項。",
      "source": "微積分 20 講 · 第 12 講隨堂測驗",
      "lecture": "12",
      "examPart": "mc",
      "answer": "3",
      "distractors": [
        "2/3",
        "2",
        "DNE"
      ]
    },
    {
      "id": "lec-12-m2",
      "topic": "series",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{關於級數收斂與一般項的極限，下列敘述何者正確？}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "convergence-test",
        "limit-trap",
        "lecture",
        "lecture-12",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "(B)：a_n=S_n-S_(n-1)→ S-S=0。(A)(C)(D) 的反例都是調和級數 Σ1/n：各項遞減趨近 0，但發散。\n第 n 項判別只能用來判定發散。",
      "source": "微積分 20 講 · 第 12 講隨堂測驗",
      "lecture": "12",
      "examPart": "mc",
      "answers": [
        "若 Σaₙ 收斂，則 lim aₙ = 0"
      ],
      "canonical": "若 Σaₙ 收斂，則 lim aₙ = 0",
      "answer": "若 Σaₙ 收斂，則 lim aₙ = 0",
      "distractors": [
        "若 lim aₙ = 0，則 Σaₙ 收斂",
        "若 Σaₙ 發散，則 lim aₙ ≠ 0",
        "若 aₙ > 0 且 aₙ 遞減，則 Σaₙ 收斂"
      ]
    },
    {
      "id": "lec-12-m4",
      "topic": "series",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{下列級數何者發散？}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "convergence-test",
        "comparison-test",
        "lecture",
        "lecture-12",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "(B) 與 1/n 作極限比較：(n/(n^2+1))/(1/n)=(n^2)/(n^2+1)→1，而 Σ1/n 發散，故發散。\n(A) 為 p=1.1>1 的 p 級數，收斂（p 只要大於 1，再接近 1 也收斂）。(C)(D) 分別比較 1/(2^n)、1/(n^2)，收斂。",
      "source": "微積分 20 講 · 第 12 講隨堂測驗",
      "lecture": "12",
      "examPart": "mc",
      "answers": [
        "Σ n/(n²+1)",
        "n/(n^2+1)"
      ],
      "canonical": "Σ n/(n²+1)",
      "answer": "Σ n/(n²+1)",
      "distractors": [
        "Σ 1/n^1.1",
        "Σ 1/(2ⁿ+1)",
        "Σ 1/(n²+1)"
      ]
    },
    {
      "id": "lec-12-m5",
      "topic": "series",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\text{級數 }\\sum_{n=1}^\\infty\\frac1{n^{p}}\\text{ 收斂的充要條件為}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "convergence-test",
        "lecture",
        "lecture-12",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "由積分判別：∫_1^∞ x^(-p)dx 在 p>1 時收斂，p≤1 時發散。p=1 是調和級數，發散，所以 (A) 錯。",
      "source": "微積分 20 講 · 第 12 講隨堂測驗",
      "lecture": "12",
      "examPart": "mc",
      "answers": [
        "p > 1",
        "p>1"
      ],
      "canonical": "p > 1",
      "answer": "p > 1",
      "distractors": [
        "p ≥ 1",
        "p > 0",
        "p < 1"
      ]
    },
    {
      "id": "lec-12-q1a",
      "topic": "series",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{求 }\\sum_{n=1}^\\infty\\frac{3^n+2^n}{6^n}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "geometric-series",
        "lecture",
        "lecture-12",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "(3^n+2^n)/(6^n)=(1/2)^n+(1/3)^n，兩個收斂的幾何級數可以分開加：\n(1/2)/(1-1/2)+(1/3)/(1-1/3)=1+1/2=3/2。",
      "source": "微積分 20 講 · 第 12 講隨堂測驗",
      "lecture": "12",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-12-q1",
      "examTitle": "幾何級數與望遠鏡級數。",
      "answer": "3/2",
      "verify": {
        "m": "series",
        "f": "\\frac{3^n+2^n}{6^n}",
        "from": 1
      }
    },
    {
      "id": "lec-12-q1b",
      "topic": "series",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{把循環小數 }0.\\overline{12}=0.121212\\cdots\\text{ 寫成幾何級數，化為最簡分數}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "geometric-series",
        "lecture",
        "lecture-12",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "0.12=12/100+12/(100^2)+… =(12/100)/(1-1/100)=12/99=4/33。",
      "source": "微積分 20 講 · 第 12 講隨堂測驗",
      "lecture": "12",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-12-q1",
      "examTitle": "幾何級數與望遠鏡級數。",
      "answer": "4/33",
      "verify": {
        "m": "series",
        "f": "\\frac{12}{100^n}",
        "from": 1
      }
    },
    {
      "id": "lec-12-q1c",
      "topic": "series",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{求 }\\sum_{n=2}^\\infty\\frac1{n^2-1}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "telescoping",
        "lecture",
        "lecture-12",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "1/(n^2-1)=1/2(1/(n-1)-1/(n+1))。部分和\nS_N=1/2(1+1/2-1/N-1/(N+1))→ 1/2· 3/2=3/4。\n（相消時隔一項，會剩下前兩項與後兩項。）",
      "source": "微積分 20 講 · 第 12 講隨堂測驗",
      "lecture": "12",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-12-q1",
      "examTitle": "幾何級數與望遠鏡級數。",
      "answer": "3/4",
      "verify": {
        "m": "series",
        "f": "\\frac{1}{n^2-1}",
        "from": 2
      }
    },
    {
      "id": "lec-12-q1d",
      "topic": "series",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{對 }-1<x<3\\text{，求 }\\sum_{n=0}^\\infty\\frac{(x-1)^n}{2^n}\\text{（以 }\\,x\\text{ 表示）}",
      "answerKind": "expression",
      "timeLimit": 120,
      "tags": [
        "geometric-series",
        "power-series",
        "lecture",
        "lecture-12",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "公比 r=(x-1)/2，收斂 ⇔|x-1|<2⇔-1<x<3（|r|=1 時一般項不趨近 0，發散）。\n和為 1/(1-(x-1)/2)=2/(3-x)。",
      "source": "微積分 20 講 · 第 12 講隨堂測驗",
      "lecture": "12",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-12-q1",
      "examTitle": "幾何級數與望遠鏡級數。",
      "answer": "2/(3-x)",
      "verify": {
        "m": "fn",
        "cases": [
          {
            "at": {
              "x": 0.3
            },
            "v": {
              "m": "series",
              "f": "\\frac{(0.3-1)^n}{2^n}",
              "from": 0
            }
          },
          {
            "at": {
              "x": 1.7
            },
            "v": {
              "m": "series",
              "f": "\\frac{(1.7-1)^n}{2^n}",
              "from": 0
            }
          },
          {
            "at": {
              "x": -0.5
            },
            "v": {
              "m": "series",
              "f": "\\frac{(-0.5-1)^n}{2^n}",
              "from": 0
            }
          }
        ]
      }
    },
    {
      "id": "lec-12-q2a",
      "topic": "series",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{證明 }\\sum_{n=1}^N\\frac1n\\ge\\ln(N+1)\\text{（在 }[n,n+1]\\text{ 上 }\\frac1x\\le\\frac1n\\text{），所以調和級數發散。}",
      "answerKind": "proof",
      "timeLimit": 300,
      "tags": [
        "proof",
        "written-proof",
        "integral-test",
        "convergence-test",
        "lecture",
        "lecture-12",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "在 [n,n+1] 上 1/x≤ 1/n，所以長方形面積 1/n≥ ∫_n^(n+1)dx/x。相加得 Σ_(n=1)^N1/n≥ ∫_1^(N+1)dx/x=ln(N+1)→ ∞ ，故發散。",
      "source": "微積分 20 講 · 第 12 講隨堂測驗",
      "lecture": "12",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-12-q2",
      "examTitle": "積分判別。",
      "proofSpec": "pl-lec-harmonic-lower",
      "answer": "（白話證明．機器判分）",
      "hints": [
        "一行一句，每句用一種句型開頭：任取／取／假設／則／由…／因為…所以／故。",
        "先寫出要證的東西長什麼樣，再一步一步扣回去。",
        "每一行都會被檢查：站不住的那一行會標紅。"
      ]
    },
    {
      "id": "lec-12-q2b",
      "topic": "series",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{判斷 }\\sum_{n=2}^\\infty\\frac1{n\\ln n}\\text{ 收斂或發散}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "convergence-test",
        "integral-test",
        "lecture",
        "lecture-12",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "f(x)=1/(xln x) 在 x≥2 為正、連續、遞減。令 u=ln x：\n∫_2^∞ dx/(xln x)=∫_(ln2)^∞ du/u=∞ ，發散。\n∫_2^∞ dx/(x(ln x)^2)=∫_(ln2)^∞ du/(u^2)=1/ln2<∞ ，收斂。",
      "source": "微積分 20 講 · 第 12 講隨堂測驗",
      "lecture": "12",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-12-q2",
      "examTitle": "積分判別。",
      "answers": [
        "發散",
        "diverges",
        "divergent"
      ],
      "canonical": "發散",
      "answer": "發散",
      "verify": {
        "m": "seriesConverges",
        "f": "\\frac{1}{n\\ln n}",
        "from": 2
      }
    },
    {
      "id": "lec-12-q2c",
      "topic": "series",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{判斷 }\\sum_{n=1}^\\infty ne^{-n^2}\\text{ 收斂或發散}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "convergence-test",
        "integral-test",
        "lecture",
        "lecture-12",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "f(x)=xe^(-x^2)，f'(x)=(1-2x^2)e^(-x^2)<0（x≥1），遞減且為正。\n∫_1^∞ xe^(-x^2)dx=[-1/2e^(-x^2)]_1^∞ =1/2e，收斂。",
      "source": "微積分 20 講 · 第 12 講隨堂測驗",
      "lecture": "12",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-12-q2",
      "examTitle": "積分判別。",
      "answers": [
        "收斂",
        "converges",
        "convergent"
      ],
      "canonical": "收斂",
      "answer": "收斂",
      "verify": {
        "m": "seriesConverges",
        "f": "ne^{-n^2}",
        "from": 1
      }
    },
    {
      "id": "lec-12-q2d",
      "topic": "series",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{用 }\\,s_n=\\sum_{k=1}^n\\frac1{k^3}\\text{ 近似 }\\sum_{k=1}^\\infty\\frac1{k^3}\\text{。用積分判別的餘項估計 }\\,R_n\\le\\int_n^\\infty x^{-3}\\,dx\\text{，求使誤差 }\\,R_n\\le0.005\\text{ 的最小 }\\,n",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "convergence-test",
        "error-bound",
        "lecture",
        "lecture-12",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "R_n≤ ∫_n^∞ dx/(x^3)=1/(2n^2)。要 1/(2n^2)≤0.005⇔ n^2≥100⇔ n≥10，取 n=10。",
      "source": "微積分 20 講 · 第 12 講隨堂測驗",
      "lecture": "12",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-12-q2",
      "examTitle": "積分判別。",
      "answer": "10",
      "verify": {
        "m": "firstIndex",
        "f": "\\int_n^{\\infty}x^{-3}\\,dx",
        "below": 0.0050000001
      }
    },
    {
      "id": "lec-12-q3a",
      "topic": "series",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{判斷 }\\sum_{n=1}^\\infty\\frac1{2^n+n}\\text{ 收斂或發散}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "convergence-test",
        "comparison-test",
        "lecture",
        "lecture-12",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "0<1/(2^n+n)<1/(2^n)，Σ1/(2^n) 收斂，由比較判別收斂。",
      "source": "微積分 20 講 · 第 12 講隨堂測驗",
      "lecture": "12",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-12-q3",
      "examTitle": "比較判別。",
      "answers": [
        "收斂",
        "converges",
        "convergent"
      ],
      "canonical": "收斂",
      "answer": "收斂",
      "verify": {
        "m": "seriesConverges",
        "f": "\\frac{1}{2^n+n}",
        "from": 1
      }
    },
    {
      "id": "lec-12-q3b",
      "topic": "series",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{判斷 }\\sum_{n=1}^\\infty\\frac{n+1}{n^3-n+5}\\text{ 收斂或發散}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "convergence-test",
        "comparison-test",
        "lecture",
        "lecture-12",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "與 1/(n^2) 極限比較：((n+1)/(n^3-n+5))/(1/n^2)=(n^3+n^2)/(n^3-n+5)→1，Σ1/(n^2) 收斂，故收斂。\n（各項為正：n^3-n+5>0。直接比較不好做，因為分母有負項。）",
      "source": "微積分 20 講 · 第 12 講隨堂測驗",
      "lecture": "12",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-12-q3",
      "examTitle": "比較判別。",
      "answers": [
        "收斂",
        "converges",
        "convergent"
      ],
      "canonical": "收斂",
      "answer": "收斂",
      "verify": {
        "m": "seriesConverges",
        "f": "\\frac{n+1}{n^3-n+5}",
        "from": 1
      }
    },
    {
      "id": "lec-12-q3c",
      "topic": "series",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{判斷 }\\sum_{n=1}^\\infty\\sin\\frac1n\\text{ 收斂或發散}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "convergence-test",
        "comparison-test",
        "lecture",
        "lecture-12",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "與 1/n 極限比較：(sin(1/n))/(1/n)→1，Σ1/n 發散，故發散。雖然 sin1/n→0，仍然發散。",
      "source": "微積分 20 講 · 第 12 講隨堂測驗",
      "lecture": "12",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-12-q3",
      "examTitle": "比較判別。",
      "answers": [
        "發散",
        "diverges",
        "divergent"
      ],
      "canonical": "發散",
      "answer": "發散",
      "verify": {
        "m": "seriesConverges",
        "f": "\\sin\\frac{1}{n}",
        "from": 1
      }
    },
    {
      "id": "lec-12-q3d",
      "topic": "series",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{判斷 }\\sum_{n=1}^\\infty\\frac{\\ln n}{n^3}\\text{ 收斂或發散}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "convergence-test",
        "comparison-test",
        "lecture",
        "lecture-12",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "ln n<n，所以 0≤ (ln n)/(n^3)<1/(n^2)，由比較判別收斂。",
      "source": "微積分 20 講 · 第 12 講隨堂測驗",
      "lecture": "12",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-12-q3",
      "examTitle": "比較判別。",
      "answers": [
        "收斂",
        "converges",
        "convergent"
      ],
      "canonical": "收斂",
      "answer": "收斂",
      "verify": {
        "m": "seriesConverges",
        "f": "\\frac{\\ln n}{n^3}",
        "from": 1
      }
    },
    {
      "id": "lec-12-q4a",
      "topic": "series",
      "difficulty": 4,
      "rank": 4,
      "authoredRank": 4,
      "prompt": "\\text{令 }\\,H_n=1+\\frac12+\\cdots+\\frac1n\\text{。用數學歸納法證明 }\\,H_{2^k}\\ge1+\\frac k2\\text{ 對所有正整數 }\\,k\\text{ 成立。}",
      "answerKind": "proof",
      "timeLimit": 360,
      "tags": [
        "proof",
        "written-proof",
        "induction",
        "convergence-test",
        "lecture",
        "lecture-12",
        "exam-style",
        "midterm-style",
        "rank-4"
      ],
      "solution": "第 j 組為 1/(2^(j-1)+1)+… +1/(2^j)，共 2^(j-1) 項，每項 ≥ 1/(2^j)，組和 ≥ 1/2。\nH_(2^k)=1+1/2+(第 2 組)+… +(第 k 組)≥1+k/2。\nk→ ∞ 時右式 → ∞ ，而 H_n 遞增，故發散。",
      "source": "微積分 20 講 · 第 12 講隨堂測驗",
      "lecture": "12",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-12-q4",
      "examTitle": "調和級數有多慢？",
      "proofSpec": "pl-lec-harmonic-doubling",
      "answer": "（白話證明．機器判分）",
      "hints": [
        "一行一句，每句用一種句型開頭：任取／取／假設／則／由…／因為…所以／故。",
        "先寫出要證的東西長什麼樣，再一步一步扣回去。",
        "每一行都會被檢查：站不住的那一行會標紅。"
      ]
    },
    {
      "id": "lec-12-q4b",
      "topic": "series",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{令 }\\,H_n=1+\\frac12+\\cdots+\\frac1n\\text{。證明 }\\,H_n\\le1+\\ln n\\text{（在 }[k-1,k]\\text{ 上 }\\frac1x\\ge\\frac1k\\text{）。}",
      "answerKind": "proof",
      "timeLimit": 300,
      "tags": [
        "proof",
        "written-proof",
        "integral-test",
        "convergence-test",
        "lecture",
        "lecture-12",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "在 [k-1,k] 上 1/x≥ 1/k，所以 1/k≤ ∫_(k-1)^kdx/x。對 k=2,…,n 相加：\nH_n-1≤ ∫_1^ndx/x=ln n。",
      "source": "微積分 20 講 · 第 12 講隨堂測驗",
      "lecture": "12",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-12-q4",
      "examTitle": "調和級數有多慢？",
      "proofSpec": "pl-lec-harmonic-upper",
      "answer": "（白話證明．機器判分）",
      "hints": [
        "一行一句，每句用一種句型開頭：任取／取／假設／則／由…／因為…所以／故。",
        "先寫出要證的東西長什麼樣，再一步一步扣回去。",
        "每一行都會被檢查：站不住的那一行會標紅。"
      ]
    },
    {
      "id": "lec-12-q4d",
      "topic": "series",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{判斷 }\\sum_{n=1}^\\infty\\ln\\frac{n}{n+1}\\text{ 收斂或發散}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "telescoping",
        "limit-trap",
        "lecture",
        "lecture-12",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "\\lnn/(n+1)=ln n-ln(n+1)，望遠鏡：S_N=ln1-ln(N+1)=-ln(N+1)→ -∞ ，發散。\n雖然一般項 → ln1=0，級數仍發散。",
      "source": "微積分 20 講 · 第 12 講隨堂測驗",
      "lecture": "12",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-12-q4",
      "examTitle": "調和級數有多慢？",
      "answers": [
        "發散",
        "diverges",
        "divergent"
      ],
      "canonical": "發散",
      "answer": "發散",
      "verify": {
        "m": "seriesConverges",
        "f": "\\ln\\frac{n}{n+1}",
        "from": 1
      }
    },
    {
      "id": "lec-13-m1",
      "topic": "series",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{交錯調和級數 }\\sum_{n=1}^\\infty\\frac{(-1)^{n+1}}{n}\\text{ 是}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "convergence-test",
        "alternating-series",
        "lecture",
        "lecture-13",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "b_n=1/n 遞減趨近 0，由交錯級數判別收斂；但 Σ|a_n|=Σ1/n 發散，故為條件收斂。",
      "source": "微積分 20 講 · 第 13 講隨堂測驗",
      "lecture": "13",
      "examPart": "mc",
      "answers": [
        "條件收斂",
        "conditionally convergent",
        "conditionally converges",
        "conditional"
      ],
      "canonical": "條件收斂",
      "answer": "條件收斂",
      "distractors": [
        "絕對收斂",
        "發散",
        "無法判斷"
      ]
    },
    {
      "id": "lec-13-m2",
      "topic": "series",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{對 }\\sum_{n=1}^\\infty\\frac{n!}{n^n}\\text{ 使用比值判別，所得極限 }\\,L",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "ratio-test",
        "lecture",
        "lecture-13",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "(a_(n+1))/a_n=((n+1)!)/((n+1)^(n+1))· (n^n)/(n!)=(n/(n+1))^n=1/((1+1/n)^n)→ 1/e<1，收斂。",
      "source": "微積分 20 講 · 第 13 講隨堂測驗",
      "lecture": "13",
      "examPart": "mc",
      "answer": "exp(-1)",
      "distractors": [
        "exp(1)",
        "1",
        "0"
      ],
      "verify": {
        "m": "seqLimit",
        "f": "\\left(\\frac{n}{n+1}\\right)^n"
      }
    },
    {
      "id": "lec-13-m3",
      "topic": "series",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\text{若比值判別得到 }\\,L=1\\text{，則}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "ratio-test",
        "lecture",
        "lecture-13",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "Σ1/n（發散）與 Σ1/(n^2)（收斂）比值判別都得 L=1，所以 L=1 時無法下結論，要改用別的判別法。",
      "source": "微積分 20 講 · 第 13 講隨堂測驗",
      "lecture": "13",
      "examPart": "mc",
      "answers": [
        "無法由此判斷",
        "無法判斷",
        "inconclusive"
      ],
      "canonical": "無法由此判斷",
      "answer": "無法由此判斷",
      "distractors": [
        "級數必收斂",
        "級數必發散",
        "級數必條件收斂"
      ]
    },
    {
      "id": "lec-13-m4",
      "topic": "series",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\sum_{n=1}^\\infty(-1)^n\\frac{n}{n+1}\\text{ 是}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "convergence-test",
        "limit-trap",
        "lecture",
        "lecture-13",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "|a_n|=n/(n+1)→1≠0，一般項不趨近 0，由第 n 項判別發散。交錯的符號救不了它。",
      "source": "微積分 20 講 · 第 13 講隨堂測驗",
      "lecture": "13",
      "examPart": "mc",
      "answers": [
        "發散",
        "diverges",
        "divergent"
      ],
      "canonical": "發散",
      "answer": "發散",
      "distractors": [
        "絕對收斂",
        "條件收斂",
        "收斂到 −1/2"
      ]
    },
    {
      "id": "lec-13-m5",
      "topic": "series",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{用 }\\sum_{n=0}^{3}\\frac{(-1)^n}{n!}\\text{ （前 4 項）近似 }\\sum_{n=0}^\\infty\\frac{(-1)^n}{n!}\\text{，誤差的上界為}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "alternating-series",
        "error-bound",
        "lecture",
        "lecture-13",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "交錯級數，b_n=1/(n!) 遞減趨近 0。誤差 ≤ 第一個被捨去的項 b_4=1/(4!)=1/24。",
      "source": "微積分 20 講 · 第 13 講隨堂測驗",
      "lecture": "13",
      "examPart": "mc",
      "answer": "1/24",
      "distractors": [
        "1/6",
        "1/120",
        "1/720"
      ],
      "verify": {
        "m": "series",
        "f": "\\frac{1}{n!}",
        "from": 4,
        "to": 4
      }
    },
    {
      "id": "lec-13-q1a",
      "topic": "series",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\sum_{n=1}^\\infty\\frac{(-1)^n}{\\sqrt n}\\text{ 是絕對收斂、條件收斂還是發散？}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "alternating-series",
        "convergence-test",
        "lecture",
        "lecture-13",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "1/(√(n)) 遞減趨近 0，交錯級數判別收斂；Σ1/(√(n)) 為 p=1/2 的 p 級數，發散。條件收斂。",
      "source": "微積分 20 講 · 第 13 講隨堂測驗",
      "lecture": "13",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-13-q1",
      "examTitle": "絕對收斂、條件收斂或發散？",
      "answers": [
        "條件收斂",
        "conditionally convergent",
        "conditionally converges",
        "conditional"
      ],
      "canonical": "條件收斂",
      "answer": "條件收斂",
      "distractors": [
        "絕對收斂",
        "發散"
      ]
    },
    {
      "id": "lec-13-q1b",
      "topic": "series",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\sum_{n=1}^\\infty\\frac{(-1)^n}{n^2}\\text{ 是絕對收斂、條件收斂還是發散？}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "alternating-series",
        "convergence-test",
        "lecture",
        "lecture-13",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "Σ1/(n^2) 收斂，絕對收斂。",
      "source": "微積分 20 講 · 第 13 講隨堂測驗",
      "lecture": "13",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-13-q1",
      "examTitle": "絕對收斂、條件收斂或發散？",
      "answers": [
        "絕對收斂",
        "absolutely convergent",
        "absolutely converges",
        "absolute"
      ],
      "canonical": "絕對收斂",
      "answer": "絕對收斂",
      "distractors": [
        "條件收斂",
        "發散"
      ]
    },
    {
      "id": "lec-13-q1c",
      "topic": "series",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\sum_{n=1}^\\infty\\frac{\\cos n}{n^2}\\text{ 是絕對收斂、條件收斂還是發散？}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "comparison-test",
        "convergence-test",
        "lecture",
        "lecture-13",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "不是交錯級數（符號不規則），但 |(cos n)/(n^2)|≤ 1/(n^2)，由比較判別 Σ|a_n| 收斂，絕對收斂，因此收斂。",
      "source": "微積分 20 講 · 第 13 講隨堂測驗",
      "lecture": "13",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-13-q1",
      "examTitle": "絕對收斂、條件收斂或發散？",
      "answers": [
        "絕對收斂",
        "absolutely convergent",
        "absolutely converges",
        "absolute"
      ],
      "canonical": "絕對收斂",
      "answer": "絕對收斂",
      "distractors": [
        "條件收斂",
        "發散"
      ]
    },
    {
      "id": "lec-13-q1d",
      "topic": "series",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\sum_{n=1}^\\infty(-1)^n\\frac{n}{n^2+1}\\text{ 是絕對收斂、條件收斂還是發散？}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "alternating-series",
        "convergence-test",
        "lecture",
        "lecture-13",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "f(x)=x/(x^2+1)，f'(x)=(1-x^2)/((x^2+1)^2)≤0（x≥1），b_n 遞減且 →0，交錯級數判別收斂。\n(n/(n^2+1))/(1/n)→1，Σ|a_n| 與 Σ1/n 同為發散。條件收斂。",
      "source": "微積分 20 講 · 第 13 講隨堂測驗",
      "lecture": "13",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-13-q1",
      "examTitle": "絕對收斂、條件收斂或發散？",
      "answers": [
        "條件收斂",
        "conditionally convergent",
        "conditionally converges",
        "conditional"
      ],
      "canonical": "條件收斂",
      "answer": "條件收斂",
      "distractors": [
        "絕對收斂",
        "發散"
      ]
    },
    {
      "id": "lec-13-q2a",
      "topic": "series",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{判斷 }\\sum_{n=1}^\\infty\\frac{n^2}{2^n}\\text{ 收斂或發散}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "ratio-test",
        "lecture",
        "lecture-13",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "比值：((n+1)^2)/(2n^2)→ 1/2<1，收斂。",
      "source": "微積分 20 講 · 第 13 講隨堂測驗",
      "lecture": "13",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-13-q2",
      "examTitle": "比值與根值判別。",
      "answers": [
        "收斂",
        "converges",
        "convergent"
      ],
      "canonical": "收斂",
      "answer": "收斂",
      "verify": {
        "m": "seriesConverges",
        "f": "\\frac{n^2}{2^n}",
        "from": 1
      }
    },
    {
      "id": "lec-13-q2b",
      "topic": "series",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{判斷 }\\sum_{n=0}^\\infty\\frac{3^n}{n!}\\text{ 收斂或發散}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "ratio-test",
        "lecture",
        "lecture-13",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "比值：3/(n+1)→0<1，收斂。（階乘出現時通常用比值判別。）",
      "source": "微積分 20 講 · 第 13 講隨堂測驗",
      "lecture": "13",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-13-q2",
      "examTitle": "比值與根值判別。",
      "answers": [
        "收斂",
        "converges",
        "convergent"
      ],
      "canonical": "收斂",
      "answer": "收斂",
      "verify": {
        "m": "seriesConverges",
        "f": "\\frac{3^n}{n!}",
        "from": 0
      }
    },
    {
      "id": "lec-13-q2c",
      "topic": "series",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{判斷 }\\sum_{n=1}^\\infty\\Bigl(\\frac{n}{2n+1}\\Bigr)^n\\text{ 收斂或發散}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "root-test",
        "lecture",
        "lecture-13",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "根值：(a_n)^(1/n)=n/(2n+1)→ 1/2<1，收斂。",
      "source": "微積分 20 講 · 第 13 講隨堂測驗",
      "lecture": "13",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-13-q2",
      "examTitle": "比值與根值判別。",
      "answers": [
        "收斂",
        "converges",
        "convergent"
      ],
      "canonical": "收斂",
      "answer": "收斂",
      "verify": {
        "m": "seriesConverges",
        "f": "\\left(\\frac{n}{2n+1}\\right)^n",
        "from": 1
      }
    },
    {
      "id": "lec-13-q2d",
      "topic": "series",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{判斷 }\\sum_{n=1}^\\infty\\frac{n^n}{n!}\\text{ 收斂或發散}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "ratio-test",
        "lecture",
        "lecture-13",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "比值：((n+1)^(n+1))/((n+1)!)· (n!)/(n^n)=((n+1)/n)^n→ e>1，發散。",
      "source": "微積分 20 講 · 第 13 講隨堂測驗",
      "lecture": "13",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-13-q2",
      "examTitle": "比值與根值判別。",
      "answers": [
        "發散",
        "diverges",
        "divergent"
      ],
      "canonical": "發散",
      "answer": "發散",
      "verify": {
        "m": "seriesConverges",
        "f": "\\frac{n^n}{n!}",
        "from": 1
      }
    },
    {
      "id": "lec-13-q2e",
      "topic": "series",
      "difficulty": 4,
      "rank": 4,
      "authoredRank": 4,
      "prompt": "\\text{判斷 }\\sum_{n=1}^\\infty\\frac{(1+\\frac1n)^{n^2}}{3^n}\\text{ 收斂或發散}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "root-test",
        "lecture",
        "lecture-13",
        "exam-style",
        "midterm-style",
        "rank-4"
      ],
      "solution": "根值：(a_n)^(1/n)=((1+1/n)^n)/3→ e/3<1，收斂。（整個 n 次方結構用根值判別最直接。）",
      "source": "微積分 20 講 · 第 13 講隨堂測驗",
      "lecture": "13",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-13-q2",
      "examTitle": "比值與根值判別。",
      "answers": [
        "收斂",
        "converges",
        "convergent"
      ],
      "canonical": "收斂",
      "answer": "收斂",
      "verify": {
        "m": "seriesConverges",
        "f": "\\frac{(1+\\frac{1}{n})^{n^2}}{3^n}",
        "from": 1
      }
    },
    {
      "id": "lec-13-q3b",
      "topic": "series",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{設 }\\,S=\\sum_{n=1}^\\infty\\frac{(-1)^{n+1}}{n^3}\\text{， }\\,S_n\\text{ 為部分和。用交錯級數的誤差估計，要保證 }\\left|S-S_n\\right|<0.01\\text{， }\\,n\\text{ 至少要多少？}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "alternating-series",
        "error-bound",
        "lecture",
        "lecture-13",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "需 b_(n+1)=1/((n+1)^3)<0.01，即 (n+1)^3>100。4^3=64，5^3=125，所以 n+1≥5，n=4。",
      "source": "微積分 20 講 · 第 13 講隨堂測驗",
      "lecture": "13",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-13-q3",
      "examTitle": "交錯級數的誤差估計。",
      "answer": "4",
      "verify": {
        "m": "firstIndex",
        "f": "\\frac{1}{(n+1)^3}",
        "below": 0.01
      }
    },
    {
      "id": "lec-13-q3c",
      "topic": "series",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{設 }\\,S=\\sum_{n=1}^\\infty\\frac{(-1)^{n+1}}{n^3}\\text{。求部分和 }\\,S_4\\text{（寫成分數）}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "alternating-series",
        "lecture",
        "lecture-13",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "S_4=1-1/8+1/27-1/64=(1728-216+64-27)/1728=1549/1728≈0.8964。\nS_4 的最後一項為負，所以 S_4<S<S_4+1/125，即 0.8964<S<0.9044。\n（S≈0.9015。）",
      "source": "微積分 20 講 · 第 13 講隨堂測驗",
      "lecture": "13",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-13-q3",
      "examTitle": "交錯級數的誤差估計。",
      "answer": "1549/1728",
      "verify": {
        "m": "series",
        "f": "\\frac{(-1)^{n+1}}{n^3}",
        "from": 1,
        "to": 4
      }
    },
    {
      "id": "lec-13-q4a",
      "topic": "series",
      "difficulty": 4,
      "rank": 4,
      "authoredRank": 4,
      "prompt": "\\text{求所有使 }\\sum_{n=1}^\\infty\\frac{(-1)^n}{n^p}\\text{ 條件收斂的實數 }\\,p\\text{（寫成區間）}",
      "answerKind": "interval",
      "timeLimit": 120,
      "tags": [
        "alternating-series",
        "convergence-test",
        "lecture",
        "lecture-13",
        "exam-style",
        "midterm-style",
        "rank-4"
      ],
      "solution": "p>1：Σ1/(n^p) 收斂，絕對收斂。\n0<p≤1：1/(n^p) 遞減趨近 0，交錯級數判別收斂，但 Σ1/(n^p) 發散，條件收斂。\np≤0：|a_n|=n^(-p)≥1，一般項不趨近 0，發散。",
      "source": "微積分 20 講 · 第 13 講隨堂測驗",
      "lecture": "13",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-13-q4",
      "examTitle": "含參數的級數與重排。",
      "answer": "(0, 1]"
    },
    {
      "id": "lec-14-m1",
      "topic": "series",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\sum_{n=0}^\\infty\\frac{x^n}{3^n}\\text{ 的收斂半徑為}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "power-series",
        "radius",
        "lecture",
        "lecture-14",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "幾何級數，公比 x/3，收斂 ⇔|x|<3，R=3。",
      "source": "微積分 20 講 · 第 14 講隨堂測驗",
      "lecture": "14",
      "examPart": "mc",
      "answer": "3",
      "distractors": [
        "1/3",
        "1",
        "inf"
      ]
    },
    {
      "id": "lec-14-m2",
      "topic": "series",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\sum_{n=0}^\\infty n!\\,x^n\\text{ 的收斂半徑為}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "power-series",
        "radius",
        "lecture",
        "lecture-14",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "比值：|((n+1)!x^(n+1))/(n!x^n)|=(n+1)|x|→ ∞ （x≠0），只在 x=0 收斂，R=0。",
      "source": "微積分 20 講 · 第 14 講隨堂測驗",
      "lecture": "14",
      "examPart": "mc",
      "answer": "0",
      "distractors": [
        "1",
        "exp(1)",
        "inf"
      ]
    },
    {
      "id": "lec-14-m3",
      "topic": "series",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\sum_{n=0}^\\infty\\frac{x^n}{n!}\\text{ 的收斂半徑為}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "power-series",
        "radius",
        "lecture",
        "lecture-14",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "比值：(|x|)/(n+1)→0<1 對所有 x 成立，R=∞ 。",
      "source": "微積分 20 講 · 第 14 講隨堂測驗",
      "lecture": "14",
      "examPart": "mc",
      "answers": [
        "∞",
        "inf",
        "infinity",
        "無限大",
        "無窮大"
      ],
      "canonical": "∞",
      "answer": "∞",
      "distractors": [
        "0",
        "1",
        "e"
      ]
    },
    {
      "id": "lec-14-m4",
      "topic": "series",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\text{在 }\\left|x\\right|<1\\text{ 內， }\\dfrac1{1+x^2}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "power-series",
        "geometric-series",
        "lecture",
        "lecture-14",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "在 1/(1-u)=Σ u^n 中以 u=-x^2 代入：Σ(-x^2)^n=Σ(-1)^nx^(2n)。",
      "source": "微積分 20 講 · 第 14 講隨堂測驗",
      "lecture": "14",
      "examPart": "mc",
      "answers": [
        "Σ (−1)ⁿ x^(2n)",
        "sum (-1)^n x^(2n)",
        "(-1)^n x^(2n)"
      ],
      "canonical": "Σ (−1)ⁿ x^(2n)",
      "answer": "Σ (−1)ⁿ x^(2n)",
      "distractors": [
        "Σ x^(2n)",
        "Σ (−1)ⁿ xⁿ",
        "Σ (−1)ⁿ x^(2n+1)"
      ]
    },
    {
      "id": "lec-14-m5",
      "topic": "series",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\sum_{n=1}^\\infty\\frac{x^n}{n}\\text{ 的收斂區間為}",
      "answerKind": "interval",
      "timeLimit": 120,
      "tags": [
        "power-series",
        "endpoint-analysis",
        "lecture",
        "lecture-14",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "R=1。x=1：Σ1/n 發散；x=-1：Σ((-1)^n)/n 由交錯級數判別收斂。故為 [-1,1)。\n兩端點的行為可以不同，每個端點都要個別檢查。",
      "source": "微積分 20 講 · 第 14 講隨堂測驗",
      "lecture": "14",
      "examPart": "mc",
      "answer": "[-1, 1)",
      "distractors": [
        "(-1, 1)",
        "[-1, 1]",
        "(-1, 1]"
      ],
      "verify": {
        "m": "convergence",
        "f": "\\frac{x^n}{n}",
        "center": 0,
        "from": 1,
        "range": [
          -100,
          100
        ]
      }
    },
    {
      "id": "lec-14-q1a",
      "topic": "series",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{求 }\\sum_{n=1}^\\infty\\frac{(x-2)^n}{n\\cdot3^n}\\text{ 的收斂區間（端點要檢查）}",
      "answerKind": "interval",
      "timeLimit": 120,
      "tags": [
        "power-series",
        "endpoint-analysis",
        "lecture",
        "lecture-14",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "比值：n/(n+1)· (|x-2|)/3→ (|x-2|)/3<1，R=3，中心 2。\nx=5：Σ1/n 發散；x=-1：Σ((-1)^n)/n 收斂。區間 [-1,5)。",
      "source": "微積分 20 講 · 第 14 講隨堂測驗",
      "lecture": "14",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-14-q1",
      "examTitle": "收斂半徑與收斂區間。",
      "answer": "[-1, 5)",
      "verify": {
        "m": "convergence",
        "f": "\\frac{1}{n}\\left(\\frac{x-2}{3}\\right)^n",
        "center": 2,
        "from": 1,
        "range": [
          -100,
          100
        ]
      }
    },
    {
      "id": "lec-14-q1b",
      "topic": "series",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{求 }\\sum_{n=1}^\\infty\\frac{n(x+1)^n}{4^n}\\text{ 的收斂區間（端點要檢查）}",
      "answerKind": "interval",
      "timeLimit": 120,
      "tags": [
        "power-series",
        "endpoint-analysis",
        "lecture",
        "lecture-14",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "比值：(n+1)/n· (|x+1|)/4→ (|x+1|)/4，R=4。\nx=3 與 x=-5：|a_n|=n¬→0，發散。區間 (-5,3)。",
      "source": "微積分 20 講 · 第 14 講隨堂測驗",
      "lecture": "14",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-14-q1",
      "examTitle": "收斂半徑與收斂區間。",
      "answer": "(-5, 3)",
      "verify": {
        "m": "convergence",
        "f": "n\\left(\\frac{x+1}{4}\\right)^n",
        "center": -1,
        "from": 1,
        "range": [
          -100,
          100
        ]
      }
    },
    {
      "id": "lec-14-q1c",
      "topic": "series",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{求 }\\sum_{n=1}^\\infty\\frac{x^{2n}}{n^2\\,9^n}\\text{ 的收斂區間（端點要檢查）}",
      "answerKind": "interval",
      "timeLimit": 120,
      "tags": [
        "power-series",
        "endpoint-analysis",
        "lecture",
        "lecture-14",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "比值：(n^2)/((n+1)^2)· (x^2)/9→ (x^2)/9<1⇔|x|<3，R=3。\nx=±3：Σ1/(n^2) 收斂。區間 [-3,3]。（只有偶次方，比值判別要對整個項做，不能套 a_n 係數公式。）",
      "source": "微積分 20 講 · 第 14 講隨堂測驗",
      "lecture": "14",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-14-q1",
      "examTitle": "收斂半徑與收斂區間。",
      "answer": "[-3, 3]",
      "verify": {
        "m": "convergence",
        "f": "\\frac{1}{n^2}\\left(\\frac{x^2}{9}\\right)^n",
        "center": 0,
        "from": 1,
        "range": [
          -100,
          100
        ]
      }
    },
    {
      "id": "lec-14-q1d",
      "topic": "series",
      "difficulty": 4,
      "rank": 4,
      "authoredRank": 4,
      "prompt": "\\text{求 }\\sum_{n=1}^\\infty\\frac{(2x-1)^n}{\\sqrt n}\\text{ 的收斂區間（端點要檢查）}",
      "answerKind": "interval",
      "timeLimit": 120,
      "tags": [
        "power-series",
        "endpoint-analysis",
        "lecture",
        "lecture-14",
        "exam-style",
        "midterm-style",
        "rank-4"
      ],
      "solution": "比值：√(n/(n+1))|2x-1|→ |2x-1|<1⇔0<x<1，R=1/2，中心 1/2。\nx=1：Σ1/(√(n)) 發散；x=0：Σ((-1)^n)/(√(n)) 收斂。區間 [0,1)。",
      "source": "微積分 20 講 · 第 14 講隨堂測驗",
      "lecture": "14",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-14-q1",
      "examTitle": "收斂半徑與收斂區間。",
      "answer": "[0, 1)",
      "verify": {
        "m": "convergence",
        "f": "\\frac{(2x-1)^n}{\\sqrt{n}}",
        "center": "\\frac{1}{2}",
        "from": 1,
        "range": [
          -100,
          100
        ]
      }
    },
    {
      "id": "lec-14-q2a",
      "topic": "series",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{求 }\\,f(x)=\\dfrac{x}{4+x^2}\\text{ 的 Maclaurin 冪級數的收斂半徑}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "power-series",
        "radius",
        "lecture",
        "lecture-14",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "x/(4+x^2)=x/4· 1/(1+(x/2)^2)=x/4Σ_(n=0)^∞ (-1)^n(x^(2n))/(4^n)=Σ_(n=0)^∞ ((-1)^nx^(2n+1))/(4^(n+1)). \n需 |x/2|<1，R=2。",
      "source": "微積分 20 講 · 第 14 講隨堂測驗",
      "lecture": "14",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-14-q2",
      "examTitle": "把函數寫成冪級數。",
      "answer": "2"
    },
    {
      "id": "lec-14-q2b",
      "topic": "series",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{由 }\\dfrac1{1+x}\\text{ 逐項積分得到 }\\ln(1+x)\\text{ 的冪級數，求其中 }\\,x^4\\text{ 的係數}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "power-series",
        "coefficient",
        "lecture",
        "lecture-14",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "1/(1+t)=Σ(-1)^nt^n，|t|<1。從 0 積到 x：\n ln(1+x)=Σ_(n=0)^∞ ((-1)^nx^(n+1))/(n+1)=x-(x^2)/2+(x^3)/3-… , R=1. \n（積分常數：x=0 時兩邊都是 0。）",
      "source": "微積分 20 講 · 第 14 講隨堂測驗",
      "lecture": "14",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-14-q2",
      "examTitle": "把函數寫成冪級數。",
      "answer": "-1/4",
      "verify": {
        "m": "derivAt0",
        "coef": true,
        "f": "\\ln(1+x)",
        "n": 4,
        "r": 0.5
      }
    },
    {
      "id": "lec-14-q2c",
      "topic": "series",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{求 }\\arctan x\\text{ 的 Maclaurin 冪級數中 }\\,x^7\\text{ 的係數}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "power-series",
        "coefficient",
        "lecture",
        "lecture-14",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "arctan x=∫_0^xdt/(1+t^2)=Σ_(n=0)^∞ ((-1)^nx^(2n+1))/(2n+1)，R=1。",
      "source": "微積分 20 講 · 第 14 講隨堂測驗",
      "lecture": "14",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-14-q2",
      "examTitle": "把函數寫成冪級數。",
      "answer": "-1/7",
      "verify": {
        "m": "derivAt0",
        "coef": true,
        "f": "\\arctan x",
        "n": 7,
        "r": 0.5
      }
    },
    {
      "id": "lec-14-q3a",
      "topic": "series",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{利用冪級數的逐項微分，求 }\\sum_{n=1}^\\infty\\frac{n}{2^n}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "power-series",
        "series-sum",
        "lecture",
        "lecture-14",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "Σ_(n=0)^∞ x^n=1/(1-x) 微分再乘 x：Σ_(n=1)^∞ nx^n=x/((1-x)^2)（|x|<1）。\nx=1/2：(1/2)/(1/4)=2。",
      "source": "微積分 20 講 · 第 14 講隨堂測驗",
      "lecture": "14",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-14-q3",
      "examTitle": "求級數的和。",
      "answer": "2",
      "verify": {
        "m": "series",
        "f": "\\frac{n}{2^n}",
        "from": 1
      }
    },
    {
      "id": "lec-14-q3b",
      "topic": "series",
      "difficulty": 4,
      "rank": 4,
      "authoredRank": 4,
      "prompt": "\\text{利用冪級數的逐項微分，求 }\\sum_{n=1}^\\infty\\frac{n^2}{2^n}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "power-series",
        "series-sum",
        "lecture",
        "lecture-14",
        "exam-style",
        "midterm-style",
        "rank-4"
      ],
      "solution": "再對 x/((1-x)^2) 微分乘 x：Σ n^2x^n=x· (1+x)/((1-x)^3)。\nx=1/2：1/2· (3/2)/(1/8)=6。",
      "source": "微積分 20 講 · 第 14 講隨堂測驗",
      "lecture": "14",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-14-q3",
      "examTitle": "求級數的和。",
      "answer": "6",
      "verify": {
        "m": "series",
        "f": "\\frac{n^2}{2^n}",
        "from": 1
      }
    },
    {
      "id": "lec-14-q3c",
      "topic": "series",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{利用冪級數的逐項積分，求 }\\sum_{n=1}^\\infty\\frac{1}{n\\,2^n}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "power-series",
        "series-sum",
        "lecture",
        "lecture-14",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "Σ_(n=1)^∞ (x^n)/n=-ln(1-x)（把 (b) 中 ln(1+x) 的 x 換成 -x）。x=1/2：-ln1/2=ln2。",
      "source": "微積分 20 講 · 第 14 講隨堂測驗",
      "lecture": "14",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-14-q3",
      "examTitle": "求級數的和。",
      "answer": "ln(2)",
      "verify": {
        "m": "series",
        "f": "\\frac{1}{n2^n}",
        "from": 1
      }
    },
    {
      "id": "lec-14-q3d",
      "topic": "series",
      "difficulty": 4,
      "rank": 4,
      "authoredRank": 4,
      "prompt": "\\text{利用 }\\arctan x\\text{ 的冪級數，求 }\\sum_{n=0}^\\infty\\frac{(-1)^n}{(2n+1)\\,3^n}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "power-series",
        "series-sum",
        "lecture",
        "lecture-14",
        "exam-style",
        "midterm-style",
        "rank-4"
      ],
      "solution": "arctan x=Σ((-1)^nx^(2n+1))/(2n+1)，取 x=1/(√(3))：\nΣ((-1)^n)/((2n+1)3^n√(3))=(π)/6，所以原式 =(√(3)π)/6=(π)/(2√(3))。",
      "source": "微積分 20 講 · 第 14 講隨堂測驗",
      "lecture": "14",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-14-q3",
      "examTitle": "求級數的和。",
      "answer": "pi/(2*sqrt(3))",
      "verify": {
        "m": "series",
        "f": "\\frac{(-1)^n}{(2n+1)3^n}",
        "from": 0
      }
    },
    {
      "id": "lec-14-q4a",
      "topic": "series",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\text{令 }\\,f(x)=\\sum_{n=0}^\\infty\\frac{x^n}{n!}\\text{。求 }\\,f\\text{ 的定義域（收斂區間）}",
      "answerKind": "interval",
      "timeLimit": 120,
      "tags": [
        "power-series",
        "radius",
        "lecture",
        "lecture-14",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "由選擇題第 3 題，R=∞ ，定義域為全體實數。",
      "source": "微積分 20 講 · 第 14 講隨堂測驗",
      "lecture": "14",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-14-q4",
      "examTitle": "用冪級數定義函數。",
      "answer": "(-inf, inf)",
      "verify": {
        "m": "convergence",
        "f": "\\frac{x^n}{n!}",
        "center": 0,
        "from": 0,
        "range": [
          -100,
          100
        ]
      }
    },
    {
      "id": "lec-14-q4d",
      "topic": "series",
      "difficulty": 4,
      "rank": 4,
      "authoredRank": 4,
      "prompt": "\\text{利用 }\\,e^x=\\sum_{n=0}^\\infty\\frac{x^n}{n!}\\text{，求 }\\sum_{n=1}^\\infty\\frac{n^2}{n!}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "power-series",
        "series-sum",
        "lecture",
        "lecture-14",
        "exam-style",
        "midterm-style",
        "rank-4"
      ],
      "solution": "Σ_(n≥1)n/(n!)=Σ_(n≥1)1/((n-1)!)=e。\n(n^2)/(n!)=n/((n-1)!)=((n-1)+1)/((n-1)!)，所以\nΣ_(n≥1)(n^2)/(n!)=Σ_(n≥2)1/((n-2)!)+Σ_(n≥1)1/((n-1)!)=e+e=2e。",
      "source": "微積分 20 講 · 第 14 講隨堂測驗",
      "lecture": "14",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-14-q4",
      "examTitle": "用冪級數定義函數。",
      "answer": "2*exp(1)",
      "verify": {
        "m": "series",
        "f": "\\frac{n^2}{n!}",
        "from": 1
      }
    },
    {
      "id": "lec-15-m1",
      "topic": "series",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\sin x\\text{ 的 Maclaurin 級數中， }\\,x^3\\text{ 的係數為}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "taylor",
        "coefficient",
        "lecture",
        "lecture-15",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "sin x=x-(x^3)/(3!)+… ，係數為 -1/6。",
      "source": "微積分 20 講 · 第 15 講隨堂測驗",
      "lecture": "15",
      "examPart": "mc",
      "answer": "-1/6",
      "distractors": [
        "1/6",
        "1/3",
        "0"
      ],
      "verify": {
        "m": "derivAt0",
        "coef": true,
        "f": "\\sin x",
        "n": 3
      }
    },
    {
      "id": "lec-15-m2",
      "topic": "series",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{設 }\\,f(x)=x^2e^x\\text{，則 }\\,f^{(10)}(0)",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "taylor",
        "higher-derivative",
        "lecture",
        "lecture-15",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "x^2e^x=Σ(x^(n+2))/(n!)，x^(10) 的係數為 1/(8!)。又係數 =(f^((10))(0))/(10!)，所以\nf^((10))(0)=(10!)/(8!)=90。不必真的微分十次。",
      "source": "微積分 20 講 · 第 15 講隨堂測驗",
      "lecture": "15",
      "examPart": "mc",
      "answer": "90",
      "distractors": [
        "1/40320",
        "10",
        "3628800"
      ],
      "verify": {
        "m": "derivAt0",
        "f": "x^2e^x",
        "n": 10,
        "r": 3
      }
    },
    {
      "id": "lec-15-m4",
      "topic": "series",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\sqrt{1+x}\\text{ 的二次 Maclaurin 多項式為}",
      "answerKind": "expression",
      "timeLimit": 120,
      "tags": [
        "taylor",
        "binomial-series",
        "lecture",
        "lecture-15",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "二項級數，k=1/2：1+kx+(k(k-1))/2x^2=1+x/2+(1/2· (-1/2))/2x^2=1+x/2-(x^2)/8。",
      "source": "微積分 20 講 · 第 15 講隨堂測驗",
      "lecture": "15",
      "examPart": "mc",
      "answer": "1+x/2-x^2/8",
      "distractors": [
        "1+x+x^2/2",
        "1+x/2+x^2/8",
        "1-x/2+3*x^2/8"
      ],
      "verify": {
        "m": "fn",
        "cases": [
          {
            "at": {
              "x": 0.3
            },
            "v": {
              "m": "taylorValue",
              "f": "\\sqrt{1+x}",
              "a": 0,
              "n": 2,
              "at": 0.3,
              "r": 0.5
            }
          },
          {
            "at": {
              "x": 0.7
            },
            "v": {
              "m": "taylorValue",
              "f": "\\sqrt{1+x}",
              "a": 0,
              "n": 2,
              "at": 0.7,
              "r": 0.5
            }
          },
          {
            "at": {
              "x": -0.4
            },
            "v": {
              "m": "taylorValue",
              "f": "\\sqrt{1+x}",
              "a": 0,
              "n": 2,
              "at": -0.4,
              "r": 0.5
            }
          }
        ]
      }
    },
    {
      "id": "lec-15-m5",
      "topic": "series",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\cos(x^2)\\text{ 的 Maclaurin 級數為}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "taylor",
        "lecture",
        "lecture-15",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "在 cos u=Σ((-1)^nu^(2n))/((2n)!) 中以 u=x^2 代入：u^(2n)=x^(4n)，分母不變。",
      "source": "微積分 20 講 · 第 15 講隨堂測驗",
      "lecture": "15",
      "examPart": "mc",
      "answers": [
        "Σ (−1)ⁿ x^(4n)/(2n)!",
        "sum (-1)^n x^(4n)/(2n)!"
      ],
      "canonical": "Σ (−1)ⁿ x^(4n)/(2n)!",
      "answer": "Σ (−1)ⁿ x^(4n)/(2n)!",
      "distractors": [
        "Σ (−1)ⁿ x^(2n)/(2n)!",
        "Σ (−1)ⁿ x^(4n)/(4n)!",
        "Σ (−1)ⁿ x^(2n+2)/(2n)!"
      ]
    },
    {
      "id": "lec-15-q1a",
      "topic": "series",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{求 }\\,f(x)=\\sqrt x\\text{ 在 }\\,a=4\\text{ 的二次 Taylor 多項式 }\\,T_2(x)",
      "answerKind": "expression",
      "timeLimit": 120,
      "tags": [
        "taylor",
        "lecture",
        "lecture-15",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "f(4)=2，f'(x)=1/2x^(-1/2)，f'(4)=1/4；f''(x)=-1/4x^(-3/2)，f''(4)=-1/32。\n T_2(x)=2+(x-4)/4-((x-4)^2)/64.",
      "source": "微積分 20 講 · 第 15 講隨堂測驗",
      "lecture": "15",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-15-q1",
      "examTitle": "Taylor 多項式與誤差估計。",
      "answer": "2+(x-4)/4-(x-4)^2/64",
      "verify": {
        "m": "fn",
        "cases": [
          {
            "at": {
              "x": 3
            },
            "v": {
              "m": "taylorValue",
              "f": "\\sqrt{x}",
              "a": 4,
              "n": 2,
              "at": 3,
              "r": 1
            }
          },
          {
            "at": {
              "x": 4.5
            },
            "v": {
              "m": "taylorValue",
              "f": "\\sqrt{x}",
              "a": 4,
              "n": 2,
              "at": 4.5,
              "r": 1
            }
          },
          {
            "at": {
              "x": 6
            },
            "v": {
              "m": "taylorValue",
              "f": "\\sqrt{x}",
              "a": 4,
              "n": 2,
              "at": 6,
              "r": 1
            }
          }
        ]
      }
    },
    {
      "id": "lec-15-q1b",
      "topic": "series",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{用 }\\,f(x)=\\sqrt x\\text{ 在 }\\,a=4\\text{ 的二次 Taylor 多項式 }\\,T_2\\text{ 估計 }\\sqrt{4.1}\\text{（寫成小數）}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "taylor",
        "linear-approximation",
        "lecture",
        "lecture-15",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "T_2(4.1)=2+0.025-0.01/64=2.025-0.00015625=2.02484375。",
      "source": "微積分 20 講 · 第 15 講隨堂測驗",
      "lecture": "15",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-15-q1",
      "examTitle": "Taylor 多項式與誤差估計。",
      "answer": "2.02484375",
      "verify": {
        "m": "taylorValue",
        "f": "\\sqrt{x}",
        "a": 4,
        "n": 2,
        "at": 4.1,
        "r": 1
      }
    },
    {
      "id": "lec-15-q1c",
      "topic": "series",
      "difficulty": 4,
      "rank": 4,
      "authoredRank": 4,
      "prompt": "\\text{用 }\\,f(x)=\\sqrt x\\text{ 在 }\\,a=4\\text{ 的二次 Taylor 多項式估計 }\\sqrt{4.1}\\text{。用 Taylor 不等式（}\\,M\\text{ 取 }|f'''|\\text{ 在 }[4,4.1]\\text{ 的最大值）求誤差上界}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "taylor",
        "error-bound",
        "lecture",
        "lecture-15",
        "exam-style",
        "midterm-style",
        "rank-4"
      ],
      "solution": "f'''(x)=3/8x^(-5/2)，在 [4,4.1] 上遞減，M=f'''(4)=3/8· 1/32=3/256。\n |R_2|≤ (3/256)/(3!)(0.1)^3=1/512000≈1.95×10^(-6). \n（實際 √(4.1)=2.0248457…，誤差 1.92×10^(-6)，確實在上界內。）",
      "source": "微積分 20 講 · 第 15 講隨堂測驗",
      "lecture": "15",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-15-q1",
      "examTitle": "Taylor 多項式與誤差估計。",
      "answer": "1/512000",
      "verify": {
        "m": "lagrangeBound",
        "f": "\\sqrt{x}",
        "a": 4,
        "n": 2,
        "at": 4.1,
        "r": 1
      }
    },
    {
      "id": "lec-15-q2b",
      "topic": "series",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\lim_{x\\to0}\\frac{x-\\arctan x}{x^3}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "taylor",
        "inverse-trig",
        "lecture",
        "lecture-15",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "x-arctan x=(x^3)/3-(x^5)/5+… ，除以 x^3：→ 1/3。",
      "source": "微積分 20 講 · 第 15 講隨堂測驗",
      "lecture": "15",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-15-q2",
      "examTitle": "用級數求極限。",
      "answer": "1/3"
    },
    {
      "id": "lec-15-q2c",
      "topic": "series",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\lim_{x\\to0}\\frac{\\cos x-1+\\frac{x^2}2}{x^4}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "taylor",
        "trig-limit",
        "lecture",
        "lecture-15",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "cos x-1+(x^2)/2=(x^4)/24-(x^6)/720+… ，→ 1/24。",
      "source": "微積分 20 講 · 第 15 講隨堂測驗",
      "lecture": "15",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-15-q2",
      "examTitle": "用級數求極限。",
      "answer": "1/24"
    },
    {
      "id": "lec-15-q2d",
      "topic": "series",
      "difficulty": 4,
      "rank": 4,
      "authoredRank": 4,
      "prompt": "\\lim_{x\\to0}\\Bigl(\\frac1{x^2}-\\frac1{\\sin^2x}\\Bigr)",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "taylor",
        "limit-trap",
        "lecture",
        "lecture-15",
        "exam-style",
        "midterm-style",
        "rank-4"
      ],
      "solution": "通分：(sin^2x-x^2)/(x^2sin^2x)。\nsin x=x-(x^3)/6+O(x^5)，sin^2x=x^2-(x^4)/3+O(x^6)。\n分子 =-(x^4)/3+O(x^6)，分母 =x^4+O(x^6)，極限 -1/3。\n（級數相乘時只需保留到需要的次方。）",
      "source": "微積分 20 講 · 第 15 講隨堂測驗",
      "lecture": "15",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-15-q2",
      "examTitle": "用級數求極限。",
      "answer": "-1/3"
    },
    {
      "id": "lec-15-q3b",
      "topic": "series",
      "difficulty": 4,
      "rank": 4,
      "authoredRank": 4,
      "prompt": "\\text{把 }\\int_0^1e^{-x^2}dx\\text{ 展成交錯級數 }\\sum_{n=0}^\\infty\\frac{(-1)^n}{n!(2n+1)}\\text{，取到誤差小於 }0.001\\text{ 為止（用交錯級數誤差估計）。所得估計值（寫成分數）}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "taylor",
        "error-bound",
        "lecture",
        "lecture-15",
        "exam-style",
        "midterm-style",
        "rank-4"
      ],
      "solution": "交錯級數，誤差 ≤ 第一個捨去的項。1/216≈0.0046>0.001，1/1320≈0.00076<0.001，\n所以取前 5 項（n=0 到 4）：\n 1-1/3+1/10-1/42+1/216=5651/7560≈0.7475. \n（實際值 0.7468，誤差 0.0007。）",
      "source": "微積分 20 講 · 第 15 講隨堂測驗",
      "lecture": "15",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-15-q3",
      "examTitle": "近似積分與求和。",
      "answer": "5651/7560",
      "verify": {
        "m": "series",
        "f": "\\frac{(-1)^n}{n!(2n+1)}",
        "from": 0,
        "to": 4
      }
    },
    {
      "id": "lec-15-q3c",
      "topic": "series",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{求 }\\sum_{n=0}^\\infty\\frac{(-1)^n\\pi^{2n+1}}{6^{2n+1}(2n+1)!}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "taylor",
        "series-sum",
        "lecture",
        "lecture-15",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "這是 sin x 的級數在 x=(π)/6：和為 sin(π)/6=1/2。",
      "source": "微積分 20 講 · 第 15 講隨堂測驗",
      "lecture": "15",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-15-q3",
      "examTitle": "近似積分與求和。",
      "answer": "1/2",
      "verify": {
        "m": "series",
        "f": "\\frac{(-1)^n\\pi^{2n+1}}{6^{2n+1}(2n+1)!}",
        "from": 0
      }
    },
    {
      "id": "lec-15-q3d",
      "topic": "series",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{求 }\\sum_{n=1}^\\infty\\frac{(-1)^{n+1}}{n\\,3^n}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "taylor",
        "series-sum",
        "lecture",
        "lecture-15",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "ln(1+x)=Σ((-1)^(n+1)x^n)/n（|x|<1），代 x=1/3：Σ((-1)^(n+1))/(n3^n)=ln(1+1/3)=ln4/3。",
      "source": "微積分 20 講 · 第 15 講隨堂測驗",
      "lecture": "15",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-15-q3",
      "examTitle": "近似積分與求和。",
      "answer": "ln(4/3)",
      "verify": {
        "m": "series",
        "f": "\\frac{(-1)^{n+1}}{n3^n}",
        "from": 1
      }
    },
    {
      "id": "lec-15-q4a",
      "topic": "series",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{求 }(1+x)^{-1/2}\\text{ 的 Maclaurin 級數中 }\\,x^3\\text{ 的係數}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "taylor",
        "binomial-series",
        "lecture",
        "lecture-15",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "k=-1/2：\nC(k,2)=((-1/2)(-3/2))/2=3/8，C(k,3)=((-1/2)(-3/2)(-5/2))/6=-5/16，\n (1+x)^(-1/2)=1-x/2+(3x^2)/8-(5x^3)/16+… , R=1.",
      "source": "微積分 20 講 · 第 15 講隨堂測驗",
      "lecture": "15",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-15-q4",
      "examTitle": "二項級數與誤差控制。",
      "answer": "-5/16",
      "verify": {
        "m": "derivAt0",
        "coef": true,
        "f": "(1+x)^{-1/2}",
        "n": 3,
        "r": 0.5
      }
    },
    {
      "id": "lec-15-q4c",
      "topic": "series",
      "difficulty": 4,
      "rank": 4,
      "authoredRank": 4,
      "prompt": "\\text{相對論動能 }\\,K=m\\,c^2\\Bigl[\\bigl(1-\\frac{v^2}{c^2}\\bigr)^{-1/2}-1\\Bigr]\\text{ 展開到 }\\,v^4\\text{ 項為 }\\,K\\approx\\frac12m\\,v^2+\\frac38\\frac{m\\,v^4}{c^2}\\text{。若 }\\,v=0.1c\\text{，用它估計相對差距 }\\dfrac{K-\\frac12m\\,v^2}{\\frac12m\\,v^2}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "taylor",
        "binomial-series",
        "lecture",
        "lecture-15",
        "exam-style",
        "midterm-style",
        "rank-4"
      ],
      "solution": "相對差距 ≈(3/8mv^4/c^2)/(1/2mv^2)=3/4(v/c)^2=3/4(0.01)=0.0075，約 0.75%。",
      "source": "微積分 20 講 · 第 15 講隨堂測驗",
      "lecture": "15",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-15-q4",
      "examTitle": "二項級數與誤差控制。",
      "answer": "0.0075",
      "verify": {
        "m": "taylorValue",
        "f": "\\frac{(1-x)^{-1/2}-1-x/2}{x/2}",
        "a": 0,
        "n": 1,
        "at": 0.01,
        "r": 0.4
      }
    },
    {
      "id": "lec-15-q4d",
      "topic": "series",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{用 }\\,e^x\\text{ 的 }\\,n\\text{ 次 Maclaurin 多項式 }\\,T_n(1)\\text{ 近似 }\\,e\\text{。已知 }\\,e<3\\text{，用 Taylor 不等式 }|R_n(1)|\\le\\dfrac{3}{(n+1)!}\\text{ 求使誤差小於 }10^{-3}\\text{ 的最小 }\\,n",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "taylor",
        "error-bound",
        "lecture",
        "lecture-15",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "在 [0,1] 上 |f^((n+1))|=e^x≤ e<3，所以 |R_n(1)|≤ 3/((n+1)!)。\n要 3/((n+1)!)<10^(-3)，即 (n+1)!>3000。6!=720，7!=5040，所以 n+1=7，n=6。",
      "source": "微積分 20 講 · 第 15 講隨堂測驗",
      "lecture": "15",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-15-q4",
      "examTitle": "二項級數與誤差控制。",
      "answer": "6",
      "verify": {
        "m": "firstIndex",
        "f": "\\frac{3}{(n+1)!}",
        "below": 0.001
      }
    },
    {
      "id": "lec-16-m1",
      "topic": "derivatives",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\text{向量 }\\mathbf{u}=(1,1,0)\\text{ 與 }\\mathbf{v}=(1,0,1)\\text{ 的夾角為幾度？}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "vector",
        "dot-product",
        "multivariable",
        "lecture",
        "lecture-16",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "cosθ=(u· v)/(|u||v|)=1/(√(2)√(2))=1/2，θ=60^°。",
      "source": "微積分 20 講 · 第 16 講隨堂測驗",
      "lecture": "16",
      "examPart": "mc",
      "answer": "60",
      "distractors": [
        "30",
        "90",
        "45"
      ],
      "verify": {
        "m": "value",
        "f": "\\frac{180}{\\pi}\\arccos\\frac{1\\cdot1+1\\cdot0+0\\cdot1}{\\sqrt{1^2+1^2+0^2}\\sqrt{1^2+0^2+1^2}}"
      }
    },
    {
      "id": "lec-16-m2",
      "topic": "derivatives",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{由 }\\mathbf{a}=(1,2,0)\\text{ 與 }\\mathbf{b}=(0,1,3)\\text{ 所張成的平行四邊形面積為}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "vector",
        "cross-product",
        "multivariable",
        "lecture",
        "lecture-16",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "a× b=(6,-3,1)，面積 =|a× b|=√(36+9+1)=√(46)。\n(D) 是三角形面積；平行四邊形不必乘 1/2。",
      "source": "微積分 20 講 · 第 16 講隨堂測驗",
      "lecture": "16",
      "examPart": "mc",
      "answer": "sqrt(46)",
      "distractors": [
        "sqrt(14)",
        "7",
        "sqrt(46)/2"
      ],
      "verify": {
        "m": "value",
        "f": "\\sqrt{(1^2+2^2+0^2)(0^2+1^2+3^2)-(1\\cdot0+2\\cdot1+0\\cdot3)^2}"
      }
    },
    {
      "id": "lec-16-m3",
      "topic": "derivatives",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{通過 }(1,0,0)\\text{、 }(0,2,0)\\text{、 }(0,0,3)\\text{ 三點的平面方程式為}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "vector",
        "plane",
        "multivariable",
        "lecture",
        "lecture-16",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "截距式 x/1+y/2+z/3=1，乘以 6 得 6x+3y+2z=6。(A) 是把截距誤當係數的常見錯誤。",
      "source": "微積分 20 講 · 第 16 講隨堂測驗",
      "lecture": "16",
      "examPart": "mc",
      "answers": [
        "6x+3y+2z=6",
        "6x+3y+2z=6",
        "6x + 3y + 2z = 6"
      ],
      "canonical": "6x+3y+2z=6",
      "answer": "6x+3y+2z=6",
      "distractors": [
        "x+2y+3z=1",
        "3x+2y+z=6",
        "x+y+z=1"
      ]
    },
    {
      "id": "lec-16-m4",
      "topic": "derivatives",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{關於 }\\lim_{(x,y)\\to(0,0)}\\frac{xy}{x^2+y^2}\\text{，下列何者正確？}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "multivariable-limit",
        "multivariable",
        "lecture",
        "lecture-16",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "沿 y=mx：(mx^2)/((1+m^2)x^2)=m/(1+m^2)，隨 m 改變（m=0 得 0，m=1 得 1/2），故極限不存在。\n(A) 錯：一條路徑的結果不能代表極限；(B) 敘述本身為假。",
      "source": "微積分 20 講 · 第 16 講隨堂測驗",
      "lecture": "16",
      "examPart": "mc",
      "answers": [
        "極限不存在",
        "不存在",
        "DNE",
        "does not exist"
      ],
      "canonical": "極限不存在",
      "answer": "極限不存在",
      "distractors": [
        "沿 x 軸趨近得 0，所以極限為 0",
        "沿所有直線 y=mx 趨近都得 0，所以極限為 0",
        "極限為 1/2"
      ]
    },
    {
      "id": "lec-16-m5",
      "topic": "derivatives",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\text{設 }\\,f(x,y)=x^2y^3\\text{，則 }\\,f_{xy}",
      "answerKind": "expression",
      "timeLimit": 120,
      "tags": [
        "partial-derivative",
        "multivariable",
        "lecture",
        "lecture-16",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "f_x=2xy^3，再對 y：f_(xy)=6xy^2。先對 y 再對 x 亦同（Clairaut 定理）。",
      "source": "微積分 20 講 · 第 16 講隨堂測驗",
      "lecture": "16",
      "examPart": "mc",
      "answer": "6*x*y^2",
      "variables": [
        "x",
        "y"
      ],
      "distractors": [
        "2*x*y^3",
        "3*x^2*y^2",
        "6*x^2*y"
      ],
      "verify": {
        "m": "fn",
        "vars": [
          "x",
          "y"
        ],
        "kind": "deriv",
        "wrt": [
          "x",
          "y"
        ],
        "f": "x^2y^3"
      }
    },
    {
      "id": "lec-16-q1a",
      "topic": "derivatives",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{設平面 }\\,P:\\ 2x-y+2z=5\\text{，點 }\\,Q(1,2,3)\\text{。求 }\\,Q\\text{ 到平面 }\\,P\\text{ 的距離}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "vector",
        "plane",
        "multivariable",
        "lecture",
        "lecture-16",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "d=(|2-2+6-5|)/(√(4+1+4))=1/3。",
      "source": "微積分 20 講 · 第 16 講隨堂測驗",
      "lecture": "16",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-16-q1",
      "examTitle": "直線與平面。",
      "answer": "1/3",
      "verify": {
        "m": "constrained",
        "f": "\\sqrt{(x-1)^2+(y-2)^2+(z-3)^2}",
        "g": "2x-y+2z",
        "c": 5,
        "vars": [
          "x",
          "y",
          "z"
        ],
        "kind": "min"
      }
    },
    {
      "id": "lec-16-q1b",
      "topic": "derivatives",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{設平面 }\\,P:\\ 2x-y+2z=5\\text{，點 }\\,Q(1,2,3)\\text{。過 }\\,Q\\text{ 且垂直於 }\\,P\\text{ 的直線寫成 }(1+2t,\\ 2-t,\\ 3+2t)\\text{，求它與 }\\,P\\text{ 交點對應的 }\\,t",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "vector",
        "plane",
        "multivariable",
        "lecture",
        "lecture-16",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "方向取法向量 (2,-1,2)：(x,y,z)=(1+2t, 2-t, 3+2t)。\n代入 P：2(1+2t)-(2-t)+2(3+2t)=5⇒6+9t=5⇒ t=-1/9，\n交點 (7/9,19/9,25/9)。距離 =|t|· |(2,-1,2)|=1/9·3=1/3，一致。",
      "source": "微積分 20 講 · 第 16 講隨堂測驗",
      "lecture": "16",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-16-q1",
      "examTitle": "直線與平面。",
      "answer": "-1/9",
      "verify": {
        "m": "root",
        "f": "2(1+2x)-(2-x)+2(3+2x)-5",
        "x0": 0
      }
    },
    {
      "id": "lec-16-q1c",
      "topic": "derivatives",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{設點 }\\,Q(1,2,3)\\text{，直線 }\\,L:\\ (x,y,z)=(1,0,-1)+s(1,1,2)\\text{。求包含 }\\,Q\\text{ 與 }\\,L\\text{ 的平面方程式}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "vector",
        "plane",
        "cross-product",
        "multivariable",
        "lecture",
        "lecture-16",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "A(1,0,-1) 在 L 上，\\overrightarrowAQ=(0,2,4)。法向量\nn=(1,1,2)× (0,2,4)=(0,-4,2)∥(0,2,-1)。\n平面：2(y-0)-(z+1)=0，即 2y-z=1。（檢查：Q：4-3=1 ✓。）",
      "source": "微積分 20 講 · 第 16 講隨堂測驗",
      "lecture": "16",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-16-q1",
      "examTitle": "直線與平面。",
      "answers": [
        "2y−z=1",
        "2y-z=1",
        "2y - z = 1",
        "-2y+z=-1"
      ],
      "canonical": "2y−z=1",
      "answer": "2y−z=1",
      "distractors": [
        "2y+z=5",
        "x+y+2z=9",
        "y−2z=−4"
      ]
    },
    {
      "id": "lec-16-q1d",
      "topic": "derivatives",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{求平面 }2x-y+2z=5\\text{ 與平面 }2y-z=1\\text{ 夾角 }\\theta\\text{（取銳角）的餘弦值}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "vector",
        "plane",
        "dot-product",
        "multivariable",
        "lecture",
        "lecture-16",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "兩法向量 (2,-1,2)、(0,2,-1)：cosθ=(|0-2-2|)/(3√(5))=4/(3√(5))=(4√(5))/15。",
      "source": "微積分 20 講 · 第 16 講隨堂測驗",
      "lecture": "16",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-16-q1",
      "examTitle": "直線與平面。",
      "answer": "4*sqrt(5)/15",
      "verify": {
        "m": "value",
        "f": "\\frac{|2\\cdot0+(-1)\\cdot2+2\\cdot(-1)|}{\\sqrt{2^2+1^2+2^2}\\sqrt{0^2+2^2+1^2}}"
      }
    },
    {
      "id": "lec-16-q2a",
      "topic": "derivatives",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{求 }\\lim_{(x,y)\\to(0,0)}\\frac{x^2y}{x^2+y^2}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "multivariable-limit",
        "multivariable",
        "lecture",
        "lecture-16",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "x=rcosθ, y=rsinθ：|(r^3cos^2θsinθ)/(r^2)|≤ r→0，與 θ 無關地被夾住，極限為 0。",
      "source": "微積分 20 講 · 第 16 講隨堂測驗",
      "lecture": "16",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-16-q2",
      "examTitle": "極限與連續。",
      "answer": "0"
    },
    {
      "id": "lec-16-q2c",
      "topic": "derivatives",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{設 }\\,f(x,y)=\\dfrac{xy}{x^2+y^2}\\text{ （}(x,y)\\neq(0,0)\\text{）， }\\,f(0,0)=0\\text{。由定義求 }\\,f_x(0,0)",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "partial-derivative",
        "multivariable",
        "lecture",
        "lecture-16",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "f(h,0)=0，f_x(0,0)=lim_(h→0)(f(h,0)-f(0,0))/h=0；同理 f_y(0,0)=0。",
      "source": "微積分 20 講 · 第 16 講隨堂測驗",
      "lecture": "16",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-16-q2",
      "examTitle": "極限與連續。",
      "answer": "0",
      "verify": {
        "m": "limit",
        "f": "\\frac{\\frac{x\\cdot0}{x^2+0^2}-0}{x}",
        "at": 0
      }
    },
    {
      "id": "lec-16-q3b",
      "topic": "derivatives",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{求 }\\,g(x,y)=\\sqrt{9-x^2-y^2}\\text{ 的值域（寫成區間）}",
      "answerKind": "interval",
      "timeLimit": 120,
      "tags": [
        "multivariable",
        "domain",
        "multivariable",
        "lecture",
        "lecture-16",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "0≤9-x^2-y^2≤9，值域 [0,3]。g=k 即 x^2+y^2=9-k^2：0≤ k<3 為半徑 √(9-k^2) 的同心圓，k=3 退化為原點。k 越接近 3 圓越小且越密。",
      "source": "微積分 20 講 · 第 16 講隨堂測驗",
      "lecture": "16",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-16-q3",
      "examTitle": "定義域與等高線。",
      "answer": "[0, 3]"
    },
    {
      "id": "lec-16-q4a",
      "topic": "derivatives",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{設 }\\,f(x,y)=x^3y+e^{xy^2}\\text{，求 }\\,f_x",
      "answerKind": "expression",
      "timeLimit": 120,
      "tags": [
        "partial-derivative",
        "multivariable",
        "lecture",
        "lecture-16",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "f_x=3x^2y+y^2e^(xy^2)，f_y=x^3+2xye^(xy^2)。",
      "source": "微積分 20 講 · 第 16 講隨堂測驗",
      "lecture": "16",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-16-q4",
      "examTitle": "偏導數與偏微分方程。",
      "answer": "3*x^2*y+y^2*exp(x*y^2)",
      "variables": [
        "x",
        "y"
      ],
      "verify": {
        "m": "fn",
        "vars": [
          "x",
          "y"
        ],
        "kind": "deriv",
        "wrt": "x",
        "f": "x^3y+e^{xy^2}"
      }
    },
    {
      "id": "lec-16-q4b",
      "topic": "derivatives",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{設 }\\,f(x,y)=x^3y+e^{xy^2}\\text{，求 }\\,f_{xy}",
      "answerKind": "expression",
      "timeLimit": 120,
      "tags": [
        "partial-derivative",
        "multivariable",
        "lecture",
        "lecture-16",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "f_(xy)=∂_y(3x^2y+y^2e^(xy^2))=3x^2+2ye^(xy^2)+2xy^3e^(xy^2)；\nf_(yx)=∂_x(x^3+2xye^(xy^2))=3x^2+2ye^(xy^2)+2xy^3e^(xy^2)。兩者相等（二階偏導處處連續，Clairaut 定理適用）。",
      "source": "微積分 20 講 · 第 16 講隨堂測驗",
      "lecture": "16",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-16-q4",
      "examTitle": "偏導數與偏微分方程。",
      "answer": "3*x^2+2*y*exp(x*y^2)+2*x*y^3*exp(x*y^2)",
      "variables": [
        "x",
        "y"
      ],
      "verify": {
        "m": "fn",
        "vars": [
          "x",
          "y"
        ],
        "kind": "deriv",
        "wrt": [
          "x",
          "y"
        ],
        "f": "x^3y+e^{xy^2}"
      }
    },
    {
      "id": "lec-17-m1",
      "topic": "derivatives",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{以 }\\,f(x,y)=\\sqrt{x^2+y^2}\\text{ 在 }(3,4)\\text{ 的線性近似估計 }\\,f(3.03,\\,3.96)\\text{，得}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "linear-approximation",
        "multivariable",
        "multivariable",
        "lecture",
        "lecture-17",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "f(3,4)=5，f_x=x/5=3/5，f_y=4/5。\nL=5+3/5(0.03)+4/5(-0.04)=5+0.018-0.032=4.986（真值約 4.9862）。",
      "source": "微積分 20 講 · 第 17 講隨堂測驗",
      "lecture": "17",
      "examPart": "mc",
      "answer": "4.986",
      "distractors": [
        "5.050",
        "4.950",
        "5.014"
      ],
      "verify": {
        "m": "linApprox",
        "f": "\\sqrt{(3+0.03x)^2+(4-0.04x)^2}",
        "a": 0,
        "dx": 1
      }
    },
    {
      "id": "lec-17-m2",
      "topic": "derivatives",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "f(x,y)=x^2+y^2\\text{ 在點 }(1,2)\\text{ 的最大方向導數（最大變化率）為}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "gradient",
        "directional-derivative",
        "multivariable",
        "lecture",
        "lecture-17",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "最大方向導數 =|∇ f|，∇ f(1,2)=(2,4)，|(2,4)|=√(20)=2√(5)。\n(A) 是把兩分量相加的錯誤。",
      "source": "微積分 20 講 · 第 17 講隨堂測驗",
      "lecture": "17",
      "examPart": "mc",
      "answer": "2*sqrt(5)",
      "distractors": [
        "6",
        "sqrt(5)",
        "20"
      ],
      "verify": {
        "m": "extremum1d",
        "v": "x",
        "lo": 0,
        "hi": "2\\pi",
        "kind": "max",
        "f": "\\frac{((1+0.001\\cos x)^2+(2+0.001\\sin x)^2)-((1-0.001\\cos x)^2+(2-0.001\\sin x)^2)}{0.002}"
      }
    },
    {
      "id": "lec-17-m3",
      "topic": "derivatives",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{曲線 }\\,x^3+y^3=6xy\\text{ 上， }\\dfrac{dy}{dx}",
      "answerKind": "expression",
      "timeLimit": 120,
      "tags": [
        "implicit-differentiation",
        "partial-derivative",
        "multivariable",
        "lecture",
        "lecture-17",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "F=x^3+y^3-6xy，dy/dx=-F_x/F_y=-(3x^2-6y)/(3y^2-6x)=(2y-x^2)/(y^2-2x)。\n(B)、(D) 各少了一個負號；(C) 忘了 6xy 項對 y 也有依賴。",
      "source": "微積分 20 講 · 第 17 講隨堂測驗",
      "lecture": "17",
      "examPart": "mc",
      "answer": "(2*y-x^2)/(y^2-2*x)",
      "variables": [
        "x",
        "y"
      ],
      "distractors": [
        "(x^2-2*y)/(y^2-2*x)",
        "-x^2/y^2",
        "(2*y-x^2)/(2*x-y^2)"
      ],
      "verify": {
        "m": "fn",
        "vars": [
          "x",
          "y"
        ],
        "cases": [
          {
            "at": {
              "x": 3,
              "y": 3
            },
            "v": {
              "m": "implicit",
              "F": "x^3+y^3-6xy",
              "at": [
                3,
                3
              ]
            }
          },
          {
            "at": {
              "x": "\\frac{4}{3}",
              "y": "\\frac{8}{3}"
            },
            "v": {
              "m": "implicit",
              "F": "x^3+y^3-6xy",
              "at": [
                "\\frac{4}{3}",
                "\\frac{8}{3}"
              ]
            }
          }
        ]
      }
    },
    {
      "id": "lec-17-m4",
      "topic": "derivatives",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{設 }\\,f\\text{ 可微， }\\nabla f(P)\\neq\\mathbf{0}\\text{。下列何者錯誤？}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "gradient",
        "directional-derivative",
        "multivariable",
        "lecture",
        "lecture-17",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "D_uf=|∇ f|cosθ，在 θ>90^° 時為負，故 (D) 錯。(A)(B)(C) 皆由此式得到。",
      "source": "微積分 20 講 · 第 17 講隨堂測驗",
      "lecture": "17",
      "examPart": "mc",
      "answers": [
        "沿任意單位向量 u，D_u f(P) ≥ 0"
      ],
      "canonical": "沿任意單位向量 u，D_u f(P) ≥ 0",
      "answer": "沿任意單位向量 u，D_u f(P) ≥ 0",
      "distractors": [
        "∇f(P) 垂直於通過 P 的等高線",
        "沿 −∇f(P) 方向 f 下降最快",
        "沿與 ∇f(P) 垂直的單位向量，方向導數為 0"
      ]
    },
    {
      "id": "lec-17-m5",
      "topic": "derivatives",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{設 }\\,z=f(x,y)\\text{ 可微， }\\,x=r\\cos\\theta\\text{， }\\,y=r\\sin\\theta\\text{，則 }\\dfrac{\\partial z}{\\partial r}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "chain-rule",
        "multivariable",
        "multivariable",
        "lecture",
        "lecture-17",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "z_r=f_xx_r+f_yy_r=f_xcosθ+f_ysinθ。(B) 是 z_θ。",
      "source": "微積分 20 講 · 第 17 講隨堂測驗",
      "lecture": "17",
      "examPart": "mc",
      "answers": [
        "f_x cosθ + f_y sinθ",
        "fx cos(θ)+fy sin(θ)"
      ],
      "canonical": "f_x cosθ + f_y sinθ",
      "answer": "f_x cosθ + f_y sinθ",
      "distractors": [
        "−f_x r sinθ + f_y r cosθ",
        "f_x + f_y",
        "f_x sinθ + f_y cosθ"
      ]
    },
    {
      "id": "lec-17-q1a",
      "topic": "derivatives",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{求曲面 }\\,z=x^2+xy+2y^2\\text{ 在 }(1,1,4)\\text{ 的切平面方程式。}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "tangent-plane",
        "multivariable",
        "multivariable",
        "lecture",
        "lecture-17",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "f_x=2x+y=3，f_y=x+4y=5：z=4+3(x-1)+5(y-1)，即 3x+5y-z=4。",
      "source": "微積分 20 講 · 第 17 講隨堂測驗",
      "lecture": "17",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-17-q1",
      "examTitle": "切平面、線性近似與可微性。",
      "answers": [
        "3x+5y−z=4",
        "3x+5y-z=4",
        "z=3x+5y-4",
        "z=3x+5y−4"
      ],
      "canonical": "3x+5y−z=4",
      "answer": "3x+5y−z=4",
      "distractors": [
        "2x+4y−z=2",
        "3x+5y+z=12",
        "x+y−z=−2"
      ]
    },
    {
      "id": "lec-17-q1b",
      "topic": "derivatives",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{用曲面 }\\,z=x^2+xy+2y^2\\text{ 在 }(1,1,4)\\text{ 的切平面（線性近似）估計 }\\,f(1.1,\\,0.95)",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "linear-approximation",
        "multivariable",
        "multivariable",
        "lecture",
        "lecture-17",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "L(1.1,0.95)=4+0.3-0.25=4.05；真值 1.21+1.045+1.805=4.06，誤差 0.01。",
      "source": "微積分 20 講 · 第 17 講隨堂測驗",
      "lecture": "17",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-17-q1",
      "examTitle": "切平面、線性近似與可微性。",
      "answer": "4.05",
      "verify": {
        "m": "linApprox",
        "f": "(1+0.1x)^2+(1+0.1x)(1-0.05x)+2(1-0.05x)^2",
        "a": 0,
        "dx": 1
      }
    },
    {
      "id": "lec-17-q1c",
      "topic": "derivatives",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{圓柱半徑 }\\,r=3\\,\\text{cm}\\text{、高 }\\,h=10\\,\\text{cm}\\text{，量測誤差分別至多 }0.01\\,\\text{cm}\\text{ 與 }0.02\\,\\text{cm}\\text{。用全微分估計體積 }\\,V=\\pi r^2h\\text{ 的最大誤差（}\\text{cm}^3\\text{，可保留 }\\pi\\text{）}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "total-differential",
        "multivariable",
        "lecture",
        "lecture-17",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "dV=2π rhdr+π r^2dh，取 |dr|=0.01、|dh|=0.02 同號：\n|dV|≤60π(0.01)+9π(0.02)=0.78π≈2.45cm^3。",
      "source": "微積分 20 講 · 第 17 講隨堂測驗",
      "lecture": "17",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-17-q1",
      "examTitle": "切平面、線性近似與可微性。",
      "answer": "0.78*pi",
      "verify": {
        "m": "totalDiff",
        "f": "\\pi x^2y",
        "at": [
          3,
          10
        ],
        "d": [
          0.01,
          0.02
        ]
      }
    },
    {
      "id": "lec-17-q2a",
      "topic": "derivatives",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{設 }\\,z=x^2y+y^3\\text{， }\\,x=st\\text{， }\\,y=s+t\\text{。求 }\\,s=1,\\ t=2\\text{ 時的 }\\dfrac{\\partial z}{\\partial s}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "chain-rule",
        "multivariable",
        "multivariable",
        "lecture",
        "lecture-17",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "樹狀圖：z→ (x,y)，x→ (s,t)，y→ (s,t)。s=1,t=2 時 x=2、y=3。\nz_x=2xy=12，z_y=x^2+3y^2=31；x_s=t=2，x_t=s=1，y_s=y_t=1。\n z_s=12·2+31·1=55, z_t=12·1+31·1=43.",
      "source": "微積分 20 講 · 第 17 講隨堂測驗",
      "lecture": "17",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-17-q2",
      "examTitle": "連鎖律與隱函數。",
      "answer": "55",
      "verify": {
        "m": "deriv",
        "f": "(st)^2(s+t)+(s+t)^3",
        "vars": [
          "s",
          "t"
        ],
        "at": [
          1,
          2
        ],
        "wrt": "s"
      }
    },
    {
      "id": "lec-17-q2b",
      "topic": "derivatives",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{方程式 }\\,x^2+y^2+z^2+xyz=4\\text{ 在 }(1,1,1)\\text{ 附近定義 }\\,z=z(x,y)\\text{。求該點的 }\\,z_x",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "implicit-differentiation",
        "partial-derivative",
        "multivariable",
        "lecture",
        "lecture-17",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "2+z_0^2+z_0=4⇒ z_0^2+z_0-2=0⇒ z_0=1（z_0=-2 不合）。\nF=x^2+y^2+z^2+xyz-4：F_x=2x+yz=3，F_y=2y+xz=3，F_z=2z+xy=3，\nz_x=-F_x/F_z=-1，z_y=-1。",
      "source": "微積分 20 講 · 第 17 講隨堂測驗",
      "lecture": "17",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-17-q2",
      "examTitle": "連鎖律與隱函數。",
      "answer": "-1",
      "verify": {
        "m": "implicit",
        "F": "x^2+1^2+y^2+x\\cdot1\\cdot y-4",
        "at": [
          1,
          1
        ]
      }
    },
    {
      "id": "lec-17-q3a",
      "topic": "derivatives",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{平板上的溫度為 }\\,T(x,y)=100-x^2-2y^2\\text{。求 }\\nabla T(2,1)",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "gradient",
        "multivariable",
        "lecture",
        "lecture-17",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "∇ T=(-2x,-4y)，∇ T(2,1)=(-4,-4)。它垂直於 P 處的等溫線（切線斜率 dy/dx=-x/2y=-1，方向 (1,-1)，與 (-4,-4) 內積為 0），且指向溫度較高的內側。",
      "source": "微積分 20 講 · 第 17 講隨堂測驗",
      "lecture": "17",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-17-q3",
      "examTitle": "梯度與溫度分布。",
      "answers": [
        "(−4, −4)",
        "(-4,-4)",
        "(-4, -4)"
      ],
      "canonical": "(−4, −4)",
      "answer": "(−4, −4)",
      "distractors": [
        "(4, 4)",
        "(−4, −2)",
        "(−2, −4)"
      ]
    },
    {
      "id": "lec-17-q3b",
      "topic": "derivatives",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{平板上的溫度為 }\\,T(x,y)=100-x^2-2y^2\\text{。求在 }\\,P(2,1)\\text{ 沿向量 }(3,4)\\text{ 方向的方向導數}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "directional-derivative",
        "multivariable",
        "lecture",
        "lecture-17",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "u=(3/5,4/5)：D_uT=-4· 3/5-4· 4/5=-28/5。",
      "source": "微積分 20 講 · 第 17 講隨堂測驗",
      "lecture": "17",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-17-q3",
      "examTitle": "梯度與溫度分布。",
      "answer": "-28/5",
      "verify": {
        "m": "deriv",
        "f": "100-(2+\\frac{3}{5}x)^2-2(1+\\frac{4}{5}x)^2",
        "at": [
          0
        ]
      }
    },
    {
      "id": "lec-17-q3c",
      "topic": "derivatives",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{平板上的溫度為 }\\,T(x,y)=100-x^2-2y^2\\text{。在 }\\,P(2,1)\\text{ 溫度上升最快的方向上，最大上升率是多少？}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "gradient",
        "directional-derivative",
        "multivariable",
        "lecture",
        "lecture-17",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "沿 ∇ T 方向，即單位向量 -1/(√(2))(1,1)（朝原點附近的高溫區），最大上升率 |∇ T|=4√(2)。",
      "source": "微積分 20 講 · 第 17 講隨堂測驗",
      "lecture": "17",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-17-q3",
      "examTitle": "梯度與溫度分布。",
      "answer": "4*sqrt(2)",
      "verify": {
        "m": "extremum1d",
        "v": "x",
        "lo": 0,
        "hi": "2\\pi",
        "kind": "max",
        "f": "\\frac{(100-(2+0.001\\cos x)^2-2(1+0.001\\sin x)^2)-(100-(2-0.001\\cos x)^2-2(1-0.001\\sin x)^2)}{0.002}"
      }
    },
    {
      "id": "lec-17-q4a",
      "topic": "derivatives",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{求橢球面 }\\,x^2+2y^2+3z^2=6\\text{ 在 }(1,1,1)\\text{ 的切平面方程式}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "tangent-plane",
        "gradient",
        "multivariable",
        "lecture",
        "lecture-17",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "F=x^2+2y^2+3z^2，∇ F=(2x,4y,6z)=(2,4,6)∥(1,2,3)。\n切平面 (x-1)+2(y-1)+3(z-1)=0，即 x+2y+3z=6；\n法線 (x,y,z)=(1,1,1)+t(1,2,3)。",
      "source": "微積分 20 講 · 第 17 講隨堂測驗",
      "lecture": "17",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-17-q4",
      "examTitle": "等值面的切平面。",
      "answers": [
        "x+2y+3z=6",
        "x + 2y + 3z = 6"
      ],
      "canonical": "x+2y+3z=6",
      "answer": "x+2y+3z=6",
      "distractors": [
        "2x+4y+6z=6",
        "x+2y+3z=1",
        "x+y+z=3"
      ]
    },
    {
      "id": "lec-17-q4c",
      "topic": "derivatives",
      "difficulty": 4,
      "rank": 4,
      "authoredRank": 4,
      "prompt": "\\text{橢球面 }\\,x^2+2y^2+3z^2=6\\text{ 上有兩個點的切平面平行於 }\\,x+y+z=0\\text{，求其中 }\\,x>0\\text{ 那一點的 }\\,x\\text{ 座標}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "tangent-plane",
        "gradient",
        "multivariable",
        "lecture",
        "lecture-17",
        "exam-style",
        "midterm-style",
        "rank-4"
      ],
      "solution": "需 (2x,4y,6z)=λ(1,1,1)：x=(λ)/2，y=(λ)/4，z=(λ)/6。代入：\nλ^2(1/4+1/8+1/12)=11/24λ^2=6⇒λ=± 12/(√(11))。\n兩點為 ± (6/(√(11)),3/(√(11)),2/(√(11)))。\n（驗證：(36+18+12)/11=6 ✓。）",
      "source": "微積分 20 講 · 第 17 講隨堂測驗",
      "lecture": "17",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-17-q4",
      "examTitle": "等值面的切平面。",
      "answer": "6/sqrt(11)"
    },
    {
      "id": "lec-18-m1",
      "topic": "derivatives",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "f(x,y)=x^2+y^2-2x+4y\\text{ 的臨界點為}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "critical-points",
        "multivariable",
        "multivariable",
        "lecture",
        "lecture-18",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "f_x=2x-2=0，f_y=2y+4=0，得 (1,-2)。配方 f=(x-1)^2+(y+2)^2-5，它是最小點。",
      "source": "微積分 20 講 · 第 18 講隨堂測驗",
      "lecture": "18",
      "examPart": "mc",
      "answers": [
        "(1, −2)",
        "(1,-2)",
        "(1, -2)"
      ],
      "canonical": "(1, −2)",
      "answer": "(1, −2)",
      "distractors": [
        "(−1, 2)",
        "(2, −4)",
        "(0, 0)"
      ]
    },
    {
      "id": "lec-18-m2",
      "topic": "derivatives",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\text{某臨界點處 }\\,f_{xx}=2\\text{， }\\,f_{yy}=-2\\text{， }\\,f_{xy}=0\\text{，則該點為}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "hessian",
        "multivariable",
        "lecture",
        "lecture-18",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "D=(2)(-2)-0=-4<0，鞍點（沿 x 方向向上彎、沿 y 方向向下彎）。",
      "source": "微積分 20 講 · 第 18 講隨堂測驗",
      "lecture": "18",
      "examPart": "mc",
      "answers": [
        "鞍點",
        "saddle",
        "saddle point"
      ],
      "canonical": "鞍點",
      "answer": "鞍點",
      "distractors": [
        "相對極小",
        "相對極大",
        "無法判定"
      ]
    },
    {
      "id": "lec-18-m3",
      "topic": "derivatives",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "f(x,y)=x^4+y^4\\text{ 與 }\\,g(x,y)=x^4-y^4\\text{ 在原點的 }\\,D\\text{ 皆為 0。關於原點，下列何者正確？}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "hessian",
        "multivariable",
        "lecture",
        "lecture-18",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "f≥0=f(0,0)，極小；g 沿 x 軸為正、沿 y 軸為負，鞍點。兩者 D 都是 0 但結論不同，所以 D=0 時必須用其他方法。原點確實是臨界點（一階偏導皆 0），(D) 錯。",
      "source": "微積分 20 講 · 第 18 講隨堂測驗",
      "lecture": "18",
      "examPart": "mc",
      "answers": [
        "f 是相對極小，g 是鞍點，可見 D=0 時判別法無法下結論"
      ],
      "canonical": "f 是相對極小，g 是鞍點，可見 D=0 時判別法無法下結論",
      "answer": "f 是相對極小，g 是鞍點，可見 D=0 時判別法無法下結論",
      "distractors": [
        "兩者都是相對極小",
        "兩者都是鞍點",
        "D=0 表示兩者在原點都沒有臨界點"
      ]
    },
    {
      "id": "lec-18-m4",
      "topic": "derivatives",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\text{在約束 }\\,x+y=10\\text{ 下， }\\,f(x,y)=xy\\text{ 的最大值為}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "lagrange-multiplier",
        "multivariable",
        "lecture",
        "lecture-18",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "Lagrange：y=λ，x=λ，所以 x=y=5，f=25。（或 f=x(10-x) 單變數求極值。）",
      "source": "微積分 20 講 · 第 18 講隨堂測驗",
      "lecture": "18",
      "examPart": "mc",
      "answer": "25",
      "distractors": [
        "50",
        "100",
        "20"
      ],
      "verify": {
        "m": "constrained",
        "f": "xy",
        "g": "x+y",
        "c": 10,
        "kind": "max"
      }
    },
    {
      "id": "lec-18-m5",
      "topic": "derivatives",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{下列何種情形保證連續函數 }\\,f(x,y)\\text{ 在區域 }\\,D\\text{ 上同時取得絕對極大與絕對極小？}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "extrema",
        "multivariable",
        "multivariable",
        "lecture",
        "lecture-18",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "極值定理要求 D 有界且閉。(A)(D) 無界，(B) 不閉（例如 f=x 在開圓盤上取不到 ±1）。",
      "source": "微積分 20 講 · 第 18 講隨堂測驗",
      "lecture": "18",
      "examPart": "mc",
      "answers": [
        "D 為閉圓盤 x²+y²≤1"
      ],
      "canonical": "D 為閉圓盤 x²+y²≤1",
      "answer": "D 為閉圓盤 x²+y²≤1",
      "distractors": [
        "D 為整個平面",
        "D 為開圓盤 x²+y²<1",
        "D 為第一象限 x≥0, y≥0"
      ]
    },
    {
      "id": "lec-18-q1a",
      "topic": "derivatives",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{設 }\\,f(x,y)=x^3+y^3-3xy\\text{。求所有臨界點}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "critical-points",
        "multivariable",
        "multivariable",
        "lecture",
        "lecture-18",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "f_x=3x^2-3y=0⇒ y=x^2；f_y=3y^2-3x=0⇒ x=y^2=x^4，\nx(x^3-1)=0，實數解 x=0 或 1。臨界點 (0,0)、(1,1)。",
      "source": "微積分 20 講 · 第 18 講隨堂測驗",
      "lecture": "18",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-18-q1",
      "examTitle": "相對極值的分類。",
      "answers": [
        "(0,0) 與 (1,1)",
        "(0,0),(1,1)",
        "(0, 0), (1, 1)",
        "(1,1),(0,0)"
      ],
      "canonical": "(0,0) 與 (1,1)",
      "answer": "(0,0) 與 (1,1)",
      "distractors": [
        "(0,0) 與 (−1,−1)",
        "只有 (1,1)",
        "(1,1) 與 (−1,1)"
      ]
    },
    {
      "id": "lec-18-q1b",
      "topic": "derivatives",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{設 }\\,f(x,y)=x^3+y^3-3xy\\text{。用二階導數判別法找出相對極小值}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "hessian",
        "extrema",
        "multivariable",
        "lecture",
        "lecture-18",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "f_(xx)=6x，f_(yy)=6y，f_(xy)=-3，D=36xy-9。\n\n(0,0)：D=-9<0，鞍點。\n\n(1,1)：D=27>0，f_(xx)=6>0，相對極小，f(1,1)=1+1-3=-1。",
      "source": "微積分 20 講 · 第 18 講隨堂測驗",
      "lecture": "18",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-18-q1",
      "examTitle": "相對極值的分類。",
      "answer": "-1"
    },
    {
      "id": "lec-18-q1c",
      "topic": "derivatives",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{設 }\\,f(x,y)=x^3+y^3-3xy\\text{，它在 }(1,1)\\text{ 有相對極小值 }-1\\text{。這是不是 }\\,f\\text{ 的絕對極小值？（填「是」或「不是」）}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "extrema",
        "multivariable",
        "multivariable",
        "lecture",
        "lecture-18",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "不是。沿 x 軸 f(x,0)=x^3→ -∞ （x→ -∞ ），例如 f(-2,0)=-8<-1。f 沒有絕對極小值。",
      "source": "微積分 20 講 · 第 18 講隨堂測驗",
      "lecture": "18",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-18-q1",
      "examTitle": "相對極值的分類。",
      "answers": [
        "不是",
        "否",
        "no"
      ],
      "canonical": "不是",
      "answer": "不是",
      "distractors": [
        "是"
      ]
    },
    {
      "id": "lec-18-q2a",
      "topic": "derivatives",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{設 }\\,f(x,y)=x^2-2xy+2y\\text{ 在矩形 }\\,R=\\{0\\le x\\le3,\\ 0\\le y\\le2\\}\\text{ 上。求 }\\,R\\text{ 內部唯一臨界點的函數值}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "critical-points",
        "multivariable",
        "multivariable",
        "lecture",
        "lecture-18",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "f_x=2x-2y=0，f_y=-2x+2=0：(1,1)，f(1,1)=1。",
      "source": "微積分 20 講 · 第 18 講隨堂測驗",
      "lecture": "18",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-18-q2",
      "examTitle": "閉區域上的絕對極值。",
      "answer": "1"
    },
    {
      "id": "lec-18-q2b",
      "topic": "derivatives",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{設 }\\,f(x,y)=x^2-2xy+2y\\text{ 在矩形 }\\,R=\\{0\\le x\\le3,\\ 0\\le y\\le2\\}\\text{ 上。求 }\\,f\\text{ 在邊 }\\,x=3\\text{ 上的最大值}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "extrema",
        "multivariable",
        "multivariable",
        "lecture",
        "lecture-18",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "L_1（y=0，0≤ x≤3）：f=x^2，範圍 [0,9]。\n\nL_2（x=3，0≤ y≤2）：f=9-4y，範圍 [1,9]。\n\nL_3（y=2，0≤ x≤3）：f=x^2-4x+4=(x-2)^2，範圍 [0,1]，最小在 x=2。\n\nL_4（x=0，0≤ y≤2）：f=2y，範圍 [0,4]。",
      "source": "微積分 20 講 · 第 18 講隨堂測驗",
      "lecture": "18",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-18-q2",
      "examTitle": "閉區域上的絕對極值。",
      "answer": "9",
      "verify": {
        "m": "extremum1d",
        "f": "3^2-2\\cdot3x+2x",
        "v": "x",
        "lo": 0,
        "hi": 2,
        "kind": "max"
      }
    },
    {
      "id": "lec-18-q2c",
      "topic": "derivatives",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{求 }\\,f(x,y)=x^2-2xy+2y\\text{ 在矩形 }\\,R=\\{0\\le x\\le3,\\ 0\\le y\\le2\\}\\text{ 上的絕對極大值}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "extrema",
        "multivariable",
        "multivariable",
        "lecture",
        "lecture-18",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "比較所有候選值：絕對極大 9 在 (3,0)；絕對極小 0 在 (0,0) 與 (2,2)。內部臨界點 (1,1) 的值 1 兩者都不是。",
      "source": "微積分 20 講 · 第 18 講隨堂測驗",
      "lecture": "18",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-18-q2",
      "examTitle": "閉區域上的絕對極值。",
      "answer": "9"
    },
    {
      "id": "lec-18-q3a",
      "topic": "derivatives",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{用 Lagrange 乘子求 }\\,f(x,y)=x^2+2y^2\\text{ 在圓 }\\,x^2+y^2=1\\text{ 上的最大值}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "lagrange-multiplier",
        "multivariable",
        "lecture",
        "lecture-18",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "∇ f=λ∇ g：2x=2λ x，4y=2λ y，x^2+y^2=1。\n\n若 x≠0 則 λ=1，第二式得 y=0，點 (±1,0)，f=1。\n\n若 x=0 則 y=±1，f=2。\n\n最大 2（於 (0,±1)），最小 1（於 (±1,0)）。",
      "source": "微積分 20 講 · 第 18 講隨堂測驗",
      "lecture": "18",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-18-q3",
      "examTitle": "Lagrange 乘子。",
      "answer": "2",
      "verify": {
        "m": "constrained",
        "f": "x^2+2y^2",
        "g": "x^2+y^2",
        "c": 1,
        "kind": "max"
      }
    },
    {
      "id": "lec-18-q3b",
      "topic": "derivatives",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{求 }\\,f(x,y)=x^2+2y^2\\text{ 在閉圓盤 }\\,x^2+y^2\\le1\\text{ 上的最小值}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "extrema",
        "multivariable",
        "multivariable",
        "lecture",
        "lecture-18",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "內部臨界點：f_x=2x=0, f_y=4y=0，(0,0)，f=0。與邊界比較：最大 2，最小 0（於原點）。",
      "source": "微積分 20 講 · 第 18 講隨堂測驗",
      "lecture": "18",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-18-q3",
      "examTitle": "Lagrange 乘子。",
      "answer": "0"
    },
    {
      "id": "lec-18-q3c",
      "topic": "derivatives",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{用 Lagrange 乘子求平面 }\\,x+2y+2z=9\\text{ 上離原點最近的點到原點的距離}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "lagrange-multiplier",
        "multivariable",
        "lecture",
        "lecture-18",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "極小化 d^2=x^2+y^2+z^2，約束 x+2y+2z=9：\n2x=λ, 2y=2λ, 2z=2λ⇒(x,y,z)=(λ)/2(1,2,2)。\n代入：(λ)/2(1+4+4)=9⇒(λ)/2=1，最近點 (1,2,2)，距離 3。\n（與點到平面距離公式 9/√(9)=3 一致；最近點沿法向量 (1,2,2) 方向。）",
      "source": "微積分 20 講 · 第 18 講隨堂測驗",
      "lecture": "18",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-18-q3",
      "examTitle": "Lagrange 乘子。",
      "answer": "3",
      "verify": {
        "m": "constrained",
        "f": "\\sqrt{x^2+y^2+z^2}",
        "g": "x+2y+2z",
        "c": 9,
        "vars": [
          "x",
          "y",
          "z"
        ],
        "kind": "min"
      }
    },
    {
      "id": "lec-18-q4a",
      "topic": "derivatives",
      "difficulty": 4,
      "rank": 4,
      "authoredRank": 4,
      "prompt": "\\text{一個無蓋長方體盒子容積為 }32\\,\\text{m}^3\\text{。求表面積的最小值（}\\text{m}^2\\text{）}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "optimization",
        "multivariable",
        "multivariable",
        "lecture",
        "lecture-18",
        "exam-style",
        "midterm-style",
        "rank-4"
      ],
      "solution": "設底 x× y、高 z=32/xy。表面積\nS=xy+2xz+2yz=xy+64/y+64/x（x,y>0）。\n\nS_x=y-64/(x^2)=0，S_y=x-64/(y^2)=0 ⇒ x^2y=64=xy^2⇒ x=y=4，z=2。\n\nS_(xx)=128/(x^3)=2，S_(yy)=2，S_(xy)=1，D=4-1=3>0、S_(xx)>0，為極小。最小表面積 16+16+16=48m^2。",
      "source": "微積分 20 講 · 第 18 講隨堂測驗",
      "lecture": "18",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-18-q4",
      "examTitle": "應用題與兩個約束。",
      "answer": "48",
      "verify": {
        "m": "constrained",
        "f": "xy+2xz+2yz",
        "g": "xyz",
        "c": 32,
        "vars": [
          "x",
          "y",
          "z"
        ],
        "kind": "min",
        "positive": true
      }
    },
    {
      "id": "lec-18-q4b",
      "topic": "derivatives",
      "difficulty": 4,
      "rank": 5,
      "authoredRank": 5,
      "prompt": "\\text{平面 }\\,x+y+z=1\\text{ 與圓柱 }\\,x^2+y^2=2\\text{ 的交線是一個橢圓。用兩個 Lagrange 乘子，求此橢圓上 }\\,z\\text{ 座標的最大值}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "lagrange-multiplier",
        "multivariable",
        "lecture",
        "lecture-18",
        "exam-style",
        "midterm-style",
        "rank-5",
        "boss-rank"
      ],
      "solution": "f=z，g=x+y+z-1=0，h=x^2+y^2-2=0。\n∇ f=λ∇ g+μ∇ h：(0,0,1)=λ(1,1,1)+μ(2x,2y,0)。\n第三分量 λ=1；前兩式 2μ x=-1=2μ y⇒ x=y。\n由 x^2+y^2=2：x=y=±1。\n\n(1,1)：z=1-2=-1；(-1,-1)：z=3。最大 3，最小 -1。\n\n（檢查：z=1-(x+y)，而圓上 x+y∈[-2,2]，一致。）",
      "source": "微積分 20 講 · 第 18 講隨堂測驗",
      "lecture": "18",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-18-q4",
      "examTitle": "應用題與兩個約束。",
      "answer": "3",
      "verify": {
        "m": "constrained",
        "f": "1-x-y",
        "g": "x^2+y^2",
        "c": 2,
        "kind": "max"
      }
    },
    {
      "id": "lec-19-m1",
      "topic": "integrals",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\int_0^1\\!\\!\\int_0^2xy\\,dy\\,dx",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "double-integral",
        "multivariable",
        "lecture",
        "lecture-19",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "內層 ∫_0^2xydy=2x，外層 ∫_0^12xdx=1。",
      "source": "微積分 20 講 · 第 19 講隨堂測驗",
      "lecture": "19",
      "examPart": "mc",
      "answer": "1",
      "distractors": [
        "1/2",
        "2",
        "1/4"
      ]
    },
    {
      "id": "lec-19-m2",
      "topic": "integrals",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{將 }\\int_0^1\\!\\!\\int_{x^2}^{x}f(x,y)\\,dy\\,dx\\text{ 改變積分順序，得}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "double-integral",
        "order-of-integration",
        "multivariable",
        "lecture",
        "lecture-19",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "區域：0≤ x≤1，x^2≤ y≤ x，即拋物線與直線之間。對固定 y∈[0,1]，x 從直線 x=y 到拋物線 x=√(y)（y≤ √(y)）。(A) 是「照抄形式」的常見錯誤。",
      "source": "微積分 20 講 · 第 19 講隨堂測驗",
      "lecture": "19",
      "examPart": "mc",
      "answers": [
        "∫₀¹ ∫_y^√y f dx dy",
        "int_0^1 int_y^sqrt(y) f dx dy"
      ],
      "canonical": "∫₀¹ ∫_y^√y f dx dy",
      "answer": "∫₀¹ ∫_y^√y f dx dy",
      "distractors": [
        "∫₀¹ ∫_{y²}^y f dx dy",
        "∫₀¹ ∫_x^{x²} f dx dy",
        "∫₀¹ ∫_√y^y f dx dy"
      ]
    },
    {
      "id": "lec-19-m3",
      "topic": "integrals",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\text{把二重積分改為極座標時，面積元素 }\\,dA\\text{ 應寫成}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "double-integral",
        "polar",
        "multivariable",
        "lecture",
        "lecture-19",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "極座標的小區域近似為邊長 dr 與 rdθ 的矩形，dA=rdrdθ（Jacobian 為 r）。漏掉 r 是最常見的錯誤。",
      "source": "微積分 20 講 · 第 19 講隨堂測驗",
      "lecture": "19",
      "examPart": "mc",
      "answers": [
        "r dr dθ",
        "r dr dtheta",
        "rdrdθ"
      ],
      "canonical": "r dr dθ",
      "answer": "r dr dθ",
      "distractors": [
        "dr dθ",
        "r² dr dθ",
        "r sinθ dr dθ"
      ]
    },
    {
      "id": "lec-19-m4",
      "topic": "integrals",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{曲面 }\\,z=x^2+y^2\\text{ 之下、單位圓盤 }\\,x^2+y^2\\le1\\text{ 之上的立體體積為}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "double-integral",
        "polar",
        "volume",
        "multivariable",
        "lecture",
        "lecture-19",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "V=∫_0^(2π)∫_0^1r^2· rdrdθ=2π· 1/4=(π)/2。",
      "source": "微積分 20 講 · 第 19 講隨堂測驗",
      "lecture": "19",
      "examPart": "mc",
      "answer": "pi/2",
      "distractors": [
        "pi",
        "2*pi",
        "pi/4"
      ],
      "verify": {
        "m": "double",
        "f": "x^2+y^2",
        "u": "x",
        "v": "y",
        "a": -1,
        "b": 1,
        "c": "-\\sqrt{1-x^2}",
        "d": "\\sqrt{1-x^2}"
      }
    },
    {
      "id": "lec-19-m5",
      "topic": "integrals",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{設 }\\,x=a\\,u\\text{、 }\\,y=b\\,v\\text{ （}\\,a,b>0\\text{）。則橢圓 }\\frac{x^2}{a^2}+\\frac{y^2}{b^2}\\le1\\text{ 的面積為}",
      "answerKind": "expression",
      "timeLimit": 120,
      "tags": [
        "jacobian",
        "multivariable",
        "lecture",
        "lecture-19",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "Jacobian (∂(x,y))/(∂(u,v))=ab，橢圓變成單位圓盤：面積 =∬_(u^2+v^2≤1)abdudv=π ab。",
      "source": "微積分 20 講 · 第 19 講隨堂測驗",
      "lecture": "19",
      "examPart": "mc",
      "answer": "pi*a*b",
      "variables": [
        "a",
        "b"
      ],
      "distractors": [
        "pi*(a+b)",
        "pi*a^2*b^2",
        "2*pi*a*b"
      ],
      "verify": {
        "m": "fn",
        "vars": [
          "a",
          "b"
        ],
        "cases": [
          {
            "at": {
              "a": 2,
              "b": 3
            },
            "v": {
              "m": "double",
              "f": "1",
              "u": "x",
              "v": "y",
              "a": -2,
              "b": 2,
              "c": "-3\\sqrt{1-x^2/2^2}",
              "d": "3\\sqrt{1-x^2/2^2}"
            }
          },
          {
            "at": {
              "a": 1.5,
              "b": 0.5
            },
            "v": {
              "m": "double",
              "f": "1",
              "u": "x",
              "v": "y",
              "a": -1.5,
              "b": 1.5,
              "c": "-0.5\\sqrt{1-x^2/1.5^2}",
              "d": "0.5\\sqrt{1-x^2/1.5^2}"
            }
          }
        ]
      }
    },
    {
      "id": "lec-19-q1b",
      "topic": "integrals",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{改變積分順序後求 }\\,I=\\int_0^1\\!\\!\\int_x^1e^{y^2}\\,dy\\,dx",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "double-integral",
        "order-of-integration",
        "multivariable",
        "lecture",
        "lecture-19",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "區域 D=\\0≤ x≤1, x≤ y≤1\\ 是頂點 (0,0),(0,1),(1,1) 的三角形。\n（圖略）\n對固定 y，0≤ x≤ y：\nI=∫_0^1∫_0^ye^(y^2)dxdy=∫_0^1ye^(y^2)dy=1/2e^(y^2)|_0^1=(e-1)/2。",
      "source": "微積分 20 講 · 第 19 講隨堂測驗",
      "lecture": "19",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-19-q1",
      "examTitle": "改變積分順序。",
      "answer": "(exp(1)-1)/2",
      "verify": {
        "m": "double",
        "f": "e^{y^2}",
        "u": "x",
        "v": "y",
        "a": 0,
        "b": 1,
        "c": "x",
        "d": "1"
      }
    },
    {
      "id": "lec-19-q1c",
      "topic": "integrals",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{改變積分順序後求 }\\,J=\\int_0^\\pi\\!\\!\\int_x^\\pi\\frac{\\sin y}{y}\\,dy\\,dx",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "double-integral",
        "order-of-integration",
        "multivariable",
        "lecture",
        "lecture-19",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "同一種三角形區域（0≤ x≤ y≤ π）：\nJ=∫_0^π∫_0^y(sin y)/ydxdy=∫_0^πsin ydy=2。",
      "source": "微積分 20 講 · 第 19 講隨堂測驗",
      "lecture": "19",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-19-q1",
      "examTitle": "改變積分順序。",
      "answer": "2",
      "verify": {
        "m": "double",
        "f": "\\frac{\\sin y}{y}",
        "u": "x",
        "v": "y",
        "a": 0,
        "b": "\\pi",
        "c": "x",
        "d": "\\pi"
      }
    },
    {
      "id": "lec-19-q2a",
      "topic": "integrals",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{計算 }\\iint_D\\frac{1}{x^2+y^2}\\,dA\\text{， }\\,D\\text{ 為環形區域 }1\\le x^2+y^2\\le4\\text{。}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "double-integral",
        "polar",
        "multivariable",
        "lecture",
        "lecture-19",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "∫_0^(2π)∫_1^21/(r^2)rdrdθ=2πln2。",
      "source": "微積分 20 講 · 第 19 講隨堂測驗",
      "lecture": "19",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-19-q2",
      "examTitle": "極座標。",
      "answer": "2*pi*ln(2)",
      "verify": {
        "m": "double",
        "f": "\\frac{1}{r^2}\\cdot r",
        "u": "t",
        "v": "r",
        "a": 0,
        "b": "2\\pi",
        "c": 1,
        "d": 2
      }
    },
    {
      "id": "lec-19-q2b",
      "topic": "integrals",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{計算 }\\iint_Dx\\,dA\\text{， }\\,D\\text{ 為第一象限的四分之一圓盤 }\\,x^2+y^2\\le4\\text{。}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "double-integral",
        "polar",
        "multivariable",
        "lecture",
        "lecture-19",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "∫_0^(π/2)∫_0^2rcosθ· rdrdθ=[sinθ]_0^(π/2)· 8/3=8/3。",
      "source": "微積分 20 講 · 第 19 講隨堂測驗",
      "lecture": "19",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-19-q2",
      "examTitle": "極座標。",
      "answer": "8/3",
      "verify": {
        "m": "double",
        "f": "x",
        "u": "x",
        "v": "y",
        "a": 0,
        "b": 2,
        "c": 0,
        "d": "\\sqrt{4-x^2}"
      }
    },
    {
      "id": "lec-19-q2c",
      "topic": "integrals",
      "difficulty": 4,
      "rank": 4,
      "authoredRank": 4,
      "prompt": "\\text{求球 }\\,x^2+y^2+z^2\\le4\\text{ 被挖去圓柱 }\\,x^2+y^2\\le1\\text{ 後剩下部分的體積。}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "double-integral",
        "polar",
        "volume",
        "multivariable",
        "lecture",
        "lecture-19",
        "exam-style",
        "midterm-style",
        "rank-4"
      ],
      "solution": "對每個 1≤ r≤2，高度為 2√(4-r^2)：\nV=∫_0^(2π)∫_1^22√(4-r^2)rdrdθ=2π[-2/3(4-r^2)^(3/2)]_1^2=2π· 2/3·3√(3)=4√(3)π。",
      "source": "微積分 20 講 · 第 19 講隨堂測驗",
      "lecture": "19",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-19-q2",
      "examTitle": "極座標。",
      "answer": "4*sqrt(3)*pi",
      "verify": {
        "m": "double",
        "f": "2\\sqrt{4-r^2}\\cdot r",
        "u": "t",
        "v": "r",
        "a": 0,
        "b": "2\\pi",
        "c": 1,
        "d": 2
      }
    },
    {
      "id": "lec-19-q3a",
      "topic": "integrals",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{計算 }\\iiint_Ez\\,dV\\text{， }\\,E\\text{ 為四面體 }\\,x,y,z\\ge0\\text{， }\\,x+y+z\\le1\\text{。}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "triple-integral",
        "multivariable",
        "lecture",
        "lecture-19",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "∫_0^1∫_0^(1-x)∫_0^(1-x-y)zdzdydx=∫_0^1∫_0^(1-x)1/2(1-x-y)^2dydx\n=∫_0^11/6(1-x)^3dx=1/24。",
      "source": "微積分 20 講 · 第 19 講隨堂測驗",
      "lecture": "19",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-19-q3",
      "examTitle": "三重積分。",
      "answer": "1/24",
      "verify": {
        "m": "double",
        "f": "\\int_0^{1-x-y}z\\,dz",
        "u": "x",
        "v": "y",
        "a": 0,
        "b": 1,
        "c": 0,
        "d": "1-x"
      }
    },
    {
      "id": "lec-19-q3b",
      "topic": "integrals",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{用柱座標求拋物面 }\\,z=x^2+y^2\\text{ 與平面 }\\,z=4\\text{ 所圍區域的體積}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "triple-integral",
        "cylindrical",
        "multivariable",
        "lecture",
        "lecture-19",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "r^2≤ z≤4，0≤ r≤2：V=∫_0^(2π)∫_0^2(4-r^2)rdrdθ=2π(8-4)=8π。",
      "source": "微積分 20 講 · 第 19 講隨堂測驗",
      "lecture": "19",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-19-q3",
      "examTitle": "三重積分。",
      "answer": "8*pi",
      "verify": {
        "m": "double",
        "f": "(4-r^2)\\cdot r",
        "u": "t",
        "v": "r",
        "a": 0,
        "b": "2\\pi",
        "c": 0,
        "d": 2
      }
    },
    {
      "id": "lec-19-q3c",
      "topic": "integrals",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{用球座標計算 }\\iiint_B(x^2+y^2+z^2)\\,dV\\text{， }\\,B\\text{ 為半徑 }\\,a\\text{ 的球（以 }\\,a\\text{ 表示）}",
      "answerKind": "expression",
      "timeLimit": 120,
      "tags": [
        "triple-integral",
        "spherical",
        "multivariable",
        "lecture",
        "lecture-19",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "∫_0^(2π)∫_0^π∫_0^aρ^2· ρ^2sinφdρdφdθ=2π·2· (a^5)/5=(4π a^5)/5。",
      "source": "微積分 20 講 · 第 19 講隨堂測驗",
      "lecture": "19",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-19-q3",
      "examTitle": "三重積分。",
      "answer": "4*pi*a^5/5",
      "variable": "a",
      "verify": {
        "m": "fn",
        "vars": [
          "a"
        ],
        "cases": [
          {
            "at": {
              "a": 1
            },
            "v": {
              "m": "integral",
              "f": "x^2\\cdot4\\pi x^2",
              "a": 0,
              "b": 1
            }
          },
          {
            "at": {
              "a": 1.5
            },
            "v": {
              "m": "integral",
              "f": "x^2\\cdot4\\pi x^2",
              "a": 0,
              "b": 1.5
            }
          }
        ]
      }
    },
    {
      "id": "lec-19-q4a",
      "topic": "integrals",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "R\\text{ 為頂點 }(0,0),(1,1),(2,0),(1,-1)\\text{ 的正方形。令 }\\,u=x+y\\text{， }\\,v=x-y\\text{，求 }\\,R\\text{ 在 }\\,uv\\text{ 平面上的像 }\\,S",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "jacobian",
        "change-of-variables",
        "multivariable",
        "lecture",
        "lecture-19",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "四個頂點依序變為 (u,v)=(0,0),(2,0),(2,2),(0,2)，四條邊 y=± x、x± y=2 變成 u,v∈\\0,2\\，故 S=[0,2]× [0,2]。\nx=(u+v)/2，y=(u-v)/2。",
      "source": "微積分 20 講 · 第 19 講隨堂測驗",
      "lecture": "19",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-19-q4",
      "examTitle": "變數變換與 Jacobian。",
      "answers": [
        "[0,2]×[0,2]",
        "0≤u≤2, 0≤v≤2",
        "[0,2]x[0,2]",
        "0<=u<=2, 0<=v<=2"
      ],
      "canonical": "[0,2]×[0,2]",
      "answer": "[0,2]×[0,2]",
      "distractors": [
        "[−2,2]×[−2,2]",
        "[0,1]×[0,1]",
        "u²+v²≤4"
      ]
    },
    {
      "id": "lec-19-q4b",
      "topic": "integrals",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{令 }\\,u=x+y\\text{， }\\,v=x-y\\text{（即 }\\,x=\\tfrac{u+v}2\\text{， }\\,y=\\tfrac{u-v}2\\text{）。求 Jacobian }\\dfrac{\\partial(x,y)}{\\partial(u,v)}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "jacobian",
        "multivariable",
        "lecture",
        "lecture-19",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "\\beginvmatrix1/2&1/2\n[2pt]1/2&-1/2\\endvmatrix=-1/2，取絕對值 1/2。",
      "source": "微積分 20 講 · 第 19 講隨堂測驗",
      "lecture": "19",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-19-q4",
      "examTitle": "變數變換與 Jacobian。",
      "answer": "-1/2"
    },
    {
      "id": "lec-19-q4c",
      "topic": "integrals",
      "difficulty": 4,
      "rank": 4,
      "authoredRank": 4,
      "prompt": "R\\text{ 為頂點 }(0,0),(1,1),(2,0),(1,-1)\\text{ 的正方形。計算 }\\iint_R(x^2-y^2)\\,dA",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "jacobian",
        "change-of-variables",
        "multivariable",
        "lecture",
        "lecture-19",
        "exam-style",
        "midterm-style",
        "rank-4"
      ],
      "solution": "x^2-y^2=(x+y)(x-y)=uv：\n∬_R(x^2-y^2)dA=∫_0^2∫_0^2uv· 1/2dudv=1/2·2·2=2。",
      "source": "微積分 20 講 · 第 19 講隨堂測驗",
      "lecture": "19",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-19-q4",
      "examTitle": "變數變換與 Jacobian。",
      "answer": "2",
      "verify": {
        "m": "double",
        "f": "x^2-y^2",
        "u": "x",
        "v": "y",
        "a": 0,
        "b": 2,
        "c": "-(1-|x-1|)",
        "d": "1-|x-1|"
      }
    },
    {
      "id": "lec-20-m1",
      "topic": "integrals",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\text{下列哪一個平面向量場是保守場？}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "conservative-field",
        "multivariable",
        "vector-calculus",
        "lecture",
        "lecture-20",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "檢查 P_y=Q_x：(A) 1=1 ✓，位勢 f=xy。(B) -1≠1；(C) 1≠ -1；(D) x^2≠1。",
      "source": "微積分 20 講 · 第 20 講隨堂測驗",
      "lecture": "20",
      "examPart": "mc",
      "answers": [
        "(y, x)",
        "(y,x)"
      ],
      "canonical": "(y, x)",
      "answer": "(y, x)",
      "distractors": [
        "(−y, x)",
        "(y, −x)",
        "(x²y, x)"
      ]
    },
    {
      "id": "lec-20-m2",
      "topic": "integrals",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\mathbf{F}=(x^2,\\ yz,\\ z)\\text{ 的散度 }\\nabla\\cdot\\mathbf{F}",
      "answerKind": "expression",
      "timeLimit": 120,
      "tags": [
        "divergence",
        "multivariable",
        "vector-calculus",
        "lecture",
        "lecture-20",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "∂_x(x^2)+∂_y(yz)+∂_z(z)=2x+z+1。散度是純量；(D) 是旋度的形式。",
      "source": "微積分 20 講 · 第 20 講隨堂測驗",
      "lecture": "20",
      "examPart": "mc",
      "answer": "2*x+z+1",
      "variables": [
        "x",
        "y",
        "z"
      ],
      "distractors": [
        "2*x+y+1",
        "2*x+y*z+z",
        "2*x+z"
      ],
      "verify": {
        "m": "fn",
        "vars": [
          "x",
          "y",
          "z"
        ],
        "cases": [
          {
            "at": {
              "x": 0.4,
              "y": 1.3,
              "z": -0.7
            },
            "v": {
              "m": "deriv",
              "f": "(0.4+s)^2+(1.3+s)(-0.7)+(-0.7+s)",
              "vars": [
                "s"
              ],
              "at": [
                0
              ]
            }
          },
          {
            "at": {
              "x": -1.1,
              "y": 0.6,
              "z": 2.2
            },
            "v": {
              "m": "deriv",
              "f": "(-1.1+s)^2+(0.6+s)(2.2)+(2.2+s)",
              "vars": [
                "s"
              ],
              "at": [
                0
              ]
            }
          },
          {
            "at": {
              "x": 2,
              "y": -1,
              "z": 0.5
            },
            "v": {
              "m": "deriv",
              "f": "(2+s)^2+(-1+s)(0.5)+(0.5+s)",
              "vars": [
                "s"
              ],
              "at": [
                0
              ]
            }
          }
        ]
      }
    },
    {
      "id": "lec-20-m3",
      "topic": "integrals",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\mathbf{F}=(-y,\\ x,\\ 0)\\text{ 的旋度 }\\nabla\\times\\mathbf{F}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "curl",
        "multivariable",
        "vector-calculus",
        "lecture",
        "lecture-20",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "∇× F=(0-0, 0-0, ∂_x x-∂_y(-y))=(0,0,2)。此場是繞 z 軸的旋轉，旋度為角速度的 2 倍。",
      "source": "微積分 20 講 · 第 20 講隨堂測驗",
      "lecture": "20",
      "examPart": "mc",
      "answers": [
        "(0, 0, 2)",
        "(0,0,2)"
      ],
      "canonical": "(0, 0, 2)",
      "answer": "(0, 0, 2)",
      "distractors": [
        "(0, 0, 0)",
        "(0, 0, 1)",
        "(0, 0, −2)"
      ]
    },
    {
      "id": "lec-20-m4",
      "topic": "integrals",
      "difficulty": 2,
      "rank": 2,
      "authoredRank": 2,
      "prompt": "\\text{由 Green 定理，逆時針簡單封閉曲線 }\\,C\\text{ 所圍區域的面積不等於}",
      "answerKind": "text",
      "timeLimit": 60,
      "tags": [
        "green-theorem",
        "multivariable",
        "vector-calculus",
        "lecture",
        "lecture-20",
        "exam-style",
        "midterm-style",
        "rank-2"
      ],
      "solution": "∮ ydx：P=y,Q=0，Q_x-P_y=-1，得 -面積。其餘三者的 Q_x-P_y 皆為 1。",
      "source": "微積分 20 講 · 第 20 講隨堂測驗",
      "lecture": "20",
      "examPart": "mc",
      "answers": [
        "∮ y dx",
        "∮_C y dx",
        "oint y dx"
      ],
      "canonical": "∮ y dx",
      "answer": "∮ y dx",
      "distractors": [
        "∮ x dy",
        "−∮ y dx",
        "½∮ (x dy − y dx)"
      ]
    },
    {
      "id": "lec-20-m5",
      "topic": "integrals",
      "difficulty": 1,
      "rank": 1,
      "authoredRank": 1,
      "prompt": "\\text{若 }\\mathbf{F}=\\nabla f\\text{， }\\,f\\text{ 在整個平面上有連續偏導數， }\\,C\\text{ 為任意封閉曲線，則 }\\oint_C\\mathbf{F}\\cdot d\\mathbf{r}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "conservative-field",
        "line-integral",
        "multivariable",
        "vector-calculus",
        "lecture",
        "lecture-20",
        "exam-style",
        "midterm-style",
        "rank-1"
      ],
      "solution": "線積分基本定理：∫_C∇ f· dr=f(終點)-f(起點)，封閉曲線起終點相同，結果為 0。",
      "source": "微積分 20 講 · 第 20 講隨堂測驗",
      "lecture": "20",
      "examPart": "mc",
      "answer": "0",
      "distractors": [
        "1",
        "2",
        "-1"
      ]
    },
    {
      "id": "lec-20-q1a",
      "topic": "integrals",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{計算 }\\int_C(x+y^2)\\,ds\\text{， }\\,C\\text{ 為從 }(0,0)\\text{ 到 }(3,4)\\text{ 的線段。}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "line-integral",
        "multivariable",
        "vector-calculus",
        "lecture",
        "lecture-20",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "r(t)=(3t,4t)，0≤ t≤1，ds=|r'|dt=5dt：\n∫_0^1(3t+16t^2)5dt=5(3/2+16/3)=205/6。",
      "source": "微積分 20 講 · 第 20 講隨堂測驗",
      "lecture": "20",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-20-q1",
      "examTitle": "線積分與功。",
      "answer": "205/6",
      "verify": {
        "m": "lineIntegral",
        "kind": "ds",
        "f": "x+y^2",
        "path": {
          "x": "3t",
          "y": "4t",
          "from": 0,
          "to": 1
        }
      }
    },
    {
      "id": "lec-20-q1b",
      "topic": "integrals",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{力場 }\\mathbf{F}=(y,\\ -x)\\text{。求質點沿單位圓從 }\\,A(1,0)\\text{ 逆時針移到 }\\,B(0,1)\\text{ 時 }\\mathbf{F}\\text{ 所作的功}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "line-integral",
        "work",
        "multivariable",
        "vector-calculus",
        "lecture",
        "lecture-20",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "r=(cos t,sin t)，0≤ t≤ (π)/2，F· r'=sin t(-sin t)+(-cos t)cos t=-1，W_1=-(π)/2。",
      "source": "微積分 20 講 · 第 20 講隨堂測驗",
      "lecture": "20",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-20-q1",
      "examTitle": "線積分與功。",
      "answer": "-pi/2",
      "verify": {
        "m": "lineIntegral",
        "kind": "work",
        "F": [
          "y",
          "-x"
        ],
        "path": {
          "x": "\\cos t",
          "y": "\\sin t",
          "from": 0,
          "to": "\\pi/2"
        }
      }
    },
    {
      "id": "lec-20-q1c",
      "topic": "integrals",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{力場 }\\mathbf{F}=(y,\\ -x)\\text{。求質點沿線段從 }\\,A(1,0)\\text{ 移到 }\\,B(0,1)\\text{ 時 }\\mathbf{F}\\text{ 所作的功}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "line-integral",
        "work",
        "multivariable",
        "vector-calculus",
        "lecture",
        "lecture-20",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "r=(1-t,t)，r'=(-1,1)，F=(t,t-1)，F· r'=-t+t-1=-1，W_2=-1。\n\nW_1≠ W_2，同起終點不同路徑的功不同，所以 F 不保守。驗證：P_y=1，Q_x=-1，不相等。",
      "source": "微積分 20 講 · 第 20 講隨堂測驗",
      "lecture": "20",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-20-q1",
      "examTitle": "線積分與功。",
      "answer": "-1",
      "verify": {
        "m": "lineIntegral",
        "kind": "work",
        "F": [
          "y",
          "-x"
        ],
        "path": {
          "x": "1-t",
          "y": "t",
          "from": 0,
          "to": 1
        }
      }
    },
    {
      "id": "lec-20-q2b",
      "topic": "integrals",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{保守場 }\\mathbf{F}=(2xy,\\ x^2+2yz,\\ y^2)\\text{。求位勢函數 }\\,f\\text{（取 }\\,f(0,0,0)=0\\text{）}",
      "answerKind": "expression",
      "timeLimit": 120,
      "tags": [
        "conservative-field",
        "potential",
        "multivariable",
        "vector-calculus",
        "lecture",
        "lecture-20",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "f_x=2xy⇒ f=x^2y+g(y,z)；f_y=x^2+g_y=x^2+2yz⇒ g=y^2z+h(z)；f_z=y^2+h'=y^2⇒ h 為常數。f=x^2y+y^2z。",
      "source": "微積分 20 講 · 第 20 講隨堂測驗",
      "lecture": "20",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-20-q2",
      "examTitle": "保守場與位勢函數。",
      "answer": "x^2*y+y^2*z",
      "variables": [
        "x",
        "y",
        "z"
      ],
      "verify": {
        "m": "fn",
        "vars": [
          "x",
          "y",
          "z"
        ],
        "cases": [
          {
            "at": {
              "x": 0,
              "y": 0,
              "z": 0
            },
            "v": {
              "m": "value",
              "f": "0"
            }
          },
          {
            "at": {
              "x": 0.4,
              "y": 1.3,
              "z": -0.7
            },
            "d": "x",
            "v": {
              "m": "value",
              "f": "2(0.4)(1.3)"
            }
          },
          {
            "at": {
              "x": 0.4,
              "y": 1.3,
              "z": -0.7
            },
            "d": "y",
            "v": {
              "m": "value",
              "f": "(0.4)^2+2(1.3)(-0.7)"
            }
          },
          {
            "at": {
              "x": 0.4,
              "y": 1.3,
              "z": -0.7
            },
            "d": "z",
            "v": {
              "m": "value",
              "f": "(1.3)^2"
            }
          },
          {
            "at": {
              "x": -1.1,
              "y": 0.6,
              "z": 2.2
            },
            "d": "x",
            "v": {
              "m": "value",
              "f": "2(-1.1)(0.6)"
            }
          },
          {
            "at": {
              "x": -1.1,
              "y": 0.6,
              "z": 2.2
            },
            "d": "y",
            "v": {
              "m": "value",
              "f": "(-1.1)^2+2(0.6)(2.2)"
            }
          },
          {
            "at": {
              "x": -1.1,
              "y": 0.6,
              "z": 2.2
            },
            "d": "z",
            "v": {
              "m": "value",
              "f": "(0.6)^2"
            }
          }
        ]
      }
    },
    {
      "id": "lec-20-q2c",
      "topic": "integrals",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{保守場 }\\mathbf{F}=(2xy,\\ x^2+2yz,\\ y^2)\\text{。求 }\\int_C\\mathbf{F}\\cdot d\\mathbf{r}\\text{， }\\,C\\text{ 為從 }(0,0,0)\\text{ 到 }(1,2,3)\\text{ 的任意平滑曲線}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "conservative-field",
        "line-integral",
        "multivariable",
        "vector-calculus",
        "lecture",
        "lecture-20",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "f(1,2,3)-f(0,0,0)=2+12=14。",
      "source": "微積分 20 講 · 第 20 講隨堂測驗",
      "lecture": "20",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-20-q2",
      "examTitle": "保守場與位勢函數。",
      "answer": "14",
      "verify": {
        "m": "lineIntegral",
        "kind": "work",
        "F": [
          "2xy",
          "x^2+2yz",
          "y^2"
        ],
        "path": {
          "x": "t",
          "y": "2t",
          "z": "3t",
          "from": 0,
          "to": 1
        }
      }
    },
    {
      "id": "lec-20-q3a",
      "topic": "integrals",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "C\\text{ 為頂點 }(0,0),(1,0),(1,1)\\text{ 的三角形邊界，逆時針。求 }\\oint_{C} xy\\,dx+x^2\\,dy",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "green-theorem",
        "multivariable",
        "vector-calculus",
        "lecture",
        "lecture-20",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "Green：Q_x-P_y=2x-x=x，∬_DxdA=∫_0^1∫_0^xxdydx=∫_0^1x^2dx=1/3。\n\n直接：底邊 y=0：dy=0 且 xy=0，得 0。右邊 x=1，y:0→1：∫_0^11dy=1。斜邊 x=y=1-t：dx=dy=-dt，∫_0^1[(1-t)^2(-1)+(1-t)^2(-1)]dt=-2/3。總和 1-2/3=1/3，一致。",
      "source": "微積分 20 講 · 第 20 講隨堂測驗",
      "lecture": "20",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-20-q3",
      "examTitle": "Green 定理。",
      "answer": "1/3",
      "verify": {
        "m": "lineIntegral",
        "kind": "work",
        "F": [
          "xy",
          "x^2"
        ],
        "paths": [
          {
            "x": "t",
            "y": "0",
            "from": 0,
            "to": 1
          },
          {
            "x": "1",
            "y": "t",
            "from": 0,
            "to": 1
          },
          {
            "x": "1-t",
            "y": "1-t",
            "from": 0,
            "to": 1
          }
        ]
      }
    },
    {
      "id": "lec-20-q3b",
      "topic": "integrals",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{用 }\\,A=\\tfrac12\\oint_C(x\\,dy-y\\,dx)\\text{ 及參數式 }\\,x=a\\cos t,\\ y=b\\sin t\\text{，求橢圓 }\\frac{x^2}{a^2}+\\frac{y^2}{b^2}=1\\text{ 的面積}",
      "answerKind": "expression",
      "timeLimit": 120,
      "tags": [
        "green-theorem",
        "area",
        "multivariable",
        "vector-calculus",
        "lecture",
        "lecture-20",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "xdy-ydx=(acos t)(bcos t)dt-(bsin t)(-asin t)dt=abdt，A=1/2∫_0^(2π)abdt=π ab。",
      "source": "微積分 20 講 · 第 20 講隨堂測驗",
      "lecture": "20",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-20-q3",
      "examTitle": "Green 定理。",
      "answer": "pi*a*b",
      "variables": [
        "a",
        "b"
      ],
      "verify": {
        "m": "fn",
        "vars": [
          "a",
          "b"
        ],
        "cases": [
          {
            "at": {
              "a": 2,
              "b": 3
            },
            "v": {
              "m": "lineIntegral",
              "kind": "work",
              "F": [
                "-y/2",
                "x/2"
              ],
              "path": {
                "x": "2\\cos t",
                "y": "3\\sin t",
                "from": 0,
                "to": "2\\pi"
              }
            }
          },
          {
            "at": {
              "a": 1.5,
              "b": 0.5
            },
            "v": {
              "m": "lineIntegral",
              "kind": "work",
              "F": [
                "-y/2",
                "x/2"
              ],
              "path": {
                "x": "1.5\\cos t",
                "y": "0.5\\sin t",
                "from": 0,
                "to": "2\\pi"
              }
            }
          }
        ]
      }
    },
    {
      "id": "lec-20-q3c",
      "topic": "integrals",
      "difficulty": 4,
      "rank": 4,
      "authoredRank": 4,
      "prompt": "\\text{計算 }\\oint_{C} y^3\\,dx-x^3\\,dy\\text{， }\\,C\\text{ 為圓 }\\,x^2+y^2=4\\text{，逆時針}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "green-theorem",
        "multivariable",
        "vector-calculus",
        "lecture",
        "lecture-20",
        "exam-style",
        "midterm-style",
        "rank-4"
      ],
      "solution": "Q_x-P_y=-3x^2-3y^2：∬_D-3(x^2+y^2)dA=-3∫_0^(2π)∫_0^2r^3drdθ=-3·2π·4=-24π。",
      "source": "微積分 20 講 · 第 20 講隨堂測驗",
      "lecture": "20",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-20-q3",
      "examTitle": "Green 定理。",
      "answer": "-24*pi",
      "verify": {
        "m": "lineIntegral",
        "kind": "work",
        "F": [
          "y^3",
          "-x^3"
        ],
        "path": {
          "x": "2\\cos t",
          "y": "2\\sin t",
          "from": 0,
          "to": "2\\pi"
        }
      }
    },
    {
      "id": "lec-20-q4a",
      "topic": "integrals",
      "difficulty": 3,
      "rank": 3,
      "authoredRank": 3,
      "prompt": "\\text{設 }\\mathbf{F}=(x,y,z)\\text{， }\\,S\\text{ 為半徑 }\\,a\\text{ 的球面（向外）。用散度定理求通量 }\\iint_S\\mathbf{F}\\cdot d\\mathbf{S}",
      "answerKind": "expression",
      "timeLimit": 120,
      "tags": [
        "divergence-theorem",
        "flux",
        "multivariable",
        "vector-calculus",
        "lecture",
        "lecture-20",
        "exam-style",
        "midterm-style",
        "rank-3"
      ],
      "solution": "∇· F=3，通量 =3· 4/3π a^3=4π a^3。\n直接：球面上 n=r/a，F· n=|r|^2/a=a，通量 =a·4π a^2=4π a^3，一致。",
      "source": "微積分 20 講 · 第 20 講隨堂測驗",
      "lecture": "20",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-20-q4",
      "examTitle": "散度定理與 Stokes 定理。",
      "answer": "4*pi*a^3",
      "variable": "a",
      "verify": {
        "m": "fn",
        "vars": [
          "a"
        ],
        "cases": [
          {
            "at": {
              "a": 1
            },
            "v": {
              "m": "surfaceFlux",
              "F": [
                "x",
                "y",
                "z"
              ],
              "surface": {
                "x": "1\\sin u\\cos v",
                "y": "1\\sin u\\sin v",
                "z": "1\\cos u",
                "u": [
                  0,
                  "\\pi"
                ],
                "v": [
                  0,
                  "2\\pi"
                ]
              }
            }
          },
          {
            "at": {
              "a": 1.7
            },
            "v": {
              "m": "surfaceFlux",
              "F": [
                "x",
                "y",
                "z"
              ],
              "surface": {
                "x": "1.7\\sin u\\cos v",
                "y": "1.7\\sin u\\sin v",
                "z": "1.7\\cos u",
                "u": [
                  0,
                  "\\pi"
                ],
                "v": [
                  0,
                  "2\\pi"
                ]
              }
            }
          }
        ]
      }
    },
    {
      "id": "lec-20-q4b",
      "topic": "integrals",
      "difficulty": 4,
      "rank": 4,
      "authoredRank": 4,
      "prompt": "\\text{設 }\\mathbf{F}=(-y,x,0)\\text{， }\\,S\\text{ 為上半球面 }\\,z=\\sqrt{1-x^2-y^2}\\text{ （法向量朝上）。用 Stokes 定理求 }\\iint_S(\\nabla\\times\\mathbf{F})\\cdot d\\mathbf{S}",
      "answerKind": "numeric",
      "timeLimit": 90,
      "tags": [
        "stokes-theorem",
        "multivariable",
        "vector-calculus",
        "lecture",
        "lecture-20",
        "exam-style",
        "midterm-style",
        "rank-4"
      ],
      "solution": "邊界為 xy 平面上的單位圓，逆時針（從上往下看，與朝上法向量符合右手定則）。\nr=(cos t,sin t,0)，F· r'=sin^2t+cos^2t=1，結果 2π。\n（檢查：∇× F=(0,0,2)，對半球的通量等於對其投影圓盤的通量 2· π=2π。）",
      "source": "微積分 20 講 · 第 20 講隨堂測驗",
      "lecture": "20",
      "examPart": "long",
      "examPoints": 20,
      "examGroup": "lec-20-q4",
      "examTitle": "散度定理與 Stokes 定理。",
      "answer": "2*pi",
      "verify": {
        "m": "curlFlux",
        "F": [
          "-y",
          "x",
          "0"
        ],
        "surface": {
          "x": "\\sin u\\cos v",
          "y": "\\sin u\\sin v",
          "z": "\\cos u",
          "u": [
            0,
            "\\pi/2"
          ],
          "v": [
            0,
            "2\\pi"
          ]
        }
      }
    }
  ];

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems);
  window.BUZZ_LECTURE_PAPERS = {
    "10": {
      "topic": "參數曲線、極座標與物理應用",
      "ids": [
        "lec-10-m1",
        "lec-10-m2",
        "lec-10-m3",
        "lec-10-m4",
        "lec-10-m5",
        "lec-10-q1a",
        "lec-10-q1b",
        "lec-10-q1c",
        "lec-10-q2a",
        "lec-10-q2b",
        "lec-10-q2c",
        "lec-10-q2d",
        "lec-10-q3a",
        "lec-10-q3b",
        "lec-10-q3c",
        "lec-10-q4a",
        "lec-10-q4c"
      ],
      "shared": {}
    },
    "11": {
      "topic": "數列",
      "ids": [
        "lec-11-m1",
        "lec-11-m2",
        "lec-11-m3",
        "lec-11-m4",
        "lec-11-m5",
        "lec-11-q1a",
        "lec-11-q1b",
        "lec-11-q1c",
        "lec-11-q1d",
        "lec-11-q2a",
        "lec-11-q2d",
        "lec-11-q3a",
        "lec-11-q3b",
        "lec-11-q3c",
        "lec-11-q4a",
        "lec-11-q4b",
        "lec-11-q4c",
        "lec-11-q4d"
      ],
      "shared": {}
    },
    "12": {
      "topic": "級數與收斂判別 I",
      "ids": [
        "lec-12-m1",
        "lec-12-m2",
        "ser-012",
        "lec-12-m4",
        "lec-12-m5",
        "lec-12-q1a",
        "lec-12-q1b",
        "lec-12-q1c",
        "lec-12-q1d",
        "lec-12-q2a",
        "lec-12-q2b",
        "lec-12-q2c",
        "lec-12-q2d",
        "lec-12-q3a",
        "lec-12-q3b",
        "lec-12-q3c",
        "lec-12-q3d",
        "lec-12-q4a",
        "lec-12-q4b",
        "lec-12-q4d"
      ],
      "shared": {
        "ser-012": "lec-12-m3"
      }
    },
    "13": {
      "topic": "收斂判別 II",
      "ids": [
        "lec-13-m1",
        "lec-13-m2",
        "lec-13-m3",
        "lec-13-m4",
        "lec-13-m5",
        "lec-13-q1a",
        "lec-13-q1b",
        "lec-13-q1c",
        "lec-13-q1d",
        "lec-13-q2a",
        "lec-13-q2b",
        "lec-13-q2c",
        "lec-13-q2d",
        "lec-13-q2e",
        "lec-13-q3b",
        "lec-13-q3c",
        "lec-13-q4a"
      ],
      "shared": {}
    },
    "14": {
      "topic": "冪級數",
      "ids": [
        "lec-14-m1",
        "lec-14-m2",
        "lec-14-m3",
        "lec-14-m4",
        "lec-14-m5",
        "lec-14-q1a",
        "lec-14-q1b",
        "lec-14-q1c",
        "lec-14-q1d",
        "lec-14-q2a",
        "lec-14-q2b",
        "lec-14-q2c",
        "lec-14-q3a",
        "lec-14-q3b",
        "lec-14-q3c",
        "lec-14-q3d",
        "lec-14-q4a",
        "lec-14-q4d"
      ],
      "shared": {}
    },
    "15": {
      "topic": "Taylor 與 Maclaurin 級數",
      "ids": [
        "lec-15-m1",
        "lec-15-m2",
        "lim-009",
        "lec-15-m4",
        "lec-15-m5",
        "lec-15-q1a",
        "lec-15-q1b",
        "lec-15-q1c",
        "cx-lh-001",
        "lec-15-q2b",
        "lec-15-q2c",
        "lec-15-q2d",
        "lec-15-q3b",
        "lec-15-q3c",
        "lec-15-q3d",
        "lec-15-q4a",
        "lec-15-q4c",
        "lec-15-q4d"
      ],
      "shared": {
        "lim-009": "lec-15-m3",
        "cx-lh-001": "lec-15-q2a"
      }
    },
    "16": {
      "topic": "空間向量與多變數函數",
      "ids": [
        "lec-16-m1",
        "lec-16-m2",
        "lec-16-m3",
        "lec-16-m4",
        "lec-16-m5",
        "lec-16-q1a",
        "lec-16-q1b",
        "lec-16-q1c",
        "lec-16-q1d",
        "lec-16-q2a",
        "lec-16-q2c",
        "lec-16-q3b",
        "lec-16-q4a",
        "lec-16-q4b"
      ],
      "shared": {}
    },
    "17": {
      "topic": "可微性、連鎖律與梯度",
      "ids": [
        "lec-17-m1",
        "lec-17-m2",
        "lec-17-m3",
        "lec-17-m4",
        "lec-17-m5",
        "lec-17-q1a",
        "lec-17-q1b",
        "lec-17-q1c",
        "lec-17-q2a",
        "lec-17-q2b",
        "lec-17-q3a",
        "lec-17-q3b",
        "lec-17-q3c",
        "lec-17-q4a",
        "lec-17-q4c"
      ],
      "shared": {}
    },
    "18": {
      "topic": "多變數極值",
      "ids": [
        "lec-18-m1",
        "lec-18-m2",
        "lec-18-m3",
        "lec-18-m4",
        "lec-18-m5",
        "lec-18-q1a",
        "lec-18-q1b",
        "lec-18-q1c",
        "lec-18-q2a",
        "lec-18-q2b",
        "lec-18-q2c",
        "lec-18-q3a",
        "lec-18-q3b",
        "lec-18-q3c",
        "lec-18-q4a",
        "lec-18-q4b"
      ],
      "shared": {}
    },
    "19": {
      "topic": "重積分",
      "ids": [
        "lec-19-m1",
        "lec-19-m2",
        "lec-19-m3",
        "lec-19-m4",
        "lec-19-m5",
        "lec-19-q1b",
        "lec-19-q1c",
        "lec-19-q2a",
        "lec-19-q2b",
        "lec-19-q2c",
        "lec-19-q3a",
        "lec-19-q3b",
        "lec-19-q3c",
        "lec-19-q4a",
        "lec-19-q4b",
        "lec-19-q4c"
      ],
      "shared": {}
    },
    "20": {
      "topic": "向量微積分",
      "ids": [
        "lec-20-m1",
        "lec-20-m2",
        "lec-20-m3",
        "lec-20-m4",
        "lec-20-m5",
        "lec-20-q1a",
        "lec-20-q1b",
        "lec-20-q1c",
        "lec-20-q2b",
        "lec-20-q2c",
        "lec-20-q3a",
        "lec-20-q3b",
        "lec-20-q3c",
        "lec-20-q4a",
        "lec-20-q4b"
      ],
      "shared": {}
    },
    "01": {
      "topic": "極限與連續",
      "ids": [
        "lim-003",
        "lec-01-m2",
        "lec-01-m3",
        "lec-01-m4",
        "lec-01-m5",
        "cx-lim-005",
        "lec-01-q1b",
        "lec-01-q1c",
        "lim-002",
        "lec-01-q2a",
        "lec-01-q2b",
        "lec-01-q2c",
        "lec-01-q3a",
        "lec-01-q3b",
        "lec-01-q4a",
        "lec-01-q4b",
        "lec-01-q4d"
      ],
      "shared": {
        "lim-003": "lec-01-m1",
        "cx-lim-005": "lec-01-q1a",
        "lim-002": "lec-01-q1d"
      }
    },
    "02": {
      "topic": "導數與微分法則",
      "ids": [
        "lec-02-m1",
        "lec-02-m2",
        "lec-02-m3",
        "cx-der-006",
        "fd-der-011",
        "lec-02-q1b",
        "lec-02-q1c",
        "lec-02-q1d",
        "lec-02-q2a",
        "lec-02-q2b",
        "lec-02-q2c",
        "lec-02-q2d",
        "lec-02-q3a",
        "lec-02-q3b",
        "lec-02-q3c",
        "lec-02-q3d",
        "lec-02-q4a",
        "lec-02-q4b",
        "lec-02-q4c",
        "lec-02-q4d"
      ],
      "shared": {
        "cx-der-006": "lec-02-m4",
        "fd-der-011": "lec-02-m5"
      }
    },
    "03": {
      "topic": "隱微分、反函數與超越函數",
      "ids": [
        "tmpl-der-exp-002",
        "lec-03-m2",
        "world-004",
        "lec-03-m4",
        "lec-03-m5",
        "lec-03-q1a",
        "lec-03-q1b",
        "lec-03-q1c",
        "lec-03-q1d",
        "lec-03-q2a",
        "lec-03-q2b",
        "lec-03-q2c",
        "lec-03-q2d",
        "lec-03-q3b",
        "lec-03-q3c",
        "lec-03-q3d",
        "lec-03-q4a",
        "lec-03-q4b"
      ],
      "shared": {
        "tmpl-der-exp-002": "lec-03-m1",
        "world-004": "lec-03-m3"
      }
    },
    "04": {
      "topic": "微分的應用 I：函數的形狀",
      "ids": [
        "lec-04-m1",
        "lec-04-m2",
        "lec-04-m3",
        "lec-04-m4",
        "lec-04-m5",
        "lec-04-q1a",
        "lec-04-q1b",
        "lec-04-q2a",
        "lec-04-q2b",
        "lec-04-q3a",
        "lec-04-q3b",
        "lec-04-q3c",
        "lec-04-q3d",
        "lec-04-q4a",
        "lec-04-q4b",
        "lec-04-q4c"
      ],
      "shared": {}
    },
    "05": {
      "topic": "微分的應用 II：最佳化、L'Hôpital 法則與近似",
      "ids": [
        "lim-005",
        "lec-05-m2",
        "lec-05-m3",
        "lim-011",
        "lec-05-m5",
        "cx-lh-002",
        "lec-05-q1b",
        "exam-lim-011",
        "lec-05-q1d",
        "lec-05-q1e",
        "lec-05-q2a",
        "lec-05-q2b",
        "lec-05-q3b",
        "lec-05-q3c",
        "lec-05-q3d",
        "lec-05-q4a",
        "lec-05-q4b",
        "lec-05-q4c"
      ],
      "shared": {
        "lim-005": "lec-05-m1",
        "lim-011": "lec-05-m4",
        "cx-lh-002": "lec-05-q1a",
        "exam-lim-011": "lec-05-q1c"
      }
    },
    "06": {
      "topic": "定積分與微積分基本定理",
      "ids": [
        "lec-06-m1",
        "lec-06-m2",
        "lec-06-m3",
        "lec-06-m4",
        "lec-06-m5",
        "lec-06-q1a",
        "lec-06-q1b",
        "lec-06-q1c",
        "lec-06-q2a",
        "lec-06-q2b",
        "lec-06-q2c",
        "lec-06-q2d",
        "lec-06-q3a",
        "int-030",
        "lec-06-q3c",
        "lec-06-q3d",
        "lec-06-q4a",
        "lec-06-q4b",
        "lec-06-q4c"
      ],
      "shared": {
        "int-030": "lec-06-q3b"
      }
    },
    "07": {
      "topic": "積分技巧 I：分部積分、三角積分、三角代換",
      "ids": [
        "lec-07-m1",
        "int-028",
        "lec-07-m3",
        "lec-07-m4",
        "lec-07-m5",
        "cx-exam-006",
        "int-015",
        "lec-07-q1c",
        "lec-07-q1d",
        "lec-07-q2a",
        "lec-07-q2c",
        "lec-07-q3a",
        "lec-07-q3b",
        "lec-07-q3c",
        "lec-07-q3d",
        "lec-07-q4a",
        "lec-07-q4b",
        "lec-07-q4c"
      ],
      "shared": {
        "int-028": "lec-07-m2",
        "cx-exam-006": "lec-07-q1a",
        "int-015": "lec-07-q1b"
      }
    },
    "08": {
      "topic": "積分技巧 II 與瑕積分",
      "ids": [
        "lec-08-m1",
        "lec-08-m2",
        "lec-08-m3",
        "exam-int-026",
        "lec-08-m5",
        "lec-08-q1a",
        "lec-08-q1b",
        "lec-08-q1c",
        "hc-rad-002",
        "lec-08-q2a",
        "exam-int-025",
        "lec-08-q2c",
        "lec-08-q2d",
        "lec-08-q3a",
        "lec-08-q3b",
        "lec-08-q3c",
        "lec-08-q3d",
        "lec-08-q4a",
        "lec-08-q4b",
        "lec-08-q4d"
      ],
      "shared": {
        "exam-int-026": "lec-08-m4",
        "hc-rad-002": "lec-08-q1d",
        "exam-int-025": "lec-08-q2b"
      }
    },
    "09": {
      "topic": "積分的幾何應用",
      "ids": [
        "lec-09-m1",
        "lec-09-m2",
        "lec-09-m3",
        "lec-09-m4",
        "lec-09-m5",
        "lec-09-q1a",
        "lec-09-q1b",
        "lec-09-q2a",
        "lec-09-q2b",
        "lec-09-q2c",
        "lec-09-q2d",
        "lec-09-q3a",
        "lec-09-q3b",
        "lec-09-q4a",
        "lec-09-q4b",
        "lec-09-q4c"
      ],
      "shared": {}
    }
  };
})();
