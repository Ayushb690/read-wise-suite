import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { StaffSidebar } from "@/components/StaffSidebar";
import { StudentSidebar } from "@/components/StudentSidebar";
import { useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const role = user?.role;

  const SidebarComponent = role === "admin" ? AppSidebar : role === "staff" ? StaffSidebar : StudentSidebar;
  const portalLabel = role === "admin" ? "Admin Portal" : role === "staff" ? "Staff Portal" : "Student Portal";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <SidebarComponent />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b bg-card px-4 sticky top-0 z-10">
            <SidebarTrigger className="mr-4" />
            <h2 className="text-sm font-medium text-muted-foreground flex-1">{portalLabel} — E-Library</h2>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden sm:inline">{user?.name}</span>
              <Button variant="ghost" size="sm" onClick={logout} className="gap-1.5">
                <LogOut className="w-4 h-4" /> Sign Out
              </Button>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
