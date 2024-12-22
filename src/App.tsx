import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import CategoryPage from "./pages/CategoryPage";
import BookDetail from "./pages/BookDetail";
import BenefitPage from "./pages/BenefitPage";
import Sitemap from "./pages/Sitemap";
import SubmitBook from "./pages/SubmitBook";
import UserManagement from "./pages/UserManagement";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Footer from "./components/Footer";
import { UserProfile } from "./components/UserProfile";

const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="min-h-screen flex flex-col">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <UserProfile />
          <main className="flex-grow">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Index />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/category/:category" element={<ProtectedRoute><CategoryPage /></ProtectedRoute>} />
              <Route path="/benefit/:benefit" element={<ProtectedRoute><BenefitPage /></ProtectedRoute>} />
              <Route path="/book/:id" element={<BookDetail />} />
              <Route path="/sitemap.xml" element={<Sitemap />} />
              <Route path="/submit-book" element={<SubmitBook />} />
              <Route path="/user-management" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;