import { fetchHistoryWrapper } from "../utils/api";
import { useLoaderData } from "react-router";
import FaxHistoryView from "../history/FaxHistoryView";

export function meta() {
  return [
    { title: "Fax Archiv" },
    { name: "description", content: "Archivierte Faxe" },
  ];
}

export const loader = async () => {
  const faxIncoming = await fetchHistoryWrapper({
    type: "FAX",
    direction: "INCOMING",
    archived: true,
  });

  const faxOutgoing = await fetchHistoryWrapper({
    type: "FAX",
    direction: "OUTGOING",
    archived: true,
  });

  // Combine incoming and outgoing fax items, matching the format expected by FaxHistoryView
  const faxHistory = [...faxIncoming.items, ...faxOutgoing.items];

  return {
    faxHistory,
  };
};

export default function FaxArchive() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="h-full p-4 bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 h-full rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-2 overflow-y-auto">
        <FaxHistoryView historyItems={data.faxHistory} />
      </div>
    </div>
  );
}
