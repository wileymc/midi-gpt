import {
  Subtitle,
  Divider,
  Select,
  SelectItem,
  Textarea,
  NumberInput,
  Text,
  Button,
  SearchSelect,
  SearchSelectItem,
  Badge,
  Switch,
} from "@tremor/react";
import Script from "next/script";
import { useEffect, useState } from "react";
import { ScaleLoader } from "react-spinners";
import { HeartIcon, MusicalNoteIcon } from "@heroicons/react/24/solid";
import soundfont from "../public/soundfont.json";
import { titleCase } from "@/lib/strings";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";

const SectionHeader = ({
  stepNumber,
  title,
}: {
  stepNumber: number;
  title: string;
}) => {
  return (
    <div className="flex items-start gap-2">
      <div className="shrink-0 bg-teal-100 dark:bg-teal-500/20 text-teal-500 font-semi-bold font-mono h-6 w-6 rounded-full flex items-center justify-center mr-2">
        {stepNumber}
      </div>
      <Subtitle className="text-gray-700 dark:text-gray-300">{title}</Subtitle>
    </div>
  );
};

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [instrumentKey, setInstrumentKey] = useState("1");
  const [tempo, setTempo] = useState(120);
  const [shouldLoop, setShouldLoop] = useState(false);
  const [midiFile, setMidiFile] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    let existingFile = localStorage.getItem("midiFile");
    if (existingFile) {
      setMidiFile(existingFile);
    }
  }, []);

  useEffect(() => {
    if (shouldLoop)
      document.querySelector("midi-player")?.setAttribute("loop", "true");
    else document.querySelector("midi-player")?.removeAttribute("loop");
  }, [shouldLoop]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputValue, instrumentKey, tempo }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate MIDI file");
      }

      let json = await response.json();
      let uri = json.uri;
      setMidiFile(uri);
      localStorage.setItem("midiFile", uri);

      // Do something with the generated MIDI file
    } catch (error) {
      console.error(error);
      // Handle error
    } finally {
      setTimeout(() => setLoading(false), 1200);
    }
  };

  const handleDownload = () => {
    if (midiFile) {
      window.open(midiFile, "_self");
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  let soundFontInstruments = Object.entries(soundfont.instruments).map(
    ([key, value]: [string, string]) => ({
      key,
      display: value,
    })
  );

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 h-full`}>
      <aside className="h-full flex flex-col col-span-1 order-last md:order-first p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <SectionHeader
            title="Describe a melody, chord sequence, or pattern to generate as MIDI"
            stepNumber={1}
          />
          <Textarea
            id="input"
            name="prompt"
            placeholder="Give me a funky thumping house bassline..."
            value={inputValue}
            onChange={handleChange}
            required
            autoFocus
          />
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={isLoading}
          >
            <MusicalNoteIcon width={24} />
            Generate a MIDI file
          </button>
          <div className="py-2">
            <Divider />
          </div>
          <SectionHeader
            title="Adjust parameters for your new midi file as needed"
            stepNumber={2}
          />
          <div className="space-y-4">
            <div>
              <Text className="mb-1 dark:text-zinc-400">Instrument</Text>
              <SearchSelect
                value={instrumentKey}
                onValueChange={(v) => setInstrumentKey(v)}
              >
                {soundFontInstruments.map((instrument) => (
                  <SearchSelectItem key={instrument.key} value={instrument.key}>
                    {titleCase(instrument.display.replace(/_/g, " "))}
                  </SearchSelectItem>
                ))}
              </SearchSelect>
            </div>
            <div>
              <Text className="mb-1 dark:text-zinc-400">Key</Text>
              <Select>
                <SelectItem value="c">C</SelectItem>
                <SelectItem value="c#">C#</SelectItem>
                <SelectItem value="d">D</SelectItem>
                <SelectItem value="d#">D#</SelectItem>
                <SelectItem value="e">E</SelectItem>
                <SelectItem value="f">F</SelectItem>
                <SelectItem value="f#">F#</SelectItem>
                <SelectItem value="g">G</SelectItem>
                <SelectItem value="g#">G#</SelectItem>
                <SelectItem value="a">A</SelectItem>
                <SelectItem value="a#">A#</SelectItem>
                <SelectItem value="b">B</SelectItem>
              </Select>
            </div>
            <div>
              <Text className="mb-1 dark:text-zinc-400">Tempo</Text>
              <NumberInput
                placeholder="120"
                defaultValue={120}
                onValueChange={(v) => setTempo(v)}
              />
            </div>
            <div className="flex justify-between items-center">
              <Text className="mb-1 dark:text-zinc-400">Toggle Loop</Text>
              <Switch
                checked={shouldLoop}
                onChange={() => setShouldLoop(!shouldLoop)}
              />
            </div>
          </div>
        </form>
        <div className="py-2">
          <Divider />
        </div>
        <button
          type="button"
          className="btn-primary w-full mt-2"
          onClick={handleDownload}
          disabled={!midiFile}
        >
          <ArrowDownTrayIcon width={24} />
          Download MIDI
        </button>
      </aside>

      <div className="flex flex-col justify-between lg:col-span-2 col-span-2 md:py-4 md:pr-4">
        <div className="w-full max-w-full h-full rounded relative flex justify-center items-center border border-teal-800/50">
          <div className="w-full max-w-full h-full p-3 md:p-4 rounded bg-[url('/studio-bg.png')] opacity-15 backdrop-filter grayscale absolute top-0 left-0 z-0 bg-cover pointer-events-auto" />
          {isLoading && <ScaleLoader color="#38B2AC" />}
          {!isLoading && midiFile && (
            <section className="z-1">
              <div id="player">
                {/* @ts-ignore */}
                <midi-player
                  src={midiFile}
                  sound-font="https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus"
                  visualizer="#midi-visualizer"
                />
                {/* @ts-ignore */}
                <midi-visualizer
                  type="piano-roll"
                  id="midi-visualizer"
                  src={midiFile}
                />
              </div>
            </section>
          )}
          <div className="absolute bottom-0 right-0 m-2">
            <Badge icon={HeartIcon}>Polyphonic MIDI files coming soon...</Badge>
          </div>
        </div>
      </div>
      <Script src="https://cdn.jsdelivr.net/combine/npm/tone@14.7.58,npm/@magenta/music@1.23.1/es6/core.js,npm/focus-visible@5,npm/html-midi-player@1.5.0" />
    </div>
  );
}
