import { Tables } from "@/integrations/supabase/types";
import portfolioFallback from "@/assets/portfolio-fallback.jpg";

export type Project = Tables<"projects">;

export type ProjectType = string;

// Helper to get image URL from project
export const getProjectImageUrl = (imageUrl: string | null): string => {
  if (!imageUrl) {
    return portfolioFallback;
  }

  if (imageUrl.startsWith('/lovable-uploads/') || imageUrl.startsWith('http')) {
    return imageUrl;
  }

  // Legacy Unsplash photo ID support
  return `https://images.unsplash.com/${imageUrl}?auto=format&fit=crop&w=1200&q=80`;
};
