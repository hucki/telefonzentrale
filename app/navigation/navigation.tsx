import {
  ArchiveBoxIcon,
  DocumentIcon,
  PhoneIcon,
} from "@heroicons/react/16/solid";
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
        <Link to="/fax">
          <DocumentIcon className="h-6 w-6 text-blue-500 dark:text-blue-700" />{" "}
          Fax
        </Link>
        <Link to="/history">
          <PhoneIcon className="h-6 w-6 text-blue-500 dark:text-blue-700" />{" "}
          Anrufliste
        </Link>
        <Link to="/archive">
          <ArchiveBoxIcon className="h-6 w-6 text-blue-500 dark:text-blue-700" />{" "}
          Archiv
        </Link>
      </div>
    </div>
  );
};
