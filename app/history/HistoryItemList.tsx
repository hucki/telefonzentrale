import {
  ArchiveBoxIcon,
  ArchiveBoxXMarkIcon,
  DocumentCheckIcon,
  StarIcon,
} from "@heroicons/react/16/solid";
import type { HistoryItem } from "../types/history";
import { putHistoryItemData, type HistoryItemUpdateProps } from "~/utils/api";
import { ArchiveBoxArrowDownIcon } from "@heroicons/react/24/solid";
import { useRevalidator } from "react-router";
import { useState } from "react";

export const HistoryItemList = ({ items }: { items: HistoryItem[] }) => {
  const { revalidate, state: revalidationState } = useRevalidator();
  const [isUpdating, setIsUpdating] = useState(false);
  const isPending = isUpdating || revalidationState !== "idle";
  const isItemFromToday = (item: HistoryItem) => {
    const today = new Date();
    const itemDate = new Date(item.lastModified);
    return (
      today.getDate() === itemDate.getDate() &&
      today.getMonth() === itemDate.getMonth() &&
      today.getFullYear() === itemDate.getFullYear()
    );
  };

  const handleUpdateHistoryItem = async ({
    id,
    note,
    archived,
    starred,
    read,
  }: HistoryItemUpdateProps) => {
    // Find the item in the array
    const item = items.find((item) => item.id === id);
    if (!item) return;

    const hasChanged =
      item.note !== note ||
      item.archived !== archived ||
      item.starred !== starred ||
      item.read !== read;
    if (!hasChanged) {
      console.log("Item has not changed, no update needed.");
      return;
    }
    console.log("Update item:", id, { note, archived, starred, read });
    setIsUpdating(true);

    const isUpdateNote =
      item.note !== note && note !== null && note !== undefined;

    try {
      if (isUpdateNote) {
        // update Note currently yields an HTTP 500 error
        await putHistoryItemData({
          id: id,
          note: note,
        });
      } else {
        await putHistoryItemData({
          id: id,
          archived: Boolean(archived),
          starred: Boolean(starred),
          read: Boolean(read),
        });
      }
      console.log("Item updated successfully");
      // Revalidate the route data after successful update
      revalidate();
    } catch (error) {
      console.error("Error updating item:", error);
    }
    setIsUpdating(false);
  };

  return items.map((item) => (
    <div
      key={item.id}
      className="grid grid-cols-3 p-2 border-b font-mono border-gray-400 gap-1 bg-white dark:bg-gray-700 hover:bg-green-50 dark:hover:bg-green-900 h-full"
    >
      <div className="flex flex-col">
        <span className={`${isItemFromToday(item) ? "font-bold" : ""} `}>
          {new Date(item.lastModified).toLocaleString("de-DE")}
        </span>
      </div>

      <div className="flex flex-col">
        {(item.direction === "INCOMING" ||
          item.direction === "MISSED_INCOMING") && (
          <span>
            {item.source} {item.sourceAlias ? "(" + item.sourceAlias + ")" : ""}
          </span>
        )}
        {item.direction === "OUTGOING" && (
          <span>
            {item.targetAlias} - {item.target}
          </span>
        )}
      </div>
      {!item.archived && (
        <ArchiveBoxArrowDownIcon
          className="h-6 w-6 text-orange-600 cursor-pointer justify-self-end"
          onClick={() => {
            handleUpdateHistoryItem({
              id: item.id,
              archived: true,
              starred: item.starred,
              read: item.read,
            });
          }}
        />
      )}
      {item.archived && (
        <ArchiveBoxXMarkIcon
          className="h-6 w-6 text-orange-600 cursor-pointer justify-self-end"
          onClick={() => {
            handleUpdateHistoryItem({
              id: item.id,
              archived: false,
              starred: item.starred,
              read: item.read,
            });
          }}
        />
      )}
      <span className="text-xs text-gray-500 dark:text-gray-100 ml-2 col-span-3">
        Notiz:{" "}
        <input
          type="text"
          className="border border-gray-300 dark:border-gray-600 rounded-md p-1 text-xs"
          defaultValue={item.note || ""}
          onBlur={(e) => {
            handleUpdateHistoryItem({
              id: item.id,
              note: e.target.value,
            });
          }}
        />
      </span>
      {item.type === "VOICEMAIL" && item.recordingUrl && (
        <>
          <audio
            controls
            className="col-span-3 w-full"
            preload="none"
            onPlay={() => {
              handleUpdateHistoryItem({
                id: item.id,
                archived: item.archived,
                starred: item.starred,
                read: true,
              });
            }}
          >
            <track kind="captions" />
            <source src={item.recordingUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
          {item.transcription && (
            <div className="text-xs text-gray-500 dark:text-gray-100 ml-2 col-span-2">
              Transkription: {item.transcription}
            </div>
          )}
        </>
      )}

      <div className="flex items-center">
        <DocumentCheckIcon
          title={item.read === true ? "Gelesen" : "Ungelesen"}
          aria-label={item.read === true ? "Gelesen" : "Ungelesen"}
          className={`h-5 w-5 ${
            item.read === true ? "text-green-600" : "text-gray-500"
          }`}
        />

        <ArchiveBoxIcon
          title={item.archived === true ? "Archiviert" : "Nicht archiviert"}
          aria-label={
            item.archived === true ? "Archiviert" : "Nicht archiviert"
          }
          className={`h-5 w-5 ${
            item.archived === true ? "text-amber-800" : "text-gray-500"
          }`}
        />
        <StarIcon
          title={item.starred === true ? "Favorit" : "Nicht Favorit"}
          aria-label={item.starred === true ? "Favorit" : "Nicht Favorit"}
          className={`h-5 w-5 ${
            item.starred === true ? "text-yellow-400" : "text-gray-500"
          }`}
        />
      </div>
    </div>
  ));
};
