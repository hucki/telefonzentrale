import { CheckIcon } from "@heroicons/react/16/solid";
import type { HistoryItem } from "~/types/history";
import type { HistoryItemUpdateProps } from "~/utils/api";
import { ArchiveButton } from "~/components/archiveButton";
import { Avatar } from "~/components/avatar";
import {
  getIsIncoming,
  getTargetColor,
  getTargetName,
  isItemFromToday,
} from "~/utils/history";

const getDisplayDate = (created: string) =>
  new Date(created).toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const getDisplayDuration = (duration: number) =>
  `${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, "0")}`;

const getDisplaySource = (source: string, sourceAlias?: string) =>
  source + (sourceAlias ? ` (${sourceAlias})` : "");

const getDisplayTarget = (target: string, targetAlias?: string) =>
  target + (targetAlias ? ` (${targetAlias})` : "");
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
  const isToday = isItemFromToday(item);
  const isIncoming = getIsIncoming(item.direction);

  const displayDuration = item.duration
    ? getDisplayDuration(item.duration)
    : null;
  const displaySource = item.source
    ? getDisplaySource(item.source, item.sourceAlias)
    : null;
  const displayTarget = item.target
    ? getDisplayTarget(item.target, item.targetAlias)
    : null;

  return (
    <article
      className={`
        p-3 rounded-lg border transition-colors duration-200
        bg-white dark:bg-gray-800
        border-gray-200 dark:border-gray-700
        hover:bg-gray-50 dark:hover:bg-gray-700
        focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2
        dark:focus-within:ring-offset-gray-800
        ${isPending ? "opacity-75 animate-pulse" : ""}
      `}
      role="listitem"
      aria-labelledby={`history-${item.id}-title`}
    >
      {/* Header with timestamp and read status */}
      <header className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <CheckIcon
            title={item.read === true ? "Gelesen" : "Ungelesen"}
            aria-label={item.read === true ? "Gelesen" : "Ungelesen"}
            className={`h-4 w-4 shrink-0 ${
              item.read === true
                ? "text-green-600 dark:text-green-400"
                : "text-gray-300 dark:text-gray-600"
            }`}
          />
          <time
            className={`text-xs font-mono px-2 py-0.5 rounded-full ${
              isToday
                ? "font-bold text-blue-900 dark:text-blue-100 bg-blue-200  dark:bg-blue-700"
                : "text-gray-600 dark:text-gray-400"
            }`}
            dateTime={item.created}
            id={`history-${item.id}-title`}
          >
            {getDisplayDate(item.created)}
          </time>
        </div>
        {/* Archive/Unarchive button */}
        <div className="shrink-0">
          <ArchiveButton
            isArchived={item.archived}
            onToggleArchive={(archived) => {
              handleUpdateHistoryItem({
                id: item.id,
                archived,
                starred: item.starred,
                read: item.read,
              });
            }}
            disabled={isPending}
          />
        </div>
      </header>

      {/* Main content area */}
      <div className="space-y-2">
        {/* Contact information and duration */}
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono text-gray-900 dark:text-gray-100 flex items-center justify-between gap-2">
            {isIncoming && (
              <>
                <Avatar
                  name={getTargetName(item.target)}
                  color={getTargetColor(getTargetName(item.target))}
                  size="sm"
                  className="shrink-0"
                />
                {displaySource}
              </>
            )}
            {!isIncoming && displayTarget}
          </div>

          {displayDuration && (
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              {displayDuration} Min.
            </span>
          )}
        </div>

        {/* Voicemail specific content */}
        {item.type === "VOICEMAIL" && item.recordingUrl && (
          <div className="space-y-2">
            <audio
              controls
              className="w-full h-8"
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
              <div className="text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-2 rounded border-l-2 border-blue-200 dark:border-blue-700">
                <span className="font-medium">Transkription:</span>{" "}
                {item.transcription}
              </div>
            )}
          </div>
        )}

        {/* Notes section */}
        <div className="space-y-1">
          <label
            htmlFor={`note-${item.id}`}
            className="block text-xs font-medium text-gray-500 dark:text-gray-400"
          >
            Notiz:
          </label>
          <input
            id={`note-${item.id}`}
            type="text"
            className="w-full text-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400"
            defaultValue={item.note || ""}
            placeholder="Notiz hinzufügen..."
            onBlur={(e) => {
              handleUpdateHistoryItem({
                id: item.id,
                note: e.target.value,
              });
            }}
          />
        </div>
      </div>
    </article>
  );
};
