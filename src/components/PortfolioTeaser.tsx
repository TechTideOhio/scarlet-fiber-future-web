import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/project';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import { Skeleton } from '@/components/ui/skeleton';

const PortfolioTeaser = () => {
  const [selected, setSelected] = useState<Project | null>(null);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects', 'home-teaser'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'published')
        .order('display_order', { ascending: true })
        .limit(3);
      if (error) throw error;
      return data as Project[];
    },
  });

  if (!isLoading && projects.length === 0) return null;

  return (
    <section className="w-full py-20 md:py-28 bg-gray-50" aria-labelledby="portfolio-heading">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-6">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-buckeye-scarlet font-medium mb-4">
              04 / Recent work
            </p>
            <h2
              id="portfolio-heading"
              className="font-display text-4xl md:text-5xl lg:text-6xl text-buckeye-black leading-[1.05]"
            >
              Installed, tested, <em className="italic font-normal text-buckeye-scarlet">documented</em>.
            </h2>
          </div>
          <Link
            to="/our-work"
            className="text-buckeye-scarlet font-medium border-b border-buckeye-scarlet/40 hover:border-buckeye-scarlet pb-1 self-start md:self-end whitespace-nowrap"
          >
            View all work →
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Skeleton className="w-full h-48" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} onClick={() => setSelected(p)} />
            ))}
          </div>
        )}
      </div>

      <ProjectModal
        project={selected}
        isOpen={!!selected}
        onClose={() => setSelected(null)}
      />
    </section>
  );
};

export default PortfolioTeaser;
