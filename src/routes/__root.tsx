import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import App from "../App.tsx";

type MainRouteSearch = {
  start?: number;
  end?: number;
  videoUrl?: string;
  loopIndex?: number;
};

export const Route = createRootRoute({
  validateSearch: (search: Record<string, unknown>): MainRouteSearch => {
    let result: MainRouteSearch = {};

    if (search?.videoUrl) {
      result.videoUrl = search?.videoUrl as string;
    }

    if (search?.start) {
      result.start = Number(search?.start);
    }

    if (search?.end) {
      result.end = Number(search?.end);
    }

    if (search?.loopIndex) {
      result.loopIndex = Number(search?.loopIndex);
    }

    return result;
  },
  component: () => (
    <React.Fragment>
      <App />
      <Outlet />
    </React.Fragment>
  ),
});
