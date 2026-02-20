import { useRef } from "react";
import HistoryItemListContainer from "~/history/HistoryItemListContainer";
import type { HistoryPanelId } from "~/types/history";
import { sortDescending } from "~/utils/sortItems";

export const HistoryPageLayout = ({
  isArchive,
  data,
}: {
  isArchive: boolean;
  data: { callsIncoming: any; callsOutgoing: any; callsMissed: any };
}) => {
  const closeFnsRef = useRef<Map<HistoryPanelId, () => void>>(new Map());

  const registerClose = (panelId: HistoryPanelId, closeFn: () => void) => {
    closeFnsRef.current.set(panelId, closeFn);
  };

  const closeOthers = (openedPanelId: HistoryPanelId) => {
    closeFnsRef.current.forEach((closeFn, panelId) => {
      if (panelId !== openedPanelId) {
        closeFn();
      }
    });
  };

  return (
    <div className="h-full p-4 bg-gray-50 dark:bg-gray-900">
      <div className="bg-white flex flex-col gap-2 dark:bg-gray-800 h-full rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-2 overflow-hidden">
        <HistoryItemListContainer
          items={data.callsMissed.items.sort(sortDescending)}
          isArchive={isArchive}
          type="CALL"
          direction="MISSED_INCOMING"
          panelId="missed"
          defaultOpen
          onRegisterClose={registerClose}
          onOpen={closeOthers}
        />
        <HistoryItemListContainer
          items={data.callsIncoming.items.sort(sortDescending)}
          isArchive={isArchive}
          type="CALL"
          direction="INCOMING"
          panelId="incoming"
          onRegisterClose={registerClose}
          onOpen={closeOthers}
        />
        <HistoryItemListContainer
          items={data.callsOutgoing.items.sort(sortDescending)}
          isArchive={isArchive}
          type="CALL"
          direction="OUTGOING"
          panelId="outgoing"
          onRegisterClose={registerClose}
          onOpen={closeOthers}
        />
      </div>
    </div>
  );
};
