import { atom } from "recoil";

export const accessTokenAtom = atom<null | string>({
  default: null,
  key: "accessTokenAtom",
});
