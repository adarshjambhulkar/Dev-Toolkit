# Project Structure & Architecture

This document describes the file structure, build config, routing, lazy loading, and state management patterns used in the **dev-toolkit** project. The project is a **Vite + React + React Router** SPA utilizing **Tailwind CSS v4**, **shadcn/ui**, and **Redux Toolkit**.

---

## 1. File Structure Overview

```
project-root/
├── index.html                 # HTML entry; script points to /src/main.tsx
├── vite.config.ts             # Vite config (plugins, tailwindcss v4, build)
├── components.json            # shadcn/ui configuration
├── eslint.config.js           # ESLint v9 configuration
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── public/                    # Static assets (copied as-is)
└── src/
    ├── main.tsx               # App bootstrap: createRoot, HashRouter, Redux Provider
    ├── App.tsx                # Top-level layout, Sidebar, Header, Suspense, Routes
    ├── index.css              # Global styles & Tailwind imports
    ├── App.css
    ├── assets/                # App assets like images and svgs
    ├── components/
    │   ├── layout/            # Layout components (Header, Sidebar, Footer, PageWrapper)
    │   ├── shared/            # Reusable shared components (CopyButton, JsonTreeViewer, etc.)
    │   └── ui/                # shadcn/ui generic components (button, input, select, etc.)
    ├── hooks/                 # Custom React hooks (useClipboard, useTheme, useSecretKey)
    ├── lib/                   # Utility functions (e.g., shadcn/ui utils)
    ├── routes/
    │   └── routes.ts          # Route definitions + React.lazy component imports
    ├── store/                 # Redux Toolkit setup
    │   ├── index.ts           # Store configuration
    │   └── slices/            # Redux slices (toolsSlice, etc.)
    ├── types/                 # TypeScript types & interfaces
    ├── utils/                 # Business logic utils (aes, jsonSchema)
    └── pages/                 # Feature-based page modules
        ├── Base64/
        │   └── Base64.tsx     # UI component & logic for the page
        ├── CharCounter/
        │   └── CharCounter.tsx
        ├── CodeToString/
        │   └── CodeToString.tsx
        ├── Decrypt/
        │   └── Decrypt.tsx
        ├── Encrypt/
        │   └── Encrypt.tsx
        ├── JsonCompare/
        │   └── JsonCompare.tsx
        ├── JsonFormatter/
        │   └── JsonFormatter.tsx
        ├── JsonSchema/
        │   └── JsonSchema.tsx
        └── JsonSerialize/
            └── JsonSerialize.tsx
```

---

## 2. Vite Configuration

| Concern     | Purpose                                                               |
| ----------- | --------------------------------------------------------------------- |
| **Plugins** | `react()` and `@tailwindcss/vite` for Tailwind CSS v4 integration.    |
| **Base**    | `./` ensures relative paths so the app can be hosted in subdirectories. |
| **Build**   | Configured to output to `docs` (for GitHub Pages) and controls chunk naming. |

### Build Configuration in `vite.config.ts`

- **Output Directory**: `outDir: "docs"` instead of standard `dist`.
- **Entry**: `entryFileNames: "[name].js"` — main entry stays as `[name].js`.
- **Chunks**: `chunkFileNames: "assets/[name].js"` — lazy-loaded route chunks go under `assets/` to ensure predictable naming.
- **Assets**:
  - Images (png, jpg, gif, svg, webp, ico) → `assets/images/[name].[ext]`
  - CSS → `[name].[ext]` (e.g. root-level CSS)
  - Other (fonts, etc.) → `assets/[name].[ext]`

---

## 3. State Management & Utilities

- **Redux Toolkit**: The application state is managed by Redux Toolkit inside `src/store/`. A `toolsSlice` stores states specific to tools.
- **Hooks**: General logic that can be reused across components is extracted to hooks like `useTheme`, `useClipboard`, and `useSecretKey` in `src/hooks/`.
- **Utils**: Tool-specific utility functions like encryption logic (`aes.ts`) and JSON manipulation (`jsonSchema.ts`) live in `src/utils/`.

---

## 4. How Pages Are Rendered

### 4.1 Bootstrap flow

1. **`index.html`**
   - Root div: `<div id="root"></div>`
   - Script: `<script type="module" src="/src/main.tsx"></script>`

2. **`main.tsx`**
   - Renders with `createRoot(document.getElementById("root")!).render(...)`
   - Wraps app in:
     - **`StrictMode`**
     - **`Provider`** (Redux Store)
     - **`HashRouter`** (for GitHub pages routing compatibility)
     - **`App`**
     - **`Toaster`** (Sonner for notifications)
   - Global CSS: `import "./index.css"`

3. **`App.tsx`**
   - Main layout component managing the layout frame (`Sidebar`, `Header`, `PageWrapper`, `Footer`).
   - Retrieves active tool from current path.
   - Sets up **`Suspense`** wrapping **`Routes`**.
   - **`Routes`** iterates over the array exported from `routes.ts`.

### 4.2 Route config → React Router

- **Config** lives in `src/routes/routes.ts`: an array of `AppRoute` objects.
- Each object contains `id`, `path`, `label`, and `component`.
- **`component`** is imported via `React.lazy()` (e.g., `lazy(() => import("../pages/Base64/Base64"))`).
- Routes are divided into types like `CryptRoute` and `GenericRoute` ensuring type-safe prop drilling (like passing `secretKey` to encryption tools).
- **Default Route**: Resolved by finding a route with `isHome: true`, mapping unhandled routes `*` or `/` to it.

So: **main.tsx** → **HashRouter** → **App Layout** → **Suspense** → **Routes** → **Route** → **route.component** (lazy page).

---

## 5. Lazy Loading & Suspense

### Lazy Loading Setup

- **Where**: In `src/routes/routes.ts`, we use `React.lazy(() => import("..."))` for every tool component.
- **Import path**: Points directly to the page component (e.g. `../pages/Base64/Base64`). No barrel files (`*Page.ts`) are used.

Example:

```ts
import { lazy } from "react";

const routes = [
  {
    id: "decrypt",
    path: "/decrypt",
    label: "Decrypt",
    component: lazy(() => import("../pages/Decrypt/Decrypt")),
    isHome: true,
  },
  // ...
];
```

- **Result**: Vite splits each route into a separate JavaScript chunk. Only the code needed for the active tool is loaded.

### Suspense Implementation

- **Where**: In `App.tsx`, we wrap the **`Routes`** block with **`Suspense`**.
- **Fallback**: A `<PageLoader />` component displays a spinner while the lazy chunk is being fetched.

Example:

```tsx
<Suspense fallback={<PageLoader />}>
  <Routes>
    <Route path="/" element={<Navigate to={defaultRoute} replace />} />
    {routes.map((route) => {
      // ... Route rendering logic
    })}
    <Route path="*" element={<Navigate to={defaultRoute} replace />} />
  </Routes>
</Suspense>
```

---

## 6. Development Conventions

1. **Pages (Features)**: When creating a new feature, place it inside its own directory in `src/pages/<FeatureName>/<FeatureName>.tsx`.
2. **Routing**: Add the newly created page to `src/routes/routes.ts` wrapping the import in `React.lazy`. Define its type in `AppRoute` if it requires specialized props.
3. **UI Components**: Run `npx shadcn@latest add <component>` to add generic atomic elements. They will be placed in `src/components/ui/`.
4. **Icons**: Use `lucide-react` for consistent iconography.
5. **Tailwind CSS v4**: Utility classes should be primarily used. Config is minimal, mostly driven by Vite `@tailwindcss/vite` plugin and `@theme` directives in `index.css`.
