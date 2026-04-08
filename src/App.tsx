import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import { useAuthStore } from "@/lib/auth-store";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import BooksPage from "./pages/BooksPage";
import SearchPage from "./pages/SearchPage";
import MembersPage from "./pages/MembersPage";
import TransactionsPage from "./pages/TransactionsPage";
import PurchasesPage from "./pages/PurchasesPage";
import ReportsPage from "./pages/ReportsPage";
import StudentDashboard from "./pages/StudentDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AuthenticatedApp() {
  const role = useAuthStore((s) => s.user?.role);

  if (role === "student") {
    return (
      <Layout>
        <Routes>
          <Route path="/" element={<StudentDashboard />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    );
  }

  if (role === "staff") {
    return (
      <Layout>
        <Routes>
          <Route path="/" element={<StaffDashboard />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    );
  }

  // Admin/librarian — full access
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/members" element={<MembersPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/purchases" element={<PurchasesPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

const App = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {isAuthenticated ? <AuthenticatedApp /> : <Routes><Route path="*" element={<LandingPage />} /></Routes>}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
