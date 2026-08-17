# 03 — 能力模型：Skill Profile / 壓力 / 速度 / 信心

這一章是整個大修的核心價值。所有公式都要能在 `src/kernel/ability.js` 以純函數實作，
輸入 `(records, problems, now)`，輸出資料，**不儲存任何新東西**。

> **實作現況（2026-08-15，已上線）**
>
> `src/kernel/ability.js` + `tools/validate_ability_model.js`（已進 CI，43 項斷言）。
> 5082 筆作答的 `profile()` 約 **25ms**（目標 50ms）。
> 既有 8 軸雷達已改走這個引擎（`src/app.js` 的 `masteryRadarData()` 用 feature-detect，
> kernel 缺席時退回 `legacyMasteryRadarData()`）。
>
> 與本章原設計的四處差異：
>
> 1. **限時 / 不限時的分流以程式碼為準，不是 3.4 那張表。** 實測 `MODES` 後發現只有
>    `practice`、`cooldown`（`practice: true`）與 `accuracy`（`noTimer: true`）真的沒有計時器；
>    **`mistakes` 與 `warmup` 其實是有計時的**。原表把它們列為 Untimed 是錯的。
>    副作用：UA 的樣本只來自練習模式，所以「壓力垮」的診斷需要使用者真的用過練習模式。
> 2. **PA / UA 的門檻用原始題數（`n >= 8`）而非加權量。** 這個數字要能直接講給使用者聽
>    （「你在這個技巧只做了 5 題」），加權量講不出口。
> 3. **PA / UA 不套 Beta 先驗。** 這兩個數字是拿來「互相比較」的，兩邊都被先驗拉向 0.45
>    會把 gap 壓平，反而測不出壓力差距。精熟度仍然套先驗。
> 4. **多了 `stale` 欄位。** 「從沒測過」和「練過但太久沒碰、資料已衰減到不算數」
>    是兩件事。對一個練了幾百題的人顯示「未測」看起來像資料不見了 ——
>    UI 要能講「太久沒練，先重測」。
>
> **信心校準已接上（2026-08-16）**：答題回饋面板出現「猜的 / 不太確定 / 確定」三顆按鈕，
> 寫入 `records.conf`，數據頁的「信心校準」面板讀它算出「自信但常錯」與「會做但沒信心」。
> 只在日常模式出現，**大考與宿敵模式不問** —— 那兩個模式的節奏不能被打斷。
> 沒有自評資料時面板明白說「還沒問到夠多」，而不是顯示 0。

## 3.1 現況與缺口

現在有 `masteryRadarData()`：8 軸、tag 對應、30 天指數半衰、閒置每天 ×0.97、借助解答算半分。
這個設計方向是對的，問題在於：

| 缺口 | 後果 |
| --- | --- |
| 只有 8 軸，tag 有 372 個 | 「多變數」一軸把 19 種 tag 混在一起，看不出是 Jacobian 爛還是 Green 定理爛 |
| 沒有信賴度 | 答 1 題全對 = 100 分，跟答 40 題全對長一樣 |
| 沒有難度權重 | R1 答對和 R5 答對同分 |
| 限時與不限時混算 | 看不出「不會」還是「壓力下垮」 |
| 沒有速度維度 | 看不出「會但慢」 |
| 沒有前置關係 | 不知道該先修哪一個 |

## 3.2 Skill Graph

