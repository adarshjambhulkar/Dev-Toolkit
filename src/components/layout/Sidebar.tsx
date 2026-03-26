import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Lock, LockOpen, Braces, GitCompare, FileJson, Binary, Layers, X, CaseSensitive, Code2 } from 'lucide-react';
import type { ToolId } from '@/types';
import { cn } from '@/lib/utils';

interface NavItem {
  id: ToolId;
  path: string;
  label: string;
  icon: React.ElementType;
  description: string;
}

interface NavCategory {
  title: string;
  items: NavItem[];
}

const NAV_CATEGORIES: NavCategory[] = [
  {
    title: 'Cryptography',
    items: [
      { id: 'encrypt', path: '/encrypt', label: 'Encrypt', icon: Lock, description: 'AES-CBC 256' },
      { id: 'decrypt', path: '/decrypt', label: 'Decrypt', icon: LockOpen, description: 'AES-CBC 256' },
      { id: 'base64', path: '/base64', label: 'Base64', icon: Binary, description: 'atob / btoa encode' },
    ],
  },
  {
    title: 'JSON Tools',
    items: [
      { id: 'formatter', path: '/formatter', label: 'Formatter', icon: Braces, description: 'Format & Stringify' },
      { id: 'compare', path: '/compare', label: 'Compare', icon: GitCompare, description: 'JSON Diff' },
      { id: 'schema', path: '/schema', label: 'Schema', icon: FileJson, description: 'JSON to Schema' },
      { id: 'jsonserialize', path: '/jsonserialize', label: 'Serialize', icon: Layers, description: 'Serialize & Deserialize' },
    ],
  },
  {
    title: 'Text & Utilities',
    items: [
      { id: 'charcounter', path: '/charcounter', label: 'Char Counter', icon: CaseSensitive, description: 'Words, chars & more' },
      { id: 'codetostring', path: '/codetostring', label: 'Code → String', icon: Code2, description: 'Escape code to string' },
    ],
  },
];

interface SidebarProps {
  activeTool: ToolId;
  /** Mobile only: whether the drawer is open */
  mobileOpen?: boolean;
  /** Mobile only: close the drawer */
  onMobileClose?: () => void;
}

function SidebarContent({
  activeTool,
  onMobileClose,
}: {
  activeTool: ToolId;
  onMobileClose?: () => void;
}) {
  return (
    <div className="flex flex-col h-full bg-sidebar">
      {/* Brand */}
      <div className="px-4 py-5 border-b flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
            <Braces className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-bold leading-none text-foreground">Dev Toolkit</p>
            <p className="text-xs text-muted-foreground mt-0.5">Developer Utilities</p>
          </div>
        </div>
        {/* Close button — mobile only */}
        {onMobileClose && (
          <button
            onClick={onMobileClose}
            className="md:hidden p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 space-y-4 overflow-y-auto">
        {NAV_CATEGORIES.map((category) => (
          <div key={category.title} className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground px-2 pb-1">
              {category.title}
            </p>
            {category.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTool === item.id;

              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  onClick={onMobileClose}
                  className={({ isActive: linkActive }) => cn(
                    'relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors duration-150',
                    linkActive
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60',
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 rounded-lg bg-accent"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon className="relative z-10 h-4 w-4 shrink-0" />
                  <div className="relative z-10 min-w-0">
                    <p className="text-sm font-medium leading-none">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.description}</p>
                  </div>
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>
    </div>
  );
}

export function Sidebar({ activeTool, mobileOpen = false, onMobileClose }: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar — always visible on md+ */}
      <aside className="hidden md:flex w-52 shrink-0 border-r flex-col h-full">
        <SidebarContent activeTool={activeTool} onMobileClose={onMobileClose} />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={onMobileClose}
            />
            {/* Drawer panel */}
            <motion.aside
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 35 }}
              className="fixed inset-y-0 left-0 z-50 w-64 border-r shadow-xl md:hidden"
            >
              <SidebarContent
                activeTool={activeTool}
                onMobileClose={onMobileClose}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
