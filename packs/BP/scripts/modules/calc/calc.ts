
/**
 * Add together a sequence of numbers
 * @param numbers The numbers to add together
 * @returns The summation
 */
export function sum(...numbers: number[]): number {
  let start = 0;
  numbers.forEach((number) => {
    start += number;
  });
  return start;
}

/**
 * Get the average of a set of numbers
 * @param numbers The numbers to the get the average of
 * @returns The average
 */
export function avg(...numbers: number[]): number {
  return sum(...numbers) / numbers.length;
}

export function degToRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function radToDeg(radians: number): number {
  return radians * (180 / Math.PI);
}
