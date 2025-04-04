import type { HistoryItem } from "../types/history";

export const sortDescending = (a: HistoryItem, b: HistoryItem) =>
  new Date(b.created).getTime() - new Date(a.created).getTime();
