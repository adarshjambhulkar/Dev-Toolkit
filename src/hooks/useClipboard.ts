import { toast } from 'sonner';

export function useClipboard() {
  function copyToClipboard(text: string) {
    if (navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(text).then(() => {
        toast.success('Copied to clipboard!');
      });
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      toast.success('Copied to clipboard!');
    }
  }

  return { copyToClipboard };
}
