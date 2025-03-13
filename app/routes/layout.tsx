import { Outlet, useNavigation } from "react-router";
import { Navigation } from "../navigation/navigation";

export default function Layout() {
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);
  return (
    <div className="flex flex-row h-screen">
      <aside className="flex flex-col w-32 md:w-40 bg-slate-300 dark:bg-slate-800">
        <Navigation />
      </aside>
      <main className="w-full">
        {isNavigating && (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          </div>
        )}
        {!isNavigating && <Outlet />}
      </main>
    </div>
  );
}
