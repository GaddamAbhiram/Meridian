import { getCurrentUserFromCookieStore } from "@/lib/session";
import Sidebar from "@/components/Sidebar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUserFromCookieStore();
  return (
    <div className="app-shell">
      <Sidebar user={user ? { id: user.id, name: user.name, role: user.role } : null} />
      <main className="app-main">{children}</main>
    </div>
  );
}
