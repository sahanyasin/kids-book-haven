import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { useEffect, useState, Suspense, lazy } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Footer from "./components/Footer";
import { UserProfile } from "./components/UserProfile";

const Index = lazy(() => import("./pages/Index"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const BookDetail = lazy(() => import("./pages/BookDetail"));
const BenefitPage = lazy(() => import("./pages/BenefitPage"));
const Sitemap = lazy(() => import("./pages/Sitemap"));
const SubmitBook = lazy(() => import("./pages/SubmitBook"));
const Login = lazy(() => import("./pages/Login"));
const Profile = lazy(() => import("./pages/Profile"));
const BulkUpload = lazy(() => import("./pages/BulkUpload"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

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
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col" role="application">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:p-4">
              Skip to main content
            </a>
            <UserProfile />
            <main id="main-content" className="flex-grow" role="main">
              <Suspense fallback={<div>Loading page...</div>}>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/" element={<Index />} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/category/:category" element={<CategoryPage />} />
                  <Route path="/benefit/:benefit" element={<BenefitPage />} />
                  <Route path="/book/:id" element={<BookDetail />} />
                  <Route path="/sitemap.xml" element={<Sitemap />} />
                  <Route path="/submit-book" element={<SubmitBook />} />
                  {/* <Route path="/user-management" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} /> */}
                  {/* <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} /> */}
                  <Route path="/bulk-upload" element={<ProtectedRoute><BulkUpload /></ProtectedRoute>} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;