import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatedRoutes } from "@/components/AnimatedRoutes";
import { PageTransition } from "@/components/PageTransition";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Index from "./pages/Index";
import About from "./pages/About";
import Products from "./pages/Products";
import Downloads from "./pages/Downloads";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Admin from "./pages/admin/Admin";

/**
 * Configure TanStack Query client with optimized defaults
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data considered fresh for 1 minute
      staleTime: 60 * 1000,
      // Cache data for 5 minutes
      gcTime: 5 * 60 * 1000,
      // Retry failed requests once
      retry: 1,
      // Don't refetch on window focus by default
      refetchOnWindowFocus: false,
      // Don't refetch on reconnect by default
      refetchOnReconnect: false,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <AnimatedRoutes>
                <Route path="/" data-genie-title="首页" data-genie-key="Home" element={<PageTransition transition="slide-up"><Index /></PageTransition>} />
                <Route path="/about" data-genie-title="关于我们" data-genie-key="About" element={<PageTransition transition="slide-up"><About /></PageTransition>} />
                <Route path="/products" data-genie-title="产品服务" data-genie-key="Products" element={<PageTransition transition="slide-up"><Products /></PageTransition>} />
                <Route path="/downloads" data-genie-title="下载中心" data-genie-key="Downloads" element={<PageTransition transition="slide-up"><Downloads /></PageTransition>} />
                <Route path="/contact" data-genie-title="联系我们" data-genie-key="Contact" element={<PageTransition transition="slide-up"><Contact /></PageTransition>} />
                <Route path="/admin" data-genie-title="后台管理" data-genie-key="Admin" element={<PageTransition transition="fade"><Admin /></PageTransition>} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" data-genie-key="NotFound" data-genie-title="Not Found" element={<PageTransition transition="fade"><NotFound /></PageTransition>} />
              </AnimatedRoutes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App
