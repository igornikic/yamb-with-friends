export const columnHeaders: string[] = ["ᐯ", "S", "ᐱ", "N", "R", "⇅"];
// "↕"
export const rowHeaders: string[] = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "∑",
  "MAX",
  "MIN",
  "∑",
  "K",
  "T",
  "F",
  "P",
  "Y",
  "∑",
];

export const data: (number | null)[][] = Array(16)
  .fill({ length: 16 })
  .map(() => Array(6).fill(null));
