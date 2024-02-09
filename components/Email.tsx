import { Button, Tailwind } from "@react-email/components";

export function Email({ code, credits }: { code: string; credits: number }) {
  return (
    <Tailwind>
      <Button
        className="bg-brand px-3 py-2 font-medium leading-4 text-white"
        href={`https://midigpt.com/redeem?code=${code}`}
      >
        Redeem {credits} Credits on MIDIgpt
      </Button>
    </Tailwind>
  );
}
