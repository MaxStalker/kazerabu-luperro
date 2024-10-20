import $ from "./styles.module.scss";

export default function Background() {
  return (
    <div className={$["container"]}>
      <div className={$["grid"]}></div>
      <div className={$["overlay"]}></div>
    </div>
  );
}
