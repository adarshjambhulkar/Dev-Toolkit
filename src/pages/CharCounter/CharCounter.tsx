import { useMemo } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { SectionCard } from '@/components/shared/SectionCard';
import { RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store';
import { setCharCounterState } from '@/store/slices/toolsSlice';

interface Stat {
  label: string;
  value: number;
  accent?: boolean;
}

function analyse(text: string) {
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const lines = text === '' ? 0 : text.split('\n').length;
  const sentences = text.trim() === '' ? 0 : (text.match(/[^.!?]*[.!?]+/g) ?? []).length;
  const paragraphs = text.trim() === '' ? 0 : text.split(/\n\s*\n/).filter((p) => p.trim() !== '').length;
  const bytes = new TextEncoder().encode(text).length;
  const uniqueChars = new Set(text.replace(/\s/g, '')).size;
  const avgWordLen =
    words === 0
      ? 0
      : Math.round((charsNoSpaces / words) * 10) / 10;

  return { chars, charsNoSpaces, words, lines, sentences, paragraphs, bytes, uniqueChars, avgWordLen };
}

// Character frequency top-N
function topChars(text: string, n = 10): { char: string; count: number; pct: number }[] {
  const freq = new Map<string, number>();
  for (const ch of text) {
    if (ch === '\n' || ch === '\r') continue;
    freq.set(ch, (freq.get(ch) ?? 0) + 1);
  }
  const total = [...freq.values()].reduce((a, b) => a + b, 0);
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([char, count]) => ({
      char: char === ' ' ? '·space·' : char,
      count,
      pct: total === 0 ? 0 : Math.round((count / total) * 1000) / 10,
    }));
}

function StatCard({ label, value, accent }: Stat) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border p-3 sm:p-4 gap-1',
        accent ? 'bg-primary/5 border-primary/20' : 'bg-muted/30',
      )}
    >
      <span className={cn('text-2xl sm:text-3xl font-bold tabular-nums', accent ? 'text-primary' : 'text-foreground')}>
        {value.toLocaleString()}
      </span>
      <span className="text-xs text-muted-foreground text-center leading-tight">{label}</span>
    </div>
  );
}

export default function CharCounterPage() {
  const dispatch = useAppDispatch();
  const charCounterState = useAppSelector((state) => state.tools.charcounter);
  const { text, showFreq } = charCounterState;

  const updateState = (updates: Partial<typeof charCounterState>) => dispatch(setCharCounterState(updates));

  const stats = useMemo(() => analyse(text), [text]);
  const freq = useMemo(() => (showFreq ? topChars(text) : []), [text, showFreq]);

  const primaryStats: Stat[] = [
    { label: 'Characters', value: stats.chars, accent: true },
    { label: 'Without spaces', value: stats.charsNoSpaces },
    { label: 'Words', value: stats.words },
    { label: 'Lines', value: stats.lines },
    { label: 'Sentences', value: stats.sentences },
    { label: 'Paragraphs', value: stats.paragraphs },
    { label: 'Bytes (UTF-8)', value: stats.bytes },
    { label: 'Unique chars', value: stats.uniqueChars },
  ];

  return (
    <div className="space-y-5">
      <SectionCard
        title="Input Text"
        actions={
          text && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-xs"
              onClick={() => updateState({ text: '' })}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Clear
            </Button>
          )
        }
      >
        <Textarea
          value={text}
          onChange={(e) => updateState({ text: e.target.value })}
          placeholder="Type or paste any text here to analyse it…"
          className="font-mono text-sm h-[180px] sm:h-[240px] resize-y border-0 rounded-none focus-visible:ring-0 bg-transparent px-3 sm:px-4 py-3"
          autoFocus
        />
      </SectionCard>

      {/* Stat grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
        {primaryStats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Extra derived stat */}
      {stats.words > 0 && (
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs gap-1">
            Avg word length
            <span className="font-bold">{stats.avgWordLen}</span>
          </Badge>
          <Badge variant="secondary" className="text-xs gap-1">
            Reading time (200 wpm)
            <span className="font-bold">
              {stats.words < 200
                ? `${Math.ceil((stats.words / 200) * 60)}s`
                : `${Math.ceil(stats.words / 200)} min`}
            </span>
          </Badge>
        </div>
      )}

      {/* Char frequency toggle */}
      <div className="flex items-center gap-2">
        <Switch id="freq" checked={showFreq} onCheckedChange={(v) => updateState({ showFreq: v })} />
        <Label htmlFor="freq" className="text-sm cursor-pointer">
          Show character frequency (top 10)
        </Label>
      </div>

      {showFreq && text.trim() !== '' && (
        <div className="rounded-lg border overflow-hidden">
          <div className="px-4 py-2.5 border-b bg-muted/40">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Frequency Analysis
            </span>
          </div>
          <div className="p-3 space-y-1.5">
            {freq.map(({ char, count, pct }) => (
              <div key={char} className="flex items-center gap-3">
                <code className="w-16 shrink-0 text-xs font-mono text-foreground bg-muted px-1.5 py-0.5 rounded truncate">
                  {char}
                </code>
                <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-12 shrink-0 text-right text-xs text-muted-foreground tabular-nums">
                  {count}
                </span>
                <span className="w-10 shrink-0 text-right text-xs text-muted-foreground tabular-nums">
                  {pct}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
