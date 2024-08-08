import { SuggestionContext } from "../types/suggestionContext";

const minMaxSuggestion = (context: SuggestionContext): void => {
  const { sumOfDiceValues, emptyIndexI, emptyIndexJ, suggestedMoves } = context;

  suggestedMoves[emptyIndexI][emptyIndexJ] = sumOfDiceValues;
};

export default minMaxSuggestion;
