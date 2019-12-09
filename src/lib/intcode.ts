type Instruction = (state: State) => number;
type Operator = (value1: number, value2: number) => number;
type JumpCondition = (value: number) => boolean;

enum ParameterMode {
  Position = 0,
  Immediate = 1
}

export type Result = {
  mem0: number;
  output: string[];
};

type State = {
  memory: number[];
  instructionPointer: number;
  parameterModes?: ParameterMode[];
  input?: number;
  output: string[];
};

const Add = (value1: number, value2: number): number => value1 + value2;
const Equals = (value1: number, value2: number): number => (value1 === value2 ? 1 : 0);
const LessThan = (value1: number, value2: number): number => (value1 < value2 ? 1 : 0);
const Multiply = (value1: number, value2: number): number => value1 * value2;

const TwoOpInstruction = (operator: Operator) => (state: State): number => {
  setParameterValue(state, 3, operator(getParameterValue(state, 1), getParameterValue(state, 2)));
  return state.instructionPointer + 4;
};

const IfZero = (value: number) => value === 0;
const IfNonZero = (value: number) => value !== 0;

const JumpInstruction = (condition: JumpCondition) => (state: State): number =>
  condition(getParameterValue(state, 1)) ? getParameterValue(state, 2) : state.instructionPointer + 3;

const InstructionSet: { [index: number]: Instruction } = {
  1: TwoOpInstruction(Add),
  2: TwoOpInstruction(Multiply),
  // input
  3: (state: State): number => {
    if (state.input !== undefined) {
      setParameterValue(state, 1, state.input);
    } else {
      throw new Error(
        "No input value to store. Op: 3, InstructionPointer: " +
          state.instructionPointer +
          ", Address: " +
          state.memory[state.instructionPointer + 1]
      );
    }
    return state.instructionPointer + 2;
  },
  4: (state: State): number => {
    state.output.push(`${getParameterValue(state, 1)}`);
    return state.instructionPointer + 2;
  },
  5: JumpInstruction(IfNonZero),
  6: JumpInstruction(IfZero),
  7: TwoOpInstruction(LessThan),
  8: TwoOpInstruction(Equals),
  99: (state: State): number => state.instructionPointer // stop
};

const getParameterValue = (state: State, paramNo: number) => {
  if (state.parameterModes && paramNo - 1 < state.parameterModes.length) {
    const paramMode = state.parameterModes[paramNo - 1];
    if (paramMode === ParameterMode.Immediate) {
      return state.memory[state.instructionPointer + paramNo];
    }
  }

  return state.memory[state.memory[state.instructionPointer + paramNo]];
};

const setParameterValue = (state: State, paramNo: number, value: number): void => {
  state.memory[state.memory[state.instructionPointer + paramNo]] = value;
};

const parseOpcode = (opcode: number): { opcode: number; parameterModes?: ParameterMode[] } =>
  opcode > 100
    ? {
        opcode: opcode % 100,
        parameterModes: `${Math.floor(opcode / 100)}`
          .split("")
          .map(c => Number.parseInt(c, 10))
          .reverse()
      }
    : { opcode };

export const run = (program: number[], input?: number): Result => {
  const state: State = { memory: Array.from(program), instructionPointer: 0, input: input, output: [] };
  while (state.instructionPointer < program.length) {
    let nextInstructionPointer = 0;
    const instruction = parseOpcode(state.memory[state.instructionPointer]);
    state.parameterModes = instruction.parameterModes;
    nextInstructionPointer = InstructionSet[instruction.opcode](state);
    if (nextInstructionPointer === state.instructionPointer) {
      break;
    }
    const { opcode } = parseOpcode(state.memory[state.instructionPointer]);
    if (opcode === instruction.opcode) {
      // opcode was not modified, progress to next
      state.instructionPointer = nextInstructionPointer;
    }
  }
  return { mem0: state.memory[0], output: state.output };
};
