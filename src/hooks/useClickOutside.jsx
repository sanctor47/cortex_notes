import { useEffect, useRef } from 'react';

const useClickOutside = (callback) => {
  const ref = useRef(null);

  const handleClick = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  return ref;
};

export default useClickOutside;