import dayjs, {Dayjs} from "dayjs";
import {
  POSSIBLE_BILL_CALCULATIONS,
  PossibleBillType,
  RealORPossibleBillsType,
  TreasurySecurityType,
} from "../types";
import {getDate} from ".";

const sortByDuration = (bills: RealORPossibleBillsType[]) => {
  return bills.sort((a, b) => {
    if (b.maturityInDays !== a.maturityInDays) {
      // If this is negative, a comes before b;
      return b.maturityInDays - a.maturityInDays;
    }
    return dayjs(a.auctionDate).valueOf() - dayjs(b.auctionDate).valueOf();
  });
};

const isInvalidBill = ({
  auctionDate,
  cusip,
}: Partial<PossibleBillType & TreasurySecurityType>) => {
  const mustHaveCusipDeadline = dayjs().add(7, "days");
  return dayjs(auctionDate).isBefore(mustHaveCusipDeadline) && !cusip;
};

const mergeBills = (
  possibleBills: PossibleBillType[],
  realBills: TreasurySecurityType[]
) => {
  const originalList: Array<TreasurySecurityType | PossibleBillType> = [
    ...realBills,
  ];
  const merged = possibleBills.reduce((acc, possible) => {
    const {
      auctionDate: possibleAuctionDate,
      maturityDate: possibleMaturityDate,
    } = possible;
    const hasRealBill = realBills.find(
      ({auctionDate, maturityDate}) =>
        possibleAuctionDate === auctionDate &&
        possibleMaturityDate === maturityDate &&
        possibleMaturityDate === maturityDate
    );
    if (!hasRealBill) {
      acc.push(possible);
    }
    return acc;
  }, originalList);
  return merged;
};

const createUnpublishedBills = (
  latestMaturityForBills: Dayjs,
  earliestAuctionDate: Dayjs
) => {
  const futureBillCollection: PossibleBillType[] = [];
  const maturities = POSSIBLE_BILL_CALCULATIONS;

  for (const {
    maturityInDays,
    daysToIssue,
    auctionDayOfWeek,
    securityTerm,
  } of maturities) {
    let adjustedAuctionDate = earliestAuctionDate;

    while (adjustedAuctionDate.day() !== auctionDayOfWeek) {
      adjustedAuctionDate = adjustedAuctionDate.add(1, "days");
    }

    while (
      adjustedAuctionDate.isBankingHoliday() ||
      /0|6/.test(adjustedAuctionDate.day().toString())
    ) {
      adjustedAuctionDate = adjustedAuctionDate.add(1, "days");
    }

    let issueDate = adjustedAuctionDate.add(daysToIssue, "days");

    while (
      issueDate.isBankingHoliday() ||
      /0|6/.test(issueDate.day().toString())
    ) {
      issueDate = issueDate.add(1, "days");
    }

    let maturityDate = issueDate.add(maturityInDays, "days");

    while (
      maturityDate.isBankingHoliday() ||
      /0|6/.test(issueDate.day().toString())
    ) {
      maturityDate = maturityDate.add(1, "days");
    }

    if (maturityDate.isAfter(latestMaturityForBills)) {
      continue;
    }

    const auctionDate = getDate(adjustedAuctionDate);
    const id = `${securityTerm}~${auctionDate}`;

    const actionDates = {
      maturityDate: getDate(maturityDate),
      id,
      issueDate: getDate(issueDate),
      auctionDate,
      securityTerm,
      maturityInDays,
    };

    futureBillCollection.push(actionDates);
  }

  return futureBillCollection;
};

export const buildBillLadders = (
  finalMautityDate: Dayjs,
  firstAuctionDate = dayjs(),
  realBills: TreasurySecurityType[]
): RealORPossibleBillsType[][] => {
  const today = firstAuctionDate;
  const stackOfBillLadders = [] as RealORPossibleBillsType[][];
  const possibleBills = createUnpublishedBills(
    finalMautityDate,
    firstAuctionDate
  );
  const merged: RealORPossibleBillsType[] = mergeBills(
    possibleBills,
    realBills
  );
  const sortedByDuration = sortByDuration(merged);

  const findViableBills = (
    prevBill: RealORPossibleBillsType
  ): RealORPossibleBillsType[] => {
    // Based on this maturity date, find all bills that could be purchased;
    const bills: RealORPossibleBillsType[] = [];
    const possibleBills = createUnpublishedBills(
      finalMautityDate,
      dayjs(prevBill.maturityDate)
    );
    const merged = mergeBills(possibleBills, realBills);
    const sortedByDuration = sortByDuration(merged);
    for (let d = 0; d < sortedByDuration.length; d++) {
      const bill = sortedByDuration[d];
      const billAuctionDate = dayjs(bill.auctionDate);
      const billMaturityDate = dayjs(bill.maturityDate);
      const diff = billAuctionDate.diff(dayjs(prevBill.maturityDate), "days");
      const isViable =
        diff >= 0 && diff <= 14 && billMaturityDate <= finalMautityDate;
      if (isViable) {
        // Found a bill, now find other bills to chain after maturity
        const futureBills = findViableBills(bill);
        bills.push(bill);
        bills.push(...futureBills);
        return bills;
      }
    }
    return bills;
  };

  for (let d = 0; d < sortedByDuration.length; d++) {
    const bill = sortedByDuration[d];
    const billAuctionDate = dayjs(bill.auctionDate);
    const billMaturityDate = dayjs(bill.maturityDate);
    const diff = billAuctionDate.diff(today, "days");
    const isViable =
      diff <= 14 && diff >= 0 && billMaturityDate <= finalMautityDate;
    if (isViable) {
      bill.invalid = isInvalidBill(bill);
      const durationCombinations = findViableBills(bill);
      const viable = [bill, ...durationCombinations];
      stackOfBillLadders.push(viable);
    }
  }
  return stackOfBillLadders;
};
