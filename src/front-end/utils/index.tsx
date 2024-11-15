import {Dayjs} from "dayjs";
import {AssetDurationProps, BondActionDatesType, BondInfoType} from "../types";

// export const actionDatesMap = {
//   // add maturity days;
//   ["4-week"]: [28, 5, 4],
//   ["42-day"]: [42, 2, 2],
//   ["8-week"]: [56, 5, 4],
//   ["13-week"]: [91, 2, 1],
//   ["17-week"]: [119, 6, 3],
// };

export const bondData = {
  "4-week": {
    maturity: 28,
    issue: 5,
    auctionDay: 4,
  },
  "42-day": {
    maturity: 42,
    issue: 2,
    auctionDay: 2,
  },
  "8-week": {
    maturity: 56,
    issue: 5,
    auctionDay: 4,
  },
  "13-week": {
    maturity: 91,
    issue: 2,
    auctionDay: 1,
  },
  "17-week": {
    maturity: 119,
    issue: 6,
    auctionDay: 3,
  },
};

const getIssueDates = (selectedDate: Dayjs) => {
  return Object.entries(bondData).reduce(
    (
      acc,
      [key, {maturity: maturityInDays, issue: daysToIssue, auctionDay}]: [
        keyof typeof bondData,
        BondInfoType,
      ]
    ) => {
      let adjustedAuctionDate = selectedDate.subtract(daysToIssue, "days");
      while (adjustedAuctionDate.day() !== auctionDay) {
        adjustedAuctionDate = adjustedAuctionDate.add(1, "day");
      }

      const actionDates = {
        issue: adjustedAuctionDate.add(daysToIssue, "days"),
        maturity: adjustedAuctionDate.add(daysToIssue + maturityInDays, "days"),
        auction: adjustedAuctionDate,
      } as BondActionDatesType;

      acc[key] = actionDates;
      return acc;
    },
    {} as Record<keyof typeof bondData, BondActionDatesType>
  );
};

const getAuctionDates = (selectedDate: Dayjs) => {
  return Object.entries(bondData).reduce(
    (
      acc,
      [key, {maturity: maturityInDays, issue: daysToIssue, auctionDay}]: [
        keyof typeof bondData,
        BondInfoType,
      ]
    ) => {
      let adjustedDate = selectedDate;
      while (adjustedDate.day() !== auctionDay) {
        adjustedDate = adjustedDate.add(1, "day");
      }

      const actionDates = {
        auction: adjustedDate,
        issue: adjustedDate.add(daysToIssue, "days"),
        maturity: adjustedDate.add(daysToIssue + maturityInDays, "days"),
      } as BondActionDatesType;

      acc[key] = actionDates;
      return acc;
    },
    {} as Record<keyof typeof bondData, BondActionDatesType>
  );
};

const getMaturityDates = (selectedDate: Dayjs) => {
  return Object.entries(bondData).reduce(
    (
      acc,
      [key, {maturity: maturityInDays, issue: daysToIssue, auctionDay}]: [
        keyof typeof bondData,
        BondInfoType,
      ]
    ) => {
      let adjustedAuctionDate = selectedDate.subtract(
        maturityInDays + daysToIssue,
        "days"
      );
      while (adjustedAuctionDate.day() !== auctionDay) {
        adjustedAuctionDate = adjustedAuctionDate.add(1, "day");
      }

      const actionDates = {
        maturity: adjustedAuctionDate.add(daysToIssue + maturityInDays, "days"),
        issue: adjustedAuctionDate.add(daysToIssue, "days"),
        auction: adjustedAuctionDate,
      } as BondActionDatesType;
      acc[key] = actionDates;
      return acc;
    },
    {} as Record<keyof typeof bondData, BondActionDatesType>
  );
};

export const calcDates = ({selectedDate, dateType}: AssetDurationProps) => {
  switch (dateType) {
    case "maturity":
      return getMaturityDates(selectedDate);
    case "issue":
      return getIssueDates(selectedDate);
    case "auction":
      return getAuctionDates(selectedDate);
  }
};
