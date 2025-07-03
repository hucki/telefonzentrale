import { fetchHistoryWrapper } from "../utils/api";
import { useLoaderData } from "react-router";
import { sortDescending } from "~/utils/sortItems";
import HistoryItemListContainer from "~/history/HistoryItemListContainer";

export function meta() {
  return [
    { title: "Voicemails Archiv" },
    { name: "description", content: "Archivierte Voicemails" },
  ];
}

export const loader = async () => {
  const voicemails = await fetchHistoryWrapper({
    type: "VOICEMAIL",
    direction: "INCOMING",
    archived: true,
  });

  return {
    callsIncoming: { items: [] }, // Empty calls for HistoryView compatibility
    callsOutgoing: { items: [] },
    callsMissed: { items: [] },
    voicemails,
  };
};

export default function VoicemailsArchive() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="h-full p-4 bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 h-full rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-2 overflow-y-auto">
        <HistoryItemListContainer
          items={data.voicemails.items.sort(sortDescending)}
          isArchive={true}
          type="VOICEMAIL"
          direction="INCOMING"
          className="md:row-span-2"
        />
      </div>
    </div>
  );
}
