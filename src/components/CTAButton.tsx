
import React from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type CTAButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
};

const CTAButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className,
  onClick,
  ...props 
}: CTAButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-buckeye-scarlet text-white hover:bg-buckeye-scarlet/90';
      case 'secondary':
        return 'bg-buckeye-gray text-white hover:bg-buckeye-gray/90';
      case 'outline':
        return 'bg-transparent border-2 border-buckeye-scarlet text-buckeye-scarlet hover:bg-buckeye-scarlet hover:text-white';
      default:
        return 'bg-buckeye-scarlet text-white hover:bg-buckeye-scarlet/90';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-sm py-2 px-4';
      case 'md':
        return 'text-base py-2.5 px-6';
      case 'lg':
        return 'text-lg py-3 px-8';
      default:
        return 'text-base py-2.5 px-6';
    }
  };

  return (
    <Button
      className={cn(
        'transition-all duration-300 font-medium rounded-md',
        getVariantClasses(),
        getSizeClasses(),
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CTAButton;
