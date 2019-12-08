import { readFileAsString, join, strToNum } from "./lib/utils";

const WIDTH = 25;
const HEIGHT = 6;
const LAYER_LENGTH = WIDTH * HEIGHT;

const countNumberInLayer = (input: number[], layer: number, digit: number): number =>
  input
    .slice(LAYER_LENGTH * layer, LAYER_LENGTH * layer + LAYER_LENGTH)
    .reduce((result, value) => (value === digit ? result + 1 : result), 0);

const calcPart1 = (input: number[]) => {
  let layersZeroCounts: number[] = [...Array(input.length / LAYER_LENGTH)];
  layersZeroCounts = layersZeroCounts.map((_, ix) => countNumberInLayer(input, ix, 0));

  const { layerIx } = layersZeroCounts.reduce(
    (result, zeros, layerIx) => (zeros < result.zeros ? { layerIx: layerIx, zeros: zeros } : result),
    {
      layerIx: 0,
      zeros: Number.MAX_VALUE
    }
  );

  return countNumberInLayer(input, layerIx, 1) * countNumberInLayer(input, layerIx, 2);
};

const getColorForPixel = (input: number[], y: number, x: number) => {
  for (let pixelIx = y * WIDTH + x; pixelIx < input.length; pixelIx += LAYER_LENGTH) {
    const pixel = input[pixelIx];
    if (pixel !== 2) {
      return pixel === 0 ? " " : "X";
    }
  }
};

const renderImage = (image: number[][]) => image.map(line => line.join("")).join("\n");

const calcPart2 = (input: number[]) => {
  const image = [...Array(HEIGHT)].map(() => [...Array(WIDTH)]);
  for (let y = 0; y < image.length; y++) {
    const line = image[y];
    for (let x = 0; x < line.length; x++) {
      image[y][x] = getColorForPixel(input, y, x);
    }
  }
  return renderImage(image);
};

export default async (..._args: any) => {
  const input = [...readFileAsString(join("inputs", "day-08-input.txt"))].map(strToNum);

  console.log(`Part 1: The result is: ${calcPart1(input)}`); // 828 is correct
  console.log("Part 2: The result is:");
  console.log(calcPart2(input));
};
