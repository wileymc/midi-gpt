import MidiWriter from "midi-writer-js";
import OpenAI from "openai";
import { NextApiRequest, NextApiResponse } from "next";
import { parseCode } from "@/lib/strings";

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
  const prompt = `You are a midi composer. Given the following description, please generate a midi sequence.  
                  It is possible to play multiple notes at the same time.
                  Output the midi sequence as an array of events in time with the FORMAT '{ pitch: ["E4", "D4"], duration: "4", velocity: "100" }'.
                  Pitch values can only string notes from C0 to G10.
                  Duration values can only be: 
                  1 : whole
                  2 : half
                  d2 : dotted half
                  dd2 : double dotted half
                  4 : quarter
                  4t : quarter triplet
                  d4 : dotted quarter
                  dd4 : double dotted quarter
                  8 : eighth
                  8t : eighth triplet
                  d8 : dotted eighth
                  dd8 : double dotted eighth
                  16 : sixteenth
                  16t : sixteenth triplet
                  32 : thirty-second
                  64 : sixty-fourth
                  Tn : where n is an explicit number of ticks (T128 = 1 beat)
                  Velocity values can only be between 0 and 100.
                  Output nothing but JSON in this format, if you cannot do so respond "FAIL". Description: ${inputValue}`;
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: prompt }],
    model: "gpt-3.5-turbo-1106",
    // Consider using function call to make this more robust
  });

  const midiSequence = parseCode(
    completion.choices[0].message.content as string
  );
  const parsedMidiSequence = JSON.parse(midiSequence);
  let events = parsedMidiSequence?.map(
    (event: MidiEvent) => new MidiWriter.NoteEvent(event)
  );

  const track = new MidiWriter.Track();

  track.polyModeOn();

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
