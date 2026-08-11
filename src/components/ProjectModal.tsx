import React, { useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X, CheckCircle } from 'lucide-react';
import { Project, getProjectImageUrl } from '@/types/project';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Link } from 'react-router-dom';

type ProjectModalProps = {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
};

const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      setTimeout(() => closeButtonRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!project) return null;

  const imageUrl = getProjectImageUrl(project.image_url);
  const features = project.features || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white overflow-y-auto grid-cols-[minmax(0,1fr)] max-sm:inset-0 max-sm:left-0 max-sm:top-0 max-sm:h-[100dvh] max-sm:max-h-[100dvh] max-sm:w-full max-sm:max-w-none max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-none max-sm:p-4 sm:max-w-4xl sm:max-h-[90dvh]">
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute right-2 top-2 inline-flex min-h-11 min-w-11 items-center justify-center rounded-md p-2 text-buckeye-gray hover:text-buckeye-scarlet active:text-buckeye-scarlet transition-all duration-200 active:scale-[0.97] z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-buckeye-scarlet focus-visible:ring-offset-2"
          aria-label="Close project details"
        >
          <X size={24} aria-hidden="true" />
        </button>
        
        <div className="space-y-6 pt-8 sm:pt-0">
          <div className="relative">
            <OptimizedImage
              src={imageUrl}
              alt={`${project.title} showcase image`}
              className="w-full h-56 sm:h-[400px] rounded-lg"
              sizes="(max-width: 640px) 100vw, 800px"
              priority
            />
            <div className="absolute top-4 left-4">
              <span className="bg-buckeye-scarlet text-white text-sm px-3 py-1 rounded-full font-medium">
                {project.type}
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <DialogTitle className="text-2xl sm:text-3xl font-bold text-buckeye-black">{project.title}</DialogTitle>
              <p className="text-buckeye-scarlet font-medium">{project.industry}</p>
            </div>
            
            <DialogDescription className="text-gray-600 leading-relaxed text-base sm:text-lg">
              {project.details || project.description}
            </DialogDescription>
            
            {features.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-buckeye-black mb-4">Key Features</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="text-buckeye-scarlet flex-shrink-0" size={20} aria-hidden="true" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="pt-6 border-t border-gray-200">
              <p className="text-buckeye-gray text-center">
                Interested in a similar project?
                <Link to="/contact" className="text-buckeye-scarlet font-medium transition-colors duration-150 link-underline ml-1" onClick={onClose}>
                  Contact us today
                </Link>
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;
