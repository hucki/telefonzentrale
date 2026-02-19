import type { FaxHistoryItem, HistoryItem } from "~/types/history";

export const getIsIncoming = (direction: string) =>
  direction === "INCOMING" || direction === "MISSED_INCOMING";
export const getTargetName = (target: string) =>
  target.includes("492932")
    ? "Neheim"
    : target.includes("492931")
      ? "Arnsberg"
      : "Unbekannt";

export const getTargetColor = (targetName: string) =>
  targetName === "Neheim"
    ? "bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-200"
    : targetName === "Arnsberg"
      ? "bg-white text-teal-800"
      : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200";

export const isItemFromToday = (
  item: FaxHistoryItem | HistoryItem,
): boolean => {
  const today = new Date();
  const itemDate = new Date(item.lastModified);
  return (
    today.getDate() === itemDate.getDate() &&
    today.getMonth() === itemDate.getMonth() &&
    today.getFullYear() === itemDate.getFullYear()
  );
};
