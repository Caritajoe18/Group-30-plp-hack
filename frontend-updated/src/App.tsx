import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ReportIncident from "./pages/ReportIncident";
import Emergency from "./pages/Emergency";
import SupportServices from "./pages/SupportServices";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import AdminSetup from "./pages/AdminSetup";
import RegisterOrganization from "./pages/RegisterOrganization";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import OrganizationDashboard from "./pages/OrganizationDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/report" element={<ReportIncident />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/support" element={<SupportServices />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin-setup" element={<AdminSetup />} />
          <Route path="/register-organization" element={<RegisterOrganization />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chat/:reportId" element={<Chat />} />
          <Route path="/organization-dashboard" element={<OrganizationDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
