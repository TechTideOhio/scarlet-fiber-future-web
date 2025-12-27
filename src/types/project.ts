import { Tables } from "@/integrations/supabase/types";

export type Project = Tables<"projects">;

export type ProjectType = string;

// Helper to get image URL from project
export const getProjectImageUrl = (imageUrl: string | null): string => {
  if (!imageUrl) {
    return "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=600&q=80";
  }
  
  // Check if it's an uploaded image, full URL, or Unsplash ID
  if (imageUrl.startsWith('/lovable-uploads/') || imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // Assume it's an Unsplash photo ID
  return `https://images.unsplash.com/${imageUrl}?auto=format&fit=crop&w=600&q=80`;
};
