import type { Route } from "./+types/history";
import { fetchHistoryWrapper } from "../utils/api";
import { useLoaderData } from "react-router";
import { HistoryView } from "../history/HistoryView";

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
    <div className="flex md:h-full">
      <div className="bg-slate-100 dark:bg-slate-700 h-full">
        <HistoryView
          callsIncoming={data.callsIncoming}
          callsMissed={data.callsMissed}
          callsOutgoing={data.callsOutgoing}
          isArchive={false}
        />
      </div>
    </div>
  );
}
