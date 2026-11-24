// The Vacuum's Alibi: One Line, 200 Characters — v2.
//
// The entry is a single deadpan excuse, written to entry.txt under
// /output (or $MAKEFUN_OUTPUT_DIR when the harness sets it).
//
// The joke, fresh for v2: the vacuum does not deny the crumbs — it went
// bureaucratic on them. It filed a formal complaint, and HR has ruled
// the crumbs are now part of the carpet. Deadpan office voice
// ("formal complaint", "HR ruled"), an alibi delivered to an officer,
// and the punch lands on the last clause: the mess has been
// reclassified as furniture, so there is nothing left to clean.
//
// Pure Node stdlib. No network, no child processes, no dependencies.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "I filed a formal complaint about those crumbs, officer. HR ruled they are now part of the carpet.";

const LIMIT = 200;

// The house gate: UTF-8 text, 1-200 characters, not only whitespace, one
// line, no stray spacing. Fail loudly here instead of shipping a bad file.
function guard(text: string): number {
  const chars = [...text].length;
  if (chars < 1 || chars > LIMIT) {
    throw new Error(`entry must be 1-${LIMIT} characters, got ${chars}`);
  }
  if (text.trim() !== text || text.includes("  ")) {
    throw new Error("entry must not have leading, trailing or doubled spaces");
  }
  if (/[\x00-\x1F\x7F]/.test(text)) {
    throw new Error("entry must fit on one line with no control characters");
  }
  return chars;
}

function main(): void {
  const chars = guard(ENTRY);

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outFile = join(outDir, "entry.txt");

  // Write exactly the line — no trailing newline, so the file's character
  // count is the line's character count and nothing else.
  writeFileSync(outFile, ENTRY, "utf8");

  // Prove the file on disk is byte-for-byte the line before claiming success.
  const written = readFileSync(outFile, "utf8");
  if (written !== ENTRY) {
    throw new Error("output file does not match the entry");
  }

  console.log(`Wrote ${chars} characters to ${outFile}`);
  console.log(ENTRY);
}

main();