> **實作現況（2026-08-15，已上線）**
>
> `src/kernel/skill_graph.js` — **77 個節點 / 7 個 family / 題目覆蓋 1407-1407（100%）**，
> 每節點至少 8 題、中位 19 題。`tools/validate_skill_graph.js` 已進 CI。
>
> 建置過程中與原設計的三處差異，都是被實際資料逼出來的：
>
> 1. **多了 `NON_SKILL_TAGS` 這個概念。** 361 個 tag 裡有一大塊根本不是技巧，
>    而是題包來源（`todai-burst` 226）、考試類型（`exam-style` 446）、難度標記
>    （`rank-N`）、以及太籠統的函數型態（`log` 103、`trig` 54）。這些必須**明列**
>    而不是靠猜，驗證器才分得出「還沒對應的技巧」與「本來就不該對應的標記」。
> 2. **skill 可以加 `topics` 限制。** `taylor` 同時出現在極限題與級數題，
>    `hyperbolic` 橫跨極限與積分，`power` 在微積分是次方、在物理是功率。
>    沒有 topics 分流，極限題會被算成級數技巧、物理題會污染微積分雷達。
> 3. **`radarAxis` 是選填，不是必填。** 原本要求「每個 skill 都要落在某個 radarAxis」，
>    但既有 8 軸本來就沒涵蓋極限與微分家族，硬塞會把技巧掛到錯的軸上。
>    改成驗證「既有雷達用到的每個 tag 都仍被某個 skill 認領」——
>    這才是真正要守的不變式（雷達的輸入不能消失）。
>
> **補標表**：`src/kernel/skill_tags.js`（266 筆，由 `tools/backfill_skill_tags.js` 產生）。
> 早期題目（`problems.js` 與高速反射包）寫在 tag 系統之前，身上只有 `rank-N`，
> 造成 17% 的題庫對不到任何技巧。補標**刻意不寫進 `problem.tags`** ——
> tags 會餵給題包抽題、主線關卡與既有雷達，動它是行為變更而非補資料。
> 實測：補標前後題庫的 rank / topic / answer / tags **零變動**。

`src/kernel/skill_graph.js` — 純資料 + 查詢 API。

### 節點命名

三段式 `domain.family.skill`，可前綴比對：

```text
limit.standard            limit.taylor            limit.rationalize
limit.squeeze             limit.multivariable.path
diff.chain                diff.product            diff.implicit
diff.log                  diff.parametric
diff.partial              diff.directional        diff.jacobian
diff.hessian              diff.lagrange           diff.wronskian
integral.usub             integral.ibp            integral.ibp.cyclic
integral.trigsub          integral.partialfrac
integral.improper         integral.improper.endpoint
integral.frullani         integral.kings          integral.parameter
integral.beta             integral.gamma          integral.wallis
integral.double           integral.triple         integral.changevars
integral.polar            integral.line           integral.surface
series.geometric          series.pseries          series.ratio
series.root               series.integral         series.alternating
series.comparison         series.power.radius     series.power.endpoint
series.taylor.coeff
vector.green              vector.stokes           vector.divergence
vector.conservative       vector.flux
adv.complex.residue       adv.ode                 adv.bessel
```

目標規模 **80–120 個節點**（不是 372）。372 個 tag 之中，大半是 pack 標記
（`rank-4`、`boss-rank`、`technique-sprint`）與同義詞（`ibp` / `integration-by-parts` / `multi-ibp`）。

### 資料結構

```js
{
  id: "integral.frullani",
  label: "Frullani 積分",
  labelEn: "Frullani integral",
  family: "integral",
  tier: 4,                                  // 1 入門 … 5 進階，用於排序與預期難度
  prereq: ["integral.improper", "limit.standard"],
  tags: ["frullani"],                       // 對應舊 tag，可多對一
  radarAxis: "improper"                     // 對應現有 8 軸雷達，維持相容
}
```

### tag → skill 映射

`tagToSkills(tag) -> string[]`。映射表由 `tools/build_skill_map.js` 產生初稿
（掃全部 372 個 tag，依現有 `RADAR_AXES` 與 `TAG_LABELS` 分群），再人工收斂。

**CI 守門**（`tools/validate_skill_graph.js`）：

1. 每個 skill 至少對應 8 題，否則統計無意義 → 報錯要求併入上層或補題。
2. 每題至少對應 1 個 skill（容許 2% 例外，目前為 0%）。
3. prereq 圖無環，且 prereq 的 `tier` 必須嚴格小於自己。
4. 既有 8 軸雷達用到的每個 tag 都必須仍被某個 skill 認領（雷達的輸入不能消失）。
5. 每個技巧 tag 都要嘛歸進某個 skill、要嘛明列進 `NON_SKILL_TAGS` —— 不允許靜默漏掉。
6. skill 不得宣告題庫裡不存在的 tag（擋打錯字）。
7. 同一個 tag 被多個 skill 認領時，必須靠 `topics` 分流，否則一題會重複計入兩個技巧。

## 3.3 精熟度 Mastery

