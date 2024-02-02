import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />
        <meta property="og:title" content="=MIDIgpt" />
        <meta
          property="og:image"
          content="https://midigpt.xyz/midi-gpt-og.png"
        />
        <meta property="og:url" content="https://midigpt.xyz" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta
          property="og:description"
          content="Easily generate MIDI files from text prompts in seconds"
        />
        <meta
          name="description"
          content="Easily generate MIDI files from text prompts in seconds"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@wileymckayconte" />
        <meta name="twitter:title" content="MIDIgpt | Text to MIDI Files" />
        <meta
          name="twitter:description"
          content="Easily generate MIDI files from text prompts in seconds"
        />
        <meta
          name="twitter:image"
          content="https://midigpt.xyz/midi-gpt-og.png"
        />
        <meta
          name="keywords"
          content="midi, gpt, ai, audio, file generation, music, midi tools, ai midi, ai audio, ai music"
        />
        <meta name="robots" content="index, follow" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
