import { Tables } from "@/integrations/supabase/types";
import portfolioFallback from "@/assets/portfolio-fallback.jpg";
import dataCenter from "@/assets/projects/data-center.jpg";
import smartBuilding from "@/assets/projects/smart-building.jpg";
import campusNetwork from "@/assets/projects/campus-network.jpg";
import manufacturingIot from "@/assets/projects/manufacturing-iot.jpg";
import hospitalSecurity from "@/assets/projects/hospital-security.jpg";
import financialCloud from "@/assets/projects/financial-cloud.jpg";

export type Project = Tables<"projects">;

export type ProjectType = string;

// Map legacy Unsplash photo IDs (stored in DB) to locally generated editorial photos.
const PROJECT_IMAGE_OVERRIDES: Record<string, string> = {
  "photo-1487958449943-2429e8be8625": dataCenter,
  "photo-1518770660439-4636190af475": smartBuilding,
  "photo-1461749280684-dccba630e2f6": campusNetwork,
  "photo-1486312338219-ce68d2c6f44d": manufacturingIot,
  "photo-1488590528505-98d2b5aba04b": hospitalSecurity,
  "photo-1496307653780-42ee777d4833": financialCloud,
};

// Helper to get image URL from project
export const getProjectImageUrl = (imageUrl: string | null): string => {
  if (!imageUrl) {
    return portfolioFallback;
  }

  if (PROJECT_IMAGE_OVERRIDES[imageUrl]) {
    return PROJECT_IMAGE_OVERRIDES[imageUrl];
  }

  if (imageUrl.startsWith('/lovable-uploads/') || imageUrl.startsWith('http')) {
    return imageUrl;
  }

  // Legacy Unsplash photo ID support (fallback for any unmapped ID)
  return `https://images.unsplash.com/${imageUrl}?auto=format&fit=crop&w=1200&q=80`;
};
