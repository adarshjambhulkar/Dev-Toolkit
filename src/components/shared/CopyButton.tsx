import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useClipboard } from '@/hooks/useClipboard';

interface CopyButtonProps {
  getText: () => string;
  label?: string;
  variant?: 'default' | 'ghost' | 'outline' | 'secondary' | 'destructive' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function CopyButton({
  getText,
  label,
  variant = 'outline',
  size = 'sm',
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const { copyToClipboard } = useClipboard();

  function handleCopy() {
    copyToClipboard(getText());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Button variant={variant} size={size} onClick={handleCopy} className="gap-1.5">
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-500" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
      {label && <span>{label}</span>}
    </Button>
  );
}
