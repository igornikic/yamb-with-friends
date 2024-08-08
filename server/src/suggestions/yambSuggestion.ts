import { SuggestionContext } from "../types/suggestionContext";

const yambSuggestion = (context: SuggestionContext): void => {
  const { counts, emptyIndexI, emptyIndexJ, suggestedMoves } = context;

  let yambSum: number = 0;

  for (const [number, count] of Object.entries(counts)) {
    const num: number = Number(number);
    if (count === 5) {
      yambSum = num * 5 + 50;
    }
  }

  suggestedMoves[emptyIndexI][emptyIndexJ] = yambSum;
};

export default yambSuggestion;
