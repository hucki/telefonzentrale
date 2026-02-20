import { fetchHistoryWrapper } from "../utils/api";
import { useLoaderData } from "react-router";
import HistoryItemListContainer from "~/history/HistoryItemListContainer";
import { HistoryPageLayout } from "~/pages/HistoryPageLayout";
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
  };
};

export default function CallsArchive() {
  const data = useLoaderData<typeof loader>();

  return <HistoryPageLayout isArchive={true} data={data} />;
}
