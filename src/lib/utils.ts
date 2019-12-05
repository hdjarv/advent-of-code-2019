export const numToStr = (n: number): string => `${n}`;
export const strToNum = (s: string): number => parseInt(s, 10);

export const range = (count: number, start: number = 1, step: number = 1): number[] =>
  [...Array(count)].map((_, ix) => start + ix * step);

export function* rangegen(count: number, start: number = 1, step: number = 1) {
  for (let i = 0; i < count; i++) {
    yield start + i * step;
  }
  return null;
}
