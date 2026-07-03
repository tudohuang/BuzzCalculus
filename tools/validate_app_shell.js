const fs = require("fs");
const path = require("path");

// The service worker precache list is hand-maintained; make sure it covers
// every script index.html ships, so a new problem pack can't miss offline mode.
const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const sw = fs.readFileSync(path.join(root, "sw.js"), "utf8");

const shippedScripts = [...html.matchAll(/src="(src\/[^"]+\.js)"/g)].map((m) => m[1]);
const shippedStyles = [...html.matchAll(/href="(styles\.css|manifest\.webmanifest|assets\/[^"]+)"/g)].map((m) => m[1]);
const cached = new Set([...sw.matchAll(/"\.\/([^"]+)"/g)].map((m) => m[1]));

const failures = [];
[...shippedScripts, ...shippedStyles].forEach((file) => {
  if (!cached.has(file)) failures.push(`sw.js APP_SHELL is missing ${file}`);
});
cached.forEach((file) => {
  if (file === "") return;
  if (!fs.existsSync(path.join(root, file))) failures.push(`sw.js APP_SHELL caches missing file ${file}`);
});

if (failures.length) {
  failures.forEach((failure) => console.error(`FAIL ${failure}`));
  process.exit(1);
}
console.log(`Validated app shell: ${cached.size} cached entries cover ${shippedScripts.length} scripts`);
