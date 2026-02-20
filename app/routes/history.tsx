import type { Route } from "./+types/history";
import { fetchHistoryWrapper } from "../utils/api";
import { useLoaderData } from "react-router";
import { HistoryPageLayout } from "~/pages/HistoryPageLayout";

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

  return <HistoryPageLayout isArchive={false} data={data} />;
}
