import { ChevronDown, ChevronRight, Info } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { JsonTreeViewer } from '@/components/shared/JsonTreeViewer';
import { CopyButton } from '@/components/shared/CopyButton';
import { SectionCard } from '@/components/shared/SectionCard';
import { useAppDispatch, useAppSelector } from '@/store';
import { setJsonSerializeState } from '@/store/slices/toolsSlice';

function inferValueType(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return `array[${(value as unknown[]).length}]`;
  return typeof value;
}

function countKeys(value: unknown): number | null {
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    return Object.keys(value as object).length;
  }
  return null;
}

export default function JsonSerializePage() {
  const dispatch = useAppDispatch();
  const serializeState = useAppSelector((state) => state.tools.jsonserialize);
  const { 
    serializeInput, 
    serialized, 
    indentSize, 
    sortKeys, 
    deserializeInput, 
    deserialized, 
    isCollapsed, 
    revivedDates, 
    activeMode 
  } = serializeState;

  const updateState = (updates: Partial<typeof serializeState>) => dispatch(setJsonSerializeState(updates));

  function getIndent(): number | string {
    if (indentSize === 'tab') return '\t';
    return parseInt(indentSize, 10);
  }

  function handleSerialize() {
    if (!serializeInput.trim()) {
      toast.warning('Please enter a value to serialize.');
      return;
    }
    try {
      const parsed = JSON.parse(serializeInput) as unknown;

      let replacer: ((key: string, value: unknown) => unknown) | null = null;
      if (sortKeys) {
        replacer = (_key: string, val: unknown) => {
          if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
            return Object.fromEntries(
              Object.entries(val as Record<string, unknown>).sort(([a], [b]) =>
                a.localeCompare(b),
              ),
            );
          }
          return val;
        };
      }

      const result = JSON.stringify(parsed, replacer ?? undefined, getIndent());
      updateState({ serialized: result, activeMode: 'serialize' });
      toast.success('Serialized successfully!');
    } catch {
      toast.error('Invalid JSON input.');
    }
  }

  function handleDeserialize() {
    if (!deserializeInput.trim()) {
      toast.warning('Please enter a JSON string to deserialize.');
      return;
    }
    try {
      let reviver: ((key: string, value: unknown) => unknown) | undefined;
      if (revivedDates) {
        const ISO_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;
        reviver = (_key: string, val: unknown) => {
          if (typeof val === 'string' && ISO_DATE.test(val)) return new Date(val);
          return val;
        };
      }

      const parsed = JSON.parse(deserializeInput, reviver) as unknown;
      updateState({ deserialized: parsed, isCollapsed: false, activeMode: 'deserialize' });
      toast.success('Deserialized successfully!');
    } catch {
      toast.error('Invalid JSON string. Parsing failed.');
    }
  }

  const valueType = deserialized !== null ? inferValueType(deserialized) : null;
  const keyCount = deserialized !== null ? countKeys(deserialized) : null;

  return (
    <div className="space-y-6">
      {/* ── Serialize ── */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
            S
          </div>
          <h2 className="text-sm font-semibold text-foreground">
            Serialize — Object → JSON String
          </h2>
        </div>

        <SectionCard title="JSON Input (object / array)">
          <Textarea
            value={serializeInput}
            onChange={(e) => updateState({ serializeInput: e.target.value })}
            placeholder={'{"name":"Alice","age":30,"tags":["dev","ts"]}'}
            className="font-mono text-sm h-[140px] sm:h-[180px] resize-y border-0 rounded-none focus-visible:ring-0 bg-transparent px-3 sm:px-4 py-3"
          />
        </SectionCard>

        {/* Options */}
        <div className="flex flex-wrap items-center gap-4">
          <Button onClick={handleSerialize}>Serialize</Button>

          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground">Indent</Label>
            <Select value={indentSize} onValueChange={(v) => updateState({ indentSize: v })}>
              <SelectTrigger className="w-28 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 spaces</SelectItem>
                <SelectItem value="4">4 spaces</SelectItem>
                <SelectItem value="tab">Tab</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Switch id="sort-keys" checked={sortKeys} onCheckedChange={(v) => updateState({ sortKeys: v })} />
            <Label htmlFor="sort-keys" className="text-xs cursor-pointer">Sort keys</Label>
          </div>
        </div>

        {activeMode === 'serialize' && serialized && (
          <SectionCard
            title="Serialized Output"
            actions={<CopyButton getText={() => serialized} label="Copy" />}
          >
            <div className="overflow-auto max-h-72 px-3 sm:px-4 py-3">
              <pre className="font-mono text-sm text-foreground whitespace-pre-wrap break-all">
                {serialized}
              </pre>
            </div>
          </SectionCard>
        )}
      </section>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-dashed" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-3 text-xs text-muted-foreground">─── or ───</span>
        </div>
      </div>

      {/* ── Deserialize ── */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
            D
          </div>
          <h2 className="text-sm font-semibold text-foreground">
            Deserialize — JSON String → Object
          </h2>
        </div>

        <SectionCard title="JSON String Input">
          <Textarea
            value={deserializeInput}
            onChange={(e) => updateState({ deserializeInput: e.target.value })}
            placeholder='"[{\"id\":1,\"name\":\"Alice\"}]"  or  [{\"id\":1}]'
            className="font-mono text-sm h-[140px] sm:h-[180px] resize-y border-0 rounded-none focus-visible:ring-0 bg-transparent px-3 sm:px-4 py-3"
          />
        </SectionCard>

        <div className="flex flex-wrap items-center gap-4">
          <Button onClick={handleDeserialize}>Deserialize</Button>

          <div className="flex items-center gap-2">
            <Switch id="revive-dates" checked={revivedDates} onCheckedChange={(v) => updateState({ revivedDates: v })} />
            <Label htmlFor="revive-dates" className="text-xs cursor-pointer">
              Revive ISO dates
            </Label>
            <div className="group relative">
              <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              <div className="absolute left-5 top-0 hidden group-hover:block z-20 w-56 rounded-md border bg-popover p-2 text-xs text-popover-foreground shadow-md">
                Converts ISO 8601 date strings (e.g. <code>2024-01-01T00:00:00Z</code>) to JavaScript{' '}
                <code>Date</code> objects during parsing.
              </div>
            </div>
          </div>
        </div>

        {activeMode === 'deserialize' && deserialized !== null && (
          <SectionCard
            title="Deserialized Object"
            actions={
              <>
                {valueType && (
                  <Badge variant="secondary" className="text-xs font-mono">
                    {valueType}
                    {keyCount !== null && ` · ${keyCount} keys`}
                  </Badge>
                )}
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
                  getText={() => JSON.stringify(deserialized, null, 2)}
                  label="Copy JSON"
                />
              </>
            }
          >
            <div className="overflow-auto max-h-[420px]">
              <JsonTreeViewer data={deserialized} collapsed={isCollapsed} />
            </div>
          </SectionCard>
        )}
      </section>
    </div>
  );
}
