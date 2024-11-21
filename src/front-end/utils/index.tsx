import dayjs, {Dayjs} from "dayjs";
import {
  AssetDurationTypes,
  BondActionDatesType,
  bondData,
  BondDataType,
  BondInfoType,
  DateType,
} from "../types";

const getIssueDates = (selectedDate: Dayjs) => {
  return Object.entries(bondData).reduce(
    (
      acc,
      [key, {maturity: maturityInDays, issue: daysToIssue, auctionDay}]
    ) => {
      let adjustedAuctionDate = selectedDate.subtract(daysToIssue, "days");
      while (adjustedAuctionDate.day() !== auctionDay) {
        adjustedAuctionDate = adjustedAuctionDate.subtract(1, "day");
      }

      const actionDates = {
        issue: adjustedAuctionDate.add(daysToIssue, "days"),
        maturity: adjustedAuctionDate.add(daysToIssue + maturityInDays, "days"),
        auction: adjustedAuctionDate,
      } as BondActionDatesType;

      acc[key as AssetDurationTypes] = actionDates;
      return acc;
    },
    {} as Record<AssetDurationTypes, BondActionDatesType>
  );
};
type ImportantBondDatesType = Record<AssetDurationTypes, BondActionDatesType>;
type GetAssetDatesType = (selectedDate: Dayjs) => ImportantBondDatesType;

const getAuctionDates: GetAssetDatesType = (selectedDate: Dayjs) => {
  return Object.entries(bondData).reduce(
    (
      acc,
      [key, {maturity: maturityInDays, issue: daysToIssue, auctionDay}]
    ) => {
      let adjustedDate = selectedDate;
      while (adjustedDate.day() !== auctionDay) {
        adjustedDate = adjustedDate.subtract(1, "day");
      }

      const actionDates = {
        auction: adjustedDate,
        issue: adjustedDate.add(daysToIssue, "days"),
        maturity: adjustedDate.add(daysToIssue + maturityInDays, "days"),
      } as BondActionDatesType;

      acc[key as AssetDurationTypes] = actionDates;
      return acc;
    },
    {} as ImportantBondDatesType
  );
};

const getMaturityDates = (selectedDate: Dayjs) => {
  return Object.entries(bondData).reduce(
    (
      acc,
      [key, {maturity: maturityInDays, issue: daysToIssue, auctionDay}]
    ) => {
      let adjustedAuctionDate = selectedDate.subtract(
        maturityInDays + daysToIssue,
        "days"
      );

      while (adjustedAuctionDate.day() !== auctionDay) {
        adjustedAuctionDate = adjustedAuctionDate.subtract(1, "day");
      }

      const actionDates = {
        maturity: adjustedAuctionDate.add(daysToIssue + maturityInDays, "days"),
        issue: adjustedAuctionDate.add(daysToIssue, "days"),
        auction: adjustedAuctionDate,
      } as BondActionDatesType;
      acc[key as AssetDurationTypes] = actionDates;
      return acc;
    },
    {} as ImportantBondDatesType
  );
};

type CalcDatesProps = {
  selectedDate: Dayjs;
  dateType: DateType;
};

export const calcDates = ({
  selectedDate,
  dateType,
}: CalcDatesProps): ImportantBondDatesType => {
  switch (dateType) {
    case "maturity":
      return getMaturityDates(selectedDate);
    case "issue":
      return getIssueDates(selectedDate);
    case "auction":
      return getAuctionDates(selectedDate);
  }
};

export const humanReadableDate = (input: Dayjs): string => {
  const updatedDate = input.hour(10).minute(0).second(0);
  return updatedDate.format("ddd MMM D, YYYY");
};

export const sortByAuctionDate = (arr) => {
  return arr.sort((a, b) => {
    const first = Object.values(a)[0].auction;
    const second = Object.values(b)[0].auction;
    return first.isBefore(second) ? -1 : 1;
  });
};

export const sortedDurations = Object.entries(bondData).sort((a, b) => {
  return b[1].maturity - a[1].maturity;
});

export const buildBillLadder = (
  finalMautityDate: Dayjs
): [AssetDurationTypes, ImportantBondDatesType][] => {
  const actionDate: Dayjs = dayjs();
  const viablebillStack = [];

  const findViableBills = (currentMaturityDate: Dayjs, num: number) => {
    // Based on this maturity date, find all bills that could be purchased;
    const possibleBills = getMaturityDates(currentMaturityDate);
    const bills = [];
    for (let d = num; d < sortedDurations.length; d++) {
      const currentDuration = sortedDurations[d][0] as AssetDurationTypes;
      const bill = possibleBills[currentDuration as AssetDurationTypes];
      const auctionDate = bill.auction;
      const isViable = auctionDate >= actionDate;
      if (isViable) {
        const prevBills = findViableBills(auctionDate, d);
        bills.push({[currentDuration]: bill});
        if (prevBills) {
          bills.push(...prevBills);
        }
        return bills;
      }
      if (finalMautityDate.isSame(currentMaturityDate)) {
        return [];
      }
    }
  };

  for (let d = 0; d < sortedDurations.length; d++) {
    const durationCombinations = findViableBills(finalMautityDate, d);
    if (durationCombinations.length) {
      viablebillStack.push(durationCombinations);
    }
  }
  return viablebillStack;
};
