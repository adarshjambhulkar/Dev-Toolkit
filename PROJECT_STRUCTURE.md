# Project Structure & Architecture (Generic Reference)

This document describes the file structure, build config, routing, lazy loading, and Suspense patterns used in a **Vite + React + React Router** SPA. You can reuse this as a template for similar projects.

---

## 1. File Structure Overview

```
project-root/
├── index.html                 # HTML entry; script points to /src/main.tsx
├── vite.config.ts             # Vite config (plugins, server, build)
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── public/                    # Static assets (copied as-is)
│   └── vite.svg
└── src/
    ├── main.tsx               # App bootstrap: createRoot, Router, App
    ├── App.tsx                # Top-level layout, Suspense, Routes
    ├── index.css              # Global styles
    ├── api/                   # API client, types, session (optional)
    │   ├── api.ts
    │   ├── axios.ts
    │   ├── types.ts
    │   └── ...
    ├── routes/
    │   └── routes.ts          # Route config + lazy-loaded components
    └── pages/                 # Feature-based page modules
        ├── Dashboard/
        │   ├── Dashboard.tsx       # UI component
        │   ├── DashboardBL.tsx     # Business logic / hooks (optional)
        │   ├── DashboardPage.ts    # Re-export entry for lazy import
        │   └── Create/        # Nested feature
        │       ├── Create.tsx
        │       ├── CreateBL.tsx
        │       ├── CreatePage.ts
        │       └── Steps/
        │           ├── StepChooseLocation.tsx
        │           ├── StepsExports.ts
        │           └── ...
        ├── HowItWorks/
        │   ├── HowItWorks.tsx
        │   ├── HowItWorksBL.tsx
        │   └── HowItWorksPage.ts
        ├── Pricing/
        │   └── ...
        └── Support/
            └── ...
```

---

## 2. Vite Configuration

| Concern     | Purpose                                                               |
| ----------- | --------------------------------------------------------------------- |
| **Plugins** | e.g. `react()` or `@vitejs/plugin-react-swc` for React + fast refresh |
| **Server**  | Port, strictPort, proxy for API (dev)                                 |
| **Build**   | Rollup options: `entryFileNames`, `chunkFileNames`, `assetFileNames`  |

### Naming Conventions in `vite.config.ts`

- **Entry**: `entryFileNames: "[name].js"` — main entry stays as `[name].js`.
- **Chunks**: `chunkFileNames: "assets/[name].js"` — lazy-loaded route chunks go under `assets/` with stable names (Vite/Rollup derives `[name]` from the dynamic import).
- **Assets**:
  - Images (png, jpg, gif, svg, webp, ico) → `assets/images/[name].[ext]`
  - CSS → `[name].[ext]` (e.g. root-level CSS)
  - Other (fonts, etc.) → `assets/[name].[ext]`

Example (generic):

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      "/api": { target: "http://localhost:3000", changeOrigin: true },
    },
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: (assetInfo) => {
          const name = assetInfo.names?.[0] || "";
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(name))
            return "assets/images/[name].[ext]";
          if (/\.css$/i.test(name)) return "[name].[ext]";
          return "assets/[name].[ext]";
        },
      },
    },
  },
});
```

---

## 3. File Naming Conventions

| Pattern              | Role                                                                                                                      | Used by                                                      |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| **`PageName.ts`**    | Barrel file that re-exports the default page component and (optionally) BL exports. **Single entry point for the route.** | `routes.ts` lazy imports                                     |
| **`PageName.tsx`**   | Presentational / UI component for the page                                                                                | Rendered as the route element                                |
| **`PageNameBL.tsx`** | Business logic, hooks, state (optional)                                                                                   | Imported by `PageName.tsx` or re-exported from `PageName.ts` |
| **`*Exports.ts`**    | Re-exports for a subfolder (e.g. Steps)                                                                                   | Internal imports within the feature                          |

### Page entry (`*Page.ts`)

- Exposes **default** = the page component (so `React.lazy(() => import("./PageNamePage"))` gets a default export).
- Optionally re-exports everything from `*BL.tsx` for consumers that need hooks/logic.

Example:

```ts
// pages/Dashboard/DashboardPage.ts
export { default } from "./Dashboard";
export * from "./DashboardBL";
```

Lazy imports in `routes.ts` always target the **`*Page.ts`** file so that:

1. Only one import path is used per route.
2. Chunk boundaries are clear (one chunk per page).
3. UI and BL can be refactored without changing route config.

---

## 4. How Pages Are Rendered

### 4.1 Bootstrap flow

1. **`index.html`**

   - Root div: `<div id="root"></div>`
   - Script: `<script type="module" src="/src/main.tsx"></script>`

2. **`main.tsx`**

   - Renders with `createRoot(document.getElementById("root")!).render(...)`
   - Wraps app in **`StrictMode`** → **`BrowserRouter`** → optional **`NavigationHandler`** (or similar) → **`App`**
   - Global CSS: `import "./index.css"`

3. **`App.tsx`**
   - Optional app-level bootstrap (e.g. auth, session).
   - Renders layout (e.g. nav), then **`Suspense`** wrapping **`Routes`**.
   - **`Routes`** iterate over a **route config** and render each **`Route`** with `element={<route.component />}`.

### 4.2 Route config → React Router

- **Config** lives in `src/routes/routes.ts`: array of `{ path, label, component, isHome?, showInNav? }`.
- **`component`** is a **lazy** component (`React.LazyExoticComponent<ComponentType>`).
- **Navigation** (e.g. nav links) uses `path` and `label`; optional `navRoutes = routes.filter(r => r.showInNav !== false)` and `defaultRoute = routes.find(r => r.isHome)?.path || routes[0].path`.
- **Redirects**:
  - `path="/"` and `path={BASE_PATH}` → `<Navigate to={defaultRoute} replace />`.

So: **main.tsx** → **Router** → **App** → **Suspense** → **Routes** → **Route** → **route.component** (lazy page).

---

## 5. Lazy Loading

- **Where**: In `routes.ts`, use `React.lazy(() => import("..."))` for every page component.
- **Import path**: Point to the **page entry file** (`*Page.ts`), which exports the page as default.

Example:

```ts
import { lazy } from "react";

