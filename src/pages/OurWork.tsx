import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import CTAButton from '../components/CTAButton';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/project';
import SEO from '../components/SEO';
import { BreadcrumbSchema } from '../components/StructuredData';
import { SEO_CONFIG } from '../config/seo';

const OurWork = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'published')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as Project[];
    }
  });

  // Extract unique project types from data
  const projectTypes = useMemo(() => {
    const types = [...new Set(projects.map(p => p.type))];
    return types.sort();
  }, [projects]);

  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(project => project.type === activeFilter);

  return (
    <div className="min-h-screen">
      <SEO 
        title={SEO_CONFIG.pages.ourWork.title}
        description={SEO_CONFIG.pages.ourWork.description}
        keywords={SEO_CONFIG.pages.ourWork.keywords}
        canonicalUrl="/our-work"
      />
      <BreadcrumbSchema items={[
        { name: 'Home', url: '/' },
        { name: 'Our Work', url: '/our-work' }
      ]} />
      
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-buckeye-black via-buckeye-black to-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Our Work
          </h1>
          <p className="text-xl text-buckeye-gray max-w-3xl mx-auto">
            Explore our portfolio of successful network infrastructure projects across various industries
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setActiveFilter('All')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === 'All'
                  ? 'bg-buckeye-scarlet text-white'
                  : 'bg-white text-buckeye-gray hover:bg-buckeye-scarlet hover:text-white'
              }`}
            >
              All Projects
            </button>
            {projectTypes.map((type) => (
              <button
                key={type}
                onClick={() => setActiveFilter(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === type
                    ? 'bg-buckeye-scarlet text-white'
                    : 'bg-white text-buckeye-gray hover:bg-buckeye-scarlet hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
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
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Failed to load projects</p>
              <button 
                onClick={() => window.location.reload()}
                className="text-buckeye-scarlet hover:underline"
              >
                Try again
              </button>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-buckeye-gray text-lg">No projects found</p>
              {activeFilter !== 'All' && (
                <button 
                  onClick={() => setActiveFilter('All')}
                  className="mt-4 text-buckeye-scarlet hover:underline"
                >
                  View all projects
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => setSelectedProject(project)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-buckeye-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to see your project here?
          </h2>
          <p className="text-xl text-buckeye-gray mb-8 max-w-2xl mx-auto">
            Join our growing list of satisfied clients and transform your network infrastructure today.
          </p>
          <CTAButton variant="primary" size="lg">
            Start Your Project
          </CTAButton>
        </div>
      </section>

      <Footer />

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
};

export default OurWork;
