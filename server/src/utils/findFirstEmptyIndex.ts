/**
 * Returns the first empty index in a specified column.
 * @param data - 2D array of numbers or nulls.
 * @param col - Column index to search.
 * @returns The first empty index or -1 if none found.
 */
export const findFirstEmptyIndex = (
  data: (number | null)[][],
  col: number
): number => {
  for (let i = 0; i < data.length; i++) {
    if (data[i][col] === null) {
      return i;
    }
  }
  return -1;
};
