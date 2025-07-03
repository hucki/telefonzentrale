import { fetchHistoryWrapper } from "../utils/api";
import { useLoaderData } from "react-router";
import { HistoryView } from "../history/HistoryView";
import HistoryItemListContainer from "~/history/HistoryItemListContainer";
import { sortDescending } from "~/utils/sortItems";

export function meta() {
  return [
    { title: "Anrufe Archiv" },
    { name: "description", content: "Archivierte Anrufe" },
  ];
}

export const loader = async () => {
  const callsIncoming = await fetchHistoryWrapper({
    type: "CALL",
    direction: "INCOMING",
    archived: true,
  });
  const callsMissed = await fetchHistoryWrapper({
    type: "CALL",
    direction: "MISSED_INCOMING",
    archived: true,
  });
  const callsOutgoing = await fetchHistoryWrapper({
    type: "CALL",
    direction: "OUTGOING",
    archived: true,
  });

  return {
    callsIncoming,
    callsOutgoing,
    callsMissed,
    voicemails: { items: [] }, // Empty voicemails for HistoryView compatibility
  };
};

export default function CallsArchive() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="h-full p-4 bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 h-full rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-2 overflow-y-auto">
        <HistoryItemListContainer
          items={data.callsMissed.items.sort(sortDescending)}
          isArchive={true}
          type="CALL"
          direction="MISSED_INCOMING"
          className="md:row-span-2"
        />
        <HistoryItemListContainer
          items={data.callsIncoming.items.sort(sortDescending)}
          isArchive={true}
          type="CALL"
          direction="INCOMING"
        />
        <HistoryItemListContainer
          items={data.callsOutgoing.items.sort(sortDescending)}
          isArchive={true}
          type="CALL"
          direction="OUTGOING"
        />
      </div>
    </div>
  );
}
