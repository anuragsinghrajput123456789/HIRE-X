
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import FloatingChatbot from "./components/FloatingChatbot";
import Index from "./pages/Index";
import GeneratorPage from "./pages/GeneratorPage";
import AnalyzerPage from "./pages/AnalyzerPage";
import JobMatchPage from "./pages/JobMatchPage";
import ChatPage from "./pages/ChatPage";
import ColdEmailPage from "./pages/ColdEmailPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-slate-900 dark:to-blue-900/20 transition-all duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <Navbar />
            <main className="relative">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/generator" element={<GeneratorPage />} />
                <Route path="/analyzer" element={<AnalyzerPage />} />
                <Route path="/job-match" element={<JobMatchPage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/cold-email" element={<ColdEmailPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <FloatingChatbot />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
