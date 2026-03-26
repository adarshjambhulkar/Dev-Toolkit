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
import { useAppDispatch, useAppSelector } from '@/store';
import { setSchemaState } from '@/store/slices/toolsSlice';

export default function JsonSchemaPage() {
  const dispatch = useAppDispatch();
  const schemaState = useAppSelector((state) => state.tools.schema);
  const { input, schema, version, strictMode, isCollapsed } = schemaState;

  const updateState = (updates: Partial<typeof schemaState>) => dispatch(setSchemaState(updates));

  function handleGenerate() {
    if (!input.trim()) {
      toast.warning('Please enter JSON to generate a schema from.');
      return;
    }
    try {
      const parsed = JSON.parse(input) as unknown;
      const result = generateJsonSchema(parsed, { version, strictMode });
      updateState({ schema: result, isCollapsed: false });
      toast.success('Schema generated successfully!');
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
          placeholder='{"id": 1, "name": "Alice", "email": "alice@example.com"}'
          className="font-mono text-sm h-[180px] sm:h-[240px] resize-y border-0 rounded-none focus-visible:ring-0 bg-transparent px-3 sm:px-4 py-3"
        />
      </SectionCard>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={handleGenerate}>Generate Schema</Button>

        <Select value={version} onValueChange={(v) => updateState({ version: v as SchemaVersion })}>
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
            onCheckedChange={(v) => updateState({ strictMode: v })}
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
