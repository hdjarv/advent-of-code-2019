type Instruction = (memory: Array<number>, instructionPointer: number) => number;

const InstructionSet: { [index: number]: Instruction } = {
  // add
  1: (memory: Array<number>, instructionPointer: number): number => {
    memory[memory[instructionPointer + 3]] =
      memory[memory[instructionPointer + 1]] + memory[memory[instructionPointer + 2]];
    return instructionPointer + 4;
  },
  // multiply
  2: (memory: Array<number>, instructionPointer: number): number => {
    memory[memory[instructionPointer + 3]] =
      memory[memory[instructionPointer + 1]] * memory[memory[instructionPointer + 2]];
    return instructionPointer + 4;
  },
  // stop
  99: (_memory: Array<number>, instructionPointer: number): number => instructionPointer
};

export const run = (program: Array<number>, noun: number = 12, verb: number = 2) => {
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
