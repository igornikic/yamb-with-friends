import { findFirstEmptyIndex } from "../utils/findFirstEmptyIndex";
import { findLastEmptyIndex } from "../utils/findLastEmptyIndex";
import { SuggestionContext } from "../types/suggestionContext";
import { suggestionsMap } from "../suggestions/suggestionMapping";

export const data: (number | null)[][] = Array.from({ length: 16 }, () =>
  Array(6).fill(null)
);

export const suggestMove = (
  diceValues: number[],
  data: (number | null)[][],
  countRoll: number,
  clickedCell: [number | null, number | null]
): (number | null)[][] => {
  let suggestedMoves: (number | null)[][] = Array.from({ length: 16 }, () =>
    Array(6).fill(null)
  );
  const counts: Record<number, number> = {};

  // Count occurrences of each dice value
  diceValues.forEach((value) => {
    if (value !== null) {
      counts[value] = (counts[value] || 0) + 1;
    }
  });

  // Calculate the sum of all dice values
  const sumOfDiceValues: number = diceValues.reduce(
    (sum, value) => sum + (value || 0),
    0
  );

  // Suggestion context object
  const context: SuggestionContext = {
    counts,
    diceValues,
    sumOfDiceValues,
    emptyIndexI: -1,
    emptyIndexJ: -1,
    suggestedMoves,
    countRoll,
  };

  // col 0,2,5 suggestions
  const colPairs = [
    { col: 0, emptyIndexI: findFirstEmptyIndex(data, 0) },
    { col: 2, emptyIndexI: findLastEmptyIndex(data, 2) },
    { col: 5, emptyIndexI: findFirstEmptyIndex(data, 5) },
    { col: 5, emptyIndexI: findLastEmptyIndex(data, 5) },
  ];

  colPairs.forEach(({ col, emptyIndexI }) => {
    if (emptyIndexI !== -1) {
      context.emptyIndexI = emptyIndexI;
      context.emptyIndexJ = col;
      const suggestionFunction = suggestionsMap[context.emptyIndexI];
      if (suggestionFunction) {
        suggestionFunction(context);
      }
    }
  });

  // col 1,3,4 suggestions
  [1, 3, 4].forEach((col) => {
    for (let row = 0; row < 16; row++) {
      if (row === 6 || row === 9 || row === 15) {
        continue;
      }
      context.emptyIndexI = row;
      context.emptyIndexJ = col;
      const suggestionFunction = suggestionsMap[row];
      if (suggestionFunction) {
        suggestionFunction(context);
      }
    }
  });

  // If countRoll is not 1, remove suggestions for the 3rd and 4th column
  if (countRoll !== 1) {
    for (let i = 0; i < suggestedMoves.length; i++) {
      // If cell is announced, don't remove suggestion for it
      if (clickedCell[0] === i && clickedCell[1] === 3) {
        suggestedMoves[i][4] = null;
        continue;
      }
      suggestedMoves[i][3] = null;
      suggestedMoves[i][4] = null;
    }
  }

  return suggestedMoves;
};
