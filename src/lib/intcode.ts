type Instruction = (state: State) => void;
type Operator = (value1: number, value2: number) => number;
type JumpCondition = (value: number) => boolean;

enum ParameterMode {
  Position = 0,
  Immediate = 1,
  Relative = 2
}

export type State = {
  memory: number[];
  instructionPointer: number;
  nextInstructionPointer: number;
  parameterModes?: ParameterMode[];
  relativeBase: number;
  input: number[];
  output: number[];
};

const Add = (value1: number, value2: number): number => value1 + value2;
const Equals = (value1: number, value2: number): number => (value1 === value2 ? 1 : 0);
const LessThan = (value1: number, value2: number): number => (value1 < value2 ? 1 : 0);
const Multiply = (value1: number, value2: number): number => value1 * value2;

const TwoOpInstruction = (operator: Operator) => (state: State): void => {
  setParameterValue(state, 3, operator(getParameterValue(state, 1), getParameterValue(state, 2)));
  state.nextInstructionPointer = state.instructionPointer + 4;
};

const IfZero = (value: number) => value === 0;
const IfNonZero = (value: number) => value !== 0;

const JumpInstruction = (condition: JumpCondition) => (state: State): void => {
  state.nextInstructionPointer = condition(getParameterValue(state, 1))
    ? getParameterValue(state, 2)
    : state.instructionPointer + 3;
};

const InstructionSet: { [index: number]: Instruction } = {
  1: TwoOpInstruction(Add),
  2: TwoOpInstruction(Multiply),
  // input
  3: (state: State): void => {
    const input = state.input.shift();
    if (input === undefined) {
      throw new Error(
        `No input value to store, instructionpointer: ${state.instructionPointer} (..., ${state.memory.slice(
          state.instructionPointer,
          state.instructionPointer + 4
        )}, ...)`
      );
    }
    setParameterValue(state, 1, input);
    state.nextInstructionPointer = state.instructionPointer + 2;
  },
  4: (state: State): void => {
    state.output.push(getParameterValue(state, 1));
    state.nextInstructionPointer = state.instructionPointer + 2;
  },
  5: JumpInstruction(IfNonZero),
  6: JumpInstruction(IfZero),
  7: TwoOpInstruction(LessThan),
  8: TwoOpInstruction(Equals),
  9: (state: State): void => {
    state.relativeBase += getParameterValue(state, 1);
    state.nextInstructionPointer = state.instructionPointer + 2;
  },
  99: (state: State): void => {
    // stop
    state.nextInstructionPointer = state.instructionPointer;
  }
};

const getParameterModeForParam = (state: State, paramNo: number): ParameterMode =>
  state.parameterModes && paramNo - 1 < state.parameterModes.length
    ? state.parameterModes[paramNo - 1]
    : ParameterMode.Position;

const getMemoryAddressForParam = (state: State, paramNo: number): number => {
  let paramMode = getParameterModeForParam(state, paramNo);
  let memAddress = -1;
  switch (paramMode) {
    case ParameterMode.Position:
      memAddress = state.memory[state.instructionPointer + paramNo];
      break;
    case ParameterMode.Immediate:
      memAddress = state.instructionPointer + paramNo;
      break;
    case ParameterMode.Relative:
      memAddress = state.relativeBase + state.memory[state.instructionPointer + paramNo];
      break;
    default:
      throw Error(
        `Invalid parameter mode: ${paramMode} (..., ${state.memory.slice(
          state.instructionPointer,
          state.instructionPointer + 4
        )}, ...)`
      );
  }
  if (memAddress < 0) {
    throw Error(
      `Invalid memory address: ${memAddress} (..., ${state.memory.slice(
        state.instructionPointer,
        state.instructionPointer + 4
      )}, ...)`
    );
  }
  return memAddress;
};

const getParameterValue = (state: State, paramNo: number) => {
  const value = state.memory[getMemoryAddressForParam(state, paramNo)];
  return value === undefined ? 0 : value;
};

const setParameterValue = (state: State, paramNo: number, value: number): void => {
  state.memory[getMemoryAddressForParam(state, paramNo)] = value;
};

const parseOpcode = (opcode: number): { opcode: number; parameterModes?: ParameterMode[] } =>
  opcode >= 100
    ? {
        opcode: opcode % 100,
        parameterModes: `${Math.floor(opcode / 100)}`
          .split("")
          .map(c => Number.parseInt(c, 10))
          .reverse()
      }
    : { opcode };

export const runFromState = (state: State, stopOnOutput: boolean = false): State => {
  while (state.instructionPointer < state.memory.length) {
    const instruction = parseOpcode(state.memory[state.instructionPointer]);
    state.parameterModes = instruction.parameterModes;
    const instFn = InstructionSet[instruction.opcode];
    if (!instFn) {
      throw Error(
        `Invalid instruction; opcode: ${instruction.opcode}, instructionPointer: ${
          state.instructionPointer
        } (..., ${state.memory.slice(state.instructionPointer, state.instructionPointer + 4)}, ...)`
      );
    }
    instFn(state);
    if (state.nextInstructionPointer === state.instructionPointer) {
      break;
    }
    const { opcode } = parseOpcode(state.memory[state.instructionPointer]);
    if (opcode === instruction.opcode) {
      // opcode was not modified, move to next
      state.instructionPointer = state.nextInstructionPointer;
    }
    if (stopOnOutput && instruction.opcode === 4) {
      break;
    }
  }
  return state;
};

export const run = (program: number[], input: number | number[] = [], stopOnOutput: boolean = false): State => {
  const state: State = {
    memory: Array.from(program),
    instructionPointer: 0,
    nextInstructionPointer: 0,
    relativeBase: 0,
    input: Array.isArray(input) ? input : [input],
    output: []
  };
  return runFromState(state, stopOnOutput);
};

export const isRunToStop = (state: State): boolean => parseOpcode(state.memory[state.instructionPointer]).opcode === 99;
