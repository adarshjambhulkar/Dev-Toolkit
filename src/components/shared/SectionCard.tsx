import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SectionCardProps {
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function SectionCard({ title, actions, children, className }: SectionCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-2.5 border-b bg-muted/40 sticky top-0 z-10">
        <span className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </span>
        {actions && <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">{actions}</div>}
      </div>
      <CardContent className="p-0">{children}</CardContent>
    </Card>
  );
}
