export interface SuggestionContext {
  counts: Record<number, number>;
  diceValues: number[];
  sumOfDiceValues: number;
  emptyIndexI: number;
  emptyIndexJ: number;
  suggestedMoves: (number | null)[][];
  countRoll: number;
}
