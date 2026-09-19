// BuzzCalculus 的型別宣告：零 build 架構下的 TypeScript。
//
// 程式碼還是 .js（GitHub Pages 直接部署原始檔，沒有編譯步驟）；型別靠這份 .d.ts
// 加上各檔案裡的 JSDoc，CI 用 `tsc --noEmit` 檢查（tools/typecheck 見 workflow）。
// 目的是抓「打錯的欄位名」「記錄結構改了沒跟上」這類錯，不是把 DOM 型別做到極致——
// 所以下面有兩個故意的寬鬆：
//   1. querySelector 回傳的元素一律當成「什麼都有」的 HTML 元素（value、dataset、
//      focus、getContext…），因為 app.js 一萬多行都是 querySelector 之後直接用。
//   2. 跨檔案的 window.Buzz* 模組 API 先宣告成 any（各 kernel 檔逐步補 JSDoc 後再收緊）。

/* ── 資料形狀 ─────────────────────────────────────────────────────── */

interface BuzzProblem {
  id: string;
  topic: string;
  difficulty: number;
  prompt: string;
  answerKind: string;
  answer?: string;
  answers?: string[];
  canonical?: string;
  variable?: string;
  timeLimit: number;
  tabLimit: number;
  solution?: string;
  source?: string;
  school?: string;
  tags?: string[];
  rankTags?: string[];
  rankLabel?: string;
  choices?: unknown[];
  hints?: string[];
  keyIdea?: string;
  [key: string]: unknown;
}

interface BuzzSettings {
  difficultyCap?: number;
  penColor?: string;
  penNib?: string;
  highlightColor?: string;
  boardSurface?: string;
  [key: string]: unknown;
}

/** localStorage 裡 buzzcalculus.records.v1 的形狀（normalizeRecords 保證每個欄位都在） */
interface BuzzRecords {
  achievements: Record<string, unknown>;
  attempts: unknown[];
  backupNoticeSeen: boolean;
  bestScore: number;
  bestStreak: number;
  conf: Record<string, unknown>;
  daily: Record<string, unknown>;
  dailyOne: Record<string, unknown>;
  examSetupDismissed: boolean;
  favorites: Record<string, unknown>;
  history: BuzzHistoryEntry[];
  mistakes: Record<string, unknown>;
  namedExams: Record<string, unknown>;
  onboardingContext: string;
  onboardingLevel: string;
  onboardingSeen: boolean;
  pathGateAttempts: Record<string, unknown>;
  pathLessonRuns: Record<string, unknown>;
  pathRetest: Record<string, unknown>;
  pathUnlocks: Record<string, unknown>;
  placement: Record<string, unknown> | null;
  plan: Record<string, unknown> | null;
  planHistory: unknown[];
  planReportSeen: Record<string, unknown>;
  practiceRuns: Record<string, unknown>;
  problemReports: Record<string, unknown>;
  problemStats: Record<string, unknown>;
  proofLang: Record<string, BuzzProofLangEntry>;
  proofLangLessons: Record<string, string>;
  proofs: Record<string, BuzzProofProgress>;
  course: Record<string, BuzzCourseProgress>;
  courseGraduation: BuzzCourseGraduation | null;
  settings: BuzzSettings;
  streakShields: number;
  topicStats: Record<string, unknown>;
  totalAnswered: number;
  totalCorrect: number;
  updatedAt: string;
  weeklyChallenge: Record<string, unknown> | null;
  [key: string]: unknown;
}

interface BuzzHistoryEntry {
  mode?: string;
  topic?: string;
  at?: string;
  [key: string]: unknown;
}

interface BuzzProofLangSubmission {
  at: string;
  verdict: string;
  lines: number;
  unsure: number;
  error: number;
  viewedSolution: boolean;
}

interface BuzzProofLangEntry {
  text?: string;
  verdict?: string;
  updatedAt?: string;
  submissions?: BuzzProofLangSubmission[];
  solvedAt?: string;
  solutionViewed?: boolean;
}

interface BuzzProofProgress {
  status?: string;
  blocker?: string;
  solutionViewed?: boolean;
  orderPassed?: boolean;
  clozePassed?: boolean;
  updatedAt?: string;
  lastViewedAt?: string;
}

