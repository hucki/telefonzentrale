import { Outlet, useNavigation } from "react-router";
import { Navigation } from "../navigation/navigation";
import { Spinner, SpinnerOverlay } from "~/components/spinner";

export default function Layout() {
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);
  return (
    <div className="flex flex-row h-screen">
      <aside className="flex flex-col w-16 md:w-40 bg-slate-300 dark:bg-slate-800">
        <Navigation />
      </aside>
      <main className="w-full">
        {isNavigating ? <Spinner size="l" /> : <Outlet />}
      </main>
    </div>
  );
}
