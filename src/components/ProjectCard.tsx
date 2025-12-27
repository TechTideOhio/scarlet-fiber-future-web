import React from 'react';
import { Project, getProjectImageUrl } from '@/types/project';
import { OptimizedImage } from '@/components/ui/optimized-image';

type ProjectCardProps = {
  project: Project;
  onClick: () => void;
};

const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
  const imageUrl = getProjectImageUrl(project.image_url);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <article
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${project.title}`}
      className="cursor-pointer group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <div className="relative overflow-hidden">
        <OptimizedImage
          src={imageUrl}
          alt={`${project.title} - ${project.industry || 'Project'} project`}
          className="w-full h-48 transition-all duration-300 group-hover:scale-105 filter grayscale group-hover:grayscale-0"
          width={600}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-4 right-4">
          <span className="bg-buckeye-scarlet text-white text-xs px-2 py-1 rounded-full font-medium">
            {project.type}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-buckeye-black mb-2 group-hover:text-buckeye-scarlet transition-colors">
          {project.title}
        </h3>
        <p className="text-buckeye-gray text-sm mb-3">
          {project.industry}
        </p>
        <p className="text-gray-600 leading-relaxed">
          {project.description}
        </p>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <span className="text-buckeye-scarlet font-medium text-sm group-hover:underline">
            View Details →
          </span>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
