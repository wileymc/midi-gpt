import { XCircleIcon } from "@heroicons/react/24/solid";
import { Button, Dialog, DialogPanel, Text, Title } from "@tremor/react";
import Script from "next/script";
import { useState } from "react";

export function Nav() {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [creditsRemaining, setCreditsRemaining] = useState(3);
  return (
    <nav
      className={`flex flex-row justify-between items-center w-full p-2 px-4 border-b h-[48px] bg-zinc-200 border-zinc-300 dark:bg-zinc-950 dark:border-zinc-700 transition-all`}
    >
      <div className={`flex gap-2 items-center`}>
        <img
          src="https://www.svgrepo.com/show/217552/keyboard-piano.svg"
          alt="Keyboard Piano"
          style={{ height: "36px" }}
        />
        <h3 className={`font-mono text-sm`}>
          MIDI<strong>gpt</strong>
        </h3>
      </div>
      <div>
        <Dialog
          open={isDialogOpen}
          onClose={(val) => setDialogOpen(val)}
          static={true}
        >
          <DialogPanel className={`lg:max-w-[64rem]`}>
            <div className="flex justify-end">
              <XCircleIcon
                width={20}
                className="text-teal-600 cursor-pointer hover:text-teal-400 transition-all"
                onClick={() => setDialogOpen(false)}
              />
            </div>
            <Title className="mb-3">Add credits to generate more MIDI</Title>
            <Text>
              You have <span className="text-teal-300">{creditsRemaining}</span>{" "}
              credits remaining.
            </Text>
            <div className="mt-3">
              <Script async src="https://js.stripe.com/v3/pricing-table.js" />
              {/* @ts-ignore */}
              <stripe-pricing-table
                pricing-table-id="prctbl_1Of7V1BDS22igUDjektIuC5m"
                publishable-key="pk_live_51Of6RkBDS22igUDjuGhhLqxihN37zQn3G4FCXpcy8z1z9WnPjVPvPGKo8DscXAF9BQ9EadMj6f9555VvumHrVLfA0088T8vn7Y"
              />
            </div>
          </DialogPanel>
        </Dialog>
        <button
          className={`flex items-center gap-1 text-sm dark:text-zinc-300 dark:hover:text-teal-300 transition-all border hover:ring-1 ring-teal-400 border-teal-500 dark:border-teal-300 rounded-md px-2 py-0.5`}
          onClick={() => setDialogOpen(true)}
        >
          <span
            className={`text-xs thin bg-teal-700 text-white w-4 h-4 rounded-full mr-2 flex items-center justify-center`}
          >
            3
          </span>
          Credits
        </button>
      </div>
    </nav>
  );
}
