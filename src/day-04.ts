import { numToStr, range, strToNum } from "./lib/utils";

const isAscendingNumbers = (str: string, chr: string = "0", ix: number = 0): boolean =>
  ix >= str.length ? true : str[ix] < chr ? false : isAscendingNumbers(str, str[ix] <= chr ? chr : str[ix], ix + 1);

export default async (..._args: any) => {
  const twoDigitsSeqRe = /(\d)\1/;
  const [low, high] = "183564-657474".split("-").map(strToNum);

  let passwords = range(high - low, low)
    .map(numToStr)
    .filter(s => s.length === 6)
    .filter(s => isAscendingNumbers(s))
    .filter(s => twoDigitsSeqRe.test(s));
  console.log(`Part 1: The number of passwords is: ${passwords.length}`);

  passwords = passwords.filter(s => twoDigitsSeqRe.test(s.replace(/(\d)\1{2,}/g, "")));
  console.log(`Part 2: The number of passwords is: ${passwords.length}`);
};
