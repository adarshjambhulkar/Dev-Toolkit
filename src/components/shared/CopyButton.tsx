import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useClipboard } from '@/hooks/useClipboard';

interface CopyButtonProps {
  getText: () => string;
  label?: string;
  variant?: 'default' | 'ghost' | 'outline' | 'secondary' | 'destructive' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function CopyButton({
  getText,
  label = 'Copy to clipboard',
  variant = 'outline',
  size = 'icon',
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const { copyToClipboard } = useClipboard();

  function handleCopy() {
    copyToClipboard(getText());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={variant}
          size={size}
          onClick={handleCopy}
          className="h-7 w-7"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          <span className="sr-only">{label}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>{copied ? 'Copied!' : label}</p>
      </TooltipContent>
    </Tooltip>
  );
}
