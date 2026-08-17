// 黑板草稿的長期保存（IndexedDB）
//
// 為什麼不放 localStorage：草稿是筆畫座標陣列，一題可以到幾十 KB。
// 續傳用的 serializeQuiz 早就明講「不值得為它撐爆 localStorage 額度」而直接丟掉。
// 但草稿真正有價值的時刻不是續傳，是**重做錯題的時候**：
// 「我上次到底是哪一步算錯的」——那個答案就在上次的草稿裡。
//
// IndexedDB 的容量是幾十 MB 起跳，剛好裝得下這種東西，
// 而且它是非同步的，不會像 localStorage 那樣在主執行緒上卡住。
//
// 這支不是 kernel：它有 I/O，而 kernel 必須是純函數（架構鐵律 2）。
//
// 降級策略：無痕模式、舊瀏覽器、使用者關掉儲存權限時，IndexedDB 會直接失敗。
// 那種情況下所有操作都靜默地變成 no-op，功能消失但程式不會壞 ——
// 草稿保存是加分項，不該讓任何人因為它而無法作答。

(function () {
  "use strict";

  const DB_NAME = "buzzcalculus";
  const DB_VERSION = 1;
  const STORE = "boards";
  // 上限的意義是「不要無限長大」，不是省空間。300 題的草稿約幾 MB，
  // 遠低於 IndexedDB 的額度，但足以讓「最近錯的題」都留得住。
  const MAX_ENTRIES = 300;

  let dbPromise = null;
  let unavailable = false;

  function openDb() {
    if (unavailable) return Promise.resolve(null);
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve) => {
      let request;
      try {
        request = indexedDB.open(DB_NAME, DB_VERSION);
      } catch (_error) {
        unavailable = true;
        resolve(null);
        return;
      }
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE)) {
          const store = db.createObjectStore(STORE, { keyPath: "id" });
          // 依時間清理舊資料要靠這個索引，不然只能全表掃描
          store.createIndex("savedAt", "savedAt");
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => { unavailable = true; resolve(null); };
      request.onblocked = () => { unavailable = true; resolve(null); };
    });
    return dbPromise;
  }

  function withStore(mode, work) {
    return openDb().then((db) => {
      if (!db) return null;
      return new Promise((resolve) => {
        let transaction;
        try {
          transaction = db.transaction(STORE, mode);
        } catch (_error) {
          resolve(null);
          return;
        }
        const store = transaction.objectStore(STORE);
        let result = null;
        try {
          result = work(store, (value) => { result = value; });
        } catch (_error) {
          resolve(null);
          return;
        }
        transaction.oncomplete = () => resolve(result);
        transaction.onerror = () => resolve(null);
        transaction.onabort = () => resolve(null);
      });
    }).catch(() => null);
  }

  function saveBoard(problemId, strokes, meta) {
    if (!problemId || !Array.isArray(strokes) || !strokes.length) return Promise.resolve(false);
    const entry = {
      id: String(problemId),
      strokes,
      savedAt: Date.now(),
      correct: Boolean(meta && meta.correct),
      // 存下當時寫的答案，因為「上次我寫了什麼」跟「上次我怎麼算的」
      // 要放在一起看才有意義
      answer: meta && meta.answer ? String(meta.answer).slice(0, 120) : ""
    };
    return withStore("readwrite", (store) => {
      store.put(entry);
      return true;
    }).then((ok) => {
      if (ok) prune();
      return Boolean(ok);
    });
  }

  function loadBoard(problemId) {
    if (!problemId) return Promise.resolve(null);
    return withStore("readonly", (store, done) => {
      const request = store.get(String(problemId));
      request.onsuccess = () => done(request.result || null);
      return null;
    });
  }

  function deleteBoard(problemId) {
    return withStore("readwrite", (store) => {
      store.delete(String(problemId));
      return true;
    });
  }

  function clearBoards() {
    return withStore("readwrite", (store) => {
      store.clear();
      return true;
    });
  }

  // 超過上限就從最舊的開始刪。用游標依 savedAt 由舊往新走，
  // 刪到剩下 MAX_ENTRIES 為止。
  function prune() {
    return withStore("readwrite", (store) => {
      const countRequest = store.count();
      countRequest.onsuccess = () => {
        let excess = countRequest.result - MAX_ENTRIES;
        if (excess <= 0) return;
        const cursorRequest = store.index("savedAt").openCursor();
        cursorRequest.onsuccess = () => {
          const cursor = cursorRequest.result;
          if (!cursor || excess <= 0) return;
          cursor.delete();
          excess -= 1;
          cursor.continue();
        };
      };
      return true;
    });
  }

  function countBoards() {
    return withStore("readonly", (store, done) => {
      const request = store.count();
      request.onsuccess = () => done(request.result || 0);
      return 0;
    });
  }

  window.BuzzBoardStore = {
    version: 1,
    saveBoard,
    loadBoard,
    deleteBoard,
    clearBoards,
    countBoards,
    isAvailable: () => !unavailable && typeof indexedDB !== "undefined"
  };
})();
