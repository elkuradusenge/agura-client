#!/usr/bin/env node
/**
 * Syne is the only typeface. Font files may only be declared in the stylesheet
 * and the single Google Fonts import in index.html.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const offenders = [];

function scan(directory) {
  const stats = statSync(directory);
  if (!stats.isDirectory()) {
    checkFile(directory);
    return;
  }
  for (const entry of readdirSync(directory)) {
    if (["node_modules", "dist", ".git"].includes(entry)) continue;
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) {
      scan(path);
      continue;
    }
    checkFile(path);
  }
}

function checkFile(path) {
  if (![".ts", ".tsx", ".css", ".html", ".js"].includes(extname(path))) return;
  const source = readFileSync(path, "utf8");
  for (const match of source.matchAll(/font-family\s*:\s*([^;]+);/g)) {
    const value = match[1];
    if (!value.includes("Syne") && !value.includes("var(")) {
      offenders.push(`${path.replace(ROOT, "")}: ${value.trim()}`);
    }
  }
}

scan(join(ROOT, "src"));
scan(join(ROOT, "index.html"));

const config = readFileSync(join(ROOT, "tailwind.config.js"), "utf8");
if (!config.includes("Syne")) {
  offenders.push("tailwind.config.js: the sans family must be Syne");
}

if (offenders.length) {
  console.error("Only Syne may be used as a typeface:");
  for (const offender of offenders) console.error(`  ${offender}`);
  process.exit(1);
}

console.log("Typeface is Syne only.");
