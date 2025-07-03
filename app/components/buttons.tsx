import { ArrowDownTrayIcon } from "@heroicons/react/16/solid";
import { Spinner } from "./spinner";

interface ButtonProps {
  label: string;
}

export const Button = ({ label }: ButtonProps) => {
  return (
    <button className="bg-green-500 text-white rounded-md p-1">{label}</button>
  );
};

interface DeleteButtonProps {
  handleDelete: () => void;
  className?: string;
}

export const DeleteButton = ({
  handleDelete,
  className,
}: DeleteButtonProps) => {
  return (
    <button
      aria-label="reset"
      onClick={handleDelete}
      className={`m-1 cursor-pointer bg-red-500 text-white text-base font-sans rounded-md h-6 w-6 text-center justify-center ${className}`}
    >
      ⊖
    </button>
  );
};

interface ToggleButtonProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export const ToggleButton = ({ label, value, onChange }: ToggleButtonProps) => {
  return (
    <SimpleButton onClick={() => onChange(!value)} label={label} color="gray" />
  );
};

export interface DownloadButtonProps {
  href: string;
  label: string;
  className?: string;
}

export const DownloadButton = ({
  href,
  label,
  className = "",
}: DownloadButtonProps) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`px-2 py-1 text-xs rounded flex items-center gap-1 bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 transition-colors ${className} max-w-fit max-h-fit`}
    >
      <ArrowDownTrayIcon width={14} /> {label}
    </a>
  );
};

type SimpleButtonColor = "orange" | "green" | "gray";

type SimpleButtonProps = {
  label: string;
  pending?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg" | "xs";
  color?: SimpleButtonColor;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const SimpleButton = ({
  label,
  className,
  pending = false,
  size = "md",
  color = "orange",
  ...props
}: SimpleButtonProps) => {
  const sizeClasses = {
    xs: "px-2 py-1 text-xs",
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };
  const colorClasses = {
    orange: "bg-orange-500 hover:bg-orange-600",
    green: "bg-green-500 hover:bg-green-600",
    gray: "bg-gray-500 hover:bg-gray-600",
  };

  return (
    <button
      disabled={pending}
      className={`${sizeClasses[size]} ${
        colorClasses[color]
      } text-white rounded-md transition-colors cursor-pointer ${className} ${
        pending ? "opacity-50 cursor-not-allowed" : ""
      }`}
      {...props}
    >
      {pending ? <Spinner size="sm" /> : null}
      {label}
    </button>
  );
};
