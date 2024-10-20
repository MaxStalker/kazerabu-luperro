import * as Tone from "tone";

export function transformRange(value: number, input: Array<number>, output: Array<number>): number {
  const [inMin, inMax] = input;
  const [outMin, outMax] = output;
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

export const notes: { [key: number]: string } = {
  1: "C",
  1.5: "C#",
  2: "D",
  2.5: "D#",
  3: "E",
  4: "F",
  4.5: "F#",
  5: "G",
  5.5: "G#",
  6: "A",
  6.5: "A#",
  7: "B",
};

export function getNote(index: number, type: number) {
  if (type === 0) {
    return (notes[index] || "-").toString();
  }
  if (type === 1) {
    if (index % 1 > 0) {
      return Math.floor(index) + "#";
    }
    return index.toString();
  }
  return "*";
}

interface PlayerWithEnvelope {
  sample: Tone.Player;
  envelope: Tone.Envelope;
}

interface Envelope {
  attack?: number;
  decay?: number;
  sustain?: number;
  release?: number;
  volume?: number;
}

export function createPlayerWithEnvelope(url: string, options: Envelope = {}): PlayerWithEnvelope {
  const sample = new Tone.Player({
    volume: options.volume || -5,
    url,
    autostart: false,
  }).toDestination();

  const envelope = new Tone.Envelope({ ...options });

  const gainNode = new Tone.Gain().toDestination();
  envelope.connect(gainNode.gain);
  sample.connect(gainNode);

  return {
    sample,
    envelope,
  };
}

export function createPart(instrument: string, play: (time: number) => void) {
  const part = new Tone.Part((time, event) => {
    console.log(instrument, time);
    play(time);
  }, []);

  part.loop = true;
  part.loopEnd = "1m";

  // '0:2:0'
  // "4:3:2" = 4 bars + 3 quarter notes + 2 sixteenth notes.
  // "0:";
  function updateNotes(events: Array<any>) {
    part.clear();
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      if (event.drum[instrument]) {
        // const quarters = i % 4;
        const time = `0:0:${i}`;
        part.add(time);
      }
    }
  }

  function start(): void {
    console.log("start playing");
    part.start(Tone.now());
  }

  function stop() {
    console.log("stop playing");
    part.stop(Tone.now());
  }

  return {
    part,
    start,
    stop,
    updateNotes,
  };
}
