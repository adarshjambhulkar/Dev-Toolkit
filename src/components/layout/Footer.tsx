import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto pt-6 pb-2 shrink-0">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground border-t pt-4">
        <div className="flex items-center gap-1.5">
          <span>Built with</span>
          <Heart className="h-4 w-4 text-red-500 hover:scale-110 transition-transform cursor-pointer" />
          <span>by</span>
          <a
            href="https://www.linkedin.com/in/adarshjambhulkar/"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-foreground hover:text-primary hover:underline transition-colors"
          >
            Adarsh Jambhulkar
          </a>
        </div>
        <div className="text-xs">
          &copy; {new Date().getFullYear()} Dev Toolkit. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
