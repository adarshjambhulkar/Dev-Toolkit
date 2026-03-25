import { useState } from 'react';
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
import { CopyButton } from '@/components/shared/CopyButton';
import { SectionCard } from '@/components/shared/SectionCard';
import { RotateCcw, ArrowLeftRight } from 'lucide-react';

type QuoteStyle = 'double' | 'single' | 'backtick';
type Mode = 'encode' | 'decode';

function codeToString(code: string, quote: QuoteStyle, addNewlines: boolean): string {
  let escaped = code
    .replace(/\\/g, '\\\\')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');

  if (quote === 'backtick') {
    escaped = escaped.replace(/`/g, '\\`').replace(/\$/g, '\\$');
    return '`' + escaped + '`';
  }

  const q = quote === 'double' ? '"' : "'";
  const escapedQuote = quote === 'double' ? '\\"' : "\\'";

  escaped = escaped.replace(new RegExp(q, 'g'), escapedQuote);

  if (addNewlines) {
    // Wrap each line with the quote + newline literal + quote for readability
    const lines = escaped.split('\n');
    if (lines.length === 1) return q + escaped + q;
    return lines.map((line, i) => {
      const isLast = i === lines.length - 1;
      const suffix = isLast ? '' : '\\n';
      return q + line + suffix + q;
    }).join(' +\n');
  }

  escaped = escaped.replace(/\n/g, '\\n');
  return q + escaped + q;
}

function stringToCode(str: string): string {
  const trimmed = str.trim();

  // Detect and strip surrounding quotes (double, single, or backtick)
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    const inner = trimmed.slice(1, -1);
    return inner
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\r/g, '\r')
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'")
      .replace(/\\\\/g, '\\');
  }

  if (trimmed.startsWith('`') && trimmed.endsWith('`')) {
    const inner = trimmed.slice(1, -1);
    return inner
      .replace(/\\`/g, '`')
      .replace(/\\\$/g, '$')
      .replace(/\\\\/g, '\\');
  }

  // Multi-line concatenated string: "..." + \n "..."
  if (trimmed.includes('" +') || trimmed.includes("' +")) {
    const lines = trimmed.split(/\s*\+\s*\n\s*/);
    return lines
      .map((l) => {
        const t = l.trim();
        const inner = t.slice(1, -1); // strip surrounding quotes
        return inner
          .replace(/\\n/g, '\n')
          .replace(/\\t/g, '\t')
          .replace(/\\r/g, '\r')
          .replace(/\\"/g, '"')
          .replace(/\\'/g, "'")
          .replace(/\\\\/g, '\\');
      })
      .join('');
  }

  // No wrapping quotes — treat as raw escaped string
  return str
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\r/g, '\r')
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, '\\');
}

export function CodeToStringPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [quoteStyle, setQuoteStyle] = useState<QuoteStyle>('double');
  const [multiLine, setMultiLine] = useState(false);
  const [mode, setMode] = useState<Mode>('encode');

  function handleConvert() {
    if (!input.trim()) {
      toast.warning('Please enter some code or text.');
      return;
    }
    try {
      if (mode === 'encode') {
        setOutput(codeToString(input, quoteStyle, multiLine));
        toast.success('Converted to string!');
      } else {
        setOutput(stringToCode(input));
        toast.success('Decoded back to original!');
      }
    } catch {
      toast.error('Conversion failed. Check your input.');
    }
  }

  function swapMode() {
    setMode((m) => (m === 'encode' ? 'decode' : 'encode'));
    setInput(output);
    setOutput('');
  }

  function handleClear() {
    setInput('');
    setOutput('');
  }

  const isEncode = mode === 'encode';

  return (
    <div className="space-y-5">
      {/* Mode bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 p-1 rounded-lg bg-muted border text-sm">
          <button
            onClick={() => setMode('encode')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              isEncode ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Code → String
          </button>
          <button
            onClick={() => setMode('decode')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              !isEncode ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            String → Code
          </button>
        </div>

        {output && (
          <Button variant="outline" size="sm" onClick={swapMode} className="gap-1.5 h-8">
            <ArrowLeftRight className="h-3.5 w-3.5" />
            Swap & flip
          </Button>
        )}

        {(input || output) && (
          <Button variant="ghost" size="sm" onClick={handleClear} className="gap-1.5 h-8">
            <RotateCcw className="h-3.5 w-3.5" />
            Clear
          </Button>
        )}
      </div>

      {/* Input */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          {isEncode ? 'Code / Multiline Text Input' : 'String Literal Input'}
        </Label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            isEncode
              ? 'Paste any code, SQL, HTML, JSON…\nMultiple lines are fine.'
              : '"Hello\\nWorld"  or  `template string`'
          }
          className="font-mono text-sm min-h-[120px] sm:min-h-[200px] resize-y"
        />
      </div>

      {/* Options (encode mode only) */}
      {isEncode && (
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <Button onClick={handleConvert}>Convert to String</Button>

          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground shrink-0">Quote style</Label>
            <Select value={quoteStyle} onValueChange={(v) => setQuoteStyle(v as QuoteStyle)}>
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="double">Double  "…"</SelectItem>
                <SelectItem value="single">Single  '…'</SelectItem>
                <SelectItem value="backtick">Backtick  `…`</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {quoteStyle !== 'backtick' && (
            <div className="flex items-center gap-2">
              <Switch id="multiline" checked={multiLine} onCheckedChange={setMultiLine} />
              <Label htmlFor="multiline" className="text-xs cursor-pointer">
                Multi-line concat
              </Label>
            </div>
          )}
        </div>
      )}

      {/* Decode button */}
      {!isEncode && (
        <Button onClick={handleConvert}>Decode to Original</Button>
      )}

      {/* Output */}
      {output && (
        <SectionCard
          title={isEncode ? 'String Literal Output' : 'Decoded Code Output'}
          actions={<CopyButton getText={() => output} label="Copy" />}
        >
          <div className="overflow-auto max-h-[400px] p-4">
            <pre className="font-mono text-sm text-foreground whitespace-pre-wrap break-all">
              {output}
            </pre>
          </div>
        </SectionCard>
      )}

      {/* Info */}
      <div className="rounded-lg border bg-muted/30 px-4 py-3 text-xs text-muted-foreground space-y-1">
        {isEncode ? (
          <>
            <p className="font-medium text-foreground">Escapes applied</p>
            <p>Backslashes, newlines (<code className="font-mono bg-muted px-1 rounded">\n</code>), tabs, and the chosen quote character are all escaped. Backtick mode also escapes <code className="font-mono bg-muted px-1 rounded">$</code>.</p>
            <p>Multi-line concat wraps each original line in its own quoted segment joined with <code className="font-mono bg-muted px-1 rounded">+</code>.</p>
          </>
        ) : (
          <>
            <p className="font-medium text-foreground">Accepted input formats</p>
            <p>Double-quoted <code className="font-mono bg-muted px-1 rounded">"…"</code>, single-quoted <code className="font-mono bg-muted px-1 rounded">'…'</code>, backtick <code className="font-mono bg-muted px-1 rounded">`…`</code>, multi-line concat, or raw escaped text.</p>
          </>
        )}
      </div>
    </div>
  );
}
