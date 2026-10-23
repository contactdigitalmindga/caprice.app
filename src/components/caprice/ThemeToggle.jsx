import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === 'dark';
  return <button type="button" className="icon caprice-action" onClick={toggleTheme} aria-label={dark ? 'Thème sombre actif. Passer au thème clair' : 'Thème clair actif. Passer au thème sombre'} title={dark ? 'Passer au thème clair' : 'Passer au thème sombre'}>{dark ? <Moon size={18} /> : <Sun size={18} />}</button>;
}