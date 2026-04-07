# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (port 5173, strict)
npm run build     # tsc -b && vite build → outputs to docs/
npm run lint      # ESLint v9 flat config
npm run preview   # Preview production build locally
```

Add shadcn/ui components: `npx shadcn@latest add <component>` (placed in `src/components/ui/`).

## Architecture

**Dev Toolkit** is a privacy-first, offline SPA — all processing is local in the browser, no backend.

### Bootstrap chain

`index.html` → `main.tsx` (StrictMode → Redux Provider → **HashRouter** → App → Toaster)  
HashRouter is required for GitHub Pages compatibility (build outputs to `docs/`).

### Layout

`App.tsx` composes the full shell: `Sidebar` + `Header` + `PageWrapper` (Suspense boundary) + `Footer`.  
The active tool is derived from the current hash path.

### Routing & lazy loading

All routes are defined in `src/routes/routes.ts` as an array of `AppRoute` objects. Every page component is imported via `React.lazy()` — Vite splits each into its own chunk. The `Suspense` fallback renders a `<PageLoader />`.

Two route types enforce prop-type safety:
- **`CryptRoute`** — encrypt/decrypt tools; receives `secretKey` and `onSecretKeyChange` props.
- **`GenericRoute`** — all other tools; no special props.

Use `isCryptRoute()` type guard when iterating routes.

Adding a new tool: create `src/pages/<Feature>/<Feature>.tsx`, add a `React.lazy` entry in `routes.ts`.

### State management

Redux Toolkit store in `src/store/`. A single `toolsSlice` holds per-tool state. Typed hooks are `useAppDispatch` / `useAppSelector` from `src/store/index.ts`. Serializable check is disabled to allow complex objects.

### Key conventions

- **Path alias**: `@/*` resolves to `src/*`.
- **Styling**: Tailwind CSS v4 utility classes only. Theming via CSS variables in `index.css`, toggled by `useTheme` hook (persisted to localStorage).
- **Icons**: `lucide-react` exclusively.
- **Encryption**: AES-CBC-256 via `src/utils/aes.ts`.
- **Chunk naming**: Lazy chunks land in `assets/[name].js` (no content hashes) for predictable GitHub Pages paths.
