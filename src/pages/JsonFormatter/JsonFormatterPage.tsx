import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { JsonTreeViewer } from '@/components/shared/JsonTreeViewer';
import { CopyButton } from '@/components/shared/CopyButton';
import { SectionCard } from '@/components/shared/SectionCard';

type Mode = 'format' | 'stringify' | null;

export function JsonFormatterPage() {
  const [input, setInput] = useState('');
  const [parsed, setParsed] = useState<unknown>(null);
  const [stringified, setStringified] = useState('');
  const [mode, setMode] = useState<Mode>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  function handleFormat() {
    if (!input.trim()) {
      toast.warning('Please enter JSON to format.');
      return;
    }
    try {
      const p = JSON.parse(input) as unknown;
      setParsed(p);
      setMode('format');
      setIsCollapsed(false);
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
      setParsed(p);
      setStringified(str);
      setMode('stringify');
      toast.success('JSON stringified successfully!');
    } catch {
      toast.error('Invalid JSON. Please check your input.');
    }
  }

  return (
    <div className="space-y-5">
      {/* Input */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">JSON Input</Label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"key": "value", "array": [1, 2, 3]}'
          className="font-mono text-sm min-h-[100px] sm:min-h-[180px] resize-y"
        />
        <div className="flex gap-2">
          <Button onClick={handleFormat} className="flex-1">Format</Button>
          <Button onClick={handleStringify} variant="secondary" className="flex-1">Stringify</Button>
        </div>
      </div>

      {/* Output */}
      {mode === 'format' && parsed !== null && (
        <SectionCard
          title="Formatted JSON"
          actions={
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed((prev) => !prev)}
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
          <div className="overflow-auto max-h-[500px] p-4">
            <pre className="font-mono text-sm text-foreground whitespace-pre-wrap break-all">
              {stringified}
            </pre>
          </div>
        </SectionCard>
      )}
    </div>
  );
}
