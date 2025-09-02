"use client";

import { useEffect, useRef } from 'react';

export function useVisibilityChange(onHide: () => void) {
  const onHideRef = useRef(onHide);
  onHideRef.current = onHide;

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        onHideRef.current();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
}
