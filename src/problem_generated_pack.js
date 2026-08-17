// 自動產生 —— 不要手改。來源：tools/expand_templates.js
//
// 模板變體。母模板在 tools/content/templates.js，那裡才是要編輯的地方。
//
// 這一包的每一題在寫進來之前都通過了 tools/lib/verify_engine.js 的
// 獨立數值驗算 —— 這是自動產生題目可以被接受的唯一理由。
// 人檢查不了幾十題自動產生的東西，機器可以，而且每次重新產生都會再檢查一次。
//
// variantOf 指回母模板：同一個模板出來的變體練的是同一件事，
// 連錯兩題是同一個弱點，不是兩個。
//
// 重新產生：node tools/expand_templates.js

(function () {
  "use strict";

  const problems = [
    {
      "id": "tmpl-der-power-001",
      "topic": "derivatives",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\frac{d}{dx}\\left(3x^{5}-4x\\right)",
      "answerKind": "expression",
      "answer": "3*5*x^(5-1)-4",
      "timeLimit": 30,
      "tabLimit": 1,
      "solution": "逐項微分：3x^5 的導數是 3·5x^(5−1)，−4x 的導數是 −4。",
      "hints": [
        "次方律：x^n 的導數是 n·x^(n−1)。",
        "常數倍不影響微分的形式。",
        "一次項的導數是常數。"
      ],
      "tags": [
        "power-rule",
        "polynomial",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-der-power",
      "solutionSteps": [
        "把式子拆成兩項分別微分：3x^5 和 −4x。",
        "次方律：3x^5 的導數是 3·5x^(5−1)。",
        "一次項 −4x 的導數是常數 −4。",
        "合起來就是 3·5x^(5−1) − 4。"
      ],
      "variable": "x"
    },
    {
      "id": "tmpl-der-power-002",
      "topic": "derivatives",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\frac{d}{dx}\\left(2x^{6}-7x\\right)",
      "answerKind": "expression",
      "answer": "2*6*x^(6-1)-7",
      "timeLimit": 30,
      "tabLimit": 1,
      "solution": "逐項微分：2x^6 的導數是 2·6x^(6−1)，−7x 的導數是 −7。",
      "hints": [
        "次方律：x^n 的導數是 n·x^(n−1)。",
        "常數倍不影響微分的形式。",
        "一次項的導數是常數。"
      ],
      "tags": [
        "power-rule",
        "polynomial",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-der-power",
      "solutionSteps": [
        "把式子拆成兩項分別微分：2x^6 和 −7x。",
        "次方律：2x^6 的導數是 2·6x^(6−1)。",
        "一次項 −7x 的導數是常數 −7。",
        "合起來就是 2·6x^(6−1) − 7。"
      ],
      "variable": "x"
    },
    {
      "id": "tmpl-der-power-003",
      "topic": "derivatives",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\frac{d}{dx}\\left(6x^{3}-5x\\right)",
      "answerKind": "expression",
      "answer": "6*3*x^(3-1)-5",
      "timeLimit": 30,
      "tabLimit": 1,
      "solution": "逐項微分：6x^3 的導數是 6·3x^(3−1)，−5x 的導數是 −5。",
      "hints": [
        "次方律：x^n 的導數是 n·x^(n−1)。",
        "常數倍不影響微分的形式。",
        "一次項的導數是常數。"
      ],
      "tags": [
        "power-rule",
        "polynomial",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-der-power",
      "solutionSteps": [
        "把式子拆成兩項分別微分：6x^3 和 −5x。",
        "次方律：6x^3 的導數是 6·3x^(3−1)。",
        "一次項 −5x 的導數是常數 −5。",
        "合起來就是 6·3x^(3−1) − 5。"
      ],
      "variable": "x"
    },
    {
      "id": "tmpl-der-power-004",
      "topic": "derivatives",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\frac{d}{dx}\\left(4x^{7}-9x\\right)",
      "answerKind": "expression",
      "answer": "4*7*x^(7-1)-9",
      "timeLimit": 30,
      "tabLimit": 1,
      "solution": "逐項微分：4x^7 的導數是 4·7x^(7−1)，−9x 的導數是 −9。",
      "hints": [
        "次方律：x^n 的導數是 n·x^(n−1)。",
        "常數倍不影響微分的形式。",
        "一次項的導數是常數。"
      ],
      "tags": [
        "power-rule",
        "polynomial",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-der-power",
      "solutionSteps": [
        "把式子拆成兩項分別微分：4x^7 和 −9x。",
        "次方律：4x^7 的導數是 4·7x^(7−1)。",
        "一次項 −9x 的導數是常數 −9。",
        "合起來就是 4·7x^(7−1) − 9。"
      ],
      "variable": "x"
    },
    {
      "id": "tmpl-der-power-005",
      "topic": "derivatives",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\frac{d}{dx}\\left(8x^{4}-3x\\right)",
      "answerKind": "expression",
      "answer": "8*4*x^(4-1)-3",
      "timeLimit": 30,
      "tabLimit": 1,
      "solution": "逐項微分：8x^4 的導數是 8·4x^(4−1)，−3x 的導數是 −3。",
      "hints": [
        "次方律：x^n 的導數是 n·x^(n−1)。",
        "常數倍不影響微分的形式。",
        "一次項的導數是常數。"
      ],
      "tags": [
        "power-rule",
        "polynomial",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-der-power",
      "solutionSteps": [
        "把式子拆成兩項分別微分：8x^4 和 −3x。",
        "次方律：8x^4 的導數是 8·4x^(4−1)。",
        "一次項 −3x 的導數是常數 −3。",
        "合起來就是 8·4x^(4−1) − 3。"
      ],
      "variable": "x"
    },
    {
      "id": "tmpl-int-power-002",
      "topic": "integrals",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\int 10x^{4}\\,dx",
      "answerKind": "antiderivative",
      "answer": "10/(4+1)*x^(4+1)",
      "timeLimit": 30,
      "tabLimit": 1,
      "solution": "次方積分：∫x^n dx = x^(n+1)/(n+1)，再乘上係數 10。",
      "hints": [
        "次方加一，再除以新的次方。",
        "係數提到積分外面。",
        "+C 可以省略。"
      ],
      "tags": [
        "power-rule",
        "basic-integral",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-int-power",
      "solutionSteps": [
        "係數 10 提到積分外面。",
        "次方積分：∫x^4 dx = x^(4+1)/(4+1)。",
        "乘回係數：10x^(4+1)/(4+1)。",
        "不定積分的 +C 這裡可以省略，判分會檢查是否只差一個常數。"
      ],
      "variable": "x"
    },
    {
      "id": "tmpl-int-power-003",
      "topic": "integrals",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\int 3x^{5}\\,dx",
      "answerKind": "antiderivative",
      "answer": "3/(5+1)*x^(5+1)",
      "timeLimit": 30,
      "tabLimit": 1,
      "solution": "次方積分：∫x^n dx = x^(n+1)/(n+1)，再乘上係數 3。",
      "hints": [
        "次方加一，再除以新的次方。",
        "係數提到積分外面。",
        "+C 可以省略。"
      ],
      "tags": [
        "power-rule",
        "basic-integral",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-int-power",
      "solutionSteps": [
        "係數 3 提到積分外面。",
        "次方積分：∫x^5 dx = x^(5+1)/(5+1)。",
        "乘回係數：3x^(5+1)/(5+1)。",
        "不定積分的 +C 這裡可以省略，判分會檢查是否只差一個常數。"
      ],
      "variable": "x"
    },
    {
      "id": "tmpl-int-power-004",
      "topic": "integrals",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\int 12x^{3}\\,dx",
      "answerKind": "antiderivative",
      "answer": "12/(3+1)*x^(3+1)",
      "timeLimit": 30,
      "tabLimit": 1,
      "solution": "次方積分：∫x^n dx = x^(n+1)/(n+1)，再乘上係數 12。",
      "hints": [
        "次方加一，再除以新的次方。",
        "係數提到積分外面。",
        "+C 可以省略。"
      ],
      "tags": [
        "power-rule",
        "basic-integral",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-int-power",
      "solutionSteps": [
        "係數 12 提到積分外面。",
        "次方積分：∫x^3 dx = x^(3+1)/(3+1)。",
        "乘回係數：12x^(3+1)/(3+1)。",
        "不定積分的 +C 這裡可以省略，判分會檢查是否只差一個常數。"
      ],
      "variable": "x"
    },
    {
      "id": "tmpl-int-power-005",
      "topic": "integrals",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\int 7x^{6}\\,dx",
      "answerKind": "antiderivative",
      "answer": "7/(6+1)*x^(6+1)",
      "timeLimit": 30,
      "tabLimit": 1,
      "solution": "次方積分：∫x^n dx = x^(n+1)/(n+1)，再乘上係數 7。",
      "hints": [
        "次方加一，再除以新的次方。",
        "係數提到積分外面。",
        "+C 可以省略。"
      ],
      "tags": [
        "power-rule",
        "basic-integral",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-int-power",
      "solutionSteps": [
        "係數 7 提到積分外面。",
        "次方積分：∫x^6 dx = x^(6+1)/(6+1)。",
        "乘回係數：7x^(6+1)/(6+1)。",
        "不定積分的 +C 這裡可以省略，判分會檢查是否只差一個常數。"
      ],
      "variable": "x"
    },
    {
      "id": "tmpl-int-definite-power-002",
      "topic": "integrals",
      "rank": 2,
      "difficulty": 2,
      "source": "Buzz 模板變體",
      "prompt": "\\int_0^{3} 4x^{1}\\,dx",
      "answerKind": "numeric",
      "answer": "4*3^(1+1)/(1+1)",
      "timeLimit": 40,
      "tabLimit": 1,
      "solution": "反導數是 4x^(1+1)/(1+1)，代入上下限（下限 0 貢獻 0）。",
      "hints": [
        "先求反導數。",
        "再用微積分基本定理代入上下限。",
        "下限是 0，所以只需要算上限。"
      ],
      "tags": [
        "definite-integral",
        "power-rule",
        "ftc",
        "rank-2",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-int-definite-power",
      "solutionSteps": [
        "先求反導數：4x^(1+1)/(1+1)。",
        "用微積分基本定理：F(3) − F(0)。",
        "下限 0 代進去是 0，所以只剩上限那一項。",
        "答案是 4·3^(1+1)/(1+1)。"
      ]
    },
    {
      "id": "tmpl-int-definite-power-003",
      "topic": "integrals",
      "rank": 2,
      "difficulty": 2,
      "source": "Buzz 模板變體",
      "prompt": "\\int_0^{2} 5x^{3}\\,dx",
      "answerKind": "numeric",
      "answer": "5*2^(3+1)/(3+1)",
      "timeLimit": 40,
      "tabLimit": 1,
      "solution": "反導數是 5x^(3+1)/(3+1)，代入上下限（下限 0 貢獻 0）。",
      "hints": [
        "先求反導數。",
        "再用微積分基本定理代入上下限。",
        "下限是 0，所以只需要算上限。"
      ],
      "tags": [
        "definite-integral",
        "power-rule",
        "ftc",
        "rank-2",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-int-definite-power",
      "solutionSteps": [
        "先求反導數：5x^(3+1)/(3+1)。",
        "用微積分基本定理：F(2) − F(0)。",
        "下限 0 代進去是 0，所以只剩上限那一項。",
        "答案是 5·2^(3+1)/(3+1)。"
      ]
    },
    {
      "id": "tmpl-int-definite-power-004",
      "topic": "integrals",
      "rank": 2,
      "difficulty": 2,
      "source": "Buzz 模板變體",
      "prompt": "\\int_0^{4} 2x^{2}\\,dx",
      "answerKind": "numeric",
      "answer": "2*4^(2+1)/(2+1)",
      "timeLimit": 40,
      "tabLimit": 1,
      "solution": "反導數是 2x^(2+1)/(2+1)，代入上下限（下限 0 貢獻 0）。",
      "hints": [
        "先求反導數。",
        "再用微積分基本定理代入上下限。",
        "下限是 0，所以只需要算上限。"
      ],
      "tags": [
        "definite-integral",
        "power-rule",
        "ftc",
        "rank-2",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-int-definite-power",
      "solutionSteps": [
        "先求反導數：2x^(2+1)/(2+1)。",
        "用微積分基本定理：F(4) − F(0)。",
        "下限 0 代進去是 0，所以只剩上限那一項。",
        "答案是 2·4^(2+1)/(2+1)。"
      ]
    },
    {
      "id": "tmpl-int-definite-power-005",
      "topic": "integrals",
      "rank": 2,
      "difficulty": 2,
      "source": "Buzz 模板變體",
      "prompt": "\\int_0^{1} 6x^{5}\\,dx",
      "answerKind": "numeric",
      "answer": "6*1^(5+1)/(5+1)",
      "timeLimit": 40,
      "tabLimit": 1,
      "solution": "反導數是 6x^(5+1)/(5+1)，代入上下限（下限 0 貢獻 0）。",
      "hints": [
        "先求反導數。",
        "再用微積分基本定理代入上下限。",
        "下限是 0，所以只需要算上限。"
      ],
      "tags": [
        "definite-integral",
        "power-rule",
        "ftc",
        "rank-2",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-int-definite-power",
      "solutionSteps": [
        "先求反導數：6x^(5+1)/(5+1)。",
        "用微積分基本定理：F(1) − F(0)。",
        "下限 0 代進去是 0，所以只剩上限那一項。",
        "答案是 6·1^(5+1)/(5+1)。"
      ]
    },
    {
      "id": "tmpl-lim-trig-001",
      "topic": "limits",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\lim_{x \\to 0}\\frac{\\sin(3x)}{2x}",
      "answerKind": "numeric",
      "answer": "3/2",
      "timeLimit": 30,
      "tabLimit": 1,
      "solution": "sin(u)/u → 1，把式子湊成 (3/2)·sin(3x)/(3x)，極限是 3/2。",
      "hints": [
        "把它湊成 sin(u)/u 的形式。",
        "分子分母各乘一個常數不影響極限。",
        "答案是兩個係數的比。"
      ],
      "tags": [
        "trig-limit",
        "standard-limit",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-lim-trig",
      "solutionSteps": [
        "認出這是 sin(u)/u 的形式，只是係數不一樣。",
        "把分子分母湊成同一個 u = 3x：sin(3x)/(3x)。",
        "為了湊出分母的 3x，整個式子要乘上 3/2。",
        "sin(u)/u → 1，所以極限是 3/2。"
      ]
    },
    {
      "id": "tmpl-lim-trig-002",
      "topic": "limits",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\lim_{x \\to 0}\\frac{\\sin(5x)}{4x}",
      "answerKind": "numeric",
      "answer": "5/4",
      "timeLimit": 30,
      "tabLimit": 1,
      "solution": "sin(u)/u → 1，把式子湊成 (5/4)·sin(5x)/(5x)，極限是 5/4。",
      "hints": [
        "把它湊成 sin(u)/u 的形式。",
        "分子分母各乘一個常數不影響極限。",
        "答案是兩個係數的比。"
      ],
      "tags": [
        "trig-limit",
        "standard-limit",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-lim-trig",
      "solutionSteps": [
        "認出這是 sin(u)/u 的形式，只是係數不一樣。",
        "把分子分母湊成同一個 u = 5x：sin(5x)/(5x)。",
        "為了湊出分母的 5x，整個式子要乘上 5/4。",
        "sin(u)/u → 1，所以極限是 5/4。"
      ]
    },
    {
      "id": "tmpl-lim-trig-003",
      "topic": "limits",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\lim_{x \\to 0}\\frac{\\sin(7x)}{3x}",
      "answerKind": "numeric",
      "answer": "7/3",
      "timeLimit": 30,
      "tabLimit": 1,
      "solution": "sin(u)/u → 1，把式子湊成 (7/3)·sin(7x)/(7x)，極限是 7/3。",
      "hints": [
        "把它湊成 sin(u)/u 的形式。",
        "分子分母各乘一個常數不影響極限。",
        "答案是兩個係數的比。"
      ],
      "tags": [
        "trig-limit",
        "standard-limit",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-lim-trig",
      "solutionSteps": [
        "認出這是 sin(u)/u 的形式，只是係數不一樣。",
        "把分子分母湊成同一個 u = 7x：sin(7x)/(7x)。",
        "為了湊出分母的 7x，整個式子要乘上 7/3。",
        "sin(u)/u → 1，所以極限是 7/3。"
      ]
    },
    {
      "id": "tmpl-lim-trig-004",
      "topic": "limits",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\lim_{x \\to 0}\\frac{\\sin(2x)}{9x}",
      "answerKind": "numeric",
      "answer": "2/9",
      "timeLimit": 30,
      "tabLimit": 1,
      "solution": "sin(u)/u → 1，把式子湊成 (2/9)·sin(2x)/(2x)，極限是 2/9。",
      "hints": [
        "把它湊成 sin(u)/u 的形式。",
        "分子分母各乘一個常數不影響極限。",
        "答案是兩個係數的比。"
      ],
      "tags": [
        "trig-limit",
        "standard-limit",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-lim-trig",
      "solutionSteps": [
        "認出這是 sin(u)/u 的形式，只是係數不一樣。",
        "把分子分母湊成同一個 u = 2x：sin(2x)/(2x)。",
        "為了湊出分母的 2x，整個式子要乘上 2/9。",
        "sin(u)/u → 1，所以極限是 2/9。"
      ]
    },
    {
      "id": "tmpl-lim-trig-005",
      "topic": "limits",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\lim_{x \\to 0}\\frac{\\sin(6x)}{5x}",
      "answerKind": "numeric",
      "answer": "6/5",
      "timeLimit": 30,
      "tabLimit": 1,
      "solution": "sin(u)/u → 1，把式子湊成 (6/5)·sin(6x)/(6x)，極限是 6/5。",
      "hints": [
        "把它湊成 sin(u)/u 的形式。",
        "分子分母各乘一個常數不影響極限。",
        "答案是兩個係數的比。"
      ],
      "tags": [
        "trig-limit",
        "standard-limit",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-lim-trig",
      "solutionSteps": [
        "認出這是 sin(u)/u 的形式，只是係數不一樣。",
        "把分子分母湊成同一個 u = 6x：sin(6x)/(6x)。",
        "為了湊出分母的 6x，整個式子要乘上 6/5。",
        "sin(u)/u → 1，所以極限是 6/5。"
      ]
    },
    {
      "id": "tmpl-ser-geometric-001",
      "topic": "series",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\sum_{n=0}^{\\infty}\\frac{1}{2^n}",
      "answerKind": "numeric",
      "answer": "1*2/(2-1)",
      "timeLimit": 35,
      "tabLimit": 1,
      "solution": "公比 1/2，首項 1。等比級數和 = 首項/(1−公比) = 1/(1−1/2) = 1·2/(2−1)。",
      "hints": [
        "這是等比級數。",
        "公比是 1/2，小於 1 所以收斂。",
        "和 = 首項 / (1 − 公比)。"
      ],
      "tags": [
        "geometric-series",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-ser-geometric",
      "solutionSteps": [
        "把通項寫成 1·(1/2)^n，看出這是等比級數。",
        "首項（n=0 那一項）是 1，公比是 1/2。",
        "公比絕對值小於 1，級數收斂。",
        "和 = 首項/(1−公比) = 1/(1−1/2) = 1·2/(2−1)。"
      ]
    },
    {
      "id": "tmpl-ser-geometric-002",
      "topic": "series",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\sum_{n=0}^{\\infty}\\frac{3}{4^n}",
      "answerKind": "numeric",
      "answer": "3*4/(4-1)",
      "timeLimit": 35,
      "tabLimit": 1,
      "solution": "公比 1/4，首項 3。等比級數和 = 首項/(1−公比) = 3/(1−1/4) = 3·4/(4−1)。",
      "hints": [
        "這是等比級數。",
        "公比是 1/4，小於 1 所以收斂。",
        "和 = 首項 / (1 − 公比)。"
      ],
      "tags": [
        "geometric-series",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-ser-geometric",
      "solutionSteps": [
        "把通項寫成 3·(1/4)^n，看出這是等比級數。",
        "首項（n=0 那一項）是 3，公比是 1/4。",
        "公比絕對值小於 1，級數收斂。",
        "和 = 首項/(1−公比) = 3/(1−1/4) = 3·4/(4−1)。"
      ]
    },
    {
      "id": "tmpl-ser-geometric-003",
      "topic": "series",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\sum_{n=0}^{\\infty}\\frac{2}{5^n}",
      "answerKind": "numeric",
      "answer": "2*5/(5-1)",
      "timeLimit": 35,
      "tabLimit": 1,
      "solution": "公比 1/5，首項 2。等比級數和 = 首項/(1−公比) = 2/(1−1/5) = 2·5/(5−1)。",
      "hints": [
        "這是等比級數。",
        "公比是 1/5，小於 1 所以收斂。",
        "和 = 首項 / (1 − 公比)。"
      ],
      "tags": [
        "geometric-series",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-ser-geometric",
      "solutionSteps": [
        "把通項寫成 2·(1/5)^n，看出這是等比級數。",
        "首項（n=0 那一項）是 2，公比是 1/5。",
        "公比絕對值小於 1，級數收斂。",
        "和 = 首項/(1−公比) = 2/(1−1/5) = 2·5/(5−1)。"
      ]
    },
    {
      "id": "tmpl-ser-geometric-004",
      "topic": "series",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\sum_{n=0}^{\\infty}\\frac{5}{3^n}",
      "answerKind": "numeric",
      "answer": "5*3/(3-1)",
      "timeLimit": 35,
      "tabLimit": 1,
      "solution": "公比 1/3，首項 5。等比級數和 = 首項/(1−公比) = 5/(1−1/3) = 5·3/(3−1)。",
      "hints": [
        "這是等比級數。",
        "公比是 1/3，小於 1 所以收斂。",
        "和 = 首項 / (1 − 公比)。"
      ],
      "tags": [
        "geometric-series",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-ser-geometric",
      "solutionSteps": [
        "把通項寫成 5·(1/3)^n，看出這是等比級數。",
        "首項（n=0 那一項）是 5，公比是 1/3。",
        "公比絕對值小於 1，級數收斂。",
        "和 = 首項/(1−公比) = 5/(1−1/3) = 5·3/(3−1)。"
      ]
    },
    {
      "id": "tmpl-ser-geometric-005",
      "topic": "series",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\sum_{n=0}^{\\infty}\\frac{4}{6^n}",
      "answerKind": "numeric",
      "answer": "4*6/(6-1)",
      "timeLimit": 35,
      "tabLimit": 1,
      "solution": "公比 1/6，首項 4。等比級數和 = 首項/(1−公比) = 4/(1−1/6) = 4·6/(6−1)。",
      "hints": [
        "這是等比級數。",
        "公比是 1/6，小於 1 所以收斂。",
        "和 = 首項 / (1 − 公比)。"
      ],
      "tags": [
        "geometric-series",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-ser-geometric",
      "solutionSteps": [
        "把通項寫成 4·(1/6)^n，看出這是等比級數。",
        "首項（n=0 那一項）是 4，公比是 1/6。",
        "公比絕對值小於 1，級數收斂。",
        "和 = 首項/(1−公比) = 4/(1−1/6) = 4·6/(6−1)。"
      ]
    },
    {
      "id": "tmpl-int-partialfrac-001",
      "topic": "integrals",
      "rank": 3,
      "difficulty": 3,
      "source": "Buzz 模板變體",
      "prompt": "\\int_{1}^{2}\\frac{1}{x(x+1)}\\,dx",
      "answerKind": "numeric",
      "answer": "(log(2/(2+1))-log(1/(1+1)))/1",
      "timeLimit": 70,
      "tabLimit": 1,
      "solution": "部分分式：1/(x(x+1)) = (1/1)(1/x − 1/(x+1))，積分得 (1/1)·ln(x/(x+1))。",
      "hints": [
        "先做部分分式分解。",
        "1/(x(x+c)) = (1/c)(1/x − 1/(x+c))。",
        "兩個對數合併成一個比值的對數。"
      ],
      "tags": [
        "partial-fraction",
        "definite-integral",
        "log",
        "rank-3"
      ],
      "variantOf": "tmpl-int-partialfrac",
      "solutionSteps": [
        "分母是兩個一次式相乘，先做部分分式分解。",
        "1/(x(x+1)) = (1/1)·(1/x − 1/(x+1))。",
        "積分得 (1/1)·(ln|x| − ln|x+1|) = (1/1)·ln(x/(x+1))。",
        "代入上下限 1 到 2，兩個對數相減。"
      ]
    },
    {
      "id": "tmpl-int-partialfrac-002",
      "topic": "integrals",
      "rank": 3,
      "difficulty": 3,
      "source": "Buzz 模板變體",
      "prompt": "\\int_{1}^{3}\\frac{1}{x(x+2)}\\,dx",
      "answerKind": "numeric",
      "answer": "(log(3/(3+2))-log(1/(1+2)))/2",
      "timeLimit": 70,
      "tabLimit": 1,
      "solution": "部分分式：1/(x(x+2)) = (1/2)(1/x − 1/(x+2))，積分得 (1/2)·ln(x/(x+2))。",
      "hints": [
        "先做部分分式分解。",
        "1/(x(x+c)) = (1/c)(1/x − 1/(x+c))。",
        "兩個對數合併成一個比值的對數。"
      ],
      "tags": [
        "partial-fraction",
        "definite-integral",
        "log",
        "rank-3"
      ],
      "variantOf": "tmpl-int-partialfrac",
      "solutionSteps": [
        "分母是兩個一次式相乘，先做部分分式分解。",
        "1/(x(x+2)) = (1/2)·(1/x − 1/(x+2))。",
        "積分得 (1/2)·(ln|x| − ln|x+2|) = (1/2)·ln(x/(x+2))。",
        "代入上下限 1 到 3，兩個對數相減。"
      ]
    },
    {
      "id": "tmpl-int-partialfrac-003",
      "topic": "integrals",
      "rank": 3,
      "difficulty": 3,
      "source": "Buzz 模板變體",
      "prompt": "\\int_{2}^{4}\\frac{1}{x(x+1)}\\,dx",
      "answerKind": "numeric",
      "answer": "(log(4/(4+1))-log(2/(2+1)))/1",
      "timeLimit": 70,
      "tabLimit": 1,
      "solution": "部分分式：1/(x(x+1)) = (1/1)(1/x − 1/(x+1))，積分得 (1/1)·ln(x/(x+1))。",
      "hints": [
        "先做部分分式分解。",
        "1/(x(x+c)) = (1/c)(1/x − 1/(x+c))。",
        "兩個對數合併成一個比值的對數。"
      ],
      "tags": [
        "partial-fraction",
        "definite-integral",
        "log",
        "rank-3"
      ],
      "variantOf": "tmpl-int-partialfrac",
      "solutionSteps": [
        "分母是兩個一次式相乘，先做部分分式分解。",
        "1/(x(x+1)) = (1/1)·(1/x − 1/(x+1))。",
        "積分得 (1/1)·(ln|x| − ln|x+1|) = (1/1)·ln(x/(x+1))。",
        "代入上下限 2 到 4，兩個對數相減。"
      ]
    },
    {
      "id": "tmpl-int-partialfrac-004",
      "topic": "integrals",
      "rank": 3,
      "difficulty": 3,
      "source": "Buzz 模板變體",
      "prompt": "\\int_{1}^{5}\\frac{1}{x(x+3)}\\,dx",
      "answerKind": "numeric",
      "answer": "(log(5/(5+3))-log(1/(1+3)))/3",
      "timeLimit": 70,
      "tabLimit": 1,
      "solution": "部分分式：1/(x(x+3)) = (1/3)(1/x − 1/(x+3))，積分得 (1/3)·ln(x/(x+3))。",
      "hints": [
        "先做部分分式分解。",
        "1/(x(x+c)) = (1/c)(1/x − 1/(x+c))。",
        "兩個對數合併成一個比值的對數。"
      ],
      "tags": [
        "partial-fraction",
        "definite-integral",
        "log",
        "rank-3"
      ],
      "variantOf": "tmpl-int-partialfrac",
      "solutionSteps": [
        "分母是兩個一次式相乘，先做部分分式分解。",
        "1/(x(x+3)) = (1/3)·(1/x − 1/(x+3))。",
        "積分得 (1/3)·(ln|x| − ln|x+3|) = (1/3)·ln(x/(x+3))。",
        "代入上下限 1 到 5，兩個對數相減。"
      ]
    },
    {
      "id": "tmpl-der-chain-exp-001",
      "topic": "derivatives",
      "rank": 2,
      "difficulty": 2,
      "source": "Buzz 模板變體",
      "prompt": "\\frac{d}{dx}e^{2x^{2}}",
      "answerKind": "expression",
      "answer": "2*2*x^(2-1)*exp(2*x^2)",
      "timeLimit": 40,
      "tabLimit": 1,
      "solution": "鏈鎖律：外層 e^u 的導數還是 e^u，內層 2x^2 的導數是 2·2x^(2−1)。",
      "hints": [
        "外層是 e^u。",
        "e^u 微分後還是 e^u，再乘 u'。",
        "u = 2x^2。"
      ],
      "tags": [
        "chain-rule",
        "exponential",
        "rank-2",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-der-chain-exp",
      "solutionSteps": [
        "外層是 e^u，內層 u = 2x^2。",
        "鏈鎖律：整個式子的導數是 e^u · u'。",
        "u' = 2·2x^(2−1)。",
        "所以答案是 2·2x^(2−1)·e^(2x^2)。"
      ],
      "variable": "x"
    },
    {
      "id": "tmpl-der-chain-exp-002",
      "topic": "derivatives",
      "rank": 2,
      "difficulty": 2,
      "source": "Buzz 模板變體",
      "prompt": "\\frac{d}{dx}e^{3x^{3}}",
      "answerKind": "expression",
      "answer": "3*3*x^(3-1)*exp(3*x^3)",
      "timeLimit": 40,
      "tabLimit": 1,
      "solution": "鏈鎖律：外層 e^u 的導數還是 e^u，內層 3x^3 的導數是 3·3x^(3−1)。",
      "hints": [
        "外層是 e^u。",
        "e^u 微分後還是 e^u，再乘 u'。",
        "u = 3x^3。"
      ],
      "tags": [
        "chain-rule",
        "exponential",
        "rank-2",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-der-chain-exp",
      "solutionSteps": [
        "外層是 e^u，內層 u = 3x^3。",
        "鏈鎖律：整個式子的導數是 e^u · u'。",
        "u' = 3·3x^(3−1)。",
        "所以答案是 3·3x^(3−1)·e^(3x^3)。"
      ],
      "variable": "x"
    },
    {
      "id": "tmpl-der-chain-exp-003",
      "topic": "derivatives",
      "rank": 2,
      "difficulty": 2,
      "source": "Buzz 模板變體",
      "prompt": "\\frac{d}{dx}e^{5x^{2}}",
      "answerKind": "expression",
      "answer": "5*2*x^(2-1)*exp(5*x^2)",
      "timeLimit": 40,
      "tabLimit": 1,
      "solution": "鏈鎖律：外層 e^u 的導數還是 e^u，內層 5x^2 的導數是 5·2x^(2−1)。",
      "hints": [
        "外層是 e^u。",
        "e^u 微分後還是 e^u，再乘 u'。",
        "u = 5x^2。"
      ],
      "tags": [
        "chain-rule",
        "exponential",
        "rank-2",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-der-chain-exp",
      "solutionSteps": [
        "外層是 e^u，內層 u = 5x^2。",
        "鏈鎖律：整個式子的導數是 e^u · u'。",
        "u' = 5·2x^(2−1)。",
        "所以答案是 5·2x^(2−1)·e^(5x^2)。"
      ],
      "variable": "x"
    },
    {
      "id": "tmpl-der-chain-exp-004",
      "topic": "derivatives",
      "rank": 2,
      "difficulty": 2,
      "source": "Buzz 模板變體",
      "prompt": "\\frac{d}{dx}e^{1x^{4}}",
      "answerKind": "expression",
      "answer": "1*4*x^(4-1)*exp(1*x^4)",
      "timeLimit": 40,
      "tabLimit": 1,
      "solution": "鏈鎖律：外層 e^u 的導數還是 e^u，內層 1x^4 的導數是 1·4x^(4−1)。",
      "hints": [
        "外層是 e^u。",
        "e^u 微分後還是 e^u，再乘 u'。",
        "u = 1x^4。"
      ],
      "tags": [
        "chain-rule",
        "exponential",
        "rank-2",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-der-chain-exp",
      "solutionSteps": [
        "外層是 e^u，內層 u = 1x^4。",
        "鏈鎖律：整個式子的導數是 e^u · u'。",
        "u' = 1·4x^(4−1)。",
        "所以答案是 1·4x^(4−1)·e^(1x^4)。"
      ],
      "variable": "x"
    },
    {
      "id": "tmpl-der-chain-exp-005",
      "topic": "derivatives",
      "rank": 2,
      "difficulty": 2,
      "source": "Buzz 模板變體",
      "prompt": "\\frac{d}{dx}e^{4x^{3}}",
      "answerKind": "expression",
      "answer": "4*3*x^(3-1)*exp(4*x^3)",
      "timeLimit": 40,
      "tabLimit": 1,
      "solution": "鏈鎖律：外層 e^u 的導數還是 e^u，內層 4x^3 的導數是 4·3x^(3−1)。",
      "hints": [
        "外層是 e^u。",
        "e^u 微分後還是 e^u，再乘 u'。",
        "u = 4x^3。"
      ],
      "tags": [
        "chain-rule",
        "exponential",
        "rank-2",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-der-chain-exp",
      "solutionSteps": [
        "外層是 e^u，內層 u = 4x^3。",
        "鏈鎖律：整個式子的導數是 e^u · u'。",
        "u' = 4·3x^(3−1)。",
        "所以答案是 4·3x^(3−1)·e^(4x^3)。"
      ],
      "variable": "x"
    },
    {
      "id": "tmpl-lim-direct-002",
      "topic": "limits",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\lim_{x \\to 2}\\left(5x+4\\right)",
      "answerKind": "numeric",
      "answer": "5*2+4",
      "timeLimit": 20,
      "tabLimit": 1,
      "solution": "多項式在每一點都連續，直接代入 x=2：5·2+4。",
      "hints": [
        "多項式是連續的。",
        "連續就可以直接代入。"
      ],
      "tags": [
        "direct-substitution",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-lim-direct",
      "solutionSteps": [
        "多項式函數處處連續。",
        "連續的地方，極限就等於函數值。",
        "直接把 x=2 代進去。"
      ]
    },
    {
      "id": "tmpl-lim-direct-003",
      "topic": "limits",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\lim_{x \\to 4}\\left(3x+7\\right)",
      "answerKind": "numeric",
      "answer": "3*4+7",
      "timeLimit": 20,
      "tabLimit": 1,
      "solution": "多項式在每一點都連續，直接代入 x=4：3·4+7。",
      "hints": [
        "多項式是連續的。",
        "連續就可以直接代入。"
      ],
      "tags": [
        "direct-substitution",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-lim-direct",
      "solutionSteps": [
        "多項式函數處處連續。",
        "連續的地方，極限就等於函數值。",
        "直接把 x=4 代進去。"
      ]
    },
    {
      "id": "tmpl-lim-direct-004",
      "topic": "limits",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\lim_{x \\to 5}\\left(2x+9\\right)",
      "answerKind": "numeric",
      "answer": "2*5+9",
      "timeLimit": 20,
      "tabLimit": 1,
      "solution": "多項式在每一點都連續，直接代入 x=5：2·5+9。",
      "hints": [
        "多項式是連續的。",
        "連續就可以直接代入。"
      ],
      "tags": [
        "direct-substitution",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-lim-direct",
      "solutionSteps": [
        "多項式函數處處連續。",
        "連續的地方，極限就等於函數值。",
        "直接把 x=5 代進去。"
      ]
    },
    {
      "id": "tmpl-lim-direct-005",
      "topic": "limits",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\lim_{x \\to 1}\\left(8x+3\\right)",
      "answerKind": "numeric",
      "answer": "8*1+3",
      "timeLimit": 20,
      "tabLimit": 1,
      "solution": "多項式在每一點都連續，直接代入 x=1：8·1+3。",
      "hints": [
        "多項式是連續的。",
        "連續就可以直接代入。"
      ],
      "tags": [
        "direct-substitution",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-lim-direct",
      "solutionSteps": [
        "多項式函數處處連續。",
        "連續的地方，極限就等於函數值。",
        "直接把 x=1 代進去。"
      ]
    },
    {
      "id": "tmpl-lim-direct-006",
      "topic": "limits",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\lim_{x \\to 6}\\left(4x+2\\right)",
      "answerKind": "numeric",
      "answer": "4*6+2",
      "timeLimit": 20,
      "tabLimit": 1,
      "solution": "多項式在每一點都連續，直接代入 x=6：4·6+2。",
      "hints": [
        "多項式是連續的。",
        "連續就可以直接代入。"
      ],
      "tags": [
        "direct-substitution",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-lim-direct",
      "solutionSteps": [
        "多項式函數處處連續。",
        "連續的地方，極限就等於函數值。",
        "直接把 x=6 代進去。"
      ]
    },
    {
      "id": "tmpl-lim-factor-002",
      "topic": "limits",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\lim_{x \\to 3}\\frac{x^2-9}{x-3}",
      "answerKind": "numeric",
      "answer": "2*3",
      "timeLimit": 25,
      "tabLimit": 1,
      "solution": "分子是平方差 (x−3)(x+3)，約掉 (x−3) 之後代入得 2·3。",
      "hints": [
        "先看分子能不能分解。",
        "平方差公式。",
        "約掉之後就可以直接代入。"
      ],
      "tags": [
        "factoring",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-lim-factor",
      "solutionSteps": [
        "直接代入會得到 0/0，不能用。",
        "分子做平方差分解：x²−9 = (x−3)(x+3)。",
        "約掉共同的 (x−3)。",
        "剩下 x+3，代入 x=3 得 2·3。"
      ]
    },
    {
      "id": "tmpl-lim-factor-003",
      "topic": "limits",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\lim_{x \\to 5}\\frac{x^2-25}{x-5}",
      "answerKind": "numeric",
      "answer": "2*5",
      "timeLimit": 25,
      "tabLimit": 1,
      "solution": "分子是平方差 (x−5)(x+5)，約掉 (x−5) 之後代入得 2·5。",
      "hints": [
        "先看分子能不能分解。",
        "平方差公式。",
        "約掉之後就可以直接代入。"
      ],
      "tags": [
        "factoring",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-lim-factor",
      "solutionSteps": [
        "直接代入會得到 0/0，不能用。",
        "分子做平方差分解：x²−25 = (x−5)(x+5)。",
        "約掉共同的 (x−5)。",
        "剩下 x+5，代入 x=5 得 2·5。"
      ]
    },
    {
      "id": "tmpl-lim-factor-005",
      "topic": "limits",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\lim_{x \\to 6}\\frac{x^2-36}{x-6}",
      "answerKind": "numeric",
      "answer": "2*6",
      "timeLimit": 25,
      "tabLimit": 1,
      "solution": "分子是平方差 (x−6)(x+6)，約掉 (x−6) 之後代入得 2·6。",
      "hints": [
        "先看分子能不能分解。",
        "平方差公式。",
        "約掉之後就可以直接代入。"
      ],
      "tags": [
        "factoring",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-lim-factor",
      "solutionSteps": [
        "直接代入會得到 0/0，不能用。",
        "分子做平方差分解：x²−36 = (x−6)(x+6)。",
        "約掉共同的 (x−6)。",
        "剩下 x+6，代入 x=6 得 2·6。"
      ]
    },
    {
      "id": "tmpl-lim-factor-006",
      "topic": "limits",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\lim_{x \\to 7}\\frac{x^2-49}{x-7}",
      "answerKind": "numeric",
      "answer": "2*7",
      "timeLimit": 25,
      "tabLimit": 1,
      "solution": "分子是平方差 (x−7)(x+7)，約掉 (x−7) 之後代入得 2·7。",
      "hints": [
        "先看分子能不能分解。",
        "平方差公式。",
        "約掉之後就可以直接代入。"
      ],
      "tags": [
        "factoring",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-lim-factor",
      "solutionSteps": [
        "直接代入會得到 0/0，不能用。",
        "分子做平方差分解：x²−49 = (x−7)(x+7)。",
        "約掉共同的 (x−7)。",
        "剩下 x+7，代入 x=7 得 2·7。"
      ]
    },
    {
      "id": "tmpl-lim-rational-001",
      "topic": "limits",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\lim_{x \\to \\infty}\\frac{3x+1}{2x+5}",
      "answerKind": "numeric",
      "answer": "3/2",
      "timeLimit": 25,
      "tabLimit": 1,
      "solution": "分子分母同除以 x，常數項都趨近 0，剩下最高次項係數比 3/2。",
      "hints": [
        "分子分母同除以最高次的 x。",
        "常數除以 x 會趨近 0。"
      ],
      "tags": [
        "rational-limit",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-lim-rational",
      "solutionSteps": [
        "分子分母同除以 x。",
        "得到 (3+1/x)/(2+5/x)。",
        "x→∞ 時 1/x 和 5/x 都趨近 0。",
        "剩下 3/2。"
      ]
    },
    {
      "id": "tmpl-lim-rational-002",
      "topic": "limits",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\lim_{x \\to \\infty}\\frac{5x+2}{4x+1}",
      "answerKind": "numeric",
      "answer": "5/4",
      "timeLimit": 25,
      "tabLimit": 1,
      "solution": "分子分母同除以 x，常數項都趨近 0，剩下最高次項係數比 5/4。",
      "hints": [
        "分子分母同除以最高次的 x。",
        "常數除以 x 會趨近 0。"
      ],
      "tags": [
        "rational-limit",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-lim-rational",
      "solutionSteps": [
        "分子分母同除以 x。",
        "得到 (5+2/x)/(4+1/x)。",
        "x→∞ 時 2/x 和 1/x 都趨近 0。",
        "剩下 5/4。"
      ]
    },
    {
      "id": "tmpl-lim-rational-003",
      "topic": "limits",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\lim_{x \\to \\infty}\\frac{7x+3}{3x+2}",
      "answerKind": "numeric",
      "answer": "7/3",
      "timeLimit": 25,
      "tabLimit": 1,
      "solution": "分子分母同除以 x，常數項都趨近 0，剩下最高次項係數比 7/3。",
      "hints": [
        "分子分母同除以最高次的 x。",
        "常數除以 x 會趨近 0。"
      ],
      "tags": [
        "rational-limit",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-lim-rational",
      "solutionSteps": [
        "分子分母同除以 x。",
        "得到 (7+3/x)/(3+2/x)。",
        "x→∞ 時 3/x 和 2/x 都趨近 0。",
        "剩下 7/3。"
      ]
    },
    {
      "id": "tmpl-lim-rational-004",
      "topic": "limits",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\lim_{x \\to \\infty}\\frac{2x+9}{5x+4}",
      "answerKind": "numeric",
      "answer": "2/5",
      "timeLimit": 25,
      "tabLimit": 1,
      "solution": "分子分母同除以 x，常數項都趨近 0，剩下最高次項係數比 2/5。",
      "hints": [
        "分子分母同除以最高次的 x。",
        "常數除以 x 會趨近 0。"
      ],
      "tags": [
        "rational-limit",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-lim-rational",
      "solutionSteps": [
        "分子分母同除以 x。",
        "得到 (2+9/x)/(5+4/x)。",
        "x→∞ 時 9/x 和 4/x 都趨近 0。",
        "剩下 2/5。"
      ]
    },
    {
      "id": "tmpl-lim-rational-005",
      "topic": "limits",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\lim_{x \\to \\infty}\\frac{6x+1}{4x+7}",
      "answerKind": "numeric",
      "answer": "6/4",
      "timeLimit": 25,
      "tabLimit": 1,
      "solution": "分子分母同除以 x，常數項都趨近 0，剩下最高次項係數比 6/4。",
      "hints": [
        "分子分母同除以最高次的 x。",
        "常數除以 x 會趨近 0。"
      ],
      "tags": [
        "rational-limit",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-lim-rational",
      "solutionSteps": [
        "分子分母同除以 x。",
        "得到 (6+1/x)/(4+7/x)。",
        "x→∞ 時 1/x 和 7/x 都趨近 0。",
        "剩下 6/4。"
      ]
    },
    {
      "id": "tmpl-lim-rational-006",
      "topic": "limits",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\lim_{x \\to \\infty}\\frac{9x+2}{6x+5}",
      "answerKind": "numeric",
      "answer": "9/6",
      "timeLimit": 25,
      "tabLimit": 1,
      "solution": "分子分母同除以 x，常數項都趨近 0，剩下最高次項係數比 9/6。",
      "hints": [
        "分子分母同除以最高次的 x。",
        "常數除以 x 會趨近 0。"
      ],
      "tags": [
        "rational-limit",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-lim-rational",
      "solutionSteps": [
        "分子分母同除以 x。",
        "得到 (9+2/x)/(6+5/x)。",
        "x→∞ 時 2/x 和 5/x 都趨近 0。",
        "剩下 9/6。"
      ]
    },
    {
      "id": "tmpl-der-exp-001",
      "topic": "derivatives",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\frac{d}{dx}e^{2x}",
      "answerKind": "expression",
      "answer": "2*exp(2*x)",
      "timeLimit": 20,
      "tabLimit": 1,
      "solution": "e^{ax} 的導數還是 e^{ax}，再乘上內層 2x 的導數 2。",
      "hints": [
        "e 的指數函數微分後還是自己。",
        "別忘了乘內層的導數。"
      ],
      "tags": [
        "chain-rule",
        "exponential",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-der-exp",
      "solutionSteps": [
        "外層是 e^u，它的導數還是 e^u。",
        "內層 u=2x，導數是 2。",
        "相乘得 2·e^(2x)。"
      ],
      "variable": "x"
    },
    {
      "id": "tmpl-der-exp-002",
      "topic": "derivatives",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\frac{d}{dx}e^{3x}",
      "answerKind": "expression",
      "answer": "3*exp(3*x)",
      "timeLimit": 20,
      "tabLimit": 1,
      "solution": "e^{ax} 的導數還是 e^{ax}，再乘上內層 3x 的導數 3。",
      "hints": [
        "e 的指數函數微分後還是自己。",
        "別忘了乘內層的導數。"
      ],
      "tags": [
        "chain-rule",
        "exponential",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-der-exp",
      "solutionSteps": [
        "外層是 e^u，它的導數還是 e^u。",
        "內層 u=3x，導數是 3。",
        "相乘得 3·e^(3x)。"
      ],
      "variable": "x"
    },
    {
      "id": "tmpl-der-exp-003",
      "topic": "derivatives",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\frac{d}{dx}e^{5x}",
      "answerKind": "expression",
      "answer": "5*exp(5*x)",
      "timeLimit": 20,
      "tabLimit": 1,
      "solution": "e^{ax} 的導數還是 e^{ax}，再乘上內層 5x 的導數 5。",
      "hints": [
        "e 的指數函數微分後還是自己。",
        "別忘了乘內層的導數。"
      ],
      "tags": [
        "chain-rule",
        "exponential",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-der-exp",
      "solutionSteps": [
        "外層是 e^u，它的導數還是 e^u。",
        "內層 u=5x，導數是 5。",
        "相乘得 5·e^(5x)。"
      ],
      "variable": "x"
    },
    {
      "id": "tmpl-der-exp-004",
      "topic": "derivatives",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\frac{d}{dx}e^{4x}",
      "answerKind": "expression",
      "answer": "4*exp(4*x)",
      "timeLimit": 20,
      "tabLimit": 1,
      "solution": "e^{ax} 的導數還是 e^{ax}，再乘上內層 4x 的導數 4。",
      "hints": [
        "e 的指數函數微分後還是自己。",
        "別忘了乘內層的導數。"
      ],
      "tags": [
        "chain-rule",
        "exponential",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-der-exp",
      "solutionSteps": [
        "外層是 e^u，它的導數還是 e^u。",
        "內層 u=4x，導數是 4。",
        "相乘得 4·e^(4x)。"
      ],
      "variable": "x"
    },
    {
      "id": "tmpl-der-exp-005",
      "topic": "derivatives",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\frac{d}{dx}e^{7x}",
      "answerKind": "expression",
      "answer": "7*exp(7*x)",
      "timeLimit": 20,
      "tabLimit": 1,
      "solution": "e^{ax} 的導數還是 e^{ax}，再乘上內層 7x 的導數 7。",
      "hints": [
        "e 的指數函數微分後還是自己。",
        "別忘了乘內層的導數。"
      ],
      "tags": [
        "chain-rule",
        "exponential",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-der-exp",
      "solutionSteps": [
        "外層是 e^u，它的導數還是 e^u。",
        "內層 u=7x，導數是 7。",
        "相乘得 7·e^(7x)。"
      ],
      "variable": "x"
    },
    {
      "id": "tmpl-der-exp-006",
      "topic": "derivatives",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\frac{d}{dx}e^{6x}",
      "answerKind": "expression",
      "answer": "6*exp(6*x)",
      "timeLimit": 20,
      "tabLimit": 1,
      "solution": "e^{ax} 的導數還是 e^{ax}，再乘上內層 6x 的導數 6。",
      "hints": [
        "e 的指數函數微分後還是自己。",
        "別忘了乘內層的導數。"
      ],
      "tags": [
        "chain-rule",
        "exponential",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-der-exp",
      "solutionSteps": [
        "外層是 e^u，它的導數還是 e^u。",
        "內層 u=6x，導數是 6。",
        "相乘得 6·e^(6x)。"
      ],
      "variable": "x"
    },
    {
      "id": "tmpl-der-sin-001",
      "topic": "derivatives",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\frac{d}{dx}\\sin(2x)",
      "answerKind": "expression",
      "answer": "2*cos(2*x)",
      "timeLimit": 20,
      "tabLimit": 1,
      "solution": "sin 的導數是 cos，再乘內層 2x 的導數 2。",
      "hints": [
        "sin 微分變 cos。",
        "鏈鎖律：乘上內層的導數。"
      ],
      "tags": [
        "chain-rule",
        "trig",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-der-sin",
      "solutionSteps": [
        "sin u 的導數是 cos u。",
        "內層 u=2x 的導數是 2。",
        "相乘得 2cos(2x)。"
      ],
      "variable": "x"
    },
    {
      "id": "tmpl-der-sin-002",
      "topic": "derivatives",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\frac{d}{dx}\\sin(3x)",
      "answerKind": "expression",
      "answer": "3*cos(3*x)",
      "timeLimit": 20,
      "tabLimit": 1,
      "solution": "sin 的導數是 cos，再乘內層 3x 的導數 3。",
      "hints": [
        "sin 微分變 cos。",
        "鏈鎖律：乘上內層的導數。"
      ],
      "tags": [
        "chain-rule",
        "trig",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-der-sin",
      "solutionSteps": [
        "sin u 的導數是 cos u。",
        "內層 u=3x 的導數是 3。",
        "相乘得 3cos(3x)。"
      ],
      "variable": "x"
    },
    {
      "id": "tmpl-der-sin-003",
      "topic": "derivatives",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\frac{d}{dx}\\sin(4x)",
      "answerKind": "expression",
      "answer": "4*cos(4*x)",
      "timeLimit": 20,
      "tabLimit": 1,
      "solution": "sin 的導數是 cos，再乘內層 4x 的導數 4。",
      "hints": [
        "sin 微分變 cos。",
        "鏈鎖律：乘上內層的導數。"
      ],
      "tags": [
        "chain-rule",
        "trig",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-der-sin",
      "solutionSteps": [
        "sin u 的導數是 cos u。",
        "內層 u=4x 的導數是 4。",
        "相乘得 4cos(4x)。"
      ],
      "variable": "x"
    },
    {
      "id": "tmpl-der-sin-004",
      "topic": "derivatives",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\frac{d}{dx}\\sin(5x)",
      "answerKind": "expression",
      "answer": "5*cos(5*x)",
      "timeLimit": 20,
      "tabLimit": 1,
      "solution": "sin 的導數是 cos，再乘內層 5x 的導數 5。",
      "hints": [
        "sin 微分變 cos。",
        "鏈鎖律：乘上內層的導數。"
      ],
      "tags": [
        "chain-rule",
        "trig",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-der-sin",
      "solutionSteps": [
        "sin u 的導數是 cos u。",
        "內層 u=5x 的導數是 5。",
        "相乘得 5cos(5x)。"
      ],
      "variable": "x"
    },
    {
      "id": "tmpl-der-sin-005",
      "topic": "derivatives",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\frac{d}{dx}\\sin(6x)",
      "answerKind": "expression",
      "answer": "6*cos(6*x)",
      "timeLimit": 20,
      "tabLimit": 1,
      "solution": "sin 的導數是 cos，再乘內層 6x 的導數 6。",
      "hints": [
        "sin 微分變 cos。",
        "鏈鎖律：乘上內層的導數。"
      ],
      "tags": [
        "chain-rule",
        "trig",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-der-sin",
      "solutionSteps": [
        "sin u 的導數是 cos u。",
        "內層 u=6x 的導數是 6。",
        "相乘得 6cos(6x)。"
      ],
      "variable": "x"
    },
    {
      "id": "tmpl-der-sin-006",
      "topic": "derivatives",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\frac{d}{dx}\\sin(7x)",
      "answerKind": "expression",
      "answer": "7*cos(7*x)",
      "timeLimit": 20,
      "tabLimit": 1,
      "solution": "sin 的導數是 cos，再乘內層 7x 的導數 7。",
      "hints": [
        "sin 微分變 cos。",
        "鏈鎖律：乘上內層的導數。"
      ],
      "tags": [
        "chain-rule",
        "trig",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-der-sin",
      "solutionSteps": [
        "sin u 的導數是 cos u。",
        "內層 u=7x 的導數是 7。",
        "相乘得 7cos(7x)。"
      ],
      "variable": "x"
    },
    {
      "id": "tmpl-der-simple-power-001",
      "topic": "derivatives",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\frac{d}{dx}\\left(4x^{3}\\right)",
      "answerKind": "expression",
      "answer": "4*3*x^(3-1)",
      "timeLimit": 20,
      "tabLimit": 1,
      "solution": "次方律：4x^3 的導數是 4·3x^(3−1)。",
      "hints": [
        "次方拉下來當係數，指數減一。"
      ],
      "tags": [
        "power-rule",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-der-simple-power",
      "solutionSteps": [
        "次方律：x^n 的導數是 n·x^(n−1)。",
        "常數係數 4 直接留著。",
        "得 4·3x^(3−1)。"
      ],
      "variable": "x"
    },
    {
      "id": "tmpl-der-simple-power-002",
      "topic": "derivatives",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\frac{d}{dx}\\left(7x^{2}\\right)",
      "answerKind": "expression",
      "answer": "7*2*x^(2-1)",
      "timeLimit": 20,
      "tabLimit": 1,
      "solution": "次方律：7x^2 的導數是 7·2x^(2−1)。",
      "hints": [
        "次方拉下來當係數，指數減一。"
      ],
      "tags": [
        "power-rule",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-der-simple-power",
      "solutionSteps": [
        "次方律：x^n 的導數是 n·x^(n−1)。",
        "常數係數 7 直接留著。",
        "得 7·2x^(2−1)。"
      ],
      "variable": "x"
    },
    {
      "id": "tmpl-der-simple-power-003",
      "topic": "derivatives",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\frac{d}{dx}\\left(5x^{6}\\right)",
      "answerKind": "expression",
      "answer": "5*6*x^(6-1)",
      "timeLimit": 20,
      "tabLimit": 1,
      "solution": "次方律：5x^6 的導數是 5·6x^(6−1)。",
      "hints": [
        "次方拉下來當係數，指數減一。"
      ],
      "tags": [
        "power-rule",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-der-simple-power",
      "solutionSteps": [
        "次方律：x^n 的導數是 n·x^(n−1)。",
        "常數係數 5 直接留著。",
        "得 5·6x^(6−1)。"
      ],
      "variable": "x"
    },
    {
      "id": "tmpl-der-simple-power-004",
      "topic": "derivatives",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\frac{d}{dx}\\left(9x^{4}\\right)",
      "answerKind": "expression",
      "answer": "9*4*x^(4-1)",
      "timeLimit": 20,
      "tabLimit": 1,
      "solution": "次方律：9x^4 的導數是 9·4x^(4−1)。",
      "hints": [
        "次方拉下來當係數，指數減一。"
      ],
      "tags": [
        "power-rule",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-der-simple-power",
      "solutionSteps": [
        "次方律：x^n 的導數是 n·x^(n−1)。",
        "常數係數 9 直接留著。",
        "得 9·4x^(4−1)。"
      ],
      "variable": "x"
    },
    {
      "id": "tmpl-der-simple-power-005",
      "topic": "derivatives",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\frac{d}{dx}\\left(3x^{8}\\right)",
      "answerKind": "expression",
      "answer": "3*8*x^(8-1)",
      "timeLimit": 20,
      "tabLimit": 1,
      "solution": "次方律：3x^8 的導數是 3·8x^(8−1)。",
      "hints": [
        "次方拉下來當係數，指數減一。"
      ],
      "tags": [
        "power-rule",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-der-simple-power",
      "solutionSteps": [
        "次方律：x^n 的導數是 n·x^(n−1)。",
        "常數係數 3 直接留著。",
        "得 3·8x^(8−1)。"
      ],
      "variable": "x"
    },
    {
      "id": "tmpl-der-simple-power-006",
      "topic": "derivatives",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\frac{d}{dx}\\left(11x^{5}\\right)",
      "answerKind": "expression",
      "answer": "11*5*x^(5-1)",
      "timeLimit": 20,
      "tabLimit": 1,
      "solution": "次方律：11x^5 的導數是 11·5x^(5−1)。",
      "hints": [
        "次方拉下來當係數，指數減一。"
      ],
      "tags": [
        "power-rule",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-der-simple-power",
      "solutionSteps": [
        "次方律：x^n 的導數是 n·x^(n−1)。",
        "常數係數 11 直接留著。",
        "得 11·5x^(5−1)。"
      ],
      "variable": "x"
    },
    {
      "id": "tmpl-int-linear-001",
      "topic": "integrals",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\int_0^{3}\\left(2x\\right)dx",
      "answerKind": "numeric",
      "answer": "2*3^2/2",
      "timeLimit": 25,
      "tabLimit": 1,
      "solution": "反導數是 2x²/2，代入上限 3（下限 0 貢獻 0）得 2·3²/2。",
      "hints": [
        "先求反導數，再代上下限。",
        "下限是 0，所以只需要算上限。"
      ],
      "tags": [
        "ftc",
        "basic-integral",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-int-linear",
      "solutionSteps": [
        "先求反導數：2x²/2。",
        "代入上限 3。",
        "下限 0 代進去是 0。",
        "答案是 2·3²/2。"
      ]
    },
    {
      "id": "tmpl-int-linear-002",
      "topic": "integrals",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\int_0^{2}\\left(4x\\right)dx",
      "answerKind": "numeric",
      "answer": "4*2^2/2",
      "timeLimit": 25,
      "tabLimit": 1,
      "solution": "反導數是 4x²/2，代入上限 2（下限 0 貢獻 0）得 4·2²/2。",
      "hints": [
        "先求反導數，再代上下限。",
        "下限是 0，所以只需要算上限。"
      ],
      "tags": [
        "ftc",
        "basic-integral",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-int-linear",
      "solutionSteps": [
        "先求反導數：4x²/2。",
        "代入上限 2。",
        "下限 0 代進去是 0。",
        "答案是 4·2²/2。"
      ]
    },
    {
      "id": "tmpl-int-linear-003",
      "topic": "integrals",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\int_0^{5}\\left(6x\\right)dx",
      "answerKind": "numeric",
      "answer": "6*5^2/2",
      "timeLimit": 25,
      "tabLimit": 1,
      "solution": "反導數是 6x²/2，代入上限 5（下限 0 貢獻 0）得 6·5²/2。",
      "hints": [
        "先求反導數，再代上下限。",
        "下限是 0，所以只需要算上限。"
      ],
      "tags": [
        "ftc",
        "basic-integral",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-int-linear",
      "solutionSteps": [
        "先求反導數：6x²/2。",
        "代入上限 5。",
        "下限 0 代進去是 0。",
        "答案是 6·5²/2。"
      ]
    },
    {
      "id": "tmpl-int-linear-004",
      "topic": "integrals",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\int_0^{4}\\left(3x\\right)dx",
      "answerKind": "numeric",
      "answer": "3*4^2/2",
      "timeLimit": 25,
      "tabLimit": 1,
      "solution": "反導數是 3x²/2，代入上限 4（下限 0 貢獻 0）得 3·4²/2。",
      "hints": [
        "先求反導數，再代上下限。",
        "下限是 0，所以只需要算上限。"
      ],
      "tags": [
        "ftc",
        "basic-integral",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-int-linear",
      "solutionSteps": [
        "先求反導數：3x²/2。",
        "代入上限 4。",
        "下限 0 代進去是 0。",
        "答案是 3·4²/2。"
      ]
    },
    {
      "id": "tmpl-int-linear-005",
      "topic": "integrals",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\int_0^{3}\\left(8x\\right)dx",
      "answerKind": "numeric",
      "answer": "8*3^2/2",
      "timeLimit": 25,
      "tabLimit": 1,
      "solution": "反導數是 8x²/2，代入上限 3（下限 0 貢獻 0）得 8·3²/2。",
      "hints": [
        "先求反導數，再代上下限。",
        "下限是 0，所以只需要算上限。"
      ],
      "tags": [
        "ftc",
        "basic-integral",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-int-linear",
      "solutionSteps": [
        "先求反導數：8x²/2。",
        "代入上限 3。",
        "下限 0 代進去是 0。",
        "答案是 8·3²/2。"
      ]
    },
    {
      "id": "tmpl-int-linear-006",
      "topic": "integrals",
      "rank": 1,
      "difficulty": 1,
      "source": "Buzz 模板變體",
      "prompt": "\\int_0^{6}\\left(5x\\right)dx",
      "answerKind": "numeric",
      "answer": "5*6^2/2",
      "timeLimit": 25,
      "tabLimit": 1,
      "solution": "反導數是 5x²/2，代入上限 6（下限 0 貢獻 0）得 5·6²/2。",
      "hints": [
        "先求反導數，再代上下限。",
        "下限是 0，所以只需要算上限。"
      ],
      "tags": [
        "ftc",
        "basic-integral",
        "rank-1",
        "beginner-friendly"
      ],
      "variantOf": "tmpl-int-linear",
      "solutionSteps": [
        "先求反導數：5x²/2。",
        "代入上限 6。",
        "下限 0 代進去是 0。",
        "答案是 5·6²/2。"
      ]
    }
  ];

  window.BUZZ_GENERATED_PROBLEMS = problems;
  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems);
})();
