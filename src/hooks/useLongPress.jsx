import { useEffect, useRef } from 'react';

const useLongPress = (callback, duration = 500) => {
  const timeoutRef = useRef(null);

  const handleStart = () => {
    timeoutRef.current = setTimeout(callback, duration);
  };

  const handleEnd = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    // Attach event listeners
    const element = window;
    element.addEventListener('mousedown', handleStart);
    element.addEventListener('touchstart', handleStart);
    element.addEventListener('mouseup', handleEnd);
    element.addEventListener('touchend', handleEnd);

    // Clean up event listeners on unmount
    return () => {
      element.removeEventListener('mousedown', handleStart);
      element.removeEventListener('touchstart', handleStart);
      element.removeEventListener('mouseup', handleEnd);
      element.removeEventListener('touchend', handleEnd);
    };
  }, [callback, duration]);

  return {
    ref: (node) => {
      // You can attach this ref to your desired element
    },
  };
};

export default useLongPress;
