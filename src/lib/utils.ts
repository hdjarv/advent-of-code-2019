export const numToStr = (n: number): string => `${n}`;
export const strToNum = (s: string): number => parseInt(s, 10);

export const range = (count: number, start: number = 1, step: number = 1): number[] =>
  [...Array(count)].map((_, ix) => start + ix * step);
