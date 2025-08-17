import { atomWithStorage } from "jotai/utils";

export const settingsAtom = atomWithStorage("settings", {
  maxUSDT: "1000",
  minUSDT: "1",
  maxBTC: "0.1",
  minBTC: "0.00001",
  saveTransactionHist: true,
  lightningActive: true,
  taprootActive: true,
  twoFactor: false,
  emailNotifications: true,
});
