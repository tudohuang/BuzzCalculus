const fs = require("fs");
const path = require("path");

// Load the same problem source files, in the same order, that index.html ships.
// Reading the list out of index.html keeps validators from silently drifting
// when a new problem pack is added (which is how world_universities and
// competition went unvalidated).
module.exports = function loadProblemSources() {
  const root = path.join(__dirname, "..", "..");
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const shipped = [...html.matchAll(/src="(src\/(?:problems|problem_[^"]+)\.js)"/g)].map((m) => m[1]);
  if (!shipped.length) {
    throw new Error("No problem source scripts found in index.html");
  }

  const onDisk = fs
    .readdirSync(path.join(root, "src"))
    .filter((name) => /^problem.*\.js$/.test(name) || name === "problems.js")
    .map((name) => `src/${name}`);
  const missing = onDisk.filter((file) => !shipped.includes(file));
  if (missing.length) {
    throw new Error(`Problem source files exist but are not loaded by index.html: ${missing.join(", ")}`);
  }

  shipped.forEach((file) => {
    require(path.join(root, file));
  });
  return shipped;
};
