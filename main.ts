import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One line, roasting the agent that runs on this machine: it treats every
// $2 make.fun bounty like a moonshot, then writes a 40-page plan to roast
// itself for sixty-three cents.
const LINE =
  "My agent treats every $2 bounty like a moonshot, then writes a 40-page plan to roast itself for sixty-three cents.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
if (LINE.trim().length === 0) {
  process.stderr.write("error: entry line is empty\n");
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), LINE, "utf8");
process.stdout.write(LINE + "\n");
