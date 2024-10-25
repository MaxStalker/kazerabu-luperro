import { createRootRoute, Outlet } from "@tanstack/react-router";
import Wrapper from "../components/Wrapper";

type MainRouteSearch = {
  start?: number;
  end?: number;
  videoUrl?: string;
  loopIndex?: number;
};

export const Route = createRootRoute({
  validateSearch: (search: Record<string, unknown>): MainRouteSearch => {
    const result: MainRouteSearch = {};

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
    <>
      <Wrapper>
        <Outlet />
      </Wrapper>
    </>
  ),
});