/* ── 白話證明 ───────────────────────────────────────────────────── */

interface BuzzProofLangSpec {
  id: string;
  family: "epsilon-delta" | "direct" | "cases" | "contradiction" | "induction";
  title: string;
  difficulty: number;
  statement: string;
  prompt: string;
  source?: string;
  vars?: Record<string, { min?: number; max?: number; int?: boolean }>;
  given?: string[];
  facts?: string[];
  abstract?: Record<string, { min?: number; max?: number }>;
  functions?: Record<string, (...args: number[]) => number>;
  macros?: { pattern: string; replace: string }[];
  goal: { relation?: string; text?: string[] };
  bound?: { lhs: string; rhs: string; threshold?: string };
  induction?: { variable: string; base: number };
  skeleton: "epsilon-delta" | "induction" | "cases" | "contradiction" | "direct";
  reference: string[];
  optional?: number[];
  allowUnsure?: boolean;
  coach?: string;
  seed?: number;
}

interface BuzzProofLangLine {
  n: number;
  raw: string;
  kind: string;
  label: string;
  /** "ok" | "unsure" | "error" */
  status: string;
  note: string;
  rule?: string | null;
  results?: unknown[];
}

interface BuzzProofLangReport {
  lines: BuzzProofLangLine[];
  counts: { ok: number; unsure: number; error: number };
  missing: string[];
  /** "verified" | "partial" | "incomplete" | "broken" | "empty" */
  verdict: string;
  verdictText: string;
  goalDone: boolean;
}

interface BuzzProofLangLesson {
  id: string;
  title: string;
  minutes: number;
  intro: string[];
  exampleId: string;
  exercise: { id: string; starter: string[]; task: string };
}

interface BuzzProofLangApi {
  version: number;
  normalize(text: string): string;
  parse(text: string): any[];
  check(spec: BuzzProofLangSpec, text: string, options?: Record<string, unknown>): BuzzProofLangReport;
  patterns: { kind: string; label: string }[];
  rules: { id: string; name: string; aliases: string[] }[];
  [key: string]: any;
}

/* ── 從零開始的課程 ───────────────────────────────────────────── */

/**
 * 計算課：worked.problemId 指向題庫的 R1 題，practice 剛好 3 題。
 * 理論課：practice 是空陣列，worked 沒有 problemId、用 tex 當推導題目，小測至少 3 題。
 */
interface BuzzCourseLesson {
  id: string;
  unit: "functions" | "limits" | "derivatives" | "integrals";
  title: string;
  minutes: number;
  goal: string;
  concept: { text: string; tex?: string }[];
  worked: { problemId?: string; tex?: string; steps: { text: string; tex?: string }[] };
  checks: { ask: string; options: { label: string; correct?: boolean; why?: string }[] }[];
  practice: string[];
}

/** 畢業關：passed 一旦 true 就不會退回；at 每考一次更新（保護期從最近一次算） */
interface BuzzCourseGraduation {
  at: string;
  correct: number;
  total: number;
  passed: boolean;
  attempts: number;
}

interface BuzzCourseProgress {
  openedAt?: string;
  checksPassed?: boolean;
  practiceDone?: boolean;
  practiceCorrect?: number;
  practiceTotal?: number;
  practicedAt?: string;
  doneAt?: string;
}

/* proofs.js（自評／骨架判）的題 */
interface BuzzProof {
  id: string;
  tier: string;
  title: string;
  difficulty: number;
  tags: string[];
  statement?: string;
  prompt: string;
  hints?: string[];
  keySteps?: string[];
  solution: { text: string; tex: string }[];
  cloze?: any[];
  leanSkeleton?: string;
}

/* ── DOM：故意寬鬆（見檔頭） ──────────────────────────────────────── */

