import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, CheckCircle } from 'lucide-react';
import { Project, getProjectImageUrl } from '@/types/project';

type ProjectModalProps = {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
};

const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
  if (!project) return null;

  const imageUrl = getProjectImageUrl(project.image_url);
  const features = project.features || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-buckeye-gray hover:text-buckeye-scarlet transition-colors z-10"
        >
          <X size={24} />
        </button>
        
        <div className="space-y-6">
          <div className="relative">
            <img
              src={imageUrl}
              alt={project.title}
              className="w-full h-[400px] object-cover rounded-lg"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-buckeye-scarlet text-white text-sm px-3 py-1 rounded-full font-medium">
                {project.type}
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-buckeye-black">{project.title}</h2>
                <p className="text-buckeye-scarlet font-medium">{project.industry}</p>
              </div>
            </div>
            
            <p className="text-gray-600 leading-relaxed text-lg">
              {project.details || project.description}
            </p>
            
            {features.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-buckeye-black mb-4">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="text-buckeye-scarlet flex-shrink-0" size={20} />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="pt-6 border-t border-gray-200">
              <p className="text-buckeye-gray text-center">
                Interested in a similar project?
                <span className="text-buckeye-scarlet font-medium cursor-pointer hover:underline ml-1">
                  Contact us today
                </span>
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;
