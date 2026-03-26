import { create } from 'jsondiffpatch';
import { format } from 'jsondiffpatch/formatters/html';
import type { Delta } from 'jsondiffpatch';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CopyButton } from '@/components/shared/CopyButton';
import { SectionCard } from '@/components/shared/SectionCard';
import { useAppDispatch, useAppSelector } from '@/store';
import { setCompareState } from '@/store/slices/toolsSlice';

export default function JsonComparePage() {
  const dispatch = useAppDispatch();
  const compareState = useAppSelector((state) => state.tools.compare);
  const { jsonA, jsonB, diffHtml, diffDelta } = compareState;

  const updateState = (updates: Partial<typeof compareState>) => dispatch(setCompareState(updates));

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
      updateState({ diffHtml: null, diffDelta: null });
      return;
    }

    // The HTML formatter returns an HTML string — safe to use since input is local user JSON
    const html = format(delta as Delta, parsedA) ?? '';
    updateState({ diffHtml: html, diffDelta: delta as object });
    toast.success('Comparison complete!');
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <SectionCard title="JSON A (Original)">
          <Textarea
            value={jsonA}
            onChange={(e) => updateState({ jsonA: e.target.value })}
            placeholder='{"name": "Alice", "age": 30}'
            className="font-mono text-sm h-[200px] sm:h-[260px] resize-y border-0 rounded-none focus-visible:ring-0 bg-transparent px-3 sm:px-4 py-3"
          />
        </SectionCard>
        <SectionCard title="JSON B (Modified)">
          <Textarea
            value={jsonB}
            onChange={(e) => updateState({ jsonB: e.target.value })}
            placeholder='{"name": "Bob", "age": 25}'
            className="font-mono text-sm h-[200px] sm:h-[260px] resize-y border-0 rounded-none focus-visible:ring-0 bg-transparent px-3 sm:px-4 py-3"
          />
        </SectionCard>
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
          <div className="overflow-auto max-h-[500px] px-3 sm:px-4 py-3">
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
