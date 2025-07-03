import { useRouteLoaderData } from "react-router";
import type { LoaderResult } from "../routes/fax";
import type { FaxHistoryItem } from "../types/history";
import { FaxHistoryItemList } from "./FaxHistoryItemList";
import { getTypeConfig } from "../utils/typeConfig";

export default function FaxHistoryView() {
  const loaderData = useRouteLoaderData<LoaderResult>("routes/fax");
  const historyItems = loaderData?.faxHistory
    ? (loaderData?.faxHistory as unknown as FaxHistoryItem[])
    : [];

  if (!historyItems?.length) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        Keine Fax-Einträge vorhanden
      </div>
    );
  }

  const outgoingItems = historyItems.filter(
    (item) => item.direction === "OUTGOING"
  );
  const incomingItems = historyItems.filter(
    (item) => item.direction === "INCOMING"
  );

  const outgoingConfig = getTypeConfig("FAX", "OUTGOING");
  const incomingConfig = getTypeConfig("FAX", "INCOMING");

  const renderSection = (
    items: FaxHistoryItem[],
    config: ReturnType<typeof getTypeConfig>,
    title: string
  ) => (
    <section className="h-1/2 overflow-hidden flex flex-col">
      {/* Header */}
      <header
        className={`
          px-4 py-3 border-b rounded-t-lg
          ${config.bgColor} ${config.borderColor}
        `}
      >
        <h2
          className={`
            text-lg font-semibold flex items-center gap-3
            ${config.color}
          `}
        >
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-sm">
            {config.icon}
          </span>
          <span>{title}</span>
          {items.length > 0 && (
            <span
              className={`
                inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ml-auto
                ${config.bgColor} ${config.color} border ${config.borderColor}
              `}
              aria-label={`${items.length} Einträge`}
            >
              {items.length}
            </span>
          )}
        </h2>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-hidden bg-white dark:bg-gray-800 border border-t-0 border-gray-200 dark:border-gray-700 rounded-b-lg">
        {items.length === 0 ? (
          <div
            className="p-6 text-center text-gray-500 dark:text-gray-400"
            role="status"
            aria-live="polite"
          >
            Keine {title.toLowerCase()}-Einträge vorhanden
          </div>
        ) : (
          <div className="h-full overflow-y-auto text-xs p-4">
            <FaxHistoryItemList items={items} showDirection={false} />
          </div>
        )}
      </div>
    </section>
  );

  return (
    <div className="p-4 flex flex-col h-full overflow-hidden gap-4">
      {renderSection(outgoingItems, outgoingConfig, "Fax Ausgang")}
      {renderSection(incomingItems, incomingConfig, "Fax Eingang")}
    </div>
  );
}
