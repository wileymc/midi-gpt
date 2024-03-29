import React, { useEffect } from "react";
import Script from "next/script";
import { Icon } from "@tremor/react";
import { ArrowDownOnSquareIcon, ShareIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";
import { useTheme } from "next-themes";
import { urlSafeBase64Encode } from "@/lib/strings";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "midi-player": {
        src: string;
        "sound-font": string;
        visualizer: string;
        loop?: boolean;
        "data-js-focus-visible"?: boolean;
      };
      "midi-visualizer": {
        type: string;
        src: string;
        id: string;
      };
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
  const handleShare = () => {
    const url = `${window.location.href}?midi=${urlSafeBase64Encode(midiFile)}`;
    if (navigator.share) {
      navigator.share({
        title: "MIDI Preview",
        text: "Check out this MIDI preview",
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      toast("Link copied to clipboard");
    }
  };

  useEffect(() => {
    if (shouldLoop)
      document.querySelector("midi-player")?.setAttribute("loop", "true");
    else document.querySelector("midi-player")?.removeAttribute("loop");
  }, [shouldLoop]);

  return (
    <div id="player" className="drop-shadow-2xl">
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
      <div className="flex gap-2 justify-end w-full p-1 rounded-bl-lg rounded-br-lg bg-teal-100 dark:bg-teal-900  border border-teal-500/50">
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
