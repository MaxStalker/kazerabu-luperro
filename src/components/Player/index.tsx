import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import * as Slider from "@radix-ui/react-slider";

import $ from "./styles.module.scss";
import "./slider.css";
import { useNavigate } from "@tanstack/react-router";
import { Route } from "../../routes/__root.tsx";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const useReactPath = () => {
  const [path, setPath] = React.useState(window.location.pathname);
  const listenToPopstate = () => {
    const winPath = window.location.pathname;
    setPath(winPath);
  };
  React.useEffect(() => {
    window.addEventListener("popstate", listenToPopstate);
    return () => {
      window.removeEventListener("popstate", listenToPopstate);
    };
  }, []);
  return path;
};

// preview image can be fetched here:
// https://img.youtube.com/vi/{id}/0.jpg
// https://img.youtube.com/vi/{id}/hqdefault.jpg
// https://img.youtube.com/vi/{id}/maxresdefault.jpg <- best version available

export default function Player() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/" });

  // Init Search params
  const initStart = search.start || 0;
  const initEnd = search.end || 0;

  const [url, setUrl] = useState("https://www.youtube.com/watch?v=6ocerGNpeK0");
  const ref = useRef(null);

  // Slider
  const [max, setMax] = useState<number | null>(null);

  const [sliderValue, setSliderValue] = useState([0, 0]);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [inited, setInited] = useState<boolean>(false);
  const prevSliderValue = usePrevious(sliderValue);

  // Loop
  const [playing, setPlaying] = useState(false);
  const [looping, setLooping] = useState(false);
  const [startLoop, setStartLoop] = useState(null);
  const [endLoop, setEndLoop] = useState(null);

  // Effects
  useEffect(() => {
    setSliderValue([initStart, initEnd || max || 0]);
  }, [max]);

  useEffect(() => {
    const [start, end] = sliderValue;

    if (!prevSliderValue || (start === prevSliderValue[0] && end === prevSliderValue[1])) {
      return;
    }

    const [prevStart, prevEnd] = prevSliderValue as [number, number];

    if (inited) {
      if (start !== prevStart) {
        ref.current.seekTo(start || 0);
        setStartLoop(start);
      }

      if (end !== prevEnd) {
        ref.current.seekTo(end || 0);
        setEndLoop(end);
      }
    } else {
      setInited(true);
    }
  }, [sliderValue]);

  // Render
  return (
    <div className={$["player-container"]}>
      <ReactPlayer
        url={url}
        ref={ref}
        controls={true}
        playing={playing}
        progressInterval={250}
        onSeek={(e) => {
          console.log({ sec: e });
          setCurrentProgress(e);
        }}
        onDuration={(duration) => {
          setMax(duration);
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onProgress={(e) => {
          setCurrentProgress(e.playedSeconds);

          if (playing && looping) {
            const [start, end] = sliderValue;

            if (e.playedSeconds < start) {
              ref.current.seekTo(start);
            }

            if (e.playedSeconds >= end) {
              ref.current.seekTo(start);
            }
            setPlaying(true);
          }
        }}
      />
      {max && (
        <div className={$["controls"]}>
          <Slider.Root
            min={0}
            max={max}
            step={0.05}
            value={[currentProgress]}
            className={"slider-root"}
            onValueChange={(val) => {
              ref.current.seekTo(val);
              setCurrentProgress(val);
              // setPlaying(true);
            }}>
            <Slider.Track className={"slider-track"}>
              <Slider.Range className={"slider-range"} />
            </Slider.Track>
            <Slider.Thumb className={"slider-thumb"} />
          </Slider.Root>

          <Slider.Root
            min={0}
            max={max}
            step={0.1}
            value={sliderValue}
            className={"slider-root"}
            onValueChange={setSliderValue}
            onValueCommit={() => {
              const [start, end] = sliderValue;
              navigate({
                search: (prev) => ({
                  ...prev,
                  start,
                  end,
                }),
              });
            }}>
            <Slider.Track className={"slider-track"}>
              <Slider.Range className={"slider-range"} />
            </Slider.Track>
            <Slider.Thumb
              className={"slider-thumb"}
              onClick={() => {
                ref?.current?.seekTo(sliderValue[0]);
              }}
            />
            <Slider.Thumb
              className={"slider-thumb"}
              onClick={() => {
                ref?.current?.seekTo(sliderValue[1]);
              }}
            />
          </Slider.Root>

          <div>
            <button
              onClick={() => {
                setPlaying(!playing);
                setLooping(false);
              }}>
              {playing ? "Pause" : "Play"}
            </button>
            <button
              onClick={() => {
                setCurrentProgress(sliderValue[0]);
                ref?.current?.seekTo(sliderValue[0]);
                setLooping(true);
                setPlaying(true);
              }}>
              PlayLoop
            </button>
            <button
              onClick={() => {
                const time = ref?.current?.getCurrentTime();
                setSliderValue([time, sliderValue[1]]);
              }}>
              Set Start Time
            </button>
            <button
              onClick={() => {
                const time = ref?.current?.getCurrentTime();
                setSliderValue([sliderValue[0], time]);
              }}>
              Set End Time
            </button>
          </div>
        </div>
      )}
    </div>
  );
}