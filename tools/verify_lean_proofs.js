// Machine-verify the lean-tier reference solutions by actually compiling
// them with Lean 4. Every lean-tier proof in src/proofs.js carries its full
// solution in the `lean` field; this tool concatenates them into one file
// and runs the Lean compiler (via WSL elan on Windows, or a native `lean`).
// Exit 0 = every reference solution is a machine-checked proof.
//
// Setup (Windows/WSL):
//   wsl bash -lc "curl -sSf https://elan.lean-lang.org/elan-init.sh | sh -s -- -y --default-toolchain stable"
//
// Usage: node tools/verify_lean_proofs.js

"use strict";

const fs = require("fs");
const path = require("path");
const { execSync, spawnSync } = require("child_process");

global.window = {};
require("../src/proofs.js");
const proofs = (global.window.BUZZ_PROOFS || []).filter((p) => p.tier === "lean");

if (!proofs.length) {
  console.error("No lean-tier proofs found.");
  process.exit(1);
}

const missing = proofs.filter((p) => !p.lean || typeof p.lean !== "string");
if (missing.length) {
  console.error(`lean-tier proofs missing the lean solution field: ${missing.map((p) => p.id).join(", ")}`);
  process.exit(1);
}

const banner = (p) => `-- ${p.id}: ${p.title}`;
const source = proofs.map((p) => `${banner(p)}\n${p.lean}`).join("\n\n") + "\n";
const tmpDir = path.join(__dirname, "..", "tmp");
fs.mkdirSync(tmpDir, { recursive: true });
const leanFile = path.join(tmpDir, "lean_proof_check.lean");
fs.writeFileSync(leanFile, source, "utf8");
console.log(`Wrote ${proofs.length} lean proofs to ${leanFile}`);

function tryRun(cmd, args) {
  const res = spawnSync(cmd, args, { encoding: "utf8" });
  return res.error ? null : res;
}

let result = null;
let runner = "";

// 1) native lean on PATH
if (tryRun("lean", ["--version"])) {
  runner = "native lean";
  result = spawnSync("lean", [leanFile], { encoding: "utf8" });
} else {
  // 2) WSL elan-installed lean
  const probe = tryRun("wsl", ["bash", "-lc", "~/.elan/bin/lean --version"]);
  if (probe && probe.status === 0) {
    runner = `WSL ${probe.stdout.trim()}`;
    const wslPath = execSync(`wsl wslpath -a '${leanFile.replace(/\\/g, "/")}'`, { encoding: "utf8" }).trim();
    result = spawnSync("wsl", ["bash", "-lc", `~/.elan/bin/lean '${wslPath}'`], { encoding: "utf8" });
  }
}

if (!result) {
  console.error("No Lean toolchain found (native or WSL ~/.elan/bin/lean).");
  console.error('Install one:  wsl bash -lc "curl -sSf https://elan.lean-lang.org/elan-init.sh | sh -s -- -y --default-toolchain stable"');
  process.exit(1);
}

const output = `${result.stdout || ""}${result.stderr || ""}`.trim();
if (result.status !== 0) {
  console.error(`Lean compilation FAILED (${runner}):\n${output}`);
  process.exit(1);
}
if (output) console.log(output);
console.log(`All ${proofs.length} lean-tier reference proofs compile (${runner}). Machine-verified.`);
