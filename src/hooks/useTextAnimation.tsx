
import { useEffect, useState } from 'react';

export const useTextAnimation = () => {
  const [titleVisible, setTitleVisible] = useState(false);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);

  useEffect(() => {
    // Staggered animations with fiber loading
    const titleTimer = setTimeout(() => setTitleVisible(true), 500);
    const subtitleTimer = setTimeout(() => setSubtitleVisible(true), 1200);
    const buttonTimer = setTimeout(() => setButtonVisible(true), 1800);

    return () => {
      clearTimeout(titleTimer);
      clearTimeout(subtitleTimer);
      clearTimeout(buttonTimer);
    };
  }, []);

  return {
    titleVisible,
    subtitleVisible,
    buttonVisible
  };
};
