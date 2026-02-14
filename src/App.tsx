import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Index from "./pages/Index";
import Schedule from "./pages/Schedule";
import WeddingParty from "./pages/WeddingParty";
import Attire from "./pages/Attire";
import ThingsToDo from "./pages/ThingsToDo";
import Hotels from "./pages/Hotels";
import Registry from "./pages/Registry";
import FAQ from "./pages/FAQ";
import RSVP from "./pages/RSVP";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/wedding-party" element={<WeddingParty />} />
          <Route path="/attire" element={<Attire />} />
          <Route path="/things-to-do" element={<ThingsToDo />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/registry" element={<Registry />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/rsvp" element={<RSVP />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
