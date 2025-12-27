import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import Index from "./pages/Index";
import Services from "./pages/Services";
import OurWork from "./pages/OurWork";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import SecurityHeaders from "./components/SecurityHeaders";
import { OrganizationSchema, WebsiteSchema } from "./components/StructuredData";
import ErrorBoundary from "./components/ErrorBoundary";
import PageErrorBoundary from "./components/PageErrorBoundary";
import SkipLinks from "./components/SkipLinks";
import { AnnouncerProvider } from "./components/Announcer";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ErrorBoundary>
          <SecurityHeaders />
          <OrganizationSchema />
          <WebsiteSchema />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SkipLinks />
            <AnnouncerProvider>
              <Routes>
                <Route path="/" element={
                  <PageErrorBoundary pageName="Home">
                    <Index />
                  </PageErrorBoundary>
                } />
                <Route path="/services" element={
                  <PageErrorBoundary pageName="Services">
                    <Services />
                  </PageErrorBoundary>
                } />
                <Route path="/our-work" element={
                  <PageErrorBoundary pageName="Our Work">
                    <OurWork />
                  </PageErrorBoundary>
                } />
                <Route path="/about" element={
                  <PageErrorBoundary pageName="About">
                    <About />
                  </PageErrorBoundary>
                } />
                <Route path="/contact" element={
                  <PageErrorBoundary pageName="Contact">
                    <Contact />
                  </PageErrorBoundary>
                } />
                <Route path="*" element={
                  <PageErrorBoundary pageName="Not Found">
                    <NotFound />
                  </PageErrorBoundary>
                } />
              </Routes>
            </AnnouncerProvider>
          </BrowserRouter>
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
