type Instruction = (memory: number[], instructionPointer: number) => number;
type Operator = (value1: number, value2: number) => number;

const Add = (value1: number, value2: number): number => value1 + value2;
const Multiply = (value1: number, value2: number): number => value1 * value2;

const TwoOpInstruction = (operator: Operator) => (memory: number[], instructionPointer: number): number => {
  memory[memory[instructionPointer + 3]] = operator(
    memory[memory[instructionPointer + 1]],
    memory[memory[instructionPointer + 2]]
  );
  return instructionPointer + 4;
};

const InstructionSet: { [index: number]: Instruction } = {
  1: TwoOpInstruction(Add),
  2: TwoOpInstruction(Multiply),
  99: (_memory: number[], instructionPointer: number): number => instructionPointer // stop
};

export const run = (program: number[], noun: number = 12, verb: number = 2) => {
  const memory = Array.from(program);
  memory[1] = noun;
  memory[2] = verb;
  let instructionPointer = 0;
  let nextInstructionPointer = 0;

  while (true) {
    nextInstructionPointer = InstructionSet[memory[instructionPointer]](memory, instructionPointer);
    if (nextInstructionPointer === instructionPointer) {
      break;
    }
    instructionPointer = nextInstructionPointer;
  }

  return memory[0];
};
