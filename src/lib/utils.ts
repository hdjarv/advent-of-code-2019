import { PathLike, readFileSync } from "fs";
import { join as _join } from "path";
import { EOL } from "os";
import { State } from "./intcode";

export const numToStr = (n: number): string => `${n}`;
export const strToNum = (s: string): number => Number.parseInt(s, 10);

export const join = _join;

export const readFileAsString = (path: PathLike) => readFileSync(path, { encoding: "utf8" });
export const readFileIntoStringArray = (path: PathLike) => readFileAsString(path).split(EOL);
export const readFileIntoNumberArray = (path: PathLike, sep: string = ",") =>
  readFileIntoStringArray(path)
    .map(s => s.split(sep))
    .map(a => a.map(strToNum));

export const range = (count: number, start: number = 1, step: number = 1): number[] =>
  [...Array(count)].map((_, ix) => start + ix * step);

export function* rangegen(count: number, start: number = 1, step: number = 1): Generator<number, null, void> {
  for (let i = 0; i < count; i++) {
    yield start + i * step;
  }
  return null;
}

export function permute(input: number[]): number[][] {
  const result: number[][] = [];
  const usedChars: number[] = [];

  const doPermute = (input: number[]) => {
    for (let i = 0; i < input.length; i++) {
      let ch = input.splice(i, 1)[0];
      usedChars.push(ch);
      if (input.length == 0) {
        result.push(Array.from(usedChars));
      }
      doPermute(input);
      input.splice(i, 0, ch);
      usedChars.pop();
    }
    return result;
  };
  return doPermute(input);
}

export const validateAndGetDiagnosticTestResult = (state: State): number =>
  state.output.reduce((_result: number, outputValue: number, ix: number, output: number[]) => {
    if (ix === output.length - 1) {
      return outputValue;
    }
    if (outputValue !== 0) {
      throw Error(`ERROR: Diagnostic test ${ix} returned ${outputValue}`);
    }
    return outputValue;
  }, 0);
