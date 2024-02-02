import { Dialog, DialogPanel, Title, Text, Divider } from "@tremor/react";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

export default function Information() {
  const [isDialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Dialog
        open={isDialogOpen}
        onClose={(val) => setDialogOpen(val)}
        static={true}
      >
        <DialogPanel>
          <Title className="mb-3 flex gap-2">
            <InformationCircleIcon width={24} className="text-teal-500/80" />
            Information
          </Title>
          <div>
            <Text>
              Thanks for visiting MIDIgpt! This is a simple but powerful web app
              that leverages a ton of open source libraries and APIs to generate
              MIDI files from text prompts. It is deeply inspired by{" "}
              <a href="https://github.com/whoiskatrin/chart-gpt">ChartGPT</a>{" "}
              which is an awesome app for generating charts from text prompts.
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
              The app is open source and the code is available on GitHub. If you
              have any questions or feedback, feel free to reach out to me on{" "}
              <a href="twitter.com/wileymckayconte">Twitter</a> or{" "}
              <a href="github.com/wileymc">GitHub</a>. Enjoy!
            </Text>
            <Divider className="my-4" />
            <Text>
              I am currently working on training a proprietary model to generate
              higher quality MIDI files from text prompts. If you are interested
              in contributing, please{" "}
              <a href="mailto:me+midigpt@wileymc.com">get in touch with me</a>.
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
    </>
  );
}
