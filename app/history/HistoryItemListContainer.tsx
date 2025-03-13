import { HistoryItemList } from "./HistoryItemList";
import {
  PhoneArrowDownLeftIcon,
  PhoneArrowUpRightIcon,
  PhoneIcon,
  PhoneXMarkIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/solid";
import type { HistoryItem, HistoryItemType } from "../types/history";

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
  const typeName =
    type === "CALL" ? "Anruf" : type === "VOICEMAIL" ? "Voicemail" : "Fax";
  const directionName =
    direction === "INCOMING"
      ? "Eingehend"
      : direction === "OUTGOING"
      ? "Ausgehend"
      : "Verpasst";
  const typeLabel =
    typeName + " " + directionName + (isArchive ? " (Archiv)" : "");
  const typeIcon =
    type === "CALL" ? (
      direction === "INCOMING" ? (
        <PhoneArrowDownLeftIcon
          width={24}
          height={24}
          className="text-green-500"
        />
      ) : direction === "OUTGOING" ? (
        <PhoneArrowUpRightIcon
          width={24}
          height={24}
          className="text-blue-500"
        />
      ) : (
        <PhoneXMarkIcon width={24} height={24} className="text-red-500" />
      )
    ) : type === "VOICEMAIL" ? (
      <SpeakerWaveIcon width={24} height={24} className="text-blue-500" />
    ) : (
      <PhoneIcon width={24} height={24} className="text-green-500" />
    );
  return (
    <div
      className={`p-4 ${
        isArchive ? "bg-yellow-100 dark:bg-amber-900" : undefined
      }  grid gap-2 auto-rows-max max-h-full overflow-y-auto border-1 border-gray-400 rounded-md shadow-md bg-white dark:bg-gray-800 ${className}`}
    >
      <h2 className="text-xl font-bold flex items-center gap-2">
        {typeIcon}
        {typeLabel}
      </h2>
      <div className="flex flex-col text-xs">
        <HistoryItemList items={items} />
      </div>
    </div>
  );
}
