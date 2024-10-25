import { ReactNode } from "react";
import Logo from "../Logo";

import $ from "../../styles.module.scss";
import HeaderInput from "../Header/input.tsx";
import { Link } from "@tanstack/react-router";

export default function Wrapper(props: { children: ReactNode }) {
  const { children } = props;

  return (
    <div className={`digi-light`}>
      <div className={$["header"]}>
        <div className={$["grid-container"]} />

        <Link to={"/"}>
          <Logo className={$["logo"]} />
        </Link>
        <HeaderInput />
      </div>
      <div className={$["content"]}>{children}</div>
    </div>
  );
}