const Dashboard = lazy(() => import("../pages/Dashboard/DashboardPage"));
const Create = lazy(() => import("../pages/Dashboard/Create/CreatePage"));
const HowItWorks = lazy(() => import("../pages/HowItWorks/HowItWorksPage"));
// ...
```

- **Result**: Each route is a separate JS chunk (e.g. under `assets/[name].js` in build).
- **No lazy in App**: Lazy components are only referenced in `routes.ts` and passed as `route.component`; `App` just renders `<route.component />` inside `Suspense`.

---

## 6. Suspense

- **Where**: In `App.tsx`, wrap the **`Routes`** (or the subtree that renders lazy components) with **`Suspense`**.
- **Fallback**: A single fallback component (e.g. full-page loader with spinner/message) so that while a lazy chunk is loading, users see a consistent loading state instead of a blank screen.

Example:

```tsx
<Suspense fallback={<PageLoader />}>
  <Routes>
    <Route path="/" element={<Navigate to={defaultRoute} replace />} />
    <Route path={BASE_PATH} element={<Navigate to={defaultRoute} replace />} />
    {routes.map((route) => (
      <Route key={route.path} path={route.path} element={<route.component />} />
    ))}
  </Routes>
</Suspense>
```

- **PageLoader**: Can be a simple div with spinner and optional message; reuse the same component for bootstrap and for Suspense fallback if desired.

---

## 7. Checklist for Reusing in Another Project

| Item             | Action                                                                                                            |
| ---------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Entry**        | Keep `index.html` → `src/main.tsx` and root `#root`.                                                              |
| **Vite**         | Copy `vite.config.ts` pattern; adjust plugins, proxy, and `assetFileNames` as needed.                             |
| **Router**       | Use `BrowserRouter` in `main.tsx` and a single `Routes` in `App.tsx`.                                             |
| **Route config** | One `routes.ts` with `path`, `label`, `component` (lazy), optional `isHome`, `showInNav`.                         |
| **Lazy**         | All route components = `lazy(() => import("../pages/.../...Page"))` in `routes.ts`.                               |
| **Suspense**     | Wrap `Routes` in `App.tsx` with `<Suspense fallback={<PageLoader />}>`.                                           |
| **Page modules** | Per page/feature: `PageName.tsx`, optional `PageNameBL.tsx`, and `PageNamePage.ts` re-exporting default (and BL). |
| **Build output** | Entry/chunk/asset naming in `vite.config.ts` keeps chunks under `assets/` and images under `assets/images/`.      |

---

## 8. Summary

| Topic              | Location                          | Summary                                                                                             |
| ------------------ | --------------------------------- | --------------------------------------------------------------------------------------------------- |
| **File structure** | Repo root + `src/`                | `main.tsx`, `App.tsx`, `routes/routes.ts`, `pages/<Feature>/` with `*.tsx`, `*BL.tsx`, `*Page.ts`.  |
| **Vite config**    | `vite.config.ts`                  | Plugins, server (port, proxy), build (entry/chunk/asset file names).                                |
| **File naming**    | `pages/`                          | UI: `PageName.tsx`; logic: `PageNameBL.tsx`; route entry: `PageNamePage.ts` (default + re-exports). |
| **Page rendering** | `main.tsx` → `App.tsx` → `Routes` | Bootstrap → Router → layout + Suspense → Routes → `route.component`.                                |
| **Lazy loading**   | `routes.ts`                       | `lazy(() => import(".../...Page"))`; one chunk per route.                                           |
| **Suspense**       | `App.tsx`                         | Wrap `Routes` with `<Suspense fallback={<PageLoader />}>`.                                          |

This gives a generic, reusable reference for a Vite + React SPA with file-based naming, centralized route config, lazy-loaded pages, and a single Suspense boundary around the router.
