import { useState, useEffect } from 'react';

export const useColorTransition = (colors: string[], intervalDuration = 2000) => {
  const [currentColorIndex, setCurrentColorIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentColorIndex(prev => (prev + 1) % colors.length);
    }, intervalDuration);

    return () => clearInterval(interval);
  }, [colors.length, intervalDuration]);

  return colors[currentColorIndex];
};