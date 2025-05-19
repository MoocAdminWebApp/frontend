import { lazy } from "react";

const menuComponents: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  "./pages/Dashboard.jsx": lazy(() => import("./pages/Dashboard")),
  "./pages/demo/index.jsx": lazy(() => import("./pages/demo/index")),
};

export default menuComponents;
