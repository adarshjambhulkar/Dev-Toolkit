import { ChevronDown, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { JsonTreeViewer } from '@/components/shared/JsonTreeViewer';
import { CopyButton } from '@/components/shared/CopyButton';
import { SectionCard } from '@/components/shared/SectionCard';
import { useAppDispatch, useAppSelector } from '@/store';
import { setFormatterState } from '@/store/slices/toolsSlice';

export default function JsonFormatterPage() {
  const dispatch = useAppDispatch();
  const formatterState = useAppSelector((state) => state.tools.formatter);
  const { input, parsed, stringified, mode, isCollapsed } = formatterState;

  const updateState = (updates: Partial<typeof formatterState>) => dispatch(setFormatterState(updates));

  function handleFormat() {
    if (!input.trim()) {
      toast.warning('Please enter JSON to format.');
      return;
    }
    try {
      const p = JSON.parse(input) as unknown;
      updateState({ parsed: p, mode: 'format', isCollapsed: false });
      toast.success('JSON formatted successfully!');
    } catch {
      toast.error('Invalid JSON. Please check your input.');
    }
  }

  function handleStringify() {
    if (!input.trim()) {
      toast.warning('Please enter JSON to stringify.');
      return;
    }
    try {
      const p = JSON.parse(input) as unknown;
      const str = JSON.stringify(JSON.stringify(p));
      updateState({ parsed: p, stringified: str, mode: 'stringify' });
      toast.success('JSON stringified successfully!');
    } catch {
      toast.error('Invalid JSON. Please check your input.');
    }
  }

  return (
    <div className="space-y-5">
      <SectionCard title="JSON Input">
        <Textarea
          value={input}
          onChange={(e) => updateState({ input: e.target.value })}
          placeholder='{"key": "value", "array": [1, 2, 3]}'
          className="font-mono text-sm h-[180px] sm:h-[240px] resize-y border-0 rounded-none focus-visible:ring-0 bg-transparent px-3 sm:px-4 py-3"
        />
        <div className="flex gap-2 p-3 bg-muted/20 border-t">
          <Button onClick={handleFormat} className="flex-1">Format</Button>
          <Button onClick={handleStringify} variant="secondary" className="flex-1">Stringify</Button>
        </div>
      </SectionCard>

      {/* Output */}
      {mode === 'format' && parsed !== null && (
        <SectionCard
          title="Formatted JSON"
          actions={
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateState({ isCollapsed: !isCollapsed })}
                className="h-7 gap-1 text-xs"
              >
                {isCollapsed ? (
                  <><ChevronRight className="h-3.5 w-3.5" />Expand</>
                ) : (
                  <><ChevronDown className="h-3.5 w-3.5" />Collapse</>
                )}
              </Button>
              <CopyButton
                getText={() => JSON.stringify(parsed, null, 2)}
                label="Copy"
              />
            </>
          }
        >
          <div className="overflow-auto max-h-[500px]">
            <JsonTreeViewer data={parsed} collapsed={isCollapsed} />
          </div>
        </SectionCard>
      )}

      {mode === 'stringify' && (
        <SectionCard
          title="Stringified JSON"
          actions={
            <CopyButton getText={() => stringified} label="Copy" />
          }
        >
          <div className="overflow-auto max-h-[500px] px-3 sm:px-4 py-3">
            <pre className="font-mono text-sm text-foreground whitespace-pre-wrap break-all">
              {stringified}
            </pre>
          </div>
        </SectionCard>
      )}
    </div>
  );
}
