import { create } from "zustand";

export const useDetailStore = create((set) => ({
  data: null,
  setData: (data) => set(() => ({ data: data })),
}));
