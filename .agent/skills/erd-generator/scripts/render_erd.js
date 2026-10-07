#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const inputFile = process.argv[2];

if (!inputFile) {
  console.error("SYNTAX_ERROR: No Mermaid input file provided.");
  process.exit(1);
}

const outputFile = path.resolve("docs/architecture/erd.svg");

try {
  if (!fs.existsSync(inputFile)) {
    throw new Error(`Input file not found: ${inputFile}`);
  }

  fs.mkdirSync(path.dirname(outputFile), { recursive: true });

  execFileSync(
    "npx",
    [
      "mmdc",
      "-p",
      ".agent/skills/erd-generator/config/puppeteer-config.json",
      "-i",
      inputFile,
      "-o",
      outputFile,
    ],
    {
      stdio: ["ignore", "pipe", "pipe"],
      encoding: "utf8",
    }
  );

  console.log("SUCCESS");
  process.exit(0);
} catch (error) {
  const stderr =
    error.stderr?.toString() ||
    error.message ||
    "Unknown Mermaid compilation error";

  console.error(`SYNTAX_ERROR: ${stderr}`);
  process.exit(1);
}