# BuzzCalculus GA4 Setup

日期：2026-06-05

## 目前狀態

前端 GA4 scaffold 已完成。

目前 `index.html` 內已設定：

```html
<script>
  window.BUZZ_GA_MEASUREMENT_ID = "G-95ST898KT1";
</script>
```

如果改回空字串，analytics 會變成 no-op，不會載入 Google script，也不會送任何資料。

## 啟用方式

更換 GA4 Measurement ID 時，改成：

```html
<script>
  window.BUZZ_GA_MEASUREMENT_ID = "G-XXXXXXXXXX";
</script>
```

## 已接事件

| 事件 | 觸發時機 |
|---|---|
| `start_session` | 開始一局 |
| `submit_answer` | 送出答案，包含手寫與選擇題 |
| `finish_session` | 一局結算 |
| `use_hint` | 查看提示 |
| `export_data` | 匯出 JSON |
| `import_data` | 匯入 JSON 成功 |
| `tab_switch` | 計分模式切分頁但尚未超限 |
| `tab_violation` | 計分模式切分頁超過該題限制 |

## 常見參數

- `app_version`
- `build_date`
- `mode`
- `topic`
- `pack`
- `answer_mode`
- `answer_kind`
- `problem_id`
- `correct`
- `reason`
- `elapsed`
- `hints_used`
- `tab_switches`
- `practice`

## 驗收方式

1. 填入 GA4 Measurement ID。
2. 開啟正式或本機頁面。
3. 在 GA4 DebugView 確認 `start_session`。
4. 作答一題，確認 `submit_answer`。
5. 完成一局，確認 `finish_session`。
6. 測試提示、匯出、匯入與切分頁事件。

確認以上事件後，P1-1 可標記完成。
