import ReactDOM from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import ThemeContextBoundary from "@contexts/theme.tsx";
import "./index.css";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({
  routeTree,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const contextTree = (
  <ThemeContextBoundary>
    <RouterProvider router={router} />
  </ThemeContextBoundary>
);

ReactDOM.createRoot(document.getElementById("root")!).render(contextTree);
