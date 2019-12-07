import { readFileIntoStringArray, join } from "./lib/utils";

type DT = Map<string, string[]>;

const isLeafNode = (data: DT, node: string): boolean => [...data.keys()].filter(k => k === node).length === 0;
const getParentNode = (data: DT, node: string): string | undefined => {
  const parent = [...data.entries()].filter(([_, nodes]) => nodes.includes(node));
  return parent.length > 0 ? parent[0][0] : undefined;
};
const getParentNodes = (data: DT, node: string): string[] => {
  const result: string[] = [];
  let parent = getParentNode(data, node);
  while (parent) {
    result.push(parent);
    parent = getParentNode(data, parent);
  }
  return result;
};
const listNodes = (data: DT): string[] => [...new Set([...data.entries()].flatMap(x => [x[0], ...x[1]])).values()];
const getLeafNodes = (data: DT): string[] => listNodes(data).filter(n => isLeafNode(data, n));

const countOrbits = (data: DT): number => {
  const nodes = getLeafNodes(data);
  const orbits = new Set<string>();
  nodes.forEach(node => {
    let startNode: string | undefined = node;
    while (startNode) {
      let p = getParentNode(data, startNode);
      while (p) {
        orbits.add(`${startNode}.${p}`);
        p = getParentNode(data, p);
      }
      startNode = getParentNode(data, startNode);
    }
  });
  return [...orbits.keys()].length;
};

const minimumTransfersBetweenNodes = (data: DT, node1: string, node2: string): number => {
  const node1Parents = getParentNodes(data, node1);
  const node2Parents = getParentNodes(data, node2);
  const commonParents = new Set<string>(
    [...node1Parents, ...node2Parents].filter(node => node1Parents.includes(node) && node2Parents.includes(node))
  );
  return (
    node1Parents.filter(node => !commonParents.has(node)).length +
    node2Parents.filter(node => !commonParents.has(node)).length
  );
};

export default async (..._args: any) => {
  const data: DT = readFileIntoStringArray(join(__dirname, "inputs", "day-06-input.txt"))
    .map(s => s.split(")"))
    .reduce(
      (result: DT, [key, value]) => result.set(key, result.has(key) ? [...result.get(key)!, value] : [value]),
      new Map<string, string[]>()
    );

  console.log(`Part 1: Total number of orbits is: ${countOrbits(data)}`);
  console.log(
    `Part 2: Minimum number of orbital transfers to Santa's orbit: ${minimumTransfersBetweenNodes(data, "YOU", "SAN")}`
  );
};
