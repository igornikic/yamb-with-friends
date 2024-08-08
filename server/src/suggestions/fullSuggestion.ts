import { SuggestionContext } from "../types/suggestionContext";

const fullSuggestion = (context: SuggestionContext): void => {
  const { counts, emptyIndexI, emptyIndexJ, suggestedMoves } = context;

  let threeSame: number = 0;
  let threeSame2: number = 0;
  let threePairsCount: number = 0;
  let twoSame: number = 0;

  for (const [number, count] of Object.entries(counts)) {
    const num: number = Number(number);
    if (count === 3) {
      if (num > threeSame) {
        threeSame2 = threeSame;
        threeSame = num;
        threePairsCount++;
      }
    }

    if (count === 2) {
      twoSame = num;
    }
  }

  let result: number;
  if (threePairsCount === 2)
    result = threeSame > 0 ? threeSame * 3 + threeSame2 * 2 + 30 : 0;
  else result = threeSame > 0 ? threeSame * 3 + twoSame * 2 + 30 : 0;

  suggestedMoves[emptyIndexI][emptyIndexJ] = result;
};

export default fullSuggestion;
