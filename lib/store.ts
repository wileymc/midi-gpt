import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface CreditStore {
  credits: number;
  increase: (amount: number) => void;
  decrement: () => void;
}

export const useCreditStore = create<CreditStore>()(
  devtools(
    persist(
      (set) => ({
        credits: 3,
        increase: (by: number) =>
          set((state) => ({ credits: state.credits + by })),
        decrement: () =>
          set((state) => ({ credits: Math.max(state.credits - 1, 0) })),
      }),
      {
        name: "credits",
      }
    )
  )
);

interface DialogueStore {
  creditsMenuOpen: boolean;
  setCreditsMenuOpen: (open: boolean) => void;
  redeemMenuOpen: boolean;
  setRedeemMenuOpen: (open: boolean) => void;
}

export const useDialogueStore = create<DialogueStore>((set) => ({
  creditsMenuOpen: false,
  setCreditsMenuOpen: (open: boolean) =>
    set({ creditsMenuOpen: open, redeemMenuOpen: false }),
  redeemMenuOpen: false,
  setRedeemMenuOpen: (open: boolean) =>
    set({ redeemMenuOpen: open, creditsMenuOpen: false }),
}));
