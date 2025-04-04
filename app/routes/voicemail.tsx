import type { Route } from "./+types/voicemail";
import { fetchHistoryWrapper } from "../utils/api";
import { Link, useLoaderData } from "react-router";
import { VoicemailView } from "../history/VoicemailView";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Voicemail" },
    { name: "description", content: "Telefonzentrale Voicemail" },
  ];
}

export const loader = async () => {
  const voicemails = await fetchHistoryWrapper({
    type: "VOICEMAIL",
    direction: "INCOMING",
    archived: false,
  });
  // Use json helper to return properly formatted response for Remix
  return {
    voicemails,
  };
};

export default function Voicemail() {
  const data = useLoaderData<typeof loader>();
  const noVoicemails = data.voicemails.items.length === 0;
  if (noVoicemails) {
    return (
      <div className="bg-slate-100 dark:bg-slate-700 h-full w-full">
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Keine Voicemails vorhanden</p>
          <Link
            to="/archive"
            className="text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-500 ml-2"
          >
            Archiv anzeigen
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-slate-100 dark:bg-slate-700 h-full w-full">
      {noVoicemails ? (
        <>
          <p className="text-gray-500">Keine neuen Voicemails vorhanden</p>
          <Link
            to="/archive"
            className="text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-500 ml-2"
          >
            Archiv anzeigen
          </Link>
        </>
      ) : (
        <VoicemailView voicemails={data.voicemails} isArchive={false} />
      )}
    </div>
  );
}
