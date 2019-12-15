import { run as runProgram } from "./lib/intcode";
import { readFileIntoNumberArray, join } from "./lib/utils";

export default async (..._args: any) => {
  const program = readFileIntoNumberArray(join(__dirname, "inputs", "day-09-input.txt")).flat();

  const boostKeyCode = runProgram(program, 1).output.pop();
  console.log(`Part 1: The BOOST keycode is: ${boostKeyCode}`);

  const coords = runProgram(program, 2).output.pop();
  console.log(`Part 2: The distress signal coordinates are: ${coords}`);
};
