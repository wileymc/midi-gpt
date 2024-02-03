import React, { useEffect, useState } from "react";
import Script from "next/script";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "midi-player": any;
      "midi-visualizer": any;
    }
  }
}

export function MidiPreview({
  midiFile,
  shouldLoop,
}: {
  midiFile: string;
  shouldLoop: boolean;
}) {
  useEffect(() => {
    if (shouldLoop)
      document.querySelector("midi-player")?.setAttribute("loop", "true");
    else document.querySelector("midi-player")?.removeAttribute("loop");
  }, [shouldLoop]);

  return (
    <div id="player">
      <Script
        async
        src="https://cdn.jsdelivr.net/combine/npm/tone@14.7.58,npm/@magenta/music@1.23.1/es6/core.js,npm/focus-visible@5,npm/html-midi-player@1.5.0"
      />
      <midi-visualizer
        type="piano-roll"
        src={midiFile}
        id="midi-visualizer-1"
      />
      <midi-player
        src={midiFile}
        sound-font="https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus"
        visualizer="#midi-visualizer-1"
        data-js-focus-visible
      />
    </div>
  );
}
