export declare global {
  interface Window {
    electronAPI: {
      getBills: () => Promise<RealBillsCollectionType>;
    };
  }
}
