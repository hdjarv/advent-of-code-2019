import { run as runProgram, Result } from "./lib/intcode";
import { join, readFileIntoNumberArray } from "./lib/utils";

const validateAndGetResult = (result: Result): string =>
  result.output.reduce((result: string, outputValue: string, ix: number, output: string[]) => {
    if (result.length === 0 && ix === output.length - 1) {
      return outputValue;
    }
    if (result.length === 0 && outputValue !== "0") {
      return `ERROR: Diagnostic test ${ix} returned ${outputValue}`;
    }
    return result.length > 0 ? result : "";
  }, "");

export default async (..._args: any) => {
  const program = readFileIntoNumberArray(join(__dirname, "inputs", "day-05-input.txt")).flat();

  console.log(`Part 1: The diagnostic code is: ${validateAndGetResult(runProgram(program, 1))}`);
  console.log(`Part 2: The diagnostic code for system ID 5 is: ${validateAndGetResult(runProgram(program, 5))}`);
};
