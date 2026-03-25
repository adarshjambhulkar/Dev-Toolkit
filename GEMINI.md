# Project Context: dev-toolkit

## Project Overview
`dev-toolkit` is a Single Page Application (SPA) built with **React 19**, **TypeScript**, and **Vite**. It appears to be a collection of developer utilities or tools, given the page names like `Base64`, `CharCounter`, `CodeToString`, `Decrypt`, `Encrypt`, `JsonCompare`, `JsonFormatter`, `JsonSchema`, and `JsonSerialize`.

The project utilizes a modern frontend stack with the following key technologies:
- **Styling & UI:** Tailwind CSS, shadcn/ui (Radix UI primitives), and Framer Motion for animations.
- **Icons:** Lucide React.
- **Routing:** React Router (inferred from the architecture documentation) with a strong emphasis on lazy loading and Suspense.
- **Linting:** ESLint with React-specific plugins.

## Architecture & File Structure
The project follows a specific, feature-based modular architecture designed for lazy loading and separation of concerns.

### Key Directories
- `src/pages/`: Contains feature-based page modules. Each module has a specific structure.
- `src/components/ui/`: Contains reusable, atomic UI components (shadcn/ui).
- `src/components/layout/`: Contains structural components like Header, Sidebar, and PageWrapper.
- `src/components/shared/`: Shared components used across different pages.
- `src/hooks/`: Custom React hooks (e.g., `useClipboard`, `useSecretKey`, `useTheme`).
- `src/utils/`: Utility functions (e.g., AES encryption, JSON Schema handling).

### Page Naming Conventions
A typical page module in `src/pages/<Feature>/` follows this pattern:
- **`Feature.tsx`**: The main presentational / UI component for the page.
- **`FeatureBL.tsx`** (Optional): Contains business logic, custom hooks, and state management for the feature.
- **`FeaturePage.ts`**: The "barrel" file that re-exports the default page component. This acts as the **single entry point** for lazy loading the route.

### Routing and Rendering
- The application uses `React.lazy()` extensively in the route configuration (`routes.ts` or similar) to code-split each page into its own chunk.
- Imports for routes always target the `*Page.ts` file.
- The top-level `App` wraps the routes in a `<Suspense>` boundary to display a fallback (like a loader) while chunks are being fetched.

## Building and Running

The following npm scripts are available in `package.json`:

- **Start Development Server:**
  ```bash
  npm run dev
  ```
  Starts the Vite dev server with Hot Module Replacement (HMR).

- **Build for Production:**
  ```bash
  npm run build
  ```
  Runs the TypeScript compiler (`tsc -b`) followed by the Vite build process.

- **Preview Production Build:**
  ```bash
  npm run preview
  ```
  Locally previews the generated production build.

- **Linting:**
  ```bash
  npm run lint
  ```
  Runs ESLint across the codebase.

## Development Conventions
- **TypeScript:** The project strictly uses TypeScript. Ensure proper typing for all components, hooks, and utilities.
- **Styling:** Use Tailwind CSS utility classes for styling. When creating new UI components, follow the patterns established by existing shadcn/ui components in `src/components/ui/`.
- **Component Structure:** When creating new pages or complex features, adhere to the `*Page.ts`, `*.tsx`, and `*BL.tsx` separation of concerns.
- **Lazy Loading:** All new route components must be integrated using `React.lazy()` to maintain optimal bundle sizes.
