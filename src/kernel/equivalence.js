// 等價題側表 —— **由 tools/detect_duplicates.js --write-equivalence 產生，不要手改。**
//
// 「等價」的意思是：兩題只有記法差異（\ln vs \log、有沒有 \left\right、
// x^2/2 vs \frac{x^2}{2}…），編譯出來是同一題。
//
// 為什麼不直接刪掉一邊：兩邊通常分屬不同題包，一個是入門友善、
// 一個是考古題風格。刪任何一邊都會在那個題包上開一個洞。
// 真正的傷害是同一局或同一份考卷抽到兩題一樣的 —— 所以改成抽題時去重。
//
// 產生時：38 組語意重複，其中 2 組經人工複核判定為誤判（見產生器內的 NOT_EQUIVALENT）。

(function registerEquivalence() {
  "use strict";
  var MAP = {
    "burst-boss-int-006": "burst-boss-int-006",
    "burst-boss-int-007": "burst-boss-int-007",
    "burst-boss-int-008": "burst-boss-int-008",
    "burst-boss-lim-002": "burst-boss-lim-002",
    "burst-boss-lim-003": "burst-boss-lim-003",
    "burst-boss-lim-008": "burst-boss-lim-008",
    "burst-int-027": "burst-int-027",
    "cx-der-005": "cx-der-005",
    "cx-hi-001": "cx-hi-001",
    "cx-hm-002": "cx-hm-002",
    "cx-int-008": "cx-int-008",
    "cx-lim-005": "cx-lim-005",
    "cx-ser-002": "cx-ser-002",
    "cx-ser-005": "cx-ser-005",
    "cx-smid-011": "cx-smid-011",
    "cx-smid-012": "cx-smid-012",
    "cx-smid-013": "cx-smid-013",
    "dd-def-001": "cx-lim-005",
    "dd-inv-001": "dd-inv-001",
    "depth-der-001": "depth-der-001",
    "depth-int-020": "depth-int-020",
    "depth-lim-001": "depth-lim-001",
    "depth-lim-002": "depth-lim-002",
    "depth-ser-003": "depth-ser-003",
    "der-007": "dd-inv-001",
    "der-008": "cx-der-005",
    "der-014": "der-014",
    "der-015": "der-015",
    "der-020": "der-020",
    "exam-der-004": "der-014",
    "exam-der-006": "der-015",
    "exam-der-017": "der-020",
    "exam-int-002": "exam-int-002",
    "exam-int-004": "exam-int-004",
    "exam-int-021": "cx-int-008",
    "exam-lim-019": "exam-lim-019",
    "gap-ser-cond-001": "gap-ser-cond-001",
    "hc-rad-008": "burst-boss-int-006",
    "hd-010": "depth-der-001",
    "int-009": "exam-int-004",
    "int-013": "int-013",
    "int-014": "exam-int-002",
    "int-055": "int-013",
    "lim-012": "lim-012",
    "mob-conv-003": "gap-ser-cond-001",
    "mob-limtrap-004": "lim-012",
    "mob-limtrap-005": "mob-limtrap-005",
    "putnam-005": "cx-hm-002",
    "putnam-010": "putnam-010",
    "rel-basic-019": "rel-basic-019",
    "rel-boss-019": "exam-lim-019",
    "rel-hard-int-011": "burst-boss-int-007",
    "rel-hard-int-012": "burst-int-027",
    "rel-hard-lim-001": "depth-lim-001",
    "rel-hard-lim-003": "depth-lim-002",
    "rel-hard-ser-008": "depth-ser-003",
    "rel-hard-ser-011": "rel-hard-ser-011",
    "ser-001": "cx-ser-002",
    "ser-002": "cx-ser-005",
    "ser-010": "rel-hard-ser-011",
    "ser-016": "cx-smid-011",
    "ser-024": "cx-smid-013",
    "ser-037": "cx-smid-012",
    "tmpl-ser-geometric-001": "rel-basic-019",
    "uni-int-014": "cx-hi-001",
    "uni-lim-001": "burst-boss-lim-002",
    "uni-lim-002": "burst-boss-lim-003",
    "world-004": "dd-inv-001",
    "world-026": "mob-limtrap-005",
    "world-069": "depth-int-020",
    "world-071": "putnam-010",
    "world-091": "burst-boss-lim-008",
    "world-094": "burst-int-027",
    "world-098": "burst-boss-int-008",
  };
  window.BuzzEquivalence = {
    // 抽題去重用的鍵：等價題共用同一個鍵，其餘題目就是自己的 id
    keyOf: function (id) { return (id && MAP[id]) || id; },
    size: 74
  };
})();
