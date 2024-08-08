/**
 * Returns the last empty index in a specified column.
 * @param data - 2D array of numbers or nulls.
 * @param col - Column index to search.
 * @returns The last empty index or -1 if none found.
 */
export const findLastEmptyIndex = (
  data: (number | null)[][],
  col: number
): number => {
  for (let i = data.length - 2; i >= 0; i--) {
    if (data[i][col] === null) {
      return i;
    }
  }
  return -1;
};
