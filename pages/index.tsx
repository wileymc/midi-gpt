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
import { titleCase, urlSafeBase64Decode } from "@/lib/strings";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import Head from "next/head";
import Information from "@/components/Information";
import { useCreditStore, useDialogueStore } from "@/lib/store";
import { MidiPreview } from "@/components/MidiPreview";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "react-toastify";

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

import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  const midiQuery = query.midi as string;
  const existingFile = midiQuery ? urlSafeBase64Decode(midiQuery) : null;

  return {
    props: {
      existingFile: existingFile,
    },
  };
};

export default function Home({
  existingFile,
}: {
  existingFile: string | null;
}) {
  const [inputValue, setInputValue] = useState("");
  const [instrumentKey, setInstrumentKey] = useState<string | undefined>();
  const [tempo, setTempo] = useState<number | undefined>();
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
    let uri = existingFile || localStorage.getItem("midiFile");
    if (uri) {
      setMidiFile(uri as string);
    }
  }, [existingFile]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (credits < 1) {
      setCreditsMenuOpen(true);
      return;
    }

    setLoading(true);
    // scroll to top for mobile phones
    window.scrollTo({ top: 0, behavior: "smooth" });

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputValue, instrumentKey, tempo }),
      });

      if (!response.ok) {
        let error = await response.text();
        throw new Error(error);
      }

      let json = await response.json();
      let uri = json.uri;
      setMidiFile(uri);
      localStorage.setItem("midiFile", uri);
      decrementCredits();
    } catch (error) {
      toast.error(`Failed to generate MIDI file: ${error}`);
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
        <title>MIDIgpt | Text to MIDI files in seconds</title>
      </Head>
      <div
        className={`grid grid-cols-1 md:grid-cols-3 h-full p-3 md:p-10 md:gap-10`}
      >
        <aside className="h-full flex flex-col col-span-1 mt-10 md:mt-0 order-last md:order-first">
          <form onSubmit={handleSubmit} className="space-y-8">
            <section className="space-y-4">
              <SectionHeader
                title="Describe a melody, chord sequence, or pattern to generate"
                stepNumber={1}
              />
              <Textarea
                id="input"
                name="prompt"
                className={`min-h-24 dark:placeholder:text-dark-tremor-content-muted`}
                placeholder="Give me a funky thumping house bassline..."
                value={inputValue}
                onChange={handleChange}
                required
                autoFocus
              />
            </section>
            <section className="space-y-4">
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
                    value={tempo}
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
              <button
                type="submit"
                className="btn-primary w-full"
                disabled={isLoading}
              >
                <MusicalNoteIcon width={24} />
                Generate a MIDI file
              </button>
            </section>
          </form>
          {midiFile && (
            <>
              <div className="py-2">
                <Divider />
              </div>
              <SectionHeader title="Download your MIDI file" stepNumber={3} />
              <button
                type="button"
                className="btn-primary w-full mt-4"
                onClick={handleDownload}
                disabled={!midiFile}
              >
                <ArrowDownTrayIcon width={24} />
                Download MIDI
              </button>
            </>
          )}
        </aside>

        <div className="flex flex-col justify-between lg:col-span-2 col-span-2">
          <div className="w-full max-w-full h-full min-h-max rounded relative flex justify-between flex-col items-center border border-teal-800/50 z-1">
            <div className="w-full max-w-full h-full rounded bg-[url('/studio-bg.webp')] opacity-15 backdrop-filter grayscale absolute top-0 left-0 z-0 bg-cover pointer-events-auto" />
            <div className="h-8" />
            <div className="lg:min-w-[32rem] flex justify-center items-center">
              {isLoading && <ScaleLoader color="#38B2AC" />}
              {!isLoading && midiFile && (
                <section className="z-1 p-4">
                  <MidiPreview
                    midiFile={midiFile}
                    shouldLoop={shouldLoop}
                    handleDownload={handleDownload}
                  />
                </section>
              )}
            </div>
            <div
              className={`flex w-full justify-end gap-4 items-baseline p-2 z-10`}
            >
              <ThemeToggle />
              <Information />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
