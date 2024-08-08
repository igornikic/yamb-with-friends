import { SuggestionContext } from "../types/suggestionContext";

const kentaSuggestion = (context: SuggestionContext): void => {
  const { diceValues, countRoll, emptyIndexI, emptyIndexJ, suggestedMoves } =
    context;
  // Convert diceValues to Set for faster lookup
  const diceSet = new Set(diceValues);

  // Check for sequence 1-5
  const isKenta1to5 = [1, 2, 3, 4, 5].every((num) => diceSet.has(num));

  // Check for sequence 2-6
  const isKenta2to6 = [2, 3, 4, 5, 6].every((num) => diceSet.has(num));

  const resultsMap: { [key: number]: number } = {
    1: 66,
    2: 56,
    3: 46,
  };

  let result: number = 0;
  if (isKenta1to5 || isKenta2to6) {
    result = resultsMap[countRoll] || 0;
  }

  suggestedMoves[emptyIndexI][emptyIndexJ] = result;
};

export default kentaSuggestion;
