import { SuggestionContext } from "../types/suggestionContext";

const trillingSuggestion = (context: SuggestionContext): void => {
  const { counts, emptyIndexI, emptyIndexJ, suggestedMoves } = context;

  let highestTrillingNumber: number = 0;

  for (const [number, count] of Object.entries(counts)) {
    const num: number = Number(number);
    if (count === 3) {
      if (num > highestTrillingNumber) {
        highestTrillingNumber = num;
      }
    }
  }

  const result: number =
    highestTrillingNumber > 0 ? highestTrillingNumber * 3 + 20 : 0;

  suggestedMoves[emptyIndexI][emptyIndexJ] = result;
};

export default trillingSuggestion;
