import { sortDescending } from "../utils/sortItems";
import type { HistoryItem } from "../types/history";
import HistoryItemListContainer from "./HistoryItemListContainer";

interface HistoryViewProps {
  callsIncoming: { items: HistoryItem[] };
  callsMissed: { items: HistoryItem[] };
  callsOutgoing: { items: HistoryItem[] };
  voicemails?: { items: HistoryItem[] };
  isArchive?: boolean;
}
export const HistoryView = ({
  callsIncoming,
  callsMissed,
  callsOutgoing,
  voicemails,
  isArchive = false,
}: HistoryViewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 h-full p-2 overflow-y-auto">
      {voicemails && (
        <HistoryItemListContainer
          items={voicemails.items.sort(sortDescending)}
          isArchive={isArchive}
          type="VOICEMAIL"
          direction="INCOMING"
          className="md:row-span-2"
        />
      )}
      <HistoryItemListContainer
        items={callsMissed.items.sort(sortDescending)}
        isArchive={isArchive}
        type="CALL"
        direction="MISSED_INCOMING"
        className="md:row-span-2"
      />
      <HistoryItemListContainer
        items={callsIncoming.items.sort(sortDescending)}
        isArchive={isArchive}
        type="CALL"
        direction="INCOMING"
      />
      <HistoryItemListContainer
        items={callsOutgoing.items.sort(sortDescending)}
        isArchive={isArchive}
        type="CALL"
        direction="OUTGOING"
      />
    </div>
  );
};
