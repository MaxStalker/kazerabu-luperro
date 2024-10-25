import { createFileRoute } from "@tanstack/react-router";
import Player from "../components/Player";

export const Route = createFileRoute("/play")({
  component: () => (
    <div>
      <Player />
    </div>
  ),
});
