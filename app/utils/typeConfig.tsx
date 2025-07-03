import {
  PhoneArrowDownLeftIcon,
  PhoneArrowUpRightIcon,
  PhoneIcon,
  PhoneXMarkIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/solid";
import type { HistoryItemType } from "../types/history";
import {
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  XMarkIcon,
} from "@heroicons/react/16/solid";

export const getTypeConfig = (
  type: HistoryItemType,
  direction: "INCOMING" | "OUTGOING" | "MISSED_INCOMING"
) => {
  const configs = {
    CALL: {
      name: "Anruf",
      INCOMING: {
        icon: <PhoneArrowDownLeftIcon className="h-5 w-5" aria-hidden="true" />,
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-50 dark:bg-green-900/20",
        borderColor: "border-green-200 dark:border-green-700",
      },
      OUTGOING: {
        icon: <PhoneArrowUpRightIcon className="h-5 w-5" aria-hidden="true" />,
        color: "text-blue-600 dark:text-blue-400",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        borderColor: "border-blue-200 dark:border-blue-700",
      },
      MISSED_INCOMING: {
        icon: <PhoneXMarkIcon className="h-5 w-5" aria-hidden="true" />,
        color: "text-red-600 dark:text-red-400",
        bgColor: "bg-red-50 dark:bg-red-900/20",
        borderColor: "border-red-200 dark:border-red-700",
      },
    },
    VOICEMAIL: {
      name: "Voicemail",
      INCOMING: {
        icon: <SpeakerWaveIcon className="h-5 w-5" aria-hidden="true" />,
        color: "text-purple-600 dark:text-purple-400",
        bgColor: "bg-purple-50 dark:bg-purple-900/20",
        borderColor: "border-purple-200 dark:border-purple-700",
      },
      OUTGOING: {
        icon: <SpeakerWaveIcon className="h-5 w-5" aria-hidden="true" />,
        color: "text-purple-600 dark:text-purple-400",
        bgColor: "bg-purple-50 dark:bg-purple-900/20",
        borderColor: "border-purple-200 dark:border-purple-700",
      },
      MISSED_INCOMING: {
        icon: <SpeakerWaveIcon className="h-5 w-5" aria-hidden="true" />,
        color: "text-purple-600 dark:text-purple-400",
        bgColor: "bg-purple-50 dark:bg-purple-900/20",
        borderColor: "border-purple-200 dark:border-purple-700",
      },
    },
    FAX: {
      name: "Fax",
      INCOMING: {
        icon: <DocumentArrowDownIcon className="h-5 w-5" aria-hidden="true" />,
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-50 dark:bg-green-900/20",
        borderColor: "border-green-200 dark:border-green-700",
      },
      OUTGOING: {
        icon: <DocumentArrowUpIcon className="h-5 w-5" aria-hidden="true" />,
        color: "text-blue-600 dark:text-blue-400",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        borderColor: "border-blue-200 dark:border-blue-700",
      },
      MISSED_INCOMING: {
        icon: <XMarkIcon className="h-5 w-5" aria-hidden="true" />,
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-50 dark:bg-green-900/20",
        borderColor: "border-green-200 dark:border-green-700",
      },
    },
    SMS: {
      name: "SMS",
      INCOMING: {
        icon: <PhoneIcon className="h-5 w-5" aria-hidden="true" />,
        color: "text-teal-600 dark:text-teal-400",
        bgColor: "bg-teal-50 dark:bg-teal-900/20",
        borderColor: "border-teal-200 dark:border-teal-700",
      },
      OUTGOING: {
        icon: <PhoneIcon className="h-5 w-5" aria-hidden="true" />,
        color: "text-teal-600 dark:text-teal-400",
        bgColor: "bg-teal-50 dark:bg-teal-900/20",
        borderColor: "border-teal-200 dark:border-teal-700",
      },
      MISSED_INCOMING: {
        icon: <PhoneIcon className="h-5 w-5" aria-hidden="true" />,
        color: "text-teal-600 dark:text-teal-400",
        bgColor: "bg-teal-50 dark:bg-teal-900/20",
        borderColor: "border-teal-200 dark:border-teal-700",
      },
    },
  } as const;

  const typeConfig = configs[type] || configs.CALL; // Fallback to CALL if type not found
  const directionConfig = typeConfig[direction] || typeConfig.INCOMING; // Fallback to INCOMING if direction not found

  return {
    ...typeConfig,
    ...directionConfig,
  };
};
