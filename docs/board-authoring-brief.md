# 寫黑板：給內容 agent 的工作說明

你要做的：照 `docs/board-candidates.md` 分到的課，把建議的那幾節加上黑板（`beat.board`），
做到「念到哪個詞、板上就亮哪裡；在任何手機上都不疊、不出板」。
先讀兩份：`docs/board-style.md`（長什麼樣子、顏色的意思、不要做的事）與 `tools/content/course_v2/SCHEMA.md` 的「黑板」一節（格式）。
示範：`tools/content/course_v2/lessons/chain-rule.json`（推導、公式、證明節都有）、`ftc-part1.json`（變形、圖、證明節的「為什麼」）、
`dominated-convergence.json`（分析學、兩張圖）。

## 一節怎麼寫

1. 先讀那一節每一句的 `show`、`say`、`note`、`why`，與結尾的小測／預測（板上不能先寫出答案）。
2. 決定這一節的板上要長成什麼樣子：哪幾行式子、在哪一句寫上、哪一句變形、什麼時候擦。**一句一個重點。**
   板上同時最多 4 行（圖算 2 行）；一行最多 32 個看得到的字。
3. 角色上色：這一節有「兩個主角」（裡層／外層、上限／被積函數、$A$／$f$…）就用 `tint` 給它們 blue／violet，整節不換。
4. 每一個動作錨在 `say` 裡**念到的那個詞**：`"on": "外層"`。錨點選「說到那個東西的名字」的那一刻（不是句尾）。
   - 同一段字在 say 裡出現兩次以上：`"外層#2"`。驗證器會告訴你。
   - 一句的第一個動作可以不寫 `on`（從這一句一開始）。
   - 有 `why`（證明節「為什麼」）的句子：問著的時候畫的動作錨在 `why.say`；答案的動作標 `"why": true`、放在最後、錨在 `say`。
   - 錨點之間至少隔兩三個字；不要錨在 say 的最後兩三個字（動作還沒畫完下一句就開始了）。
5. 記號：只標一兩個真正要看的地方。`circle`／`box` 只給四周有空的項（整個因子、整個分數、答案）；
   上標、括號旁邊的一個字母 → `focus`（只變色）或 `underline`。標籤 ≤ 8 個字、純文字，可以不要。
6. 數字規則照舊：板上的字、標籤、圖裡的數字都要在課文裡出現過。**不要改 `show`、`say` 的意思與數字**；
   真的要改 say（例如沒有可以錨的詞）就改，但在回報裡寫出來（那一句要重錄）。

## 流程（每一課）

```sh
node tools/validate_course_v2.js <id>          # 格式、錨點、數字規則、KaTeX；錯誤要是 0
node tools/build_course_v2.js                  # 畫面讀的是產生出來的 src/course_v2/
node tools/lint_board_layout.js <id> --shots <你的暫存資料夾>/shots   # 真的 Chrome：4 種寬度 × 淺／深，每一步量一次
```

- **lint 一次只能跑一顆 Chrome**：工具自己拿機器層級的鎖（系統暫存資料夾裡的 `buzzcalculus-chrome-lint.lock`），
  別人在跑就會印「等別的 Chrome 跑完」然後等。不要開好幾個 lint 平行跑、不要刪別人的鎖（拿著的程序不在了，鎖會自己被收回）。
  一課約 40 秒（三節）。被 OOM 殺掉了不要一直重跑：回報。
- `--shots` 每一句畫完的板截一張（390 與 1280、淺與深）。**一張一張看**，對照下面的清單。lint 綠了不代表好看。
- 一課改兩三輪是正常的。lint 說「記號壓到」：換成 `focus`／`underline`，或把那個項跟旁邊拆開一點（例如整個因子一起圈）。
  「標籤壓到」：標籤改短或拿掉，或換一個記號。「跑出黑板」「字 < 16px」：那一行太長，拆成兩行（第二行用 `=` 開頭會自動對齊）。
  「黑板太高」：早一點 `clear` 或 `keep`。
- 旁白：**不用**自己重錄。合併之後 lead 跑 `node tools/build_narration.js`（有黑板的句子會用 Azure SDK 重錄、記下每個詞的時間點），
  在那之前畫面照字數比例估錨點的時間，預覽夠用。

## 看截圖的清單

- [ ] 沒有東西疊在一起、沒有東西被切掉（lint 管）；記號離旁邊的字有一點空，不是貼著。
- [ ] 每一句畫完，板上「現在講的東西」一眼看得出來（只有一兩個記號）；上一句的記號已經收掉。
- [ ] 顏色：同一個角色整節同一個顏色；gold＝現在講的、green＝結果、red＝錯／警告；沒有只為了好看的顏色。
- [ ] 相鄰的推導行 `=` 對齊；一行太長有換行而不是縮成很小。
- [ ] 問「為什麼」的時候，板上沒有答案；小測／預測的答案沒有出現在板上。
- [ ] 深色板與淺色板都看過。

## 完成的定義（每一課）

1. 建議的節都畫了（或寫了為什麼不畫：例如那一節其實是純文字、有 widget 在動、式子太長拆不開）。
2. `node tools/validate_course_v2.js <id>` 錯誤 0。
3. `node tools/lint_board_layout.js <id>` 綠（四種寬度 × 兩種主題）。
4. 截圖照清單看過。
5. 回報：課、畫了哪幾節、幾句、跳過的節與原因、有沒有改 say（哪幾句）。

## 合併之後（lead）

1. `node tools/build_narration.js`：有黑板的句子用 SDK 重錄（`cd tools && npm install` 一次；金鑰讀 `AZURE_SPEECH_KEY`／`azure*.txt`，不印）。
   印出「換了的檔」與「在新檔上傳之前照舊用已上傳的那一支（prev）」—— 這時候部署照舊用舊的錄音，網站不會指到不存在的檔。
2. `node tools/make_media_manifest.js --narration <新 tag> --add --plan` → 照印出來的 `gh release create …` 上傳 `tmp/release-<tag>/*.mp3`。
3. 上傳完：`node tools/make_media_manifest.js --narration <新 tag> --add`（改清單）→ `node tools/regen_all.js`（課文換成新的錄音與錨點）→ commit、push。
4. `node tools/lint_board_layout.js`（全部有黑板的課）、`node tools/e2e_course_board.js`。
