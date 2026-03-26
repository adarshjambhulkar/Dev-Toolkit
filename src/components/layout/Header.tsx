import { Sun, Moon, Menu } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { Theme } from '@/types';

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
  title: string;
  description?: string;
  onMenuClick?: () => void;
}

export function Header({ theme, onToggleTheme, title, description, onMenuClick }: HeaderProps) {
  return (
    <header className="shrink-0 flex items-center justify-between px-4 md:px-6 py-3.5 border-b bg-background/80 backdrop-blur-sm gap-3">
      <div className="flex items-center gap-3 min-w-0">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          className="md:hidden shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-sm font-semibold leading-none text-foreground truncate">{title}</h1>
          {description && (
            <p className="text-xs text-muted-foreground mt-1 truncate hidden sm:block">{description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Sun className="h-3.5 w-3.5 text-muted-foreground" />
        <Switch
          id="theme-toggle"
          checked={theme === 'dark'}
          onCheckedChange={onToggleTheme}
          className="scale-90"
        />
        <Moon className="h-3.5 w-3.5 text-muted-foreground" />
        <Label htmlFor="theme-toggle" className="sr-only">
          Toggle theme
        </Label>
      </div>
    </header>
  );
}
