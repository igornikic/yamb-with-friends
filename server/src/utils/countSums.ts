/**
 * Calculate sum
 * @param data - 2D array of numbers or nulls.
 * @param emptyIndexI - Row index of the empty cell.
 * @param emptyIndexJ - Column index of the empty cell.
 * @returns Calculated sum
 */
export const countSums = (
  data: (number | null)[][],
  emptyIndexI: number,
  emptyIndexJ: number
): number => {
  let sum = 0;
  if (emptyIndexI === 6) {
    let i = 0;
    while (i < 6) {
      sum += data[i][emptyIndexJ] as number;
      i++;
    }
    if (sum >= 60) sum += 30;
  }

  if (emptyIndexI === 9) {
    const max = data[7][emptyIndexJ] as number;
    const min = data[8][emptyIndexJ] as number;
    const oneCount = data[0][emptyIndexJ] as number;

    sum = (max - min) * oneCount;
  }

  if (emptyIndexI === 15) {
    for (let i = 10; i < 15; i++) sum += data[i][emptyIndexJ] as number;
  }
  return sum;
};
