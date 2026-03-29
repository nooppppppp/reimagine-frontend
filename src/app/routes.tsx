import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { StyleSelection } from "./pages/StyleSelection";
import { DesignResult } from "./pages/DesignResult";
import { MyProjects } from "./pages/MyProjects";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/style-selection",
    Component: StyleSelection,
  },
  {
    path: "/design-result",
    Component: DesignResult,
  },
  {
    path: "/my-projects",
    Component: MyProjects,
  },
]);