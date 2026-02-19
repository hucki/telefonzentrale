import type { HistoryItem } from "../types/history";
import type { HistoryItemUpdateProps } from "../utils/api";
import { useRevalidator } from "react-router";
import { useHistoryItemUpdate } from "~/hooks/useHistoryItemUpdate";
import { useEffect, useState } from "react";
import { HistoryListItem } from "./HistoryListItem";

export const HistoryItemList = ({ items }: { items: HistoryItem[] }) => {
  const { state: revalidationState } = useRevalidator();
  const { updateHistoryItem, isUpdating } = useHistoryItemUpdate();
  const [lastUpdatedItemId, setLastUpdatedItemId] = useState<string | null>(
    null,
  );
  const isPending = isUpdating || revalidationState !== "idle";

  // Separate handlers for different types of updates
  const handleNoteUpdate = (id: string, note: string) => {
    const item = items.find((item) => item.id === id);
    if (!item || item.note === note) return;

    console.log("Update note for item:", id, note);

    // Only update the note
    updateHistoryItem({ id, note });
  };

  const handleAttributeUpdate = (
    id: string,
    attributes: {
      archived?: boolean;
      starred?: boolean;
      read?: boolean;
    },
  ) => {
    const item = items.find((item) => item.id === id);
    if (!item) return;

    const hasChanged =
      (attributes.archived !== undefined &&
        item.archived !== attributes.archived) ||
      (attributes.starred !== undefined &&
        item.starred !== attributes.starred) ||
      (attributes.read !== undefined && item.read !== attributes.read);

    if (!hasChanged) {
      console.log("Attributes have not changed, no update needed.");
      return;
    }

    console.log("Update attributes for item:", id, attributes);

    // Only update the attributes (no note)
    updateHistoryItem({
      id,
      ...attributes,
    });
  };

  // This function can delegate to the specific handlers
  const handleUpdateHistoryItem = ({
    id,
    note,
    archived,
    starred,
    read,
  }: HistoryItemUpdateProps) => {
    setLastUpdatedItemId(id);
    // If note is being updated, use the note-specific handler
    if (note !== undefined && note !== null) {
      handleNoteUpdate(id, note);
    }
    // Otherwise use the attributes handler
    else {
      handleAttributeUpdate(id, { archived, starred, read });
    }
  };
  useEffect(() => {
    if (!isPending) {
      setLastUpdatedItemId(null);
    }
  }, [isPending]);

  return (
    <div className="space-y-2" role="list" aria-label="Anruf-Verlauf">
      {items.map((item) => (
        <HistoryListItem
          key={item.id}
          item={item}
          isPending={lastUpdatedItemId === item.id && isPending}
          handleUpdateHistoryItem={handleUpdateHistoryItem}
        />
      ))}
    </div>
  );
};
