import {
  ArchiveBoxXMarkIcon,
  ArchiveBoxArrowDownIcon,
} from "@heroicons/react/24/solid";

interface ArchiveButtonProps {
  isArchived: boolean;
  onToggleArchive: (archived: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const ArchiveButton = ({
  isArchived,
  onToggleArchive,
  disabled = false,
  className = "",
}: ArchiveButtonProps) => {
  const handleClick = () => {
    onToggleArchive(!isArchived);
  };

  if (!isArchived) {
    return (
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`
          p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
        aria-label="Element archivieren"
        title="Archivieren"
      >
        <ArchiveBoxArrowDownIcon className="h-4 w-4 text-orange-600 dark:text-orange-400" />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      aria-label="Element aus Archiv entfernen"
      title="Aus Archiv entfernen"
    >
      <ArchiveBoxXMarkIcon className="h-4 w-4 text-orange-600 dark:text-orange-400" />
    </button>
  );
};
