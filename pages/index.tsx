import { Subtitle, Divider } from "@tremor/react";
import Script from "next/script";
import { useState } from "react";
import { ScaleLoader } from "react-spinners";

const SectionHeader = ({
  stepNumber,
  title,
}: {
  stepNumber: number;
  title: string;
}) => {
  return (
    <div className="flex items-center gap-2">
      <div className="block bg-teal-100 dark:bg-teal-500/20 text-teal-500 font-semi-bold font-mono h-6 w-6 rounded-full flex items-center justify-center mr-2">
        {stepNumber}
      </div>
      <Subtitle className="text-gray-700 dark:text-gray-300">{title}</Subtitle>
    </div>
  );
};

async function getFileFromUri(url, name, defaultType = "audio/midi") {
  const response = await fetch(url);
  const data = await response.blob();
  return new File([data], name, {
    type: data.type || defaultType,
  });
}

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [midiFile, setMidiFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputValue }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate MIDI file");
      }

      let json = await response.json();
      let uri = json.uri;
      let file = await getFileFromUri(uri, "generated.mid");
      setMidiFile(uri);
      // Do something with the generated MIDI file
    } catch (error) {
      console.error(error);
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 h-full`}>
      <aside className="h-full flex flex-col col-span-1 order-last md:order-first p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <SectionHeader
            title="Describe a melody, chord sequence, or anything musical that
                you'd like to generate as MIDI"
            stepNumber={1}
          />
          <textarea
            id="input"
            name="prompt"
            placeholder="Give me a funky thumping house bassline..."
            value={inputValue}
            onChange={handleChange}
            required
            autoFocus
            className="w-full p-3 rounded border border-stone-600 bg-stone-900 hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
          />
          <button type="submit" className={`btn-primary`}>
            Generate a MIDI file
          </button>
          <div className="py-2">
            <Divider className="h-px bg-teal-900/50" />
          </div>
          <SectionHeader
            title="Adjust parameters for your new midi file as needed"
            stepNumber={2}
          />
        </form>
      </aside>

      <div className="flex flex-col justify-between lg:col-span-2 col-span-2 md:py-4 md:pr-4">
        <div className="w-full max-w-full h-full rounded relative flex justify-center items-center border border-teal-800/50">
          <div
            className="w-full max-w-full h-full p-3 md:p-4 rounded bg-[url('/studio-bg.png')] opacity-5 backdrop-filter grayscale absolute top-0 left-0"
            style={{ backgroundSize: "cover" }}
          />
          {loading && <ScaleLoader color="#38B2AC" />}
          {midiFile && (
            <section id="player">
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
            </section>
          )}
        </div>
      </div>
      <Script src="https://cdn.jsdelivr.net/combine/npm/tone@14.7.58,npm/@magenta/music@1.23.1/es6/core.js,npm/focus-visible@5,npm/html-midi-player@1.5.0" />
    </div>
  );
}
