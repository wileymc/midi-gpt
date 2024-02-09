import { Button, Tailwind } from "@react-email/components";

export function Email({ code, credits }: { code: string; credits: number }) {
  return (
    <Tailwind>
      <h1 className="text-2xl font-bold mb-4">Thanks for your purchase</h1>
      <p className="mb-4">
        You've received {credits} credits for MIDIgpt. Click the button below to
        redeem them. Treat this code like cash, if you lose your session on our
        site, you can enter this code to retrieve your credit balance.
      </p>
      <strong className="text-center text-xl">{code}</strong>
      <Button
        className="bg-brand px-3 py-2 font-medium leading-4 text-white"
        href={`https://midigpt.com/redeem?code=${code}`}
      >
        Redeem {credits} Credits on MIDIgpt
      </Button>
    </Tailwind>
  );
}
