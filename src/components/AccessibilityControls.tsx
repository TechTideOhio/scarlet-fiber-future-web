
import React, { useState, useEffect } from 'react';
import { Pause, Play, Settings } from 'lucide-react';

interface AccessibilityControlsProps {
  isPaused: boolean;
  onTogglePause: () => void;
  quality: 'high' | 'medium' | 'low' | 'static';
  onQualityChange: (quality: 'high' | 'medium' | 'low' | 'static') => void;
}

const AccessibilityControls: React.FC<AccessibilityControlsProps> = ({
  isPaused,
  onTogglePause,
  quality,
  onQualityChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
      if (e.matches) {
        onQualityChange('static');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [onQualityChange]);

  // Auto-hide controls after 3 seconds of no interaction
  useEffect(() => {
    if (!isExpanded) return;
    
    const timer = setTimeout(() => {
      setIsExpanded(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [isExpanded]);

  return (
    <div 
      className="fixed bottom-4 right-4 z-50"
      role="region"
      aria-label="Animation accessibility controls"
    >
      <div className={`flex flex-col items-end gap-2 transition-all duration-300 ${
        isExpanded ? 'opacity-100' : 'opacity-70 hover:opacity-100'
      }`}>
        
        {/* Expanded controls */}
        {isExpanded && (
          <div className="bg-buckeye-black/80 backdrop-blur-sm rounded-md p-3 min-w-[200px]">
            <div className="text-white text-sm mb-3 font-medium">
              Animation Settings
            </div>
            
            {/* Quality selector */}
            <div className="mb-3">
              <label className="text-white text-xs mb-1 block">Quality Level</label>
              <select
                value={quality}
                onChange={(e) => onQualityChange(e.target.value as any)}
                className="w-full bg-white/10 text-white text-xs rounded-md px-2 py-1 border border-white/20"
                disabled={prefersReducedMotion}
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
                <option value="static">Static</option>
              </select>
            </div>

            {/* Reduced motion notice */}
            {prefersReducedMotion && (
              <div className="text-yellow-300 text-xs mb-2">
                ⚠️ Reduced motion detected - animations disabled
              </div>
            )}

            {/* Quick actions */}
            <div className="flex gap-2">
              <button
                onClick={onTogglePause}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs rounded-md px-2 py-1 transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-buckeye-scarlet focus-visible:ring-offset-2"
                disabled={quality === 'static'}
              >
                {isPaused ? 'Resume' : 'Pause'}
              </button>
              <button
                onClick={() => onQualityChange('static')}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs rounded-md px-2 py-1 transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-buckeye-scarlet focus-visible:ring-offset-2"
              >
                Disable
              </button>
            </div>
          </div>
        )}

        {/* Main control button */}
        <div className="flex gap-2">
          <button
            onClick={onTogglePause}
            className="bg-buckeye-black/80 hover:bg-buckeye-black text-white p-2 min-h-11 min-w-11 flex items-center justify-center rounded-md transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-buckeye-scarlet focus-visible:ring-offset-2"
            aria-label={isPaused ? 'Resume animation' : 'Pause animation'}
            disabled={quality === 'static'}
          >
            {isPaused ? <Play size={16} /> : <Pause size={16} />}
          </button>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-buckeye-black/80 hover:bg-buckeye-black text-white p-2 min-h-11 min-w-11 flex items-center justify-center rounded-md transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-buckeye-scarlet focus-visible:ring-offset-2"
            aria-label="Animation settings"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityControls;
