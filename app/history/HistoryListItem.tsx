import { ArchiveBoxXMarkIcon, CheckIcon } from "@heroicons/react/16/solid";
import { ArchiveBoxArrowDownIcon } from "@heroicons/react/24/solid";
import type { HistoryItem } from "~/types/history";
import type { HistoryItemUpdateProps } from "~/utils/api";

type HistoryListItemProps = {
  item: HistoryItem;
  isPending: boolean;
  handleUpdateHistoryItem: (updateProps: HistoryItemUpdateProps) => void;
};

export const HistoryListItem = ({
  item,
  isPending,
  handleUpdateHistoryItem,
}: HistoryListItemProps) => {
  const isItemFromToday = (item: HistoryItem) => {
    const today = new Date();
    const itemDate = new Date(item.created);
    return (
      today.getDate() === itemDate.getDate() &&
      today.getMonth() === itemDate.getMonth() &&
      today.getFullYear() === itemDate.getFullYear()
    );
  };

  const displayDate = new Date(item.created).toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const displayDuration = item.duration
    ? `${Math.floor(item.duration / 60)}:${String(item.duration % 60).padStart(
        2,
        "0"
      )}`
    : null;
  const displaySource = item.source
    ? item.source + (item.sourceAlias ? ` (${item.sourceAlias})` : "")
    : null;
  const displayTarget = item.target
    ? item.target + (item.targetAlias ? ` (${item.targetAlias})` : "")
    : null;

  return (
    <div
      key={item.id}
      className={`grid grid-cols-1 lg:grid-cols-3 p-2 border-b font-mono border-gray-400 gap-1 bg-white dark:bg-gray-700 hover:bg-green-50 dark:hover:bg-green-900 h-full ${
        isPending ? "animate-pulse bg-yellow-100 dark:bg-yellow-700" : ""
      }`}
    >
      <div className="flex flex-col">
        <span className={`${isItemFromToday(item) ? "font-bold" : ""} `}>
          <CheckIcon
            title={item.read === true ? "Gelesen" : "Ungelesen"}
            aria-label={item.read === true ? "Gelesen" : "Ungelesen"}
            className={`h-5 w-5 inline mr-2 ${
              item.read === true ? "text-green-600" : "text-gray-300"
            }`}
          />
          {displayDate}
          {item.duration && (
            <span className="text-xs text-gray-500 dark:text-gray-100 ml-2 lg:col-span-2">
              ({displayDuration} Min.)
            </span>
          )}
        </span>
      </div>
      <div className="flex flex-col">
        {(item.direction === "INCOMING" ||
          item.direction === "MISSED_INCOMING") && <span>{displaySource}</span>}
        {item.direction === "OUTGOING" && <span>{displayTarget}</span>}
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

      {item.type === "VOICEMAIL" && item.recordingUrl && (
        <>
          <audio
            controls
            className="lg:col-span-3 w-full"
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
            <div className="text-xs text-gray-500 dark:text-gray-100 ml-2 lg:col-span-2">
              Transkription: {item.transcription}
            </div>
          )}
        </>
      )}
      <span className="text-xs text-gray-500 dark:text-gray-100 ml-2 lg:col-span-3">
        Notiz:{" "}
        <input
          type="text"
          className="border border-gray-300 dark:border-gray-600 rounded-md p-1 text-xs w-full"
          defaultValue={item.note || ""}
          onBlur={(e) => {
            handleUpdateHistoryItem({
              id: item.id,
              note: e.target.value,
            });
          }}
        />
      </span>
    </div>
  );
};
