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
        decrement: () => set((state) => ({ credits: state.credits - 1 })),
      }),
      {
        name: "credits",
      }
    )
  )
);
