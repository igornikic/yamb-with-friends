import { SuggestionContext } from "../types/suggestionContext";
import oneToSixSuggestion from "./oneToSixSuggestion";
import minMaxSuggestion from "./minMaxSuggestion";
import kentaSuggestion from "./kentaSuggestion";
import trillingSuggestion from "./trillingSuggestion";
import fullSuggestion from "./fullSuggestion";
import pokerSuggestion from "./pokerSuggestion";
import yambSuggestion from "./yambSuggestion";

export const suggestionsMap: {
  [key: number]: (context: SuggestionContext) => void;
} = {
  0: oneToSixSuggestion,
  1: oneToSixSuggestion,
  2: oneToSixSuggestion,
  3: oneToSixSuggestion,
  4: oneToSixSuggestion,
  5: oneToSixSuggestion,
  7: minMaxSuggestion,
  8: minMaxSuggestion,
  10: kentaSuggestion,
  11: trillingSuggestion,
  12: fullSuggestion,
  13: pokerSuggestion,
  14: yambSuggestion,
};
