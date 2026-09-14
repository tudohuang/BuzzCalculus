// Pure sampling checks, separated from UI and storage. Finite sampling is not a formal proof.
(function () {
  "use strict";

  function inDomain(domain, vars) {
    if (!domain) return true;
    const value = vars[domain.variable];
    if (value === undefined) return true;
    switch (domain.operator) {
      case ">": return value > domain.value;
      case ">=": return value >= domain.value;
      case "<": return value < domain.value;
      case "<=": return value <= domain.value;
      case "!=": return value !== domain.value;
      default: return true;
    }
  }

  function create({ evaluateExpression, stripConstant, friendlyWrongHint }) {
    function checkExpression(expected, input, variable, domain) {
      const variables = Array.isArray(variable) ? variable : [variable];
      const samples = expressionSamples(variables).filter((vars) => inDomain(domain, vars));
      let valid = 0;
      for (const vars of samples) {
        const a = evaluateExpression(expected, vars);
        const b = evaluateExpression(input, vars);
        if (!Number.isFinite(a)) continue;
        if (!Number.isFinite(b)) return { correct: false, message: `答案在 ${formatVars(vars)} 沒有定義，或格式無法解析。` };
        valid += 1;
        const tolerance = Math.max(1e-6, Math.abs(a) * 1e-5);
        if (Math.abs(a - b) > tolerance) {
          return { correct: false, message: `在 ${formatVars(vars)} 代入時不相同。${friendlyWrongHint({ answerKind: "expression", variable: variables[0] }, input, expected)}` };
        }
      }
      return {
        correct: valid >= 3,
        message: valid >= 3 ? "多點代入等價。" : "格式讀不穩。請用 2*x、sin(x)、log(x) 這種寫法。"
      };
    }
  
    // 原本的取樣點全是正數（0.35 … 4.4）。那有一個很實際的漏洞：
    // sqrt(x²) 和 x 在正數上完全一樣，但它們不是同一個函數。
    // 只用正數取樣，這種答案一定判對。加入負值之後才有辦法分開。
    //
    // 同時把「好看的數字」換成無理數附近的值：0.5、1、2 這種點上，
    // 不同的函數剛好撞在一起的機率高得多（sin(π/6)=1/2 這類巧合）。
    const ANTIDERIVATIVE_SAMPLES = [0.3137, 0.7211, 1.2345, 1.9871, 3.3013, -0.6180, -1.3247, -2.1069];
  
    function expressionSamples(variables) {
      const base = ANTIDERIVATIVE_SAMPLES;
      if (variables.length === 1) return base.map((value) => ({ [variables[0]]: value }));
      // 每個座標獨立產生；不能把所有點都放在 y = x + 常數的直線上。
      let state = 20260914;
      return Array.from({ length: 24 }, () => {
        return variables.reduce((vars, name) => {
          state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
          vars[name] = base[(state >>> 16) % base.length] + (state / 4294967296 - 0.5) * 0.14;
          return vars;
        }, {});
      });
    }
  
    function formatVars(vars) {
      return Object.entries(vars)
        .map(([name, value]) => `${name}=${Math.round(value * 100) / 100}`)
        .join(", ");
    }
  
    function checkAntiderivative(expected, input, variable, domain) {
      const samples = ANTIDERIVATIVE_SAMPLES.filter((x) => inDomain(domain, { [variable]: x }));
      const values = [];
      const expression = stripConstant(input);
      for (const x of samples) {
        const vars = { [variable]: x };
        const a = evaluateExpression(expected, vars);
        const b = evaluateExpression(expression, vars);
        if (!Number.isFinite(a)) continue;
        if (!Number.isFinite(b)) return { correct: false, message: `答案在 ${formatVars(vars)} 沒有定義，或格式無法解析。` };
        values.push({ a, b });
      }
      if (values.length < 3) {
        return { correct: false, message: "答案無法穩定解析。請用 x、sin(x)、log(x) 這類寫法。" };
      }
      const first = values[0];
      // 比較函數的增量；容差由原函數的變化決定，不能被任意 +C 放大。
      for (const { a, b } of values.slice(1)) {
        const expectedChange = a - first.a;
        const tolerance = Math.max(1e-5, Math.abs(expectedChange) * 1e-5);
        const roundoff = 4 * Number.EPSILON * Math.max(Math.abs(b), Math.abs(first.b));
        if (roundoff > tolerance) return { correct: false, message: "積分常數太大，無法可靠比較。請省略常數或改寫成 +C 再送出。" };
        if (Math.abs((b - first.b) - expectedChange) > tolerance + roundoff) {
          return { correct: false, message: `微分後不相同。${friendlyWrongHint({ answerKind: "antiderivative", variable }, input, expected)}` };
        }
      }
      return {
        correct: true,
        message: "原函數相差常數，判定正確。"
      };
    }
    return { checkExpression, checkAntiderivative };
  }

  window.BuzzAnswerSampling = { create };
})();
