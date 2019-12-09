#!/usr/bin/env node

import { existsSync as fileExists } from "fs";
import { basename, join } from "path";

if (process.argv.length < 3) {
  console.error(`Usage: ${basename(process.argv[1])} <day> [<arg1>...<argN>]`);
  process.exit(1);
}

const dayNo = Number.parseInt(process.argv[2], 10);
const dayModule = `day-${dayNo < 10 ? `0${dayNo}` : dayNo}`;

if (!fileExists(join(__dirname, dayModule + ".js"))) {
  console.error(`Not implemented`);
  process.exit(2);
}

console.log(`AOC 2019 - Day ${dayNo}`);
const day = require("./" + dayModule);

(async () => {
  try {
    await day.default(...process.argv.slice(3));
  } catch (error) {
    console.error(`Error running Day ${dayNo}`);
    console.error(error.stack);
    process.exit(3);
  }
})();
