import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import Dashboard from "./pages/Dashboard";
import BooksPage from "./pages/BooksPage";
import SearchPage from "./pages/SearchPage";
import MembersPage from "./pages/MembersPage";
import TransactionsPage from "./pages/TransactionsPage";
import PurchasesPage from "./pages/PurchasesPage";
import ReportsPage from "./pages/ReportsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
