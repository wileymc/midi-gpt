import { useCreditStore, useDialogueStore } from "@/lib/store";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { Dialog, DialogPanel, Text, TextInput, Title } from "@tremor/react";
import Image from "next/image";
import { Divider } from "@tremor/react";
import { Button } from "@react-email/components";
import { supabase } from "@/lib/supabase";
import { toast } from "react-toastify";
import { useState } from "react";
import { ScaleLoader } from "react-spinners";

export function Nav() {
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
      <PricingModal />
      <RedeemModal />
    </nav>
  );
}

function PricingSection() {
  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-tremor-default border border-tremor-border bg-tremor-background-muted p-6 dark:border-dark-tremor-border dark:bg-dark-tremor-background-muted">
          <div className="flex items-start justify-between space-x-6">
            <h3 className="font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong text-tremor-metric">
              <span className="text-tremor-brand">10</span> Credits
            </h3>
            <p className="flex items-baseline">
              <span className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                $5
              </span>
            </p>
          </div>
          <Divider />
          <div className="flex items-center justify-center">
            <Image
              src="/strat.png"
              alt="Keyboard Piano"
              width={300}
              height={300}
              style={{
                borderRadius: "5px",
              }}
            />
          </div>
          <a
            href="https://buy.stripe.com/8wMcQJaVhgzv796bIK"
            className="block w-full whitespace-nowrap mt-8 rounded-tremor-small bg-tremor-brand py-2.5 text-center text-tremor-default font-medium text-tremor-brand-inverted shadow-tremor-input hover:bg-tremor-brand-emphasis dark:bg-dark-tremor-brand dark:text-dark-tremor-brand-inverted dark:shadow-dark-tremor-input dark:hover:bg-dark-tremor-brand-emphasis"
          >
            Buy
          </a>
        </div>
        <div className="rounded-tremor-default border border-tremor-border bg-tremor-background-muted p-6 dark:border-dark-tremor-border dark:bg-dark-tremor-background-muted">
          <div className="flex items-start justify-between space-x-6">
            <h3 className="font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong text-tremor-metric">
              <span className="text-tremor-brand">50</span> Credits
            </h3>
            <p className="flex items-baseline">
              <span className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                $20
              </span>
            </p>
          </div>
          <Divider />
          <div className="flex items-center justify-center">
            <Image
              src="/kit.jpeg"
              alt="Keyboard Piano"
              width={300}
              height={300}
              style={{
                borderRadius: "5px",
              }}
            />
          </div>
          <a
            href="https://buy.stripe.com/14k8At6F10Axbpm289"
            className="block w-full whitespace-nowrap mt-8 rounded-tremor-small bg-tremor-brand py-2.5 text-center text-tremor-default font-medium text-tremor-brand-inverted shadow-tremor-input hover:bg-tremor-brand-emphasis dark:bg-dark-tremor-brand dark:text-dark-tremor-brand-inverted dark:shadow-dark-tremor-input dark:hover:bg-dark-tremor-brand-emphasis"
          >
            Buy
          </a>
        </div>
        <div className="rounded-tremor-default border border-tremor-border bg-tremor-background-muted p-6 dark:border-dark-tremor-border dark:bg-dark-tremor-background-muted">
          <div className="flex items-start justify-between space-x-6">
            <h3 className="font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong text-tremor-metric">
              <span className="text-tremor-brand">250</span> Credits
            </h3>
            <p className="flex items-baseline">
              <span className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                $80
              </span>
            </p>
          </div>
          <Divider />
          <div className="flex items-center justify-center">
            <Image
              src="/moog.png"
              alt="Keyboard Piano"
              width={300}
              height={300}
              style={{
                borderRadius: "5px",
              }}
            />
          </div>
          <a
            href="https://buy.stripe.com/fZe8At1kH6YVfFC288"
            className="block w-full whitespace-nowrap mt-8 rounded-tremor-small bg-tremor-brand py-2.5 text-center text-tremor-default font-medium text-tremor-brand-inverted shadow-tremor-input hover:bg-tremor-brand-emphasis dark:bg-dark-tremor-brand dark:text-dark-tremor-brand-inverted dark:shadow-dark-tremor-input dark:hover:bg-dark-tremor-brand-emphasis"
          >
            Buy
          </a>
        </div>
      </div>
    </>
  );
}

function PricingModal() {
  const { creditsMenuOpen, setCreditsMenuOpen, setRedeemMenuOpen } =
    useDialogueStore((state) => ({
      creditsMenuOpen: state.creditsMenuOpen,
      setCreditsMenuOpen: state.setCreditsMenuOpen,
      redeemMenuOpen: state.redeemMenuOpen,
      setRedeemMenuOpen: state.setRedeemMenuOpen,
    }));
  const creditsRemaining = useCreditStore((state) => state.credits);
  return (
    <div>
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
      <Dialog
        open={creditsMenuOpen}
        onClose={(val) => setCreditsMenuOpen(val)}
        static={true}
      >
        <DialogPanel className={`md:max-w-[64rem]`}>
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
            credits remaining. You can purchase more credits below. Already have
            a code?{" "}
            <Button
              className="cursor-pointer"
              onClick={() => setRedeemMenuOpen(true)}
            >
              Redeem it now.
            </Button>
          </Text>
          <Divider className="my-4" />
          <PricingSection />
        </DialogPanel>
      </Dialog>
    </div>
  );
}

function RedeemModal() {
  const [isLoading, setIsLoading] = useState(false);
  const { redeemMenuOpen, setRedeemMenuOpen } = useDialogueStore((state) => ({
    redeemMenuOpen: state.redeemMenuOpen,
    setRedeemMenuOpen: state.setRedeemMenuOpen,
  }));

  const handleRedeem = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const inputValue = event.currentTarget["code"].value;

    try {
      const { data, error } = await supabase
        .from("credit_codes")
        .update({ redeemed_at: new Date() }) // Use the 'update' method instead of 'set'
        .eq("code", inputValue)
        .select();

      if (error) {
        throw error;
      }

      if (data) {
        useCreditStore.getState().increase(data[0].credits);
        toast.success("Code redeemed successfully");
        setRedeemMenuOpen(false);
      }
    } catch (error) {
      console.error("Error redeeming code", error);
      toast.error("Error redeeming code");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={redeemMenuOpen} onClose={() => setRedeemMenuOpen(false)}>
      <DialogPanel>
        <Title>Redeem your code</Title>
        <Text>
          Enter your code below to redeem your credits. If you have a code from
          a purchase, you can enter it here to add credits to your account.
        </Text>
        <Divider className="my-4" />
        <form
          className="flex flex-col gap-4 w-full h-full"
          onSubmit={handleRedeem}
        >
          <TextInput name="code" />
          <button
            className="btn-primary h-8"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <ScaleLoader height={16} color="#fff" />
            ) : (
              "Redeem Code"
            )}
          </button>
        </form>
      </DialogPanel>
    </Dialog>
  );
}
