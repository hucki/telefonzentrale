export const Spinner = ({ size }: { size: "sm" | "l" }) => {
  const spinnerSize = size === "l" ? "h-32 w-32" : "h-4 w-4";
  return (
    <div className="flex items-center justify-center h-full">
      <div
        className={`animate-spin rounded-full ${spinnerSize} border-b-2 border-blue-500`}
      ></div>
    </div>
  );
};

export const SpinnerOverlay = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800 bg-opacity-10 z-50">
      <Spinner size="l" />
    </div>
  );
};
