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
    <section className="w-full py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-buckeye-black mb-3">
              Recent Projects
            </h2>
            <p className="text-buckeye-gray max-w-2xl">
              A sample of network infrastructure we've delivered across Ohio.
            </p>
          </div>
          <Link
            to="/our-work"
            className="text-buckeye-scarlet hover:text-buckeye-scarlet/80 font-medium whitespace-nowrap"
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
