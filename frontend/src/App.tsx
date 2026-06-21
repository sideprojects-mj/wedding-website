import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from "./pages/Admin";
import BridalShowerAdmin from "./pages/BridalShowerAdmin";
import BridalShowerRsvp from "./pages/BridalShowerRsvp";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Rsvp from "./pages/Rsvp";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/rsvp" element={<Rsvp />} />
          <Route path="/bridalShower/rsvp" element={<BridalShowerRsvp />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/bridal-shower/admin" element={<BridalShowerAdmin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
