import { useState } from 'react';
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

type IndentSize = '2' | '4' | 'tab';
type ActiveMode = 'serialize' | 'deserialize' | null;

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

export function JsonSerializePage() {
  // Serialize state
  const [serializeInput, setSerializeInput] = useState('');
  const [serialized, setSerialized] = useState('');
  const [indentSize, setIndentSize] = useState<IndentSize>('2');
  const [sortKeys, setSortKeys] = useState(false);

  // Deserialize state
  const [deserializeInput, setDeserializeInput] = useState('');
  const [deserialized, setDeserialized] = useState<unknown>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [revivedDates, setRevivedDates] = useState(false);

  const [activeMode, setActiveMode] = useState<ActiveMode>(null);

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
      setSerialized(result);
      setActiveMode('serialize');
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
      setDeserialized(parsed);
      setIsCollapsed(false);
      setActiveMode('deserialize');
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

        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">JSON Input (object / array)</Label>
          <Textarea
            value={serializeInput}
            onChange={(e) => setSerializeInput(e.target.value)}
            placeholder={'{"name":"Alice","age":30,"tags":["dev","ts"]}'}
            className="font-mono text-sm min-h-[120px] resize-y"
          />
        </div>

        {/* Options */}
        <div className="flex flex-wrap items-center gap-4">
          <Button onClick={handleSerialize}>Serialize</Button>

          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground">Indent</Label>
            <Select value={indentSize} onValueChange={(v) => setIndentSize(v as IndentSize)}>
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
            <Switch id="sort-keys" checked={sortKeys} onCheckedChange={setSortKeys} />
            <Label htmlFor="sort-keys" className="text-xs cursor-pointer">Sort keys</Label>
          </div>
        </div>

        {activeMode === 'serialize' && serialized && (
          <SectionCard
            title="Serialized Output"
            actions={<CopyButton getText={() => serialized} label="Copy" />}
          >
            <div className="overflow-auto max-h-72 p-4">
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

        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">JSON String Input</Label>
          <Textarea
            value={deserializeInput}
            onChange={(e) => setDeserializeInput(e.target.value)}
            placeholder='"[{\"id\":1,\"name\":\"Alice\"}]"  or  [{\"id\":1}]'
            className="font-mono text-sm min-h-[120px] resize-y"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Button onClick={handleDeserialize}>Deserialize</Button>

          <div className="flex items-center gap-2">
            <Switch id="revive-dates" checked={revivedDates} onCheckedChange={setRevivedDates} />
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
                  onClick={() => setIsCollapsed((p) => !p)}
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
