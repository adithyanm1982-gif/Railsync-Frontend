import { PropsWithChildren, useEffect } from 'react';

/**
 * RailSync is dark-mode-only per the simulation design spec
 * (canvas background #090D16 / #0B0F19). This provider just guarantees
 * the class is present at the document root; it's a seam for adding
 * a light/high-contrast theme later without touching every component.
 */
export function ThemeProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return <>{children}</>;
}
