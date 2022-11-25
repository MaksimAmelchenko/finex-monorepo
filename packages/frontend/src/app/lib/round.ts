export function round(value: number, precision = 2): number {
  return Number(`${Math.round(Number(`${value}e${precision}`))}e-${precision}`);
}
