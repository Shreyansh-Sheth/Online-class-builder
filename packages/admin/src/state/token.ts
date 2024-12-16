import { atom } from "recoil";

export const tokenState = atom<undefined | string>({
  key: "tokenSTate", // unique ID (with respect to other atoms/selectors)
  default: undefined, // default value (aka initial value)
});
