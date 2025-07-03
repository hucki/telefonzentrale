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

type FaxStatusType = "FAILED" | "SENT" | "SENDING" | "PENDING";
type FaxStatusItem = {
  text: string;
  color: string;
  icon: JSX.Element;
};
type FaxStatus = {
  [key in FaxStatusType]: FaxStatusItem;
};
const faxStatus: FaxStatus = {
  FAILED: {
    text: " fehlgeschlagen",
    color: "text-red-500",
    icon: (
      <ExclamationTriangleIcon
        className="h-4 w-4 text-red-500"
        aria-hidden="true"
      />
    ),
  },
  SENT: {
    text: " gesendet",
    color: "text-green-500",
    icon: (
      <DocumentCheckIcon
        className="h-4 w-4 text-green-500"
        aria-hidden="true"
      />
    ),
  },
  SENDING: {
    text: " wird gesendet",
    color: "text-orange-500",
    icon: (
      <PaperAirplaneIcon
        className="h-4 w-4 text-orange-500"
        aria-hidden="true"
      />
    ),
  },
  PENDING: {
    text: " wartet",
    color: "text-blue-500",
    icon: (
      <ExclamationCircleIcon
        className="h-4 w-4 text-blue-500"
        aria-hidden="true"
      />
    ),
  },
};

export const FaxHistoryItemList = ({ items }: { items: FaxHistoryItem[] }) => {
  return items.map((item) => {
    const faxStatusType = item.faxStatusType as FaxStatusType | undefined;
    const faxStatusText = faxStatusType ? faxStatus[faxStatusType].text : "";
    const faxStatusColor = faxStatusType ? faxStatus[faxStatusType].color : "";
    const faxStatusIcon = faxStatusType ? faxStatus[faxStatusType].icon : null;
    const isItemFromToday = (item: FaxHistoryItem) => {
      const today = new Date();
      const itemDate = new Date(item.lastModified);
      return (
        today.getDate() === itemDate.getDate() &&
        today.getMonth() === itemDate.getMonth() &&
        today.getFullYear() === itemDate.getFullYear()
      );
    };
    // {item.targetAlias} - {item.target}
    const ItemLabel = () =>
      item.direction === "INCOMING" ? (
        <>
          <pre>{item.source}</pre> {item.sourceAlias}
        </>
      ) : (
        <>
          <pre>{item.target}</pre> {item.targetAlias}
        </>
      );
    return (
      <div
        key={item.id}
        className="grid grid-cols-3 p-2 border-b border-gray-400 gap-1 bg-white dark:bg-gray-700 hover:bg-green-50 dark:hover:bg-green-900"
      >
        <div className="flex flex-col">
          <span
            className={`${isItemFromToday(item) ? "font-bold" : ""} font-mono`}
          >
            {new Date(item.lastModified).toLocaleString("de-DE")}
          </span>
          <span
            className={`font-bold grid grid-cols-[1fr_3fr] items-center ${faxStatusColor}`}
          >
            {faxStatusIcon}
            {faxStatusText}
          </span>
          {faxStatusType === "FAILED" && item.id && (
            <ResendFaxButton faxId={item.id} />
          )}
        </div>
        <div className="flex flex-col">
          <ItemLabel />
        </div>

        {item.direction === "INCOMING" && item.documentUrl && (
          <DownloadButton href={item.documentUrl} label="FAX" />
        )}
        {item.direction === "OUTGOING" && (
          <span className="grid items-center gap-0.5">
            {item.documentUrl && (
              <DownloadButton href={item.documentUrl} label="FAX" />
            )}
            {item.reportUrl && (
              <DownloadButton href={item.reportUrl} label="Sende-Bericht" />
            )}
          </span>
        )}
      </div>
    );
  });
};
