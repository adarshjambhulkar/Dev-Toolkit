import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
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
import { JsonTreeViewer } from '@/components/shared/JsonTreeViewer';
import { CopyButton } from '@/components/shared/CopyButton';
import { SectionCard } from '@/components/shared/SectionCard';
import { generateJsonSchema } from '@/utils/jsonSchema';
import type { SchemaVersion } from '@/types';

export function JsonSchemaPage() {
  const [input, setInput] = useState('');
  const [schema, setSchema] = useState<Record<string, unknown> | null>(null);
  const [version, setVersion] = useState<SchemaVersion>('2020-12');
  const [strictMode, setStrictMode] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  function handleGenerate() {
    if (!input.trim()) {
      toast.warning('Please enter JSON to generate a schema from.');
      return;
    }
    try {
      const parsed = JSON.parse(input) as unknown;
      const result = generateJsonSchema(parsed, { version, strictMode });
      setSchema(result);
      setIsCollapsed(false);
      toast.success('Schema generated successfully!');
    } catch {
      toast.error('Invalid JSON. Please check your input.');
    }
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">JSON Input</Label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"id": 1, "name": "Alice", "email": "alice@example.com"}'
          className="font-mono text-sm min-h-[100px] sm:min-h-[180px] resize-y"
        />
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={handleGenerate}>Generate Schema</Button>

        <Select value={version} onValueChange={(v) => setVersion(v as SchemaVersion)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2020-12">Draft 2020-12 (Latest)</SelectItem>
            <SelectItem value="2019-09">Draft 2019-09</SelectItem>
            <SelectItem value="draft-07">Draft 07</SelectItem>
            <SelectItem value="draft-04">Draft 04</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Switch
            id="strict-mode"
            checked={strictMode}
            onCheckedChange={setStrictMode}
          />
          <Label htmlFor="strict-mode" className="text-sm cursor-pointer">
            Strict Mode
          </Label>
        </div>
      </div>

      {/* Info banner */}
      <div className="rounded-lg border bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">Strict mode</span> adds{' '}
        <code className="font-mono bg-muted px-1 rounded text-xs">required</code> and{' '}
        <code className="font-mono bg-muted px-1 rounded text-xs">additionalProperties: false</code>{' '}
        to all object schemas.
      </div>

      {schema !== null && (
        <SectionCard
          title="Generated Schema"
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
                getText={() => JSON.stringify(schema, null, 2)}
                label="Copy Schema"
              />
            </>
          }
        >
          <div className="overflow-auto max-h-[500px]">
            <JsonTreeViewer data={schema} collapsed={isCollapsed} />
          </div>
        </SectionCard>
      )}
    </div>
  );
}
