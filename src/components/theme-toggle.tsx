'use client';

import { Moon, Sun, Laptop } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { useTheme } from '@/lib/context/theme';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const positionMap = {
    dark: 'left-[0.25rem]',
    system: 'left-[3.25rem]', // centered
    light: 'left-[6.25rem]',
  };

  if (!theme) return null;

  return (
    <div className="relative inline-flex min-w-[8.5rem] w-[8.5rem] items-center justify-between rounded-full">
      <span
        className={twMerge(
          'absolute top-[0.3rem] h-8 w-8 rounded-full bg-muted transition-all duration-300 ease-out',
          positionMap[theme]
        )}
      />
      <button
        onClick={() => setTheme('dark')}
        className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors duration-300"
        aria-label="Dark mode"
      >
        <Moon className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme('system')}
        className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors duration-300"
        aria-label="System mode"
      >
        <Laptop className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme('light')}
        className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors duration-300"
        aria-label="Light mode"
      >
        <Sun className="h-4 w-4" />
      </button>
    </div>
  );
}
