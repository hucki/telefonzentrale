export const Avatar = ({
  name,
  size = "md",
  className = "",
  color = "bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
}: {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  color?: string;
}) => {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const sizeClasses =
    size === "sm"
      ? "w-6 h-6 text-xs"
      : size === "lg"
        ? "w-12 h-12 text-lg"
        : "w-8 h-8 text-sm";

  return (
    <article
      className={`flex items-center justify-center rounded-full ${color} font-bold ${sizeClasses} ${className} overflow-hidden`}
      aria-label={`Avatar von ${name}`}
    >
      {initials === "A" ? (
        <img
          src="/Arnsberg_RGB.webp"
          alt="Arnsberg"
          className="w-full h-full object-cover"
        />
      ) : (
        initials
      )}
    </article>
  );
};
