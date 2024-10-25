import { useState } from "react";
import { Route } from "../../routes/__root.tsx";
import { useNavigate } from "@tanstack/react-router";
import "../Player/styles.css";

export default function HeaderInput() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/" });
  const videoUrl = search.videoUrl || "";
  const [inputUrl, setInputUrl] = useState(videoUrl);

  function loadPlayer() {
    navigate({
      to: "/play",
      search: {
        videoUrl: inputUrl,
      },
    });
    setInputUrl("")
  }

  return (
    <div className={"url-input"}>
      <input
        type={"text"}
        value={inputUrl}
        onChange={(e) => {
          setInputUrl(e.target.value);
        }}
      />
      <button onClick={loadPlayer} disabled={inputUrl.length === 0}>
        Go
      </button>
    </div>
  );
}
