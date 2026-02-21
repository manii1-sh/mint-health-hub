import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { AppProvider } from "@/context/AppContext";
import { ThemeProvider } from "@/hooks/useTheme";

import Login from "./pages/Login";
import Index from "./pages/Index";
import Appointments from "./pages/Appointments";
import Patients from "./pages/Patients";
import Doctors from "./pages/Doctors";
import Resources from "./pages/Resources";
import EmergencyQueue from "./pages/EmergencyQueue";
import CrisisPanel from "./pages/CrisisPanel";
import ServiceRequests from "./pages/ServiceRequests";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import AuditLogs from "./pages/AuditLogs";
import SettingsPage from "./pages/Settings";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/" element={<Index />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/patients" element={<Patients />} />
                <Route path="/doctors" element={<Doctors />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/emergency" element={<EmergencyQueue />} />
                <Route path="/crisis" element={<CrisisPanel />} />
                <Route path="/service-requests" element={<ServiceRequests />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/audit-logs" element={<AuditLogs />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
