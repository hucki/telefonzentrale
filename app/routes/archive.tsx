import type { Route } from "./+types/archive";
import { Outlet, useLocation } from "react-router";
import { Link } from "../navigation/link";
import {
  PhoneIcon,
  SpeakerWaveIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { getTypeConfig } from "../utils/typeConfig";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Archive" },
    { name: "description", content: "Telefonzentrale Archiv" },
  ];
}

export default function Archive() {
  const location = useLocation();

  // Define the archive sections
  const archiveSections = [
    {
      path: "/archive/calls",
      label: "Anrufe",
      type: "CALL" as const,
      description: "Eingehende, ausgehende und verpasste Anrufe",
      icon: <PhoneIcon className="h-5 w-5" />,
    },
    {
      path: "/archive/voicemails",
      label: "Voicemails",
      type: "VOICEMAIL" as const,
      description: "Gespeicherte Sprachnachrichten",
      icon: <SpeakerWaveIcon className="h-5 w-5" />,
    },
    {
      path: "/archive/fax",
      label: "Fax",
      type: "FAX" as const,
      description: "Gesendete und empfangene Faxe",
      icon: <DocumentTextIcon className="h-5 w-5" />,
    },
  ];

  // Check if we're on the main archive page (no sub-route)
  const isMainArchivePage =
    location.pathname === "/archive" || location.pathname === "/archive/";

  if (isMainArchivePage) {
    return (
      <div className="p-6 h-full bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Archiv
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Wählen Sie einen Bereich, um archivierte Einträge anzuzeigen
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {archiveSections.map((section) => {
              const config = getTypeConfig(section.type, "INCOMING");

              return (
                <Link
                  key={section.path}
                  to={section.path}
                  className={`
                    group relative overflow-hidden rounded-lg border transition-all duration-200
                    hover:shadow-lg hover:scale-105 focus:ring-2 focus:ring-offset-2
                    ${config.bgColor} ${config.borderColor}
                    hover:shadow-${
                      section.type === "CALL"
                        ? "green"
                        : section.type === "VOICEMAIL"
                        ? "purple"
                        : "green"
                    }-500/20
                    focus:ring-${
                      section.type === "CALL"
                        ? "green"
                        : section.type === "VOICEMAIL"
                        ? "purple"
                        : "green"
                    }-500
                  `}
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div
                        className={`
                          p-3 rounded-full
                          ${config.color}
                          bg-white dark:bg-gray-800 shadow-sm
                          group-hover:scale-110 transition-transform duration-200
                        `}
                      >
                        {section.icon}
                      </div>
                      <h2
                        className={`
                          ml-4 text-xl font-semibold
                          ${config.color}
                        `}
                      >
                        {section.label}
                      </h2>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {section.description}
                    </p>

                    <div className="mt-4 flex items-center text-sm font-medium">
                      <span className={config.color}>Archiv anzeigen</span>
                      <svg
                        className={`ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 ${config.color}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Info zum Archiv
                </h3>
                <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                  Im Archiv werden alle älteren Kommunikationseinträge
                  gespeichert. Sie können diese nach Typ gefiltert einsehen und
                  bei Bedarf wieder aktivieren.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render the sub-route content
  return (
    <div className="h-full">
      <Outlet />
    </div>
  );
}
