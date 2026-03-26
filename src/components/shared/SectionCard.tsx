import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Minimize2, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface SectionCardProps {
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  /** Whether to show the maximize button */
  allowMaximize?: boolean;
}

export function SectionCard({ title, actions, children, className, allowMaximize = true }: SectionCardProps) {
  const [isMaximized, setIsMaximized] = useState(false);

  // Prevent scrolling on body when maximized
  useEffect(() => {
    if (isMaximized) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMaximized]);

  const header = (
    <div className={cn(
      "flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-1.5 border-b bg-muted/40 sticky top-0 z-10",
      isMaximized && "bg-muted/80 backdrop-blur-md py-2.5"
    )}>
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          {title}
        </span>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
        {actions}
        {allowMaximize && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsMaximized(!isMaximized)}
                className={cn(
                  "h-7 w-7",
                  isMaximized && "bg-accent text-accent-foreground border-accent"
                )}
              >
                {isMaximized ? (
                  <Minimize2 className="h-3.5 w-3.5" />
                ) : (
                  <Maximize2 className="h-3.5 w-3.5" />
                )}
                <span className="sr-only">{isMaximized ? "Restore" : "Maximize"}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{isMaximized ? "Restore" : "Maximize"}</p>
            </TooltipContent>
          </Tooltip>
        )}
        {isMaximized && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMaximized(false)}
            className="h-7 w-7"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );

  const cardContent = (
    <CardContent className="p-0 flex-1 overflow-auto">
      {children}
    </CardContent>
  );

  return (
    <>
      <Card className={cn('overflow-hidden py-0 gap-0 flex flex-col', className)}>
        {header}
        {cardContent}
      </Card>

      {/* Maximize Modal */}
      {allowMaximize && createPortal(
        <AnimatePresence>
          {isMaximized && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-background/80 backdrop-blur-sm"
            >
              <motion.div
                layoutId={`card-${title}`}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full h-full max-w-6xl flex flex-col bg-card rounded-xl border shadow-2xl overflow-hidden"
              >
                {header}
                <div className="flex-1 overflow-hidden bg-background/50 flex flex-col [&>*]:flex-1 [&>*]:h-full!">
                  {children}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
