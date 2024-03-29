// prettier-ignore
const masses = [
  134492, 88713, 84405, 148193, 95951, 63545, 137840, 65558, 124836, 95431, 77622, 91864, 108677, 116871,
  119496, 97172, 86115, 105704, 68613, 77114, 114013, 52766, 57048, 80814, 73888, 58253, 135934, 97409,
  112439, 98262, 116047, 57456, 124261, 83006, 101495, 133449, 111372, 56146, 87818, 92209, 149259, 124559,
  141838, 147988, 65703, 125566, 59650, 139564, 92430, 126307, 120406, 147383, 84362, 51529, 146366, 131840,
  53270, 71886, 118767, 104311, 126181, 76964, 129430, 95489, 91098, 54133, 110057, 107276, 118226, 96104,
  135382, 85152, 61697, 143417, 148879, 126846, 130205, 111170, 86687, 113729, 123330, 56976, 148470, 66028,
  129715, 75686, 74964, 148258, 72669, 88809, 78173, 92699, 124806, 67217, 139066, 136002, 135730, 145708,
  142054, 135772
];

const sum = (a: number, b: number): number => a + b;

const calculateFuelRequiredForMass = (mass: number): number => Math.floor(mass / 3.0) - 2;

const calculateTotalFuelForMass = (
  fuelMass: number,
  additionalFuel: number = calculateFuelRequiredForMass(fuelMass) // not to be actually used :-)
): number => (additionalFuel > 0 ? additionalFuel + calculateTotalFuelForMass(additionalFuel) : 0);

const calculateInitialFuelRequired = () => masses.map(calculateFuelRequiredForMass).reduce(sum, 0);

const calculateTotalFuelRequired = () => masses.map(mass => calculateTotalFuelForMass(mass)).reduce(sum, 0);

export default async (..._args: any) => {
  console.log(`Part 1: Initial fuel required: ${calculateInitialFuelRequired()}`);
  console.log(`Part 2: Total fuel required: ${calculateTotalFuelRequired()}`);
};
