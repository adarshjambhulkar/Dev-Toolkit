import { useState, useEffect } from 'react';

export function useSecretKey() {
  const [secretKey, setSecretKeyState] = useState<string>(() => {
    return localStorage.getItem('secretKey') ?? '';
  });

  useEffect(() => {
    localStorage.setItem('secretKey', secretKey);
  }, [secretKey]);

  function setSecretKey(key: string) {
    setSecretKeyState(key);
  }

  return { secretKey, setSecretKey };
}
