export declare global {
  interface Window {
    electronAPI: {
      getBills: () => Promise<RealBillsCollectionType>;
      createInvite: (ladder: SavedLadderPayload) => Promise<boolean>;
    };
  }
}
