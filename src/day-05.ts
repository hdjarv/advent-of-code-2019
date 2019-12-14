import { run as runProgram } from "./lib/intcode";
import { join, readFileIntoNumberArray, validateAndGetDiagnosticTestResult } from "./lib/utils";

export default async (..._args: any) => {
  const program = readFileIntoNumberArray(join(__dirname, "inputs", "day-05-input.txt")).flat();

  console.log(`Part 1: The diagnostic code is: ${validateAndGetDiagnosticTestResult(runProgram(program, 1))}`);
  console.log(
    `Part 2: The diagnostic code for system ID 5 is: ${validateAndGetDiagnosticTestResult(runProgram(program, 5))}`
  );
};
