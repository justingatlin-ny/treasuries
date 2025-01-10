import {TreasurySecurityType} from "./types";

export declare global {
  interface Window {
    electronAPI: {
      getBills: () => Promise<TreasurySecurityType[]>;
      createInvite: (ladder: SavedLadderPayload) => Promise<boolean>;
    };
  }
}
