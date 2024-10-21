import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import * as Slider from "@radix-ui/react-slider";

import { useNavigate } from "@tanstack/react-router";
import { Route } from "../../routes/__root.tsx";
import BaseReactPlayer, { BaseReactPlayerProps } from "react-player/base";

import $ from "./styles.module.scss";
import "./slider.css";
import "./styles.css";

function usePrevious(value: any) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

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
  const videoUrl = search.videoUrl || "";

  const [inputUrl, setInputUrl] = useState(videoUrl);
  const [url, setUrl] = useState(videoUrl);
  const ref = useRef<BaseReactPlayer<BaseReactPlayerProps>>(null);

  // Slider
  const [max, setMax] = useState<number | null>(null);

  const [sliderValue, setSliderValue] = useState([0, 0]);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [inited, setInited] = useState<boolean>(false);
  const prevSliderValue = usePrevious(sliderValue);

  // Loop
  const [playing, setPlaying] = useState(false);
  const [looping, setLooping] = useState(false);

  // Effects
  useEffect(() => {
    setSliderValue([initStart, initEnd || max || 0]);
  }, [max, initStart, initEnd]);

  useEffect(() => {
    const [start, end] = sliderValue;

    if (!prevSliderValue || (start === prevSliderValue[0] && end === prevSliderValue[1])) {
      return;
    }

    const [prevStart, prevEnd] = prevSliderValue as [number, number];

    if (inited) {
      if (start !== prevStart) {
        ref?.current?.seekTo(start || 0);
      }

      if (end !== prevEnd) {
        ref?.current?.seekTo(end || 0);
      }
    } else {
      setInited(true);
    }
  }, [sliderValue, initEnd, initStart, inited]);

  // Render
  return (
    <div className={$["player-container"]}>
      <div className={"url-input"}>
        <input
          type={"text"}
          value={inputUrl}
          onChange={(e) => {
            setInputUrl(e.target.value);
          }}
        />
        <button
          onClick={() => {
            // TODO: load localStorage loops
            setInited(false);
            setUrl(inputUrl);
            navigate({
              //@ts-ignore
              search: (prev) => ({
                //@ts-ignore
                //...prev,
                videoUrl: inputUrl,
              }),
            });
          }}>
          Load
        </button>
      </div>
      <div className={"player-wrapper"}>
        <ReactPlayer
          width={"100%"}
          height={"100%"}
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
                ref?.current?.seekTo(start);
              }

              if (e.playedSeconds >= end) {
                ref?.current?.seekTo(start);
              }
              setPlaying(true);
            }
          }}
        />
      </div>
      {max && (
        <div className={$["controls"]}>
          <Slider.Root
            min={0}
            max={max}
            step={0.05}
            value={[currentProgress]}
            className={"slider-root"}
            onValueChange={(val) => {
              ref?.current?.seekTo(val[0]);
              setCurrentProgress(val[0]);
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
                //@ts-ignore
                search: (prev) => ({
                  //@ts-ignore
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

          <div className={"buttons"}>
            <button
              onClick={() => {
                const time = ref?.current?.getCurrentTime();
                setSliderValue([time || 0, sliderValue[1]]);
              }}>
              Set Start Time
            </button>
            <button
              onClick={() => {
                const time = ref?.current?.getCurrentTime();
                setSliderValue([sliderValue[0], time || 0]);
              }}>
              Set End Time
            </button>

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
          </div>
        </div>
      )}
    </div>
  );
}
