import type { JSX } from "react";
import {
  DocumentCheckIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/16/solid";
import type { FaxHistoryItem } from "../types/history";
import { DownloadButton } from "~/components/buttons";
import { ResendFaxButton } from "~/components/resendFaxButton";
import { ArchiveButton } from "~/components/archiveButton";
import { useHistoryItemUpdate } from "~/hooks/useHistoryItemUpdate";
import { Avatar } from "~/components/avatar";
import {
  getIsIncoming,
  getRoutingTargetName,
  getTargetColor,
  getTargetName,
  isItemFromToday,
} from "~/utils/history";

type FaxStatusType = "FAILED" | "SENT" | "SENDING" | "PENDING";
type FaxStatusItem = {
  text: string;
  color: string;
  icon: JSX.Element;
  ariaLabel: string;
};

type FaxStatus = {
  [key in FaxStatusType]: FaxStatusItem;
};

const faxStatus: FaxStatus = {
  FAILED: {
    text: "fehlgeschlagen",
    color:
      "text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-700",
    ariaLabel: "Fax-Versendung fehlgeschlagen",
    icon: (
      <ExclamationTriangleIcon
        className="h-3 w-3 text-red-600 dark:text-red-400"
        aria-hidden="true"
      />
    ),
  },
  SENT: {
    text: "gesendet",
    color:
      "text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-700",
    ariaLabel: "Fax erfolgreich gesendet",
    icon: (
      <DocumentCheckIcon
        className="h-3 w-3 text-green-600 dark:text-green-400"
        aria-hidden="true"
      />
    ),
  },
  SENDING: {
    text: "wird gesendet",
    color:
      "text-orange-600 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-900/20 dark:border-orange-700",
    ariaLabel: "Fax wird gerade gesendet",
    icon: (
      <PaperAirplaneIcon
        className="h-3 w-3 text-orange-600 dark:text-orange-400"
        aria-hidden="true"
      />
    ),
  },
  PENDING: {
    text: "wartet",
    color:
      "text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-700",
    ariaLabel: "Fax wartet auf Versendung",
    icon: (
      <ExclamationCircleIcon
        className="h-3 w-3 text-blue-600 dark:text-blue-400"
        aria-hidden="true"
      />
    ),
  },
};

const FaxContactInfo = ({
  item,
  showDirection = false,
}: {
  item: FaxHistoryItem;
  showDirection?: boolean;
}) => {
  const isIncoming = getIsIncoming(item.direction);
  const contactNumber = isIncoming ? item.source : item.target;
  const contactName = isIncoming ? item.sourceAlias : item.targetAlias;

  const itemTargetName = getTargetName(item.target);

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          {isIncoming ? "Von" : "An"}
        </span>
        {showDirection && (
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              isIncoming
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
            }`}
          >
            {isIncoming ? "Eingehend" : "Ausgehend"}
          </span>
        )}
      </div>

      {contactName && (
        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {contactName}
        </div>
      )}

      <div className="text-sm font-mono text-gray-600 dark:text-gray-400">
        {contactNumber}
      </div>
    </div>
  );
};

const FaxStatusBadge = ({
  faxStatusType,
  size = "sm",
}: {
  faxStatusType: FaxStatusType | undefined;
  size?: "xs" | "sm" | "md";
}) => {
  if (!faxStatusType) return null;

  const status = faxStatus[faxStatusType];

  const sizeClasses = {
    xs: "px-2 py-0.5 text-xs gap-1",
    sm: "px-2.5 py-1 text-sm gap-1.5",
    md: "px-3 py-1 text-sm gap-2",
  };

  return (
    <div
      className={`inline-flex items-center rounded-full border font-medium ${status.color} ${sizeClasses[size]}`}
      role="status"
      aria-label={status.ariaLabel}
    >
      {status.icon}
      <span>{status.text}</span>
    </div>
  );
};

const FaxActions = ({ item }: { item: FaxHistoryItem }) => {
  const faxStatusType = item.faxStatusType as FaxStatusType | undefined;
  const isOutgoing = item.direction === "OUTGOING";
  const isIncoming = item.direction === "INCOMING";

  return (
    <div className="flex flex-col gap-2">
      {/* Incoming fax actions */}
      {isIncoming && item.documentUrl && (
        <DownloadButton
          href={item.documentUrl}
          label="FAX herunterladen"
          aria-label={`Eingehendes Fax von ${
            item.sourceAlias || item.source
          } herunterladen`}
        />
      )}

      {/* Outgoing fax actions */}
      {isOutgoing && (
        <div className="space-y-2">
          {item.documentUrl && (
            <DownloadButton
              href={item.documentUrl}
              label="FAX herunterladen"
              aria-label={`Gesendetes Fax an ${
                item.targetAlias || item.target
              } herunterladen`}
            />
          )}

          {item.reportUrl && (
            <DownloadButton
              href={item.reportUrl}
              label="Sendebericht"
              aria-label={`Sendebericht für Fax an ${
                item.targetAlias || item.target
              } herunterladen`}
            />
          )}
          {faxStatusType === "FAILED" && item.id && (
            <ResendFaxButton faxId={item.id} />
          )}
        </div>
      )}
    </div>
  );
};

export const FaxHistoryItemList = ({
  items,
  showDirection = false,
}: {
  items: FaxHistoryItem[];
  showDirection?: boolean;
}) => {
  const { updateHistoryItem, updatingItemIds } = useHistoryItemUpdate();

  if (!items || items.length === 0) {
    return (
      <div
        className="text-center py-8 text-gray-500 dark:text-gray-400"
        role="status"
        aria-live="polite"
      >
        Keine Fax-Einträge vorhanden
      </div>
    );
  }

  return (
    <div className="space-y-2" role="list" aria-label="Fax-Verlauf">
      {items.map((item) => {
        const faxStatusType = item.faxStatusType as FaxStatusType | undefined;
        const isIncoming = getIsIncoming(item.direction);
        const isToday = isItemFromToday(item);
        const itemTargetName = getTargetName(item.target);
        const targetName =
          itemTargetName || getRoutingTargetName(item.endpoints);
        const targetColor = getTargetColor(targetName);
        const isPending = updatingItemIds.includes(item.id);
        const formattedDate = new Date(item.lastModified).toLocaleString(
          "de-DE",
          {
            dateStyle: "short",
            timeStyle: "short",
          },
        );

        return (
          <article
            key={item.id}
            className={`
              p-4 rounded-lg border transition-colors duration-200
              bg-white dark:bg-gray-800
              border-gray-200 dark:border-gray-700
              hover:bg-gray-50 dark:hover:bg-gray-700
              focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2
              dark:focus-within:ring-offset-gray-800
            `}
            role="listitem"
            aria-labelledby={`fax-${item.id}-title`}
          >
            {/* Header with date and status */}
            <header className="flex items-start justify-between mb-3">
              <div className="space-y-1 px-2 py-0.5 rounded-full flex gap-2">
                {isIncoming && (
                  <Avatar
                    name={targetName}
                    color={targetColor}
                    size="sm"
                    className="shrink-0"
                  />
                )}
                <time
                  className={`text-sm px-2 py-0.5 rounded-full ${
                    isToday
                      ? "font-bold bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                  dateTime={item.lastModified}
                >
                  {formattedDate}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <FaxStatusBadge faxStatusType={faxStatusType} size="xs" />
                {/* Archive/Unarchive button */}
                <div className="flex justify-end">
                  <ArchiveButton
                    isArchived={item.archived}
                    onToggleArchive={(archived) => {
                      updateHistoryItem({
                        id: item.id,
                        archived,
                        starred: item.starred,
                        read: item.read,
                      });
                    }}
                    disabled={isPending}
                  />
                </div>
              </div>
            </header>

            {/* Main content area */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-start">
              {/* Contact information */}
              <div id={`fax-${item.id}-title`}>
                <FaxContactInfo item={item} showDirection={showDirection} />
              </div>

              {/* Actions */}
              <div className="md:justify-self-end">
                <FaxActions item={item} />
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};
