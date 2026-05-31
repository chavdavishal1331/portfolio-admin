import { useEffect, useState } from "react";

export function usePreloadedSrc(url) {
  const [src, setSrc] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSrc(null);
    setReady(false);

    if (!url) {
      setReady(true);
      return;
    }

    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (!cancelled) {
        setSrc(url);
        setReady(true);
      }
    };
    img.onerror = () => {
      if (!cancelled) {
        setSrc(url);
        setReady(true);
      }
    };
    img.src = url;

    return () => {
      cancelled = true;
    };
  }, [url]);

  return { src, ready };
}
