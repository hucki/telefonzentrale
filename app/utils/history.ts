import type {
  FaxHistoryItem,
  HistoryItem,
  HistoryItemEndpoint,
} from "~/types/history";

export const getIsIncoming = (direction: string) =>
  direction === "INCOMING" || direction === "MISSED_INCOMING";

export const extensionNames = {
  g0: "Arnsberg",
  g1: "Therapie",
  g2: "Unbekannt",
  g3: "Neheim",
};

export const getRoutingTargetName = (endpoints: HistoryItemEndpoint[]) => {
  if (!endpoints.some((endpoint) => endpoint.type === "ROUTED")) {
    return "Unbekannt";
  }
  return (
    endpoints
      .filter((endpoint) => endpoint.type === "ROUTED")
      .map((endpoint) => {
        return (
          extensionNames[
            endpoint.endpoint.extension as keyof typeof extensionNames
          ] || "Unbekannt"
        );
      })[0] || "Unbekannt"
  );
};

export const getTargetName = (target: string) =>
  target.includes("492932")
    ? "Neheim"
    : target.includes("492931")
      ? "Arnsberg"
      : undefined;

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