// 不能用 HTMLInputElement & HTMLCanvasElement 這種交集：width、type 等欄位型別互斥，交集會塌成 never。
interface BuzzDomElement extends HTMLElement {
  value: string;
  checked: boolean;
  disabled: boolean;
  open: boolean;
  width: number;
  height: number;
  files: FileList | null;
  selectionStart: number | null;
  selectionEnd: number | null;
  selectedIndex: number;
  options: HTMLOptionsCollection;
  select(): void;
  setSelectionRange(start: number, end: number, direction?: "forward" | "backward" | "none"): void;
  getContext(contextId: "2d", options?: CanvasRenderingContext2DSettings): CanvasRenderingContext2D | null;
  toDataURL(type?: string, quality?: unknown): string;
  submit(): void;
  reset(): void;
  play(): Promise<void>;
  pause(): void;
}

interface ParentNode {
  querySelector(selectors: string): BuzzDomElement | null;
  querySelectorAll(selectors: string): NodeListOf<BuzzDomElement>;
}

interface Event {
  key?: string;
  pointerId?: number;
}

interface EventTarget {
  closest?(selectors: string): BuzzDomElement | null;
}

/* document.activeElement 是 Element；程式會問它游標在哪 */
interface Element {
  selectionStart?: number | null;
  selectionEnd?: number | null;
}

interface Navigator {
  standalone?: boolean;
}

/* ── window 上的模組與資料 ────────────────────────────────────────── */

interface Window {
  BUZZ_PROBLEMS: BuzzProblem[];
  BUZZ_PROOFS: BuzzProof[];
  BUZZ_COURSE: BuzzCourseLesson[];
  BuzzCourseUI: { create(deps: { escapeHtml: (s: unknown) => string; escapeAttr: (s: unknown) => string; icon: (name: string) => string; referenceAnswerHTML: (problem: BuzzProblem) => string }): any };
  /** src/share_cards.js：本週戰報與成就分享卡（canvas → PNG，本機） */
  BuzzShareCards: { create(deps: Record<string, unknown>): { weeklyShareData(records: BuzzRecords): any; downloadWeeklyReport(): void; shareAchievementCard(from: string): void; shareDailyOneCard(data: Record<string, unknown>, onFallback?: () => void): void } };
  BUZZ_PROOF_LANG_PROBLEMS: BuzzProofLangSpec[];
  BUZZ_PROOF_LANG_LESSONS: BuzzProofLangLesson[];
  /** src/kernel/proof_surface.js：Proof Input v2 自由書寫層，把中英文／LaTeX 翻成句型語言再交給 BuzzProofLang */
  BuzzProofSurface: { version: number; translate(text: string, lang: any): { nodes: any[]; canonicalText: string; problems: any[] }; check(lang: any, spec: any, text: string): any; latexToPlain(source: string): { text: string; unknown: string[] }; segment(text: string): string[] };
  BUZZ_SKILL_TAGS: Record<string, string[]>;
  BUZZ_DIFFICULTY: any;
  BUZZ_CUSTOM: any;
  BUZZ_DAILY_ONE_HISTORY: Record<string, string>;
  BUZZ_GA_MEASUREMENT_ID?: string;
  BUZZ_SYNC_TOKEN?: string;
  BuzzProofLang: BuzzProofLangApi;
  BuzzProofLabUI: { create(deps: { escapeHtml: (s: unknown) => string; escapeAttr: (s: unknown) => string; icon: (name: string) => string; proofs?: BuzzProof[] }): any };
  BuzzAnswerSampling: { create: (deps: any) => any };
  BuzzCannedHints: any;
  BUZZ_SYNC_ENDPOINT?: string;
  __BUZZ_TEST_HOOKS__: any;
  BuzzAbility: any;
  BuzzPlanner: any;
  BuzzSession: any;
  BuzzRecords: any;
  BuzzSkillGraph: any;
  BuzzEquivalence: any;
  BuzzBoardRender: any;
  BuzzBoardStore: any;
  BuzzInkRead: any;
  BuzzTexLite: any;
  BuzzTagLabels: any;
  BuzzPricing: any;
  BuzzUid: any;
  BuzzRubric: any;
  BuzzDerivedHints: any;
  BuzzVerifiedAnswers: any;
  BuzzOrigin: any;
  katex: any;
  anime: any;
  lucide: any;
  gtag: (...args: unknown[]) => void;
  dataLayer: unknown[];
  webkitAudioContext: typeof AudioContext;
}

/* 檢查器丟出的錯誤帶著「哪個符號沒宣告」 */
interface Error {
  unknownSymbol?: string;
}
