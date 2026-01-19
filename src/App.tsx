import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/use-auth";
import { LanguageProvider } from "./hooks/use-language";
// Admin Pages
import Index from "./pages/Index";
import Mosques from "./pages/Mosques";
import Submissions from "./pages/Submissions";
import Users from "./pages/Users";
import Donations from "./pages/Donations";
import Ideas from "./pages/Ideas";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// Mobile App Pages
import { MobileLayout } from "./components/mobile/MobileLayout";
import MobileHome from "./pages/mobile/MobileHome";
import MobileMosques from "./pages/mobile/MobileMosques";
import MobileMapView from "./pages/mobile/MobileMapView";
import MobileQibla from "./pages/mobile/MobileQibla";
import MobileUmrah from "./pages/mobile/MobileUmrah";
import MobileRamadan from "./pages/mobile/MobileRamadan";
import MobileNotifications from "./pages/mobile/MobileNotifications";
import MobileDonate from "./pages/mobile/MobileDonate";
import MobileProfile from "./pages/mobile/MobileProfile";
import MobileAuth from "./pages/mobile/MobileAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Admin Panel Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/mosques" element={<Mosques />} />
              <Route path="/submissions" element={<Submissions />} />
              <Route path="/users" element={<Users />} />
              <Route path="/donations" element={<Donations />} />
              <Route path="/ideas" element={<Ideas />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/settings" element={<Settings />} />

              {/* Mobile App Routes */}
              <Route path="/mobile" element={<MobileLayout><MobileHome /></MobileLayout>} />
              <Route path="/mobile/mosques" element={<MobileLayout><MobileMosques /></MobileLayout>} />
              <Route path="/mobile/map" element={<MobileMapView />} />
              <Route path="/mobile/qibla" element={<MobileLayout><MobileQibla /></MobileLayout>} />
              <Route path="/mobile/umrah" element={<MobileLayout><MobileUmrah /></MobileLayout>} />
              <Route path="/mobile/ramadan" element={<MobileLayout><MobileRamadan /></MobileLayout>} />
              <Route path="/mobile/notifications" element={<MobileLayout><MobileNotifications /></MobileLayout>} />
              <Route path="/mobile/donate" element={<MobileLayout><MobileDonate /></MobileLayout>} />
              <Route path="/mobile/profile" element={<MobileLayout><MobileProfile /></MobileLayout>} />
              <Route path="/mobile/auth" element={<MobileAuth />} />
              
              {/* Legacy routes - redirect to new paths */}
              <Route path="/app" element={<MobileLayout><MobileHome /></MobileLayout>} />
              <Route path="/app/mosques" element={<MobileLayout><MobileMosques /></MobileLayout>} />
              <Route path="/app/notifications" element={<MobileLayout><MobileNotifications /></MobileLayout>} />
              <Route path="/app/donate" element={<MobileLayout><MobileDonate /></MobileLayout>} />
              <Route path="/app/profile" element={<MobileLayout><MobileProfile /></MobileLayout>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
