import {
  TreasurySecurityType,
  TreasuryErrorType,
  NativeTreasuryAssetType,
} from "../types";
import { billReducer } from "./billReducer";

const TREASURY_BASE_URL = "https://www.treasurydirect.gov/TA_WS/";
const SECURITIES_PATH = "securities/";
const TREASURY_PARAMS = "?format=json";
const TreasuryURLS = [
  `${TREASURY_BASE_URL}${SECURITIES_PATH}auctioned${TREASURY_PARAMS}&type=Bill`,
  `${TREASURY_BASE_URL}${SECURITIES_PATH}auctioned${TREASURY_PARAMS}&type=CMB`,
  `${TREASURY_BASE_URL}${SECURITIES_PATH}CMB${TREASURY_PARAMS}`,
  `${TREASURY_BASE_URL}${SECURITIES_PATH}Bill${TREASURY_PARAMS}`,
  `${TREASURY_BASE_URL}${SECURITIES_PATH}upcoming${TREASURY_PARAMS}`,

];

let lastPull: Date;
let previousData: TreasurySecurityType[] = [];

export const getTreasuries = async (
  force?: boolean
): Promise<{
  success: TreasurySecurityType[];
  error: TreasuryErrorType[];
}> => {
  const fifteenMinuesAgo = new Date(Date.now() - 15 * 60 * 1000);

  if (!force && previousData.length && lastPull > fifteenMinuesAgo) {
    return Promise.resolve({ success: previousData, error: [] });
  }
  return await Promise.allSettled(TreasuryURLS.map((url) => fetch(url)))
    .then(async (promiseList) => {
      const data: {
        success: NativeTreasuryAssetType[];
        error: TreasuryErrorType[];
      } = {
        success: [],
        error: [],
      };
      for (let p = 0; p < promiseList.length; p++) {
        const promise = promiseList[p];
        if (promise.status === "fulfilled") {
          if (promise.value.ok) {
            const json = await promise.value.json();
            data.success.push(...json);
          } else {
            const { url, statusText } = promise.value;
            data.error.push({
              url,
              reason: statusText,
              timestamp: new Date().toISOString(),
            });
          }
        } else {
          data.error.push({
            reason: promise.reason,
            timestamp: new Date().toISOString(),
          });
        }
      }
      return await data;
    })
    .then(({ error, success: incomingSuccess }) => {
      const success = incomingSuccess.reduce(billReducer, []);
      const now = new Date();
      lastPull = now;
      previousData = success;
      return { error, success };
    });
};
