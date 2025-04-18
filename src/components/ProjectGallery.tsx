
import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from 'lucide-react';

type Project = {
  id: number;
  title: string;
  description: string;
  image: string;
  details: string;
};

const projects: Project[] = [
  {
    id: 1,
    title: "Enterprise Data Center",
    description: "High-density fiber infrastructure deployment",
    image: "photo-1488590528505-98d2b5aba04b",
    details: "Complete overhaul of legacy infrastructure with state-of-the-art fiber optic cabling, supporting 100Gb/s throughput across 50,000 square feet of data center space."
  },
  {
    id: 2,
    title: "Smart Building Integration",
    description: "IoT-enabled building management system",
    image: "photo-1518770660439-4636190af475",
    details: "Implementation of smart building technology across a 30-story commercial tower, integrating HVAC, security, and lighting systems into a unified control platform."
  },
  {
    id: 3,
    title: "Campus Network Upgrade",
    description: "University-wide network modernization",
    image: "photo-1461749280684-dccba630e2f6",
    details: "Comprehensive upgrade of campus-wide network infrastructure, including Wi-Fi 6E deployment and 40Gb backbone installation across 15 buildings."
  },
  {
    id: 4,
    title: "Manufacturing IoT Network",
    description: "Industrial IoT sensor network deployment",
    image: "photo-1486312338219-ce68d2c6f44d",
    details: "Design and installation of robust IoT network supporting 1,000+ sensors and real-time machine learning analytics for predictive maintenance."
  }
];

const ProjectGallery = () => {
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(null);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-buckeye-black mb-8">Recent Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="cursor-pointer group relative overflow-hidden rounded-lg"
            >
              <img
                src={`https://images.unsplash.com/${project.image}?auto=format&fit=crop&w=800&q=80`}
                alt={project.title}
                className="w-full h-64 object-cover transition-all duration-300 group-hover:scale-105 filter grayscale hover:grayscale-0"
              />
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-buckeye-scarlet transition-colors duration-300 rounded-lg pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <h3 className="text-white font-bold">{project.title}</h3>
                <p className="text-gray-200 text-sm">{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="bg-buckeye-black text-white max-w-3xl">
          <button
            onClick={() => setSelectedProject(null)}
            className="absolute right-4 top-4 p-2 text-buckeye-scarlet hover:text-buckeye-scarlet/80 transition-colors"
          >
            <X size={24} />
          </button>
          
          {selectedProject && (
            <div className="space-y-6">
              <img
                src={`https://images.unsplash.com/${selectedProject.image}?auto=format&fit=crop&w=1200&q=90`}
                alt={selectedProject.title}
                className="w-full h-[400px] object-cover rounded-lg"
              />
              <div>
                <h2 className="text-2xl font-bold mb-2">{selectedProject.title}</h2>
                <p className="text-buckeye-gray leading-relaxed">{selectedProject.details}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ProjectGallery;
