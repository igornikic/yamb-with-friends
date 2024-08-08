import { SuggestionContext } from "../types/suggestionContext";

const pokerSuggestion = (context: SuggestionContext): void => {
  const { counts, emptyIndexI, emptyIndexJ, suggestedMoves } = context;

  let pokerSum: number = 0;

  for (const [number, count] of Object.entries(counts)) {
    const num: number = Number(number);
    if (count === 4) {
      pokerSum = num * 4 + 40;
    }
  }

  suggestedMoves[emptyIndexI][emptyIndexJ] = pokerSum;
};

export default pokerSuggestion;
