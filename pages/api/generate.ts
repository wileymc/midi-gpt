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
  const { inputValue, instrumentKey, tempo } = req.body;
  const prompt = `You are a specialized MIDI sequence generator. Your task is to create musical sequences in precise JSON format.

  Instructions for sequence generation:
  1. Output format must be a JSON object with a "notes" array: { "notes": [{ "pitch": ["E4"], "duration": "4", "velocity": "85" }, ...] }
  2. The sequence must be exactly 16 beats long (4 bars in 4/4 time)
  
  Constraints:
  - Pitch: Only use notes from C0 to G10 in string format (e.g., "C4", "G#3", "Bb5")
  - Duration values must be one of:
    * "1" (whole note = 4 beats)
    * "2" (half note = 2 beats)
    * "d2" (dotted half = 3 beats)
    * "dd2" (double dotted half = 3.5 beats)
    * "4" (quarter note = 1 beat)
    * "4t" (quarter triplet = 2/3 beat)
    * "d4" (dotted quarter = 1.5 beats)
    * "dd4" (double dotted quarter = 1.75 beats)
    * "8" (eighth = 0.5 beats)
    * "8t" (eighth triplet = 1/3 beat)
    * "d8" (dotted eighth = 0.75 beats)
    * "dd8" (double dotted eighth = 0.875 beats)
    * "16" (sixteenth = 0.25 beats)
    * "16t" (sixteenth triplet = 1/6 beat)
    * "32" (thirty-second = 0.125 beats)
    * "64" (sixty-fourth = 0.0625 beats)
    * "Tn" where n is ticks (T128 = 1 beat)
  - Velocity: Integer between 0-100
  
  Musical guidelines:
  - Vary note durations and velocities for musical interest
  - Consider using chord progressions (multiple pitches in the pitch array)
  - Ensure rhythmic consistency
  - Total duration must sum to exactly 16 beats
  
  Description: ${inputValue}
  
  If you cannot complete this task, respond with: { "error": "Specific reason for failure" }`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: prompt }],
    model: "gpt-3.5-turbo-0125",
    response_format: { type: "json_object" },
    // Consider using function call to make this more robust
  });

  const gptResponse = completion.choices[0].message.content as string;
  console.log(gptResponse);
  const json = JSON.parse(gptResponse);

  if (json.error) {
    res.status(500).send(json.error);
    return;
  }

  let events = json?.notes.map(
    (event: MidiEvent) => new MidiWriter.NoteEvent(event)
  );

  const track = new MidiWriter.Track();

  track.polyModeOn();

  if (instrumentKey)
    track.addEvent(
      new MidiWriter.ProgramChangeEvent({ instrument: instrumentKey })
    );

  if (tempo) track.setTempo(tempo);

  track.addTrackName(slugify(inputValue));

  track.setTempo(120);

  track.addEvent(events, function (event, index) {
    return { sequential: true };
  });

  // Generate a data URI
  const write = new MidiWriter.Writer(track);
  const uri = write.dataUri();
  res.setHeader("Content-Type", "application/json");
  res.status(200).json({ uri });
}

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}
