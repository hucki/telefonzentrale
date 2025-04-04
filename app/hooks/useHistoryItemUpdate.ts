import { useCallback, useEffect, useState } from "react";
import { useFetcher } from "react-router";
import type { HistoryItemUpdateProps } from "~/utils/api";

export function useHistoryItemUpdate() {
  const fetcher = useFetcher();
  const [updatingItemIds, setUpdatingItemIds] = useState<string[]>([]);

  // Update tracking of which items are being updated
  useEffect(() => {
    // If fetch is idle and we have a success result, remove the item from updating state
    if (fetcher.state === "idle" && fetcher.data?.success && fetcher.data?.id) {
      setUpdatingItemIds((prev) => prev.filter((id) => id !== fetcher.data.id));
    }
  }, [fetcher.state, fetcher.data]);

  const updateHistoryItem = useCallback(
    ({ id, note, archived, starred, read }: HistoryItemUpdateProps) => {
      // Add this item to our updating state
      setUpdatingItemIds((prev) => {
        if (!prev.includes(id)) {
          return [...prev, id];
        }
        return prev;
      });

      const formData = new FormData();
      formData.append("id", id);

      // Determine if this is a note update or other attributes update
      if (note !== undefined) {
        // For note updates, only include the note
        formData.append("note", note || "");
      } else {
        // For attribute updates, only include the specified attributes
        if (archived !== undefined) {
          formData.append("archived", String(archived));
        }

        if (starred !== undefined) {
          formData.append("starred", String(starred));
        }

        if (read !== undefined) {
          formData.append("read", String(read));
        }
      }

      // Submit the form
      fetcher.submit(formData, {
        method: "post",
        action: "/api/history-update",
      });
    },
    [fetcher]
  );

  return {
    updateHistoryItem,
    updatingItemIds,
    isUpdating: fetcher.state !== "idle",
    result: fetcher.data,
  };
}
