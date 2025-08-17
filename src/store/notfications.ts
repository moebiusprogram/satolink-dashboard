import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const notificationsAtom = atomWithStorage("notifications", []);
export const paymentAtom = atom(false);
