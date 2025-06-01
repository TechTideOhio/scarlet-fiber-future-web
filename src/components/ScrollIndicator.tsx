
import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const ScrollIndicator = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const sections = ['hero-section', 'services-section', 'final-section'];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const viewportHeight = window.innerHeight;
      const sectionIndex = Math.round(scrollPosition / viewportHeight);
      setCurrentSection(Math.min(sectionIndex, sections.length - 1));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (index: number) => {
    const element = document.getElementById(sections[index]);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 flex flex-col space-y-3">
      {sections.map((_, index) => (
        <button
          key={index}
          onClick={() => scrollToSection(index)}
          className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
            currentSection === index
              ? 'bg-buckeye-scarlet border-buckeye-scarlet'
              : 'bg-transparent border-white/50 hover:border-buckeye-scarlet'
          }`}
          aria-label={`Go to section ${index + 1}`}
        />
      ))}
      
      {currentSection < sections.length - 1 && (
        <button
          onClick={() => scrollToSection(currentSection + 1)}
          className="mt-6 p-2 text-white/70 hover:text-buckeye-scarlet transition-colors animate-bounce"
          aria-label="Scroll to next section"
        >
          <ChevronDown size={20} />
        </button>
      )}
    </div>
  );
};

export default ScrollIndicator;
