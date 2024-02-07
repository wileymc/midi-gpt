import { useCreditStore, useDialogueStore } from "@/lib/store";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { Dialog, DialogPanel, Text, Title } from "@tremor/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Script from "next/script";
import { Auth } from "./Auth";

export function Nav() {
  const { creditsMenuOpen, setCreditsMenuOpen } = useDialogueStore((state) => ({
    creditsMenuOpen: state.creditsMenuOpen,
    setCreditsMenuOpen: state.setCreditsMenuOpen,
  }));
  const creditsRemaining = useCreditStore((state) => state.credits);
  const { theme } = useTheme();
  return (
    <nav
      className={`flex flex-row justify-between items-center w-full p-3 border-b h-[48px] bg-zinc-200 border-zinc-300 dark:bg-zinc-950 dark:border-zinc-700 transition-all`}
    >
      <div className={`flex gap-2 items-center`}>
        <Image
          src="https://www.svgrepo.com/show/217552/keyboard-piano.svg"
          alt="Keyboard Piano"
          width={36}
          height={36}
        />
        <h3 className={`font-mono text-sm`}>
          MIDI<strong>gpt</strong>
        </h3>
      </div>
      <div>
        <Dialog
          open={creditsMenuOpen}
          onClose={(val) => setCreditsMenuOpen(val)}
          static={true}
        >
          <DialogPanel className={`lg:max-w-[32rem]`}>
            <div className="absolute top-0 right-0 p-3">
              <XCircleIcon
                width={20}
                className="text-teal-600 cursor-pointer hover:text-teal-400 transition-all"
                onClick={() => setCreditsMenuOpen(false)}
              />
            </div>
            <Title className="mb-3">Add credits to generate more MIDI</Title>
            <Text>
              You have <span className="text-teal-300">{creditsRemaining}</span>{" "}
              credits remaining. Please register or sign in to add more credits.
            </Text>
            <Auth handleClose={() => setCreditsMenuOpen(false)} />
          </DialogPanel>
        </Dialog>
        <div className="flex justify-end items-center gap-2">
          <button
            className={`flex items-center gap-1 text-sm dark:text-zinc-300 dark:hover:text-teal-300 transition-all border hover:ring-1 ring-teal-400 border-teal-500 dark:border-teal-300 rounded-md px-2 py-0.5`}
            onClick={() => setCreditsMenuOpen(true)}
          >
            <span
              className={`text-xs thin bg-teal-700 text-white min-w-4 min-h-4 px-1 rounded-full mr-2 flex items-center justify-center`}
            >
              {creditsRemaining}
            </span>
            Credits
          </button>
        </div>
      </div>
    </nav>
  );
}
