import { HistoryItemList } from "./HistoryItemList";
import type { HistoryItem, HistoryItemType } from "../types/history";
import { getTypeConfig } from "../utils/typeConfig";

interface HistoryItemListContainerProps {
  items: HistoryItem[];
  isArchive: boolean;
  type: HistoryItemType;
  direction: "INCOMING" | "OUTGOING" | "MISSED_INCOMING";
  className?: string;
}

export default function HistoryItemListContainer({
  type,
  direction,
  items,
  isArchive,
  className,
}: HistoryItemListContainerProps) {
  const config = getTypeConfig(type, direction);

  const directionName =
    direction === "INCOMING"
      ? "Eingehend"
      : direction === "OUTGOING"
        ? "Ausgehend"
        : "Verpasst";

  const typeLabel = `${config.name} ${directionName}${
    isArchive ? " (Archiv)" : ""
  }`;
  const itemCount = items.length;

  return (
    <section
      className={`
        rounded-lg border transition-colors duration-200
        ${
          isArchive
            ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700"
            : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
        }
        shadow-sm hover:shadow-md
        flex flex-col
        ${className}
      `}
      aria-labelledby={`${type}-${direction}-heading`}
    >
      {/* Header */}
      <header
        className={`
        px-4 py-3 border-b
        ${
          isArchive
            ? "border-amber-200 dark:border-amber-700 bg-amber-100/50 dark:bg-amber-900/30"
            : `${config.bgColor} ${config.borderColor}`
        }
        rounded-t-lg
      `}
      >
        <div className="flex items-center justify-between">
          <h2
            id={`${type}-${direction}-heading`}
            className={`
              text-lg font-semibold flex items-center gap-3
              ${isArchive ? "text-amber-800 dark:text-amber-200" : config.color}
            `}
          >
            <span
              className={`
              inline-flex items-center justify-center w-8 h-8 rounded-full
              ${
                isArchive
                  ? "bg-amber-200 dark:bg-amber-800"
                  : "bg-white dark:bg-gray-800 shadow-sm"
              }
            `}
            >
              {config.icon}
            </span>
            <span>{typeLabel}</span>
          </h2>

          {itemCount > 0 && (
            <span
              className={`
                inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                ${
                  isArchive
                    ? "bg-amber-200 text-amber-800 dark:bg-amber-800 dark:text-amber-200"
                    : `${config.bgColor} ${config.color} border ${config.borderColor}`
                }
              `}
              aria-label={`${itemCount} Einträge`}
            >
              {itemCount}
            </span>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {items.length === 0 ? (
          <div
            className="p-6 text-center text-gray-500 dark:text-gray-400"
            role="status"
            aria-live="polite"
          >
            Keine {config.name.toLowerCase()}-Einträge vorhanden
          </div>
        ) : (
          <div className="p-4 overflow-y-auto max-h-full">
            <HistoryItemList items={items} />
          </div>
        )}
      </div>
    </section>
  );
}
