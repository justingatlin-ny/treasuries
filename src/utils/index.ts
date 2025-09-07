import {RealORPossibleBillsType} from "../types";
import dayjs, {Dayjs} from "dayjs";
import dayjsBankingDays from "dayjs-banking-days";

dayjs.extend(dayjsBankingDays);

export const humanReadableDate = (input: string): string => {
  const updatedDate = dayjs(input);
  return updatedDate.format("ddd MMM D, YYYY");
};

const sortBillsByDateFunc = (
  billA: RealORPossibleBillsType,
  billB: RealORPossibleBillsType
) => {
  const first = dayjs(billA.auctionDate);
  const second = dayjs(billB.auctionDate);
  return first.isBefore(second) ? -1 : 1;
};

export const sortBillsByDate = (billArray: RealORPossibleBillsType[]) => {
  return billArray.sort(sortBillsByDateFunc);
};

export const determineStatus = (value: string) => {
  const currentValue = dayjs(value);
  return {
    IsPassed: currentValue.isBefore(dayjs()),
    IsClose:
      currentValue.isAfter(dayjs()) &&
      !currentValue.isAfter(dayjs().add(7, "days")),
  };
};

export const getImportantDates = (selectedBills: RealORPossibleBillsType[]) => {
  let firstDate: Dayjs;

  const finalMaturity = selectedBills.reduce((acc, bill) => {
    const {maturityDate, auctionDate} = bill;
    if (!firstDate) {
      firstDate = dayjs(auctionDate);
    }
    const maturity = dayjs(maturityDate);
    if (acc < maturity) acc = maturity;
    return acc;
  }, dayjs());

  const dateOfMaturity = finalMaturity.date();
  const monthNeeded =
    dateOfMaturity >= 6
      ? finalMaturity.add(1, "month").set("date", 1)
      : finalMaturity.set("date", 1);

  return {firstDate, monthNeeded, finalMaturity};
};

export const getDate = (incoming: Dayjs) => {
  return incoming.format("YYYY-MM-DD");
};
