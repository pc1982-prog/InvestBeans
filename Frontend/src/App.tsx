import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeController from "@/controllers/HomeController";
import NotFoundController from "@/controllers/NotFoundController";
import DomesticController from "@/controllers/DomesticController";
import GlobalController from "@/controllers/GlobalController";
import DashboardController from "@/controllers/DashboardController";
import SignInController from "@/controllers/SignInController";
import SignUpController from "@/controllers/SignUpController";
import ForgotPasswordController from "@/controllers/ForgotPasswordController";
import ResetPasswordController from "@/controllers/ResetPasswordController";
import ProtectedRoute from "@/controllers/ProtectedRoute";
import { AuthProvider } from "@/controllers/AuthContext";
import MarketsView from "@/views/MarketsView";
import EducationView from "@/views/EducationView";
import TeamView from "@/views/TeamView";
import BlogsView from "@/views/BlogsView";
import BlogDetailView from "./views/BlogDetailView";
import ScrollToTop from "@/controllers/ScrollToTop";  
import PaymentSuccess from "./components/PaymentSuccess";
import GlobalToastListener from "./components/GlobalToastListener";
import TermsOfService from "./views/Termsofservice";
import HelpCenter from "./views/Helpcenter";
import PrivacyPolicy from "./views/Privacypolicy";
import ChartPage from "./components/Chartpage";
import IPOSection from "./views/Iposection";
import IPOPage from "./views/Ipopage";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <GlobalToastListener /> 
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop /> 
          <Routes>
            <Route path="/" element={<HomeController />} />
            <Route path="/domestic" element={<DomesticController />} />
            <Route path="/global" element={<GlobalController />} />
            <Route path="/markets" element={<MarketsView />} />
            <Route path="/chart/:symbol" element={<ChartPage />} />
            <Route path="/education" element={<EducationView />} />
            <Route path="/team" element={<TeamView />} />
            <Route path="/blogs" element={<BlogsView />} />
            <Route path="/blogs/:id" element={<BlogDetailView />} />
            <Route path="/paymentsuccess" element={<PaymentSuccess />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy/>} />
            
            <Route path="/ipo-section" element={<IPOSection/>} />
            <Route path="/ipos" element={<IPOPage/>} />

            {/* ✅ NEW: Password Reset Routes */}
            <Route path="/forgot-password" element={<ForgotPasswordController />} />
            <Route path="/reset-password" element={<ResetPasswordController />} />
            
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardController />
                </ProtectedRoute>
              }
            />
            <Route path="/signin" element={<SignInController />} />
            <Route path="/signup" element={<SignUpController />} />
            <Route path="*" element={<NotFoundController />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;