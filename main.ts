// The Vacuum's Alibi: One Line, 200 Characters.
//
// The entry is a single deadpan excuse, written to /output/entry.txt
// (or $MAKEFUN_OUTPUT_DIR/entry.txt when the harness sets it).
//
// The joke: the vacuum did not miss the spot — its sensors decided the
// crumbs were load-bearing, so it cleaned around them and escalated the
// matter to headquarters. Deadpan robot voice (sensors, escalation),
// a surprise turn (crumbs as structural engineering), and the punch lands
// on the last clause: a crumb report going all the way upstairs.
//
// Pure Node stdlib, no network, no child processes, no dependencies.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "I did not miss that spot. My sensors determined the crumbs were load-bearing, so I cleaned around them and escalated the matter to headquarters.";

const MAX_LEN = 200;

// The house gate: UTF-8 text, 1-200 characters, not only whitespace, one
// line. Fail loudly here instead of shipping a bad file.
function checkLine(text: string): void {
  const chars = [...text].length;
  if (chars < 1 || chars > MAX_LEN) {
    throw new Error(`line must be 1-${MAX_LEN} characters, got ${chars}`);
  }
  if (text.trim().length === 0) {
    throw new Error("line must not be blank");
  }
  if (text !== text.trim() || text.includes("  ")) {
    throw new Error("line must not have stray or doubled spaces");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("line must fit on one line");
  }
}

function main(): void {
  checkLine(LINE);

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outFile = join(outDir, "entry.txt");

  // Write exactly the line — no trailing newline, so the file's character
  // count is the line's character count and nothing else.
  writeFileSync(outFile, LINE, "utf8");

  // Prove the file on disk is byte-for-byte the line before claiming success.
  const written = readFileSync(outFile, "utf8");
  if (written !== LINE) {
    throw new Error("output file does not match the line");
  }

  console.log(`Wrote ${[...LINE].length} characters to ${outFile}`);
  console.log(LINE);
}

main();
