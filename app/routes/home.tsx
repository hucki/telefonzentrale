import { ArrowLeftCircleIcon } from "@heroicons/react/16/solid";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Mundwerk Telefonzentrale" },
    { name: "description", content: "Hier ist die Zentrale des Telefons. ;-)" },
  ];
}

export default function Home() {
  // we want to point the users to use the left side navigation

  return (
    <div className="bg-slate-100 dark:bg-slate-700 h-full w-full pt-4">
      <h1 className="text-4xl font-bold text-center">
        Mundwerk Telefonzentrale
      </h1>
      <p className="text-lg mt-4 text-center">
        Hier ist die Zentrale des Telefons. ;-)
      </p>
      <p className="text-lg mt-4 text-center">
        <ArrowLeftCircleIcon className="h-6 w-6 text-blue-500 dark:text-blue-300 inline-block" />{" "}
        <span className="hidden md:inline">
          Bitte nutze die Navigation links, um auf die verschiedenen Bereiche
          zuzugreifen.
        </span>
      </p>
    </div>
  );
}
