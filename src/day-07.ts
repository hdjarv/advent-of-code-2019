import { run as runProgram, runFromState, isRunToStop } from "./lib/intcode";
import { readFileIntoNumberArray, join, validateAndGetDiagnosticTestResult, permute } from "./lib/utils";

const runThoughAmplifiers = (program: number[], phaseSettings: number[], input: number): number =>
  phaseSettings.reduce(
    (result, phaseSetting) => validateAndGetDiagnosticTestResult(runProgram(program, [phaseSetting, result || input])),
    0
  );

const runThoughAmplifiersWithFeedbackLoop = (
  program: number[],
  phaseSettings: number[],
  initialInput: number
): number => {
  const getOutputFromAmp = (ampNo: number): number => ampStates[ampNo].output[ampStates[ampNo].output.length - 1];

  const ampStates = [...Array(phaseSettings.length)];
  let ampNo = 0;
  while (true) {
    let state = ampStates[ampNo];
    if (!state) {
      let input = ampNo === 0 ? initialInput : getOutputFromAmp(ampNo - 1);
      state = runProgram(program, [phaseSettings[ampNo], input], true);
    } else {
      let input = getOutputFromAmp(ampNo === 0 ? ampStates.length - 1 : ampNo - 1);
      state.input.unshift(input);
      state = runFromState(state, true);
    }
    ampStates[ampNo] = state;

    if (isRunToStop(state)) {
      if (ampNo === ampStates.length - 1) {
        break;
      }
    }
    ampNo = ampNo < ampStates.length - 1 ? ampNo + 1 : 0;
  }
  return getOutputFromAmp(ampNo);
};

export default async (..._args: any) => {
  const program = readFileIntoNumberArray(join(__dirname, "inputs", "day-07-input.txt")).flat();

  const highestThrusterSignal = permute([0, 1, 2, 3, 4])
    .map(phaseSettings => {
      return runThoughAmplifiers(program, phaseSettings, 0);
    })
    .sort((a, b) => a - b)
    .pop();

  console.log(`Part 1: The highest signal sent to thrusters is: ${highestThrusterSignal}`);

  const highestThrusterSignal2 = permute([5, 6, 7, 8, 9])
    .map(phaseSettings => {
      return runThoughAmplifiersWithFeedbackLoop(program, phaseSettings, 0);
    })
    .sort((a, b) => a - b)
    .pop();

  console.log(`Part 2: The highest signal (with feedback loop) sent to thrusters is: ${highestThrusterSignal2}`);
};
