import { SuggestionContext } from "../types/suggestionContext";

const oneToSixSuggestion = (context: SuggestionContext): void => {
  const { counts, emptyIndexI, emptyIndexJ, suggestedMoves } = context;

  if (!counts[emptyIndexI + 1]) {
    suggestedMoves[emptyIndexI][emptyIndexJ] = 0;
  } else {
    suggestedMoves[emptyIndexI][emptyIndexJ] =
      (emptyIndexI + 1) * counts[emptyIndexI + 1];
  }
};

export default oneToSixSuggestion;
