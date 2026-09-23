import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) return <div className="h-9 w-9" />;

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink-muted transition hover:text-ink"
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
