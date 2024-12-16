import { atom } from "recoil";

export const themeAtom = atom({
  key: "themeForEndUserAtom",
  default: "blue",
});
