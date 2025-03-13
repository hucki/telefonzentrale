import type { Route } from "./+types/archive";
import { fetchHistoryWrapper } from "../utils/api";
import { useLoaderData } from "react-router";
import { HistoryView } from "../history/HistoryView";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Archive" },
    { name: "description", content: "Telefonzentrale Archiv" },
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
  const voicemails = await fetchHistoryWrapper({
    type: "VOICEMAIL",
    direction: "INCOMING",
    archived: true,
  });

  // Use json helper to return properly formatted response for Remix
  return {
    callsIncoming,
    callsOutgoing,
    callsMissed,
    voicemails,
  };
};

export default function Arvive() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="flex md:h-full">
      <div className="bg-slate-100 dark:bg-slate-700 h-full">
        <HistoryView
          callsIncoming={data.callsIncoming}
          callsMissed={data.callsMissed}
          callsOutgoing={data.callsOutgoing}
          voicemails={data.voicemails}
          isArchive={true}
        />
      </div>
    </div>
  );
}
