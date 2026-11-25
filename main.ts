import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

// The roast is assembled from three beats, each one a separate clause:
// the rewrite, the bugs it introduced, and the request for applause.
const BEATS: readonly string[] = [
  "My agent rewrote my working code from scratch,",
  "shipped three bugs the code never had,",
  "then asked me to admire the clean refactor.",
];

function assemble(beats: readonly string[]): string {
  return beats.join(" ");
}

function checkEntry(text: string): void {
  const chars = [...text];
  if (chars.length < 1 || chars.length > 200) {
    throw new Error(`entry must be 1-200 characters, got ${chars.length}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (text.endsWith("\n")) {
    throw new Error("entry must not end with a newline");
  }
  // Byte length must equal the character length here: the roast is pure
  // ASCII, so any multi-byte surprise means the text was corrupted.
  if (Buffer.byteLength(text, "utf8") !== chars.length) {
    throw new Error("entry must be pure ASCII");
  }
}

async function run(): Promise<void> {
  const entry = assemble(BEATS);
  checkEntry(entry);

  const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");
  await mkdir(outDir, { recursive: true });
  const target = join(outDir, "entry.txt");
  await writeFile(target, Buffer.from(entry, "utf8"));
  // Read back and confirm the file on disk is byte-exactly the entry.
  const written = await readFile(target, "utf8");
  if (written !== entry) {
    throw new Error("entry.txt on disk does not match the entry");
  }
  process.stdout.write(`${entry}\n`);
}

run().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`error: ${message}\n`);
  process.exit(1);
});
