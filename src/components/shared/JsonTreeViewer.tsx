import JsonView from '@uiw/react-json-view';
import { darkTheme } from '@uiw/react-json-view/dark';
import { lightTheme } from '@uiw/react-json-view/light';

interface JsonTreeViewerProps {
  data: unknown;
  collapsed?: boolean;
  className?: string;
}

export function JsonTreeViewer({ data, collapsed = false, className }: JsonTreeViewerProps) {
  const isDark = document.documentElement.classList.contains('dark');
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <div className={className}>
      <JsonView
        value={data as object}
        collapsed={collapsed ? 1 : false}
        style={{
          ...theme,
          fontFamily: 'ui-monospace, Consolas, monospace',
          fontSize: '13px',
          padding: '12px',
          borderRadius: '6px',
          background: 'transparent',
        }}
      />
    </div>
  );
}
