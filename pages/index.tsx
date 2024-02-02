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
  Badge,
  Switch,
  Icon,
  Title,
} from "@tremor/react";
import Script from "next/script";
import { useEffect, useState } from "react";
import { ScaleLoader } from "react-spinners";
import {
  HeartIcon,
  InformationCircleIcon,
  MusicalNoteIcon,
} from "@heroicons/react/24/solid";
import soundfont from "../public/soundfont.json";
import { titleCase } from "@/lib/strings";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { Dialog, DialogPanel } from "@tremor/react";

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
  const [isDialogOpen, setDialogOpen] = useState(false);

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
            title="Adjust parameters for your new midi file as needed"
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
        <aside className="flex flex-col justify-between h-full">
          <div></div>
          <Dialog
            open={isDialogOpen}
            onClose={(val) => setDialogOpen(val)}
            static={true}
          >
            <DialogPanel>
              <Title className="mb-3 flex gap-2">
                <InformationCircleIcon
                  width={24}
                  className="text-teal-500/80"
                />
                Information
              </Title>
              <div>
                <Text>
                  Thanks for visiting MIDIgpt! This is a simple but powerful web
                  app that leverages a ton of open source libraries and APIs to
                  generate MIDI files from text prompts. It is deeply inspired
                  by{" "}
                  <a href="https://github.com/whoiskatrin/chart-gpt">
                    ChartGPT
                  </a>{" "}
                  which is an awesome library for generating charts from text
                  prompts.
                </Text>
                <Text className="mt-2">
                  The MIDI concepts are generated using the GPT-3.5 model from
                  OpenAI, and the MIDI files are generated using the{" "}
                  <a href="https://github.com/grimmdude/MidiWriterJS">
                    MidiWriterJS
                  </a>{" "}
                  library. The midi preview and visualizer are using the{" "}
                  <a href="https://github.com/cifkao/html-midi-player/">
                    html-midi-player
                  </a>{" "}
                  library. The app is built using{" "}
                  <a href="https://nextjs.org/">Next.js</a>,{" "}
                  <a href="https://tailwindcss.com/">Tailwind CSS</a>, and{" "}
                  <a href="https://tremor.so">Tremor</a>, and is hosted on{" "}
                  <a href="https://vercel.com/">Vercel</a>.
                </Text>
                <Text className="mt-2">
                  The app is open source and the code is available on GitHub. If
                  you have any questions or feedback, feel free to reach out to
                  me on <a href="twitter.com/wileymckayconte">Twitter</a> or{" "}
                  <a href="github.com/wileymc">GitHub</a>. Enjoy!
                </Text>
                <Divider className="my-4" />
                <Text>
                  I am currently working on training a proprietary model to
                  generate higher quality MIDI files from text prompts. If you
                  are interested in contributing, please{" "}
                  <a href="mailto:me+midigpt@wileymc.com">
                    get in touch with me
                  </a>
                  .
                </Text>
              </div>
            </DialogPanel>
          </Dialog>
          <button
            className="bg-teal-100 rounded-full w-fit mt-2 hover:ring-2 hover:ring-teal-400/50 transition-all"
            onClick={() => setDialogOpen(true)}
          >
            <InformationCircleIcon width={24} color="teal" />
          </button>
        </aside>
      </aside>

      <div className="flex flex-col justify-between lg:col-span-2 col-span-2 md:py-8 md:pr-8">
        <div className="w-full max-w-full h-full min-h-max rounded relative flex justify-center items-center border border-teal-800/50">
          <div className="w-full max-w-full h-full p-3 md:p-4 rounded bg-[url('/studio-bg.png')] opacity-15 backdrop-filter grayscale absolute top-0 left-0 z-0 bg-cover pointer-events-auto" />
          {isLoading && <ScaleLoader color="#38B2AC" />}
          {!isLoading && midiFile && (
            <section className="z-1 p-4">
              <div id="player">
                {/* @ts-ignore */}
                <midi-player
                  src={midiFile}
                  sound-font="https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus"
                  visualizer="#midi-visualizer"
                  tempo={tempo}
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
        </div>
      </div>
      <Script src="https://cdn.jsdelivr.net/combine/npm/tone@14.7.58,npm/@magenta/music@1.23.1/es6/core.js,npm/focus-visible@5,npm/html-midi-player@1.5.0" />
    </div>
  );
}
