import { useState, Suspense, useMemo } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Footer } from '@/components/layout/Footer';
import { useTheme } from '@/hooks/useTheme';
import { useSecretKey } from '@/hooks/useSecretKey';
import { routes, defaultRoute, isCryptRoute } from '@/routes/routes';
import type { ToolId } from '@/types';
import { Loader2 } from 'lucide-react';

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

function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground animate-pulse">Loading tool...</p>
    </div>
  );
}

function App() {
  const { theme, toggleTheme } = useTheme();
  const { secretKey, setSecretKey } = useSecretKey();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  const activeTool = useMemo(() => {
    const route = routes.find((r) => r.path === location.pathname);
    return route?.id || 'decrypt';
  }, [location.pathname]);

  const meta = TOOL_META[activeTool];

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-background text-foreground overflow-hidden">
        <Sidebar
          activeTool={activeTool}
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
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Navigate to={defaultRoute} replace />} />
                    {routes.map((route) => {
                      if (isCryptRoute(route)) {
                        const CryptComponent = route.component;
                        return (
                          <Route
                            key={route.path}
                            path={route.path}
                            element={<CryptComponent secretKey={secretKey} onSecretKeyChange={setSecretKey} />}
                          />
                        );
                      }
                      const GenericComponent = route.component;
                      return (
                        <Route
                          key={route.path}
                          path={route.path}
                          element={<GenericComponent />}
                        />
                      );
                    })}
                    <Route path="*" element={<Navigate to={defaultRoute} replace />} />
                  </Routes>
                </Suspense>
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
