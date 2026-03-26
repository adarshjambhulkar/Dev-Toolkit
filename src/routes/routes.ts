import { lazy } from "react";
import type { ToolId } from "../types";

export interface BaseRoute {
  path: string;
  label: string;
  isHome?: boolean;
}

export interface CryptRoute extends BaseRoute {
  id: "decrypt" | "encrypt";
  component: React.LazyExoticComponent<
    React.ComponentType<{
      secretKey: string;
      onSecretKeyChange: (key: string) => void;
    }>
  >;
}

export interface GenericRoute extends BaseRoute {
  id: Exclude<ToolId, "decrypt" | "encrypt">;
  component: React.LazyExoticComponent<React.ComponentType>;
}

export type AppRoute = CryptRoute | GenericRoute;

export function isCryptRoute(route: AppRoute): route is CryptRoute {
  return route.id === "decrypt" || route.id === "encrypt";
}

export const routes: AppRoute[] = [
  {
    id: "decrypt",
    path: "/decrypt",
    label: "Decrypt",
    component: lazy(() => import("../pages/Decrypt/Decrypt")),
    isHome: true,
  },
  {
    id: "encrypt",
    path: "/encrypt",
    label: "Encrypt",
    component: lazy(() => import("../pages/Encrypt/Encrypt")),
  },
  {
    id: "formatter",
    path: "/formatter",
    label: "Formatter",
    component: lazy(() => import("../pages/JsonFormatter/JsonFormatter")),
  },
  {
    id: "compare",
    path: "/compare",
    label: "Compare",
    component: lazy(() => import("../pages/JsonCompare/JsonCompare")),
  },
  {
    id: "schema",
    path: "/schema",
    label: "Schema",
    component: lazy(() => import("../pages/JsonSchema/JsonSchema")),
  },
  {
    id: "base64",
    path: "/base64",
    label: "Base64",
    component: lazy(() => import("../pages/Base64/Base64")),
  },
  {
    id: "jsonserialize",
    path: "/jsonserialize",
    label: "Serialize",
    component: lazy(() => import("../pages/JsonSerialize/JsonSerialize")),
  },
  {
    id: "charcounter",
    path: "/charcounter",
    label: "Char Counter",
    component: lazy(() => import("../pages/CharCounter/CharCounter")),
  },
  {
    id: "codetostring",
    path: "/codetostring",
    label: "Code to String",
    component: lazy(() => import("../pages/CodeToString/CodeToString")),
  },
];

export const defaultRoute =
  routes.find((r) => r.isHome)?.path || routes[0].path;
