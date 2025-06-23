
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";
import GeneratorPage from "./pages/GeneratorPage";
import AnalyzerPage from "./pages/AnalyzerPage";
import JobMatchPage from "./pages/JobMatchPage";
import ExportPage from "./pages/ExportPage";
import ChatPage from "./pages/ChatPage";
import ColdEmailPage from "./pages/ColdEmailPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen gradient-bg w-full">
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/generator" element={<GeneratorPage />} />
            <Route path="/analyzer" element={<AnalyzerPage />} />
            <Route path="/job-match" element={<JobMatchPage />} />
            <Route path="/export" element={<ExportPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/cold-email" element={<ColdEmailPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
