import { ArrowDown, ArrowUp, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CopyButton } from '@/components/shared/CopyButton';
import { SectionCard } from '@/components/shared/SectionCard';
import { useAppDispatch, useAppSelector } from '@/store';
import { setBase64State } from '@/store/slices/toolsSlice';

export default function Base64Page() {
  const dispatch = useAppDispatch();
  const base64State = useAppSelector((state) => state.tools.base64);
  const { encodeInput, encodeOutput, decodeInput, decodeOutput } = base64State;

  const updateState = (updates: Partial<typeof base64State>) => dispatch(setBase64State(updates));

  function handleEncode() {
    if (!encodeInput.trim()) {
      toast.warning('Please enter text to encode.');
      return;
    }
    try {
      // Use TextEncoder to handle unicode correctly
      const bytes = new TextEncoder().encode(encodeInput);
      const binStr = Array.from(bytes, (b) => String.fromCharCode(b)).join('');
      updateState({ encodeOutput: btoa(binStr) });
      toast.success('Encoded successfully!');
    } catch {
      toast.error('Encoding failed.');
    }
  }

  function handleDecode() {
    if (!decodeInput.trim()) {
      toast.warning('Please enter Base64 to decode.');
      return;
    }
    try {
      const binStr = atob(decodeInput.trim());
      const bytes = Uint8Array.from(binStr, (c) => c.charCodeAt(0));
      updateState({ decodeOutput: new TextDecoder().decode(bytes) });
      toast.success('Decoded successfully!');
    } catch {
      toast.error('Invalid Base64 string.');
    }
  }

  function sendToDecoder() {
    updateState({ decodeInput: encodeOutput, decodeOutput: '' });
    toast.info('Sent to decoder.');
  }

  function sendToEncoder() {
    updateState({ encodeInput: decodeOutput, encodeOutput: '' });
    toast.info('Sent to encoder.');
  }

  return (
    <div className="space-y-6">
      {/* Encode section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded bg-primary/10 flex items-center justify-center">
            <ArrowDown className="h-3 w-3 text-primary" />
          </div>
          <h2 className="text-sm font-semibold text-foreground">Encode — Text → Base64</h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <SectionCard title="Plain Text Input">
            <Textarea
              value={encodeInput}
              onChange={(e) => updateState({ encodeInput: e.target.value })}
              placeholder="Enter text to encode..."
              className="font-mono text-sm h-[140px] sm:h-[180px] resize-y border-0 rounded-none focus-visible:ring-0 bg-transparent px-3 sm:px-4 py-3"
            />
            <div className="p-3 bg-muted/20 border-t">
              <Button onClick={handleEncode} className="w-full">
                Encode to Base64
              </Button>
            </div>
          </SectionCard>

          <SectionCard
            title="Base64 Output"
            actions={
              <>
                {encodeOutput && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={sendToDecoder}
                    className="h-7 gap-1 text-xs"
                    title="Send to decoder"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                    Send to decoder
                  </Button>
                )}
                {encodeOutput && <CopyButton getText={() => encodeOutput} label="Copy" />}
              </>
            }
          >
            <Textarea
              readOnly
              value={encodeOutput}
              placeholder="Base64 output will appear here..."
              className="font-mono text-sm h-[140px] sm:h-[180px] resize-y border-0 rounded-none focus-visible:ring-0 bg-transparent px-3 sm:px-4 py-3"
            />
          </SectionCard>
        </div>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-dashed" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-3 text-xs text-muted-foreground">─── or ───</span>
        </div>
      </div>

      {/* Decode section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded bg-primary/10 flex items-center justify-center">
            <ArrowUp className="h-3 w-3 text-primary" />
          </div>
          <h2 className="text-sm font-semibold text-foreground">Decode — Base64 → Text</h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <SectionCard title="Base64 Input">
            <Textarea
              value={decodeInput}
              onChange={(e) => updateState({ decodeInput: e.target.value })}
              placeholder="Paste Base64 string here..."
              className="font-mono text-sm h-[140px] sm:h-[180px] resize-y border-0 rounded-none focus-visible:ring-0 bg-transparent px-3 sm:px-4 py-3"
            />
            <div className="flex gap-2 p-3 bg-muted/20 border-t">
              <Button onClick={handleDecode} className="flex-1">
                Decode from Base64
              </Button>
              {decodeInput && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateState({ decodeInput: '', decodeOutput: '' })}
                  title="Clear"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
            </div>
          </SectionCard>

          <SectionCard
            title="Decoded Text Output"
            actions={
              <>
                {decodeOutput && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={sendToEncoder}
                    className="h-7 gap-1 text-xs"
                    title="Send to encoder"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                    Send to encoder
                  </Button>
                )}
                {decodeOutput && <CopyButton getText={() => decodeOutput} label="Copy" />}
              </>
            }
          >
            <Textarea
              readOnly
              value={decodeOutput}
              placeholder="Decoded text will appear here..."
              className="font-mono text-sm h-[140px] sm:h-[180px] resize-y border-0 rounded-none focus-visible:ring-0 bg-transparent px-3 sm:px-4 py-3"
            />
          </SectionCard>
        </div>
      </div>

      {/* Info */}
      <div className="rounded-lg border bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
        Uses <code className="font-mono bg-muted px-1 rounded">btoa()</code> /{' '}
        <code className="font-mono bg-muted px-1 rounded">atob()</code> browser APIs with{' '}
        <code className="font-mono bg-muted px-1 rounded">TextEncoder</code> for full Unicode support.
        All processing is local — nothing leaves your browser.
      </div>
    </div>
  );
}
