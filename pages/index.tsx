import {
  Subtitle,
  Divider,
  Select,
  SelectItem,
  Textarea,
  NumberInput,
  Text,
  SearchSelect,
  SearchSelectItem,
  Switch,
} from "@tremor/react";
import { useEffect, useState } from "react";
import { ScaleLoader } from "react-spinners";
import { MusicalNoteIcon } from "@heroicons/react/24/solid";
import soundfont from "../public/soundfont.json";
import { titleCase } from "@/lib/strings";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import Head from "next/head";
import Information from "@/components/Information";
import { useCreditStore, useDialogueStore } from "@/lib/store";
import MidiPreview from "@/components/MidiPreview";

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
  const { credits, decrementCredits } = useCreditStore((state) => ({
    decrementCredits: state.decrement,
    credits: state.credits,
  }));
  const { setCreditsMenuOpen } = useDialogueStore((state) => ({
    creditsMenuOpen: state.creditsMenuOpen,
    setCreditsMenuOpen: state.setCreditsMenuOpen,
  }));

  useEffect(() => {
    let existingFile = localStorage.getItem("midiFile");
    if (existingFile) {
      setMidiFile(existingFile);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (credits < 1) {
      setCreditsMenuOpen(true);
      return;
    }

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
      decrementCredits();
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => setLoading(false), 1200);
    }
  };

  const handleInstrumentChange = (value: string) => {
    setInstrumentKey(value);
  };

  const handleTempoChange = (value: number) => {
    setTempo(value);
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
    <>
      <Head>
        <title>MIDIgpt | Generate MIDI files from text in seconds</title>
      </Head>
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
              className={`min-h-24`}
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
              title="Adjust optional MIDI parameters as needed"
              stepNumber={2}
            />
            <div className="space-y-4">
              <div>
                <Text className="mb-1 dark:text-zinc-400">Instrument</Text>
                <SearchSelect
                  value={instrumentKey}
                  onValueChange={handleInstrumentChange}
                >
                  {soundFontInstruments.map((instrument) => (
                    <SearchSelectItem
                      key={instrument.key}
                      value={instrument.key}
                    >
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
                  onValueChange={handleTempoChange}
                />
              </div>
              <div className="flex justify-between items-center">
                <Text className="mb-1 dark:text-zinc-400">
                  Toggle Playback Loop
                </Text>
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
          <SectionHeader title="Download your MIDI file" stepNumber={3} />
          {midiFile && (
            <button
              type="button"
              className="btn-primary w-full mt-4"
              onClick={handleDownload}
              disabled={!midiFile}
            >
              <ArrowDownTrayIcon width={24} />
              Download MIDI
            </button>
          )}
        </aside>

        <div className="flex flex-col justify-between lg:col-span-2 col-span-2 md:py-8 md:pr-8">
          <div className="w-full max-w-full h-full min-h-max rounded relative flex justify-between flex-col items-center border border-teal-800/50">
            <div className="w-full max-w-full h-full rounded bg-[url('/studio-bg.png')] opacity-15 backdrop-filter grayscale absolute top-0 left-0 z-0 bg-cover pointer-events-auto" />
            <div className="h-8" />
            <div>
              {isLoading && <ScaleLoader color="#38B2AC" />}
              {!isLoading && midiFile && (
                <section className="z-1 p-4">
                  <MidiPreview midiFile={midiFile} shouldLoop={shouldLoop} />
                </section>
              )}
            </div>
            <div className={`flex w-full justify-end p-2 z-10`}>
              <Information />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
