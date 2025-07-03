import type { Route } from "./+types/history";
import { fetchHistoryWrapper } from "../utils/api";
import { useLoaderData } from "react-router";
import HistoryItemListContainer from "~/history/HistoryItemListContainer";
import { sortDescending } from "~/utils/sortItems";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Anrufliste" },
    { name: "description", content: "Telefonzentrale Anrufliste" },
  ];
}

export const loader = async () => {
  const callsIncoming = await fetchHistoryWrapper({
    type: "CALL",
    direction: "INCOMING",
    archived: false,
  });
  const callsMissed = await fetchHistoryWrapper({
    type: "CALL",
    direction: "MISSED_INCOMING",
    archived: false,
  });
  const callsOutgoing = await fetchHistoryWrapper({
    type: "CALL",
    direction: "OUTGOING",
    archived: false,
  });

  // Use json helper to return properly formatted response for Remix
  return {
    callsIncoming,
    callsOutgoing,
    callsMissed,
  };
};

export default function History() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="h-full p-4 bg-gray-50 dark:bg-gray-900">
      <div className="bg-white grid grid-cols-3 gap-2 dark:bg-gray-800 h-full rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-2 overflow-y-auto">
        <HistoryItemListContainer
          items={data.callsMissed.items.sort(sortDescending)}
          isArchive={false}
          type="CALL"
          direction="MISSED_INCOMING"
        />
        <HistoryItemListContainer
          items={data.callsIncoming.items.sort(sortDescending)}
          isArchive={false}
          type="CALL"
          direction="INCOMING"
        />
        <HistoryItemListContainer
          items={data.callsOutgoing.items.sort(sortDescending)}
          isArchive={false}
          type="CALL"
          direction="OUTGOING"
        />
      </div>
    </div>
  );
}
