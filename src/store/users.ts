import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const emailAtom = atomWithStorage("email", "");
const usernameAtom = atomWithStorage("username", "");
//export const accountIDAtom = atom("");
const accountIDAtom = atomWithStorage("accountID", "");

const avatarAtom = atom("");

export { emailAtom, usernameAtom, accountIDAtom, avatarAtom };
