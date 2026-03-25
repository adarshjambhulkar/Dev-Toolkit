import { useState } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Footer } from '@/components/layout/Footer';
import { DecryptPage } from '@/pages/Decrypt/DecryptPage';
import { EncryptPage } from '@/pages/Encrypt/EncryptPage';
import { JsonFormatterPage } from '@/pages/JsonFormatter/JsonFormatterPage';
import { JsonComparePage } from '@/pages/JsonCompare/JsonComparePage';
import { JsonSchemaPage } from '@/pages/JsonSchema/JsonSchemaPage';
import { Base64Page } from '@/pages/Base64/Base64Page';
import { JsonSerializePage } from '@/pages/JsonSerialize/JsonSerializePage';
import { CharCounterPage } from '@/pages/CharCounter/CharCounterPage';
import { CodeToStringPage } from '@/pages/CodeToString/CodeToStringPage';
import { useTheme } from '@/hooks/useTheme';
import { useSecretKey } from '@/hooks/useSecretKey';
import type { ToolId } from '@/types';

const TOOL_META: Record<ToolId, { title: string; description: string }> = {
  decrypt: { title: 'AES-CBC 256 Decrypt', description: 'Decrypt Base64-encoded cipher text' },
  encrypt: { title: 'AES-CBC 256 Encrypt', description: 'Encrypt plain text with AES-CBC 256' },
  formatter: { title: 'JSON Formatter', description: 'Format, prettify, or stringify JSON' },
  compare: { title: 'JSON Compare', description: 'Diff two JSON objects side-by-side' },
  schema: { title: 'JSON to Schema', description: 'Generate JSON Schema from a JSON sample' },
  base64: { title: 'Base64 Encode / Decode', description: 'Encode text to Base64 (btoa) or decode Base64 to text (atob)' },
  jsonserialize: { title: 'JSON Serialize / Deserialize', description: 'Serialize objects to JSON strings and deserialize JSON strings to objects' },
  charcounter: { title: 'Character Counter', description: 'Count characters, words, lines, and more' },
  codetostring: { title: 'Code to String', description: 'Escape and wrap code into a string literal' },
};

function App() {
  const { theme, toggleTheme } = useTheme();
  const { secretKey, setSecretKey } = useSecretKey();
  const [activeTool, setActiveTool] = useState<ToolId>('decrypt');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const meta = TOOL_META[activeTool];

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-background text-foreground overflow-hidden">
        <Sidebar
          activeTool={activeTool}
          onToolChange={setActiveTool}
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />

        <div className="flex flex-col flex-1 overflow-hidden min-w-0">
          <Header
            theme={theme}
            onToggleTheme={toggleTheme}
            title={meta.title}
            description={meta.description}
            onMenuClick={() => setMobileSidebarOpen(true)}
          />

          <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 flex flex-col">
            <div className="flex-1">
              <PageWrapper activeKey={activeTool}>
                {activeTool === 'decrypt' && (
                  <DecryptPage secretKey={secretKey} onSecretKeyChange={setSecretKey} />
                )}
                {activeTool === 'encrypt' && (
                  <EncryptPage secretKey={secretKey} onSecretKeyChange={setSecretKey} />
                )}
                {activeTool === 'formatter' && <JsonFormatterPage />}
                {activeTool === 'compare' && <JsonComparePage />}
                {activeTool === 'schema' && <JsonSchemaPage />}
                {activeTool === 'base64' && <Base64Page />}
                {activeTool === 'jsonserialize' && <JsonSerializePage />}
                {activeTool === 'charcounter' && <CharCounterPage />}
                {activeTool === 'codetostring' && <CodeToStringPage />}
              </PageWrapper>
            </div>
            <Footer />
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}

export default App;
