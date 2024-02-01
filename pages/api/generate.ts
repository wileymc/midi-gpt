import MidiWriter from "midi-writer-js";

export default async function handler(req, res) {
  //   const { input } = req.body;
  //   const prompt = `Generate a random number between 1 and 100`;
  //   const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  //   const response = await fetch("https://api.openai.com/v1/chat/completions", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${OPENAI_API_KEY}`,
  //     },
  //     body: JSON.stringify({
  //       model: "gpt-3.5-turbo",
  //       messages: [
  //         {
  //           role: "user",
  //           content: prompt,
  //         },
  //       ],
  //       temperature: 0.7,
  //     }),
  //   });
  //   const status = await response.status;
  //   console.log(status);
  //   const data = await response.json();
  //   console.log(data);
  //   res.setHeader("Content-Type", "application/json");
  //   res.status(200).json(data);

  const track = new MidiWriter.Track();

  // Define an instrument (optional):
  track.addEvent(new MidiWriter.ProgramChangeEvent({ instrument: 2 }));

  // Hot cross buns
  track.addEvent(
    [
      new MidiWriter.NoteEvent({ pitch: ["E4", "D4"], duration: "4" }),
      new MidiWriter.NoteEvent({ pitch: ["C4"], duration: "2" }),
      new MidiWriter.NoteEvent({ pitch: ["E4", "D4"], duration: "4" }),
      new MidiWriter.NoteEvent({ pitch: ["C4"], duration: "2" }),
      new MidiWriter.NoteEvent({
        pitch: ["C4", "C4", "C4", "C4", "D4", "D4", "D4", "D4"],
        duration: "8",
      }),
      new MidiWriter.NoteEvent({ pitch: ["E4", "D4"], duration: "4" }),
      new MidiWriter.NoteEvent({ pitch: ["C4"], duration: "2" }),
    ],
    function (event, index) {
      return { sequential: true };
    }
  );

  // Generate a data URI
  const write = new MidiWriter.Writer(track);
  const uri = write.dataUri();
  res.setHeader("Content-Type", "application/json");
  res.status(200).json({ uri });
}
