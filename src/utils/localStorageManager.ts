import dayjs from "dayjs";
import {SavedLadderPayload, TreasurySecurityType} from "../types";

export const SAVED_LADDERS = "savedLadders";
export const ON_SAVED_LADDERS_CHANGED = "onSavedLaddersChanged";

const updateStorage = (newValue: SavedLadderPayload[]) => {
  if (!window?.localStorage) throw new Error("No window object");
  window.localStorage.setItem(SAVED_LADDERS, JSON.stringify(newValue));
};

export const addToStorage = (newLadder: SavedLadderPayload) => {
  const ladders = getSavedLaddersFromStorage();
  ladders.push(newLadder);
  updateStorage(ladders);
};

export const removeFromStorage = (id: string) => {
  const ladders = getSavedLaddersFromStorage();
  const updatedLadders = ladders.filter((ladder) => ladder.id !== id);
  updateStorage(updatedLadders);
};

export const updateNotes = (id: string, newText: string) => {
  const savedLadders: SavedLadderPayload[] = getSavedLaddersFromStorage();

  const updatedLadders = savedLadders.map((ladder) => {
    if (ladder.id === id) {
      ladder.notes = newText;
    }
    return ladder;
  });
  updateStorage(updatedLadders);
};

export const getSavedLaddersFromStorage = (): SavedLadderPayload[] => {
  if (!window?.localStorage) throw new Error("No window object");
  const ladders = window.localStorage.getItem(SAVED_LADDERS) || "[]";
  return JSON.parse(ladders);
};

const validateSavedBillsAndUpdateStorage = (
  realTreasuryBills: TreasurySecurityType[]
) => {
  const daysInFuture = dayjs().add(10, "days");

  const viableTreasuries = realTreasuryBills.filter((data) => {
    const auctionDate = dayjs(data.auctionDate);
    return (
      daysInFuture.isAfter(auctionDate, "date") ||
      daysInFuture.isSame(auctionDate, "date")
    );
  });
  const previousLadders = getSavedLaddersFromStorage();

  const updatedLadders = (previousLadders: SavedLadderPayload[]) => {
    return previousLadders.map((savedLadder) => {
      const updatedBills = savedLadder.selectedBills.map((bill) => {
        const correspondingBill = viableTreasuries.find((currentViable) => {
          return (
            bill.auctionDate === currentViable.auctionDate &&
            bill.maturityDate === currentViable.maturityDate
          );
        });
        if (correspondingBill) {
          savedLadder.invalid = false;
          return {
            ...bill,
            ...correspondingBill,
            invalid: false,
          };
        }
        return bill;
      });
      savedLadder.selectedBills = updatedBills;
      return savedLadder;
    });
  };

  if (viableTreasuries.length && previousLadders.length) {
    updateStorage(updatedLadders(previousLadders));
  }
};

export default validateSavedBillsAndUpdateStorage;
