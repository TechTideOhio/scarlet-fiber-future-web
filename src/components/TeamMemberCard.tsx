import React from 'react';
import { Linkedin } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type TeamMember = Tables<"team_members">;

type TeamMemberCardProps = {
  member: TeamMember;
};

const TeamMemberCard = ({ member }: TeamMemberCardProps) => {
  const defaultImage = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80";
  const imageUrl = member.image_url || defaultImage;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square overflow-hidden">
        <img
          src={imageUrl}
          alt={member.name}
          className="w-full h-full object-cover"
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
            className="inline-flex items-center gap-1 mt-3 text-buckeye-gray hover:text-buckeye-scarlet transition-colors"
          >
            <Linkedin size={18} />
            <span className="text-sm">Connect</span>
          </a>
        )}
      </div>
    </div>
  );
};

export default TeamMemberCard;
