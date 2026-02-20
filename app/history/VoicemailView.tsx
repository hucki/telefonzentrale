import { sortDescending } from "../utils/sortItems";
import type { HistoryItem } from "../types/history";
import HistoryItemListContainer from "./HistoryItemListContainer";

interface HistoryViewProps {
  voicemails: { items: HistoryItem[] };
  isArchive?: boolean;
}
export const VoicemailView = ({
  voicemails,
  isArchive = false,
}: HistoryViewProps) => {
  return (
    <div className="grid grid-cols-1 h-full w-full p-2 overflow-y-auto">
      <HistoryItemListContainer
        items={voicemails.items.sort(sortDescending)}
        isArchive={isArchive}
        type="VOICEMAIL"
        direction="INCOMING"
        className="md:row-span-2"
        defaultOpen={true}
        panelId="voicemail"
        onRegisterClose={() => {}}
        onOpen={() => {}}
      />
    </div>
  );
};
