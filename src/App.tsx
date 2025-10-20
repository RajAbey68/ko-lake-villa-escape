import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import SimpleIndex from "./pages/SimpleIndex";
import NotFound from "./pages/NotFound";
import GalleryPage from "./pages/GalleryPage";
import ContactPage from "./pages/ContactPage";
import AccommodationPage from "./pages/AccommodationPage";
import ExperiencesPage from "./pages/ExperiencesPage";
import DealsPage from "./pages/DealsPage";
import AuthPage from "./pages/AuthPage";
import AdminPage from "./pages/AdminPage";
import VideoPage from "./pages/VideoPage";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/legacy-home" element={<SimpleIndex />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/accommodation" element={<AccommodationPage />} />
            <Route path="/experiences" element={<ExperiencesPage />} />
            <Route path="/deals" element={<DealsPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/videos" element={<VideoPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
