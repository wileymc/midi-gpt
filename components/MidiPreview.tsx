import React, { useEffect, useState } from "react";
import Script from "next/script";
import { Button, Icon, Text } from "@tremor/react";
import {
  ArrowDownOnSquareIcon,
  LinkIcon,
  ShareIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

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
  handleDownload,
}: {
  midiFile: string;
  shouldLoop: boolean;
  handleDownload: () => void;
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
      <div className="  flex justify-end w-full p-1 rounded-bl-lg rounded-br-lg bg-teal-100/50 dark:bg-teal-600/50 border border-teal-500/50 gap-2">
        <div className="z-10">
          <Icon
            icon={ArrowDownOnSquareIcon}
            onClick={handleDownload}
            size="sm"
            className="hover:text-teal-900 dark:hover:text-teal-100 transition-colors cursor-pointer"
            tooltip="Download"
          />
        </div>
        <div className="z-10">
          <Icon
            icon={ShareIcon}
            onClick={handleShare}
            size="sm"
            className="hover:text-teal-900 dark:hover:text-teal-100 transition-colors cursor-pointer"
            tooltip="Share"
          />
        </div>
      </div>
    </div>
  );
}

function handleShare() {
  if (navigator.share) {
    navigator.share({
      title: "MIDI Preview",
      text: "Check out this MIDI preview",
      url: window.location.href,
    });
  }
}
