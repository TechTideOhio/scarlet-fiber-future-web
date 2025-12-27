
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { trackCTAClick } from '@/lib/analytics';

type CTAButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  href?: string;
  navigateTo?: string;
  trackingLabel?: string;
  trackingLocation?: string;
};

const CTAButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className,
  onClick,
  href,
  navigateTo,
  trackingLabel,
  trackingLocation,
  ...props 
}: CTAButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const navigate = useNavigate();
  const location = useLocation();
  
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

  const handleClick = () => {
    // Track the CTA click
    const label = trackingLabel || (typeof children === 'string' ? children : 'CTA Button');
    const destination = href || navigateTo || '/contact';
    const pageLocation = trackingLocation || location.pathname;
    
    trackCTAClick(label, destination, pageLocation);

    if (onClick) {
      onClick();
    } else if (href) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else if (navigateTo) {
      navigate(navigateTo);
    } else {
      // Default behavior: navigate to contact page
      navigate('/contact');
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
      onClick={handleClick}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CTAButton;
