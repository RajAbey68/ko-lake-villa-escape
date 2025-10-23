import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import SimpleIndex from "./pages/SimpleIndex";
import SimpleHome from "./pages/SimpleHome";
import NotFound from "./pages/NotFound";
import GalleryPage from "./pages/GalleryPage";
import GalleryPageSimple from "./pages/GalleryPageSimple";
import ContactPage from "./pages/ContactPage";
import AccommodationPage from "./pages/AccommodationPage";
import RoomsPageSimple from "./pages/RoomsPageSimple";
import ExperiencesPage from "./pages/ExperiencesPage";
import AmenitiesPageSimple from "./pages/AmenitiesPageSimple";
import DealsPage from "./pages/DealsPage";
import DealsPageSimple from "./pages/DealsPageSimple";
import ContactPageSimple from "./pages/ContactPageSimple";
import ContactPageNew from "./pages/ContactPageNew";
import SimpleImageUpload from "./pages/SimpleImageUpload";
import DirectImageUpload from "./pages/DirectImageUpload";
import TestSetup from "./pages/TestSetup";
import AuthPage from "./pages/AuthPage";
import AdminPage from "./pages/AdminPage";
import VideoPage from "./pages/VideoPage";
import BookingPage from "./pages/BookingPage";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/simple-home" element={<SimpleHome />} />
            <Route path="/legacy-home" element={<SimpleIndex />} />
            <Route path="/rooms" element={<RoomsPageSimple />} />
            <Route path="/accommodation" element={<RoomsPageSimple />} />
            <Route path="/rooms-admin" element={<AccommodationPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/gallery-admin" element={<GalleryPage />} />
            <Route path="/amenities" element={<AmenitiesPageSimple />} />
            <Route path="/experiences" element={<AmenitiesPageSimple />} />
            <Route path="/amenities-admin" element={<ExperiencesPage />} />
            <Route path="/deals" element={<DealsPageSimple />} />
            <Route path="/deals-admin" element={<DealsPage />} />
            <Route path="/contact" element={<ContactPageNew />} />
            <Route path="/contact-old" element={<ContactPageSimple />} />
            <Route path="/contact-admin" element={<ContactPage />} />
            <Route path="/upload" element={<DirectImageUpload />} />
            <Route path="/test" element={<TestSetup />} />
            <Route path="/book" element={<BookingPage />} />
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
