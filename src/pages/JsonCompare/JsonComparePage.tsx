import { useState } from 'react';
import { create } from 'jsondiffpatch';
import { format } from 'jsondiffpatch/formatters/html';
import type { Delta } from 'jsondiffpatch';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CopyButton } from '@/components/shared/CopyButton';
import { SectionCard } from '@/components/shared/SectionCard';

export function JsonComparePage() {
  const [jsonA, setJsonA] = useState('');
  const [jsonB, setJsonB] = useState('');
  const [diffHtml, setDiffHtml] = useState<string | null>(null);
  const [diffDelta, setDiffDelta] = useState<object | null>(null);

  function handleCompare() {
    if (!jsonA.trim() || !jsonB.trim()) {
      toast.warning('Please enter both JSON inputs.');
      return;
    }

    let parsedA: unknown, parsedB: unknown;
    try {
      parsedA = JSON.parse(jsonA);
    } catch {
      toast.error('JSON A is invalid. Please check your input.');
      return;
    }
    try {
      parsedB = JSON.parse(jsonB);
    } catch {
      toast.error('JSON B is invalid. Please check your input.');
      return;
    }

    const instance = create();
    const delta = instance.diff(parsedA, parsedB);

    if (!delta) {
      toast.info('The two JSONs are identical.');
      setDiffHtml(null);
      setDiffDelta(null);
      return;
    }

    // The HTML formatter returns an HTML string — safe to use since input is local user JSON
    const html = format(delta as Delta, parsedA) ?? '';
    setDiffHtml(html);
    setDiffDelta(delta as object);
    toast.success('Comparison complete!');
  }

  return (
    <div className="space-y-5">
      {/* Side-by-side inputs */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-muted-foreground">JSON A (Original)</Label>
          <Textarea
            value={jsonA}
            onChange={(e) => setJsonA(e.target.value)}
            placeholder='{"name": "Alice", "age": 30}'
            className="font-mono text-sm min-h-[120px] sm:min-h-[200px] resize-y"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-muted-foreground">JSON B (Modified)</Label>
          <Textarea
            value={jsonB}
            onChange={(e) => setJsonB(e.target.value)}
            placeholder='{"name": "Bob", "age": 25}'
            className="font-mono text-sm min-h-[120px] sm:min-h-[200px] resize-y"
          />
        </div>
      </div>

      <Button onClick={handleCompare} className="w-full">Compare</Button>

      {diffHtml !== null && (
        <SectionCard
          title="Diff Result"
          actions={
            diffDelta ? (
              <CopyButton
                getText={() => JSON.stringify(diffDelta, null, 2)}
                label="Copy Diff"
              />
            ) : undefined
          }
        >
          <div className="overflow-auto max-h-[500px] p-4">
            {/* dangerouslySetInnerHTML is safe here — content comes from user's local JSON only */}
            <div
              className="jsondiffpatch-delta font-mono text-sm"
              dangerouslySetInnerHTML={{ __html: diffHtml }}
            />
          </div>
        </SectionCard>
      )}
    </div>
  );
}
