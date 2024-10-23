import useLocalStorage from "../../hooks/useLocalStorage.ts";
import { Link } from "@tanstack/react-router";

export default function MainContent() {
  const { list } = useLocalStorage();

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "1rem" }}>
      <h1>History</h1>

      {list.map((item) => {
        return (
          <Link to={`/play?videoUrl=${item.url}`}>
            <div style={{ display: "flex", gap: "1rem" }}>
              <img src={item.thumbnail} style={{ width: "150px", height: "auto" }} />
              <p>{item.name}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
