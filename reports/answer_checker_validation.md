# Answer Checker Validation

日期：2026-06-05

## 結論

P0-2 答案檢查器驗證已通過。

測試命令：

```powershell
node tools\validate_answer_checker.js
```

結果：

- 15 個測試案例全部通過
- 不定積分等價判定通過
- 導數 / 式子等價判定通過
- 文字題大小寫正規化通過
- 數值答案符號與小數判定通過
- 負向案例可正確判錯

## 覆蓋案例

### 不定積分

題目設定：

- 參考答案：`tan(x)`

通過案例：

- `tan(x)`
- `tan(x)+5`
- `sin(x)/cos(x)`

負向案例：

- `sin(x)` 判錯

### 導數 / 式子

題目設定：

- 參考答案：`2*x`

通過案例：

- `2x`
- `x+x`

新增隱式乘法支援：

- `2x`
- `2(x+1)`
- `2sin(x)`
- `(x+1)(x-1)` 類型

負向案例：

- `x*x` 判錯

### 文字題

題目設定：

- 參考答案：`convergent`

通過案例：

- `convergent`
- `Convergent`
- `CONVERGENT`

負向案例：

- `divergent` 判錯

### 數值題

題目設定：

- 參考答案：`pi/4`

通過案例：

- `pi/4`
- `0.7853981633974483`

負向案例：

- `1` 判錯

## 相關變更

- 新增 `tools/validate_answer_checker.js`
- `src/app.js` 新增測試 hook：`window.__BUZZ_TEST_HOOKS__`
- `src/app.js` 新增隱式乘法解析：`applyImplicitMultiplication`
- `tools/smoke_app_render.js` 改用 ASCII 字串檢查，避免中文編碼誤判