對每個 skill `s`，取該 skill 的所有作答（來自 `attemptLog`，見 [02.5](02-data-model.md#25-history_limit-是能力模型的天花板)）。

### 單次作答的權重與得分

```text
Δt      = (now - t) / 1 day
w_time  = exp(-Δt / 30)                    # 30 天時間常數（沿用現況）
w_rank  = 0.6 + 0.2 * rank                 # R1=0.8 … R6=1.8
w       = w_time * w_rank

score   = 0                                if 答錯
        = 0.5 * w                          if 答對但 assisted（看過完整解答）
        = (1 - 0.15 * hintsUsed) * w       if 答對且用過提示（下限 0.55w）
        = w                                if 乾淨答對
```

### 帶先驗的精熟度

```text
W  = Σ w            (該 skill 的加權作答量)
S  = Σ score
α  = 6              (先驗強度，等價於 6 次作答的疑慮)
p0 = 0.45           (先驗正確率 — 未知技巧預設偏低)

acc = (S + α * p0) / (W + α)
```

α = 6 的意思：**答 3 題全對只會給到 ~72 分，不會給 100**。要拿 90 分需要
約 25 次加權作答且幾乎全對。這解決「一題就滿分」的假象。

### 衰退

高精熟衰退慢，低精熟衰退快（真實學習曲線）：

```text
idle      = (now - lastAt) / 1 day
halfLife  = 10 + 0.25 * (100 * acc)        # acc=0.5 → 22.5 天；acc=0.95 → 33.75 天
decay     = 0.5 ^ (idle / halfLife)
M         = round(100 * acc * decay)
```

同時輸出 `confidence`（不是使用者信心，是統計信賴度）：

```text
conf = min(1, W / 12)      # W < 12 時 UI 必須標示「樣本不足」
```

**UI 規則**：`conf < 0.4` 的 skill 一律顯示「未測」而非分數。寧可留白也不要給錯的能力數字。

### 掌握門檻與狀態

| M | 狀態 | UI 文案 | 行為 |
| --- | --- | --- | --- |
| < 40 | `weak` | 還沒建立 | 進弱點清單，優先排 |
| 40–64 | `shaky` | 會但不穩 | 進日常訓練配方 |
| 65–84 | `solid` | 穩了 | 只在 SRS 到期時回鍋 |
| ≥ 85 | `reflex` | 反射 | 進入維持排程（間隔拉到 21–30 天） |

## 3.4 Pressure Accuracy vs Untimed Accuracy

這是 A 區第 12–15 條，也是最能拉開與其他刷題站差距的功能。

### 分流定義

一次作答屬於 **Timed** 若 `flags & 4`（session 有計時且非 practice 模式）。
現行模式對應：

| Timed（壓力） | Untimed（無壓） |
| --- | --- |
| quick, topic, daily, brutal, boss, boss_rush, rival, exam, 各 named exam, weekly, daily_one, integral_bee, accuracy, survival | practice, mistakes（錯題複習）, warmup, cooldown, path lesson |

`practice: true` 的 quiz 一律算 Untimed（現有 `currentQuiz.practice` 已經在記）。

### 三個數字

```text
PA(s) = 加權正確率, 只取 Timed 作答      (Pressure Accuracy)
UA(s) = 加權正確率, 只取 Untimed 作答    (Untimed Accuracy)
gap(s) = UA - PA
```

兩者都需 `W >= 8` 才顯示，否則顯示「資料不足，去打一局練習模式」。

### 診斷輸出（這才是產品，不是數字本身）

| 條件 | 判定 | 文案 | 推薦動作 |
| --- | --- | --- | --- |
| `gap >= 0.15` 且 `UA >= 0.7` | 壓力垮 | 「你會做，是壓力下垮掉」 | 同技巧限時重練，計時器設在你自己的中位數 ×1.2 |
| `PA ≈ UA` 且兩者 `< 0.5` | 真的不會 | 「這個技巧還沒建立」 | 先看關鍵一句 + 慢練 5 題不限時 |
| `gap <= -0.1` | 反常 | — | 通常是 Untimed 樣本太少，不顯示 |
| `PA >= 0.8` 且 `UA >= 0.8` | 反射 | 「這題型你已經反射」 | 提高難度或拉長 SRS 間隔 |

## 3.5 Speed × Accuracy 二維圖

### 速度正規化

每題有 `timeLimit`。定義：

```text
r = elapsed / timeLimit            # 相對耗時
```

用 `timeLimit` 而不是絕對秒數，因為題目本身的預期時間差很多（20s 到 300s）。
若題目沒有 `timeLimit`（不應發生，實測 1407 題全有），退回同 rank 中位數。

skill 的速度指標取**中位數**（非平均，避免掛機拉爆）：

```text
speed(s) = median(r)  over 該 skill 的 Timed 且已作答的紀錄
```

### 四象限

X 軸 = `speed`（越小越快，畫圖時反轉），Y 軸 = `PA`。

```text
PA
1.0 ┤  ①反射區            ②會但慢
    │  快 & 準            慢 & 準
0.7 ┼─────────────────┼──────────────
    │  ③衝太快           ④還沒建立
    │  快 & 錯            慢 & 錯
0.0 ┴─────────────────┴──────────────
     r<0.6            r>=0.6
```

| 象限 | 診斷 | 推薦 |
| --- | --- | --- |
| ① 反射區 | 已達目標 | 拉高難度 / 進 Boss |
| ② 會但慢 | 方法對、不熟 | 同技巧限時訓練，時限逐次收緊 |
| ③ 衝太快 | 讀題或代數不穩 | 練習模式 + 強制標註錯因 |
| ④ 還沒建立 | 缺技巧 | 看關鍵一句 + 三層提示 + 慢練 |

### 「不會」還是「來不及」

用 `unanswered` flag 直接分流，這是現有資料就有的：

```text
timeoutRate(s) = unanswered 數 / Timed 作答數
wrongRate(s)   = 有作答但錯 / Timed 作答數
```

- `timeoutRate > 0.3` → **來不及**：速度問題，練熟不練新。
- `wrongRate > timeoutRate * 2` → **不會**：知識問題，先補技巧。

首頁弱點卡的文案直接用這個結論，不要顯示比率。

## 3.6 信心校準（Confidence Calibration）

### 收集

每題結算後（feedback 畫面）出現三顆極輕量按鈕：

```text
[ 猜的 ]  [ 不太確定 ]  [ 確定 ]
```

- **可跳過**，跳過不影響任何流程與計分。
- 只在 practice / mistakes / daily 模式出現，**exam 與 rival 不出現**（不干擾節奏）。
- 寫入 `records.conf[problemId]`，並帶進 `attemptLog` flags 的擴充位。

### 指標

映射 `猜的 = 0.25、不太確定 = 0.6、確定 = 0.9`（三選項對應的主觀機率）。

```text
Brier(s) = mean( (p_i - o_i)^2 )        # o_i = 1 答對 / 0 答錯
bias(s)  = mean(p_i) - mean(o_i)        # > 0 過度自信
```

### 產品輸出

| 條件 | 標籤 | 為什麼危險 |
| --- | --- | --- |
| `bias > 0.2` 且 n >= 10 | **危險技巧：自信但常錯** | 考場上不會回頭檢查，直接失分 |
| `bias < -0.2` 且 `PA > 0.7` | **被低估的技巧：會做但沒信心** | 浪費時間反覆驗算，拖垮整份考卷 |

「自信但常錯」的 skill 在弱點清單置頂，且文案要直接：
「你在 Frullani 上有 8 次標『確定』但錯了 5 次 — 這是考卷上最貴的錯。」

## 3.7 錯因（Error Cause）

現況 `ERROR_TAGS = ["粗心", "不會", "忘公式"]` 已存在，且 `answers[].errorTag` 有記。
擴充成結構化錯因，維持三顆按鈕的輕量互動：

| key | 標籤 | 自動推薦條件 |
| --- | --- | --- |
| `algebra-slip` | 算錯，不是不會 | 有草稿筆畫 且 elapsed 正常 且 該 skill PA > 0.7 |
| `wrong-technique` | 選錯方法 | 該 skill M < 50 |
| `forgot-formula` | 忘公式 | 該題被提示 level 2 後就會了 |
| `misread` | 看錯題目 | elapsed < 0.25 * timeLimit 且答錯 |
| `timeout` | 來不及 | `unanswered`（自動填，不問使用者） |

**自動推薦**：預先選中最可能的一項，使用者一鍵確認或改選。降低標註成本是這個功能能不能活的關鍵。

> **實作現況（2026-08-16）**：推薦**不只是視覺預選，而是直接寫進 `answer.errorTag` 並標記 `causeAuto`**。
> 只預選不寫入的話，沒有主動點的人完全不會產生資料，這個功能等於不存在。
> 使用者改選時 `causeAuto` 被清掉；數據頁的錯因分佈會誠實標明「其中 N/M 筆是系統推測的」——
> 不標的話那張圖看起來像使用者親自標的，那是在騙人。
>
> 三條推薦規則各自有一句可以講給使用者聽的理由：
> 讀太快（低於 25% 時限）→ 看錯題目或選錯方法；看到第二層提示才會 → 忘公式；
> 有動筆 + 時間花夠 + 該技巧精熟度 >= 65 → 算錯。逾時不問，系統直接判定為「來不及」。

輸出：
- 「我其實是算錯，不是不會」統計：`algebra-slip / 全部錯題` 的比例與趨勢。
- 錯因趨勢圖：近 30 天各錯因的週佔比堆疊圖。
- 若 `algebra-slip` 佔比 > 40%，首頁推薦「代數穩定度訓練」（低 rank、高計算量的題包），
  而不是推薦更難的題。

## 3.8 同難度百分位

沒有後端之前**不能**做真正的跨使用者百分位。分兩階段：

**階段 1（本機，誠實命名）**：對照組 = 自己的過去。
文案必須是「**你比自己三週前快 28%**」，不得暗示是跟別人比。
計算：同 skill、同 rank 的 `median(r)` 於 `[now-7d, now]` vs `[now-28d, now-21d]`。

**階段 2（有後端後）**：上傳去識別化的 `(problemUid, rank, correct, sec, userMasteryBand)`，
伺服器算 p50/p90。UI 顯示「R4 題你在同程度使用者中排前 32%」。
必須 opt-in，且不得顯示他人可辨識資訊。

## 3.9 成長曲線

`abilityAt(records, t)` — 把 `now` 當參數的直接後果就是**能力模型可以回放**。

```js
const timeline = [0, 7, 14, 21, 28].map(d =>
  BuzzAbility.profile(records, { now: now - d * DAY }).overall
);
```

首頁顯示「兩週前 57% → 今天 78%」用的就是這個。因為是純函數回放，
**不需要每天寫入快照**，也不會因為使用者中斷使用就斷線。

代價：每次回放要重掃 `attemptLog`。以 5000 筆計，單次約 3–5ms，5 個時間點 < 25ms，可接受。
超過時用 `cache.abilityHash` 記憶化。

## 3.10 `BuzzAbility` API

```js
window.BuzzAbility = {
  profile(records, opts?) -> {
    now, overall: { M, PA, UA, gap, speed, n },
    skills: { [skillId]: {
      M, state, conf, W, n,
      PA, UA, gap, timedN, untimedN,
      speed, timeoutRate, wrongRate, quadrant,
      brier, bias, confN,
      lastAt, halfLife, dueAt
    }},
    axes: [ …8 軸雷達，向下相容 masteryRadarData 的輸出形狀… ],
    weakest: [skillId…],      // 排序後的弱點，已套用 conf 門檻
    dangerous: [skillId…],    // 自信但常錯
    underrated: [skillId…],   // 會做但沒信心
    trend: { d7: Δ, d30: Δ, fastestUp: skillId, fastestDown: skillId }
  },

  skill(records, skillId, opts?) -> 單一 skill 的完整資料（含最近 20 次作答）
  decayForecast(records, days) -> [{ skillId, M_now, M_future }]   // 「再不練就會掉到 …」
}
```

`axes` 欄位刻意做成與現行 `masteryRadarData()` 相同形狀，**現有雷達 UI 一行不用改就能接上新引擎**。
這是鐵律 3 的具體應用。

## 3.11 驗證

`tools/validate_ability_model.js`（進 CI）：

1. 合成 fixture：全對 / 全錯 / 一題全對 / 高壓垮掉 / 快而錯 …各造一份 records。
2. 斷言：一題全對 M ≤ 75；40 題全對 M ≥ 88；壓力垮的 fixture `gap > 0.15`；
   全錯的 skill 不得出現在 `dangerous`。
3. 單調性：多加一次答對，M 不得下降；多加一次答錯，M 不得上升。
4. 時間單調性：不作答時，M 隨 now 前進單調不增。
5. 效能：5000 筆 `attemptLog` 的 `profile()` < 50ms。
