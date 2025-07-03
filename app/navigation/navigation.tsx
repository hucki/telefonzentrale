import {
  ArchiveBoxIcon,
  DocumentIcon,
  PhoneIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/16/solid";
import {
  PhoneIcon as PhoneOutlineIcon,
  SpeakerWaveIcon as SpeakerOutlineIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { Link } from "./link";
import { Logo } from "../components/logo";

export const Navigation = () => {
  return (
    <div className="flex flex-col p-2 h-full bg-slate-300 dark:bg-gray-700">
      <div className="flex flex-col mt-4">
        <div className="flex flex-col items-center mb-2">
          <Logo size={42} />
        </div>
        <span className="text-slate-900 dark:text-white text-sm font-bold font-mono text-center text-nowrap justify-center">
          Menu
        </span>

        {/* Main navigation items */}
        <div className="space-y-1">
          <Link
            to="/fax"
            className="flex items-center py-2 px-2 rounded text-sm hover:bg-slate-400 dark:hover:bg-gray-600 transition-colors"
          >
            <DocumentTextIcon className="h-6 w-6 text-green-600 dark:text-green-400 mr-2" />
            <span className="hidden md:block text-slate-700 dark:text-gray-300">
              Faxe(n)
            </span>
          </Link>

          <Link
            to="/voicemail"
            className="flex items-center py-2 px-2 rounded text-sm hover:bg-slate-400 dark:hover:bg-gray-600 transition-colors"
          >
            <SpeakerOutlineIcon className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-2" />
            <span className="hidden md:block text-slate-700 dark:text-gray-300">
              Voicemails
            </span>
          </Link>

          <Link
            to="/history"
            className="flex items-center py-2 px-2 rounded text-sm hover:bg-slate-400 dark:hover:bg-gray-600 transition-colors"
          >
            <PhoneOutlineIcon className="h-6 w-6 text-green-600 dark:text-green-400 mr-2" />
            <span className="hidden md:block text-slate-700 dark:text-gray-300">
              Anrufe
            </span>
          </Link>
        </div>

        {/* Archive section */}
        <div className="mt-2 pt-2 border-t border-slate-400 dark:border-gray-600">
          <div className="flex items-center mb-2">
            <ArchiveBoxIcon className="h-5 w-5 text-slate-600 dark:text-gray-400 mr-2" />
            <span className="text-slate-700 dark:text-gray-300 text-xs font-semibold hidden md:block">
              Archiv
            </span>
          </div>

          {/* Archive sub-navigation */}
          <div className="ml-1 space-y-1">
            <Link
              to="/archive/calls"
              className="flex items-center py-2 px-2 rounded text-sm hover:bg-slate-400 dark:hover:bg-gray-600 transition-colors"
            >
              <PhoneOutlineIcon className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
              <span className="hidden md:block text-slate-700 dark:text-gray-300">
                Anrufe
              </span>
            </Link>

            <Link
              to="/archive/voicemails"
              className="flex items-center py-2 px-2 rounded text-sm hover:bg-slate-400 dark:hover:bg-gray-600 transition-colors"
            >
              <SpeakerOutlineIcon className="h-4 w-4 text-purple-600 dark:text-purple-400 mr-2" />
              <span className="hidden md:block text-slate-700 dark:text-gray-300">
                Voicemails
              </span>
            </Link>

            <Link
              to="/archive/fax"
              className="flex items-center py-2 px-2 rounded text-sm hover:bg-slate-400 dark:hover:bg-gray-600 transition-colors"
            >
              <DocumentTextIcon className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
              <span className="hidden md:block text-slate-700 dark:text-gray-300">
                Faxe
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
