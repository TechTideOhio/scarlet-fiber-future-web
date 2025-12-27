import React from 'react';
import { Linkedin } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import { OptimizedImage } from '@/components/ui/optimized-image';

type TeamMember = Tables<"team_members">;

type TeamMemberCardProps = {
  member: TeamMember;
};

const TeamMemberCard = ({ member }: TeamMemberCardProps) => {
  const defaultImage = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80";
  const imageUrl = member.image_url || defaultImage;

  return (
    <article 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
      aria-label={`Team member: ${member.name}, ${member.role}`}
    >
      <div className="aspect-square overflow-hidden">
        <OptimizedImage
          src={imageUrl}
          alt={`${member.name}, ${member.role} at Buckeye DataCom`}
          className="w-full h-full"
          width={300}
          aspectRatio="1/1"
        />
      </div>
      <div className="p-4 text-center">
        <h3 className="text-lg font-bold text-buckeye-black">{member.name}</h3>
        <p className="text-buckeye-scarlet font-medium text-sm mb-2">{member.role}</p>
        {member.bio && (
          <p className="text-gray-600 text-sm line-clamp-3">{member.bio}</p>
        )}
        {member.linkedin_url && (
          <a
            href={member.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-3 text-buckeye-gray hover:text-buckeye-scarlet transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
            aria-label={`Connect with ${member.name} on LinkedIn`}
          >
            <Linkedin size={18} aria-hidden="true" />
            <span className="text-sm">Connect</span>
          </a>
        )}
      </div>
    </article>
  );
};

export default TeamMemberCard;
