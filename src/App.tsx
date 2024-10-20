import { useContext } from "react";

import Background from "./components/Background";
import { ThemeContext } from "./contexts/theme.tsx";
import Logo from "./components/Logo";
import $ from "./styles.module.scss";
import "./index.css";
import Player from "./components/Player";

function App() {
  const { toggleMode, mode } = useContext(ThemeContext);

  return (
    <div className={`digi-${mode}`}>
      <Logo className={$["logo"]} onClick={toggleMode} />
      <Background />

      <Player />
    </div>
  );
}

export default App;
