import MidiWriter from "midi-writer-js";
import OpenAI from "openai";
import { NextApiRequest, NextApiResponse } from "next";

const openai = new OpenAI();

type MidiEvent = {
  pitch: string[];
  duration: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { inputValue, instrumentKey = 1, tempo = 120 } = req.body;
  const prompt = `You are a midi composer. Given the following description, please generate a midi sequence.  Output the midi sequence as an array of note(s) in time with the format '{ pitch: ["E4", "D4"], duration: "4" }'. Output nothing but JSON in this format, if you cannot do so respond "FAIL". Description: ${inputValue}`;
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: prompt }],
    model: "gpt-4",
    // Consider using function call to make this more robust
  });

  const midiSequence = completion.choices[0].message.content as string;
  const parsedMidiSequence = JSON.parse(midiSequence);
  let events = parsedMidiSequence?.map(
    (event: MidiEvent) => new MidiWriter.NoteEvent(event)
  );

  const track = new MidiWriter.Track();

  // Define an instrument (optional):
  track.addEvent(
    new MidiWriter.ProgramChangeEvent({ instrument: instrumentKey })
  );

  track.setTempo(tempo);

  track.addEvent(events, function (event, index) {
    return { sequential: true };
  });

  // Generate a data URI
  const write = new MidiWriter.Writer(track);
  const uri = write.dataUri();
  res.setHeader("Content-Type", "application/json");
  res.status(200).json({ uri });
}
