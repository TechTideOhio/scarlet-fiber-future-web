import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import { SEO_CONFIG } from "@/config/seo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-buckeye-black via-gray-900 to-buckeye-black">
      <SEO 
        title={SEO_CONFIG.pages.notFound.title}
        description={SEO_CONFIG.pages.notFound.description}
        noIndex={true}
      />
      
      <div className="text-center px-4 max-w-lg">
        {/* 404 Number */}
        <h1 className="text-8xl md:text-9xl font-bold text-buckeye-scarlet mb-4 animate-pulse">
          404
        </h1>
        
        {/* Error Message */}
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
          Page Not Found
        </h2>
        
        <p className="text-buckeye-gray mb-8">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            asChild
            className="bg-buckeye-scarlet hover:bg-buckeye-scarlet/90 text-white"
          >
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            asChild
            className="border-buckeye-gray text-white hover:bg-white/10"
          >
            <Link to="/services">
              <Search className="mr-2 h-4 w-4" />
              View Services
            </Link>
          </Button>
        </div>
        
        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <p className="text-buckeye-gray text-sm mb-4">Popular pages:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/our-work" className="text-buckeye-scarlet hover:text-white transition-colors">
              Our Work
            </Link>
            <Link to="/about" className="text-buckeye-scarlet hover:text-white transition-colors">
              About Us
            </Link>
            <Link to="/contact" className="text-buckeye-scarlet hover:text-white transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
