import dayjs, {Dayjs} from "dayjs";
import dayjsBankingDays from "dayjs-banking-days";

dayjs.extend(dayjsBankingDays);

import {
  AssetDurationTypes,
  BillActionDatesType,
  billMaturityIssueAuctionCalculations,
  DateType,
  RealBillsCollectionType,
  GetAssetDatesType,
  ImportantBondDatesType,
  TreasurySecurityType,
} from "../types";

const getIssueDates = (selectedDate: Dayjs) => {
  return Object.entries(billMaturityIssueAuctionCalculations).reduce(
    (acc, [key, {maturityInDays, daysToIssue, auctionDayOfWeek}]) => {
      let adjustedAuctionDate = selectedDate.subtract(daysToIssue, "days");
      while (adjustedAuctionDate.day() !== auctionDayOfWeek) {
        adjustedAuctionDate = adjustedAuctionDate.subtract(1, "day");
      }

      const actionDates = {
        issue: adjustedAuctionDate.add(daysToIssue, "days"),
        maturity: adjustedAuctionDate.add(daysToIssue + maturityInDays, "days"),
        auction: adjustedAuctionDate,
      } as BillActionDatesType;

      acc[key as AssetDurationTypes] = actionDates;
      return acc;
    },
    {} as Record<AssetDurationTypes, BillActionDatesType>
  );
};

const getAuctionDates: GetAssetDatesType = (selectedDate: Dayjs) => {
  return Object.entries(billMaturityIssueAuctionCalculations).reduce(
    (acc, [key, {maturityInDays, daysToIssue, auctionDayOfWeek}]) => {
      let adjustedDate = selectedDate;
      while (adjustedDate.day() !== auctionDayOfWeek) {
        adjustedDate = adjustedDate.subtract(1, "day");
      }

      const actionDates = {
        auction: adjustedDate,
        issue: adjustedDate.add(daysToIssue, "days"),
        maturity: adjustedDate.add(daysToIssue + maturityInDays, "days"),
      } as BillActionDatesType;

      acc[key as AssetDurationTypes] = actionDates;
      return acc;
    },
    {} as ImportantBondDatesType
  );
};

const createUnpublishedBills = (
  latestMaturityForBills: Dayjs,
  earliestAuctionDate = dayjs()
) => {
  // Based in the selectedDate, find all bills that could be purchased;
  const futureBillCollection = {};
  const maturities = Object.entries(billMaturityIssueAuctionCalculations);

  for (const [
    term,
    {maturityInDays, daysToIssue, auctionDayOfWeek},
  ] of maturities) {
    let adjustedAuctionDate = latestMaturityForBills.subtract(
      maturityInDays + daysToIssue,
      "days"
    );

    // if adjusted auction date is current friday and this bill's auction date is thursday,
    // subtract one day to get to thursday;
    while (adjustedAuctionDate.day() !== auctionDayOfWeek) {
      // Keep going backwards in the week until the day of the week matches
      adjustedAuctionDate = adjustedAuctionDate.subtract(1, "days");
    }

    if (adjustedAuctionDate.isBefore(earliestAuctionDate)) {
      break;
    }

    while (
      adjustedAuctionDate.isBankingHoliday() ||
      /0|6/.test(adjustedAuctionDate.day().toString())
    ) {
      adjustedAuctionDate = adjustedAuctionDate.add(1, "days");
    }
    // Auction date has been adjusted to thursday January 2025,
    // now use the data to set the action dates

    let issueDate = adjustedAuctionDate.add(daysToIssue, "days");

    while (
      issueDate.isBankingHoliday() ||
      /0|6/.test(issueDate.day().toString())
    ) {
      issueDate = issueDate.add(1, "days");
    }

    const maturityDate = adjustedAuctionDate.add(
      daysToIssue + maturityInDays,
      "days"
    );

    const actionDates = {
      maturityDate: getDate(maturityDate),
      issueDate: getDate(issueDate),
      auctionDate: getDate(adjustedAuctionDate),
      securityTerm: term,
      maturityInDays,
    };

    const hash = `${term}~${getDate(issueDate)}`;
    futureBillCollection[hash] = actionDates;
  }

  return futureBillCollection;
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
      return createUnpublishedBills(selectedDate);
    case "issue":
      return getIssueDates(selectedDate);
    case "auction":
      return getAuctionDates(selectedDate);
  }
};

export const humanReadableDate = (input: string): string => {
  const updatedDate = dayjs(input);
  return updatedDate.format("ddd MMM D, YYYY");
};

export const sortBillsByDate = (billArray: RealBillsCollectionType[]) => {
  return billArray.sort((billA, billB) => {
    const first = dayjs(Object.values(billA)[0].auctionDate);
    const second = dayjs(Object.values(billB)[0].auctionDate);
    return first.isBefore(second) ? -1 : 1;
  });
};

export const sortDurations = (bills: RealBillsCollectionType) => {
  return Object.entries(bills).sort((a, b) => {
    if (b[1].maturityInDays !== a[1].maturityInDays) {
      // If this is negative, a comes before b;
      return b[1].maturityInDays - a[1].maturityInDays;
    }
    return (
      dayjs(a[1].auctionDate).valueOf() - dayjs(b[1].auctionDate).valueOf()
    );
  });
};

export const buildBillLadder = (
  finalMautityDate: Dayjs,
  realBills: RealBillsCollectionType
): RealBillsCollectionType[][] => {
  const today: Dayjs = dayjs();
  const stackOfBillLadders = [];
  const possibleBills = createUnpublishedBills(finalMautityDate);
  const merged: RealBillsCollectionType = {...possibleBills, ...realBills};
  const sortedDurationsList: string[] = sortDurations(merged).reduce(
    (acc, [key]) => {
      acc.push(key);
      return acc;
    },
    []
  );

  const findViableBills = (
    prevBill: TreasurySecurityType
  ): RealBillsCollectionType[] => {
    // Based on this maturity date, find all bills that could be purchased;
    const bills: RealBillsCollectionType[] = [];
    const possibleBills = createUnpublishedBills(
      finalMautityDate,
      dayjs(prevBill.maturityDate)
    );
    const merged: RealBillsCollectionType = {...possibleBills, ...realBills};
    const sortedDurationsList: string[] = sortDurations(merged).reduce(
      (acc, [key]) => {
        acc.push(key);
        return acc;
      },
      []
    );
    for (let d = 0; d < sortedDurationsList.length; d++) {
      const currentDuration = sortedDurationsList[d];
      const bill = merged[currentDuration];
      const billAuctionDate = dayjs(bill.auctionDate);
      const billMaturityDate = dayjs(bill.maturityDate);
      const diff = billAuctionDate.diff(dayjs(prevBill.maturityDate), "days");
      const isViable =
        diff >= 0 && diff <= 14 && billMaturityDate <= finalMautityDate;
      if (isViable) {
        // Found a bill, now find other bills to chain after maturity
        const futureBills = findViableBills(bill);
        bills.push({[currentDuration]: bill} as RealBillsCollectionType);
        bills.push(...futureBills);
        return bills;
      }
    }
    return bills;
  };

  for (let d = 0; d < sortedDurationsList.length; d++) {
    const bill = merged[sortedDurationsList[d]];
    if (!bill) {
      continue;
    }
    const billAuctionDate = dayjs(bill.auctionDate);
    const billMaturityDate = dayjs(bill.maturityDate);
    const diff = billAuctionDate.diff(today, "days");
    const isViable =
      diff <= 14 && diff >= 0 && billMaturityDate <= finalMautityDate;
    if (isViable) {
      const durationCombinations = findViableBills(bill);
      const viable = [
        {[sortedDurationsList[d]]: bill},
        ...durationCombinations,
      ];
      stackOfBillLadders.push(viable);
    }
  }
  return stackOfBillLadders;
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

export const collectDateStatuses = (datesAndTypes: RealBillsCollectionType) => {
  return Object.entries(datesAndTypes)
    .reduce((acc, [dateType, date]) => {
      const dateResult = Object.entries(determineStatus(date))
        .reduce((acc2, [key, status]) => {
          if (status) {
            acc2.push(`${dateType.toLowerCase()}${key}`);
          }
          return acc2;
        }, [])
        .join(" ")
        .trim();

      if (dateResult) {
        acc.push(dateResult);
      }
      return acc;
    }, [])
    .join(" ");
};

export const getImportantDates = (selectedBills: RealBillsCollectionType[]) => {
  let firstDate: Dayjs;
  const finalMaturity = selectedBills.reduce((acc, bill) => {
    const {maturityDate, auctionDate} = Object.values(bill)[0];
    if (!firstDate) {
      firstDate = dayjs(auctionDate);
    }
    const maturity = dayjs(maturityDate);
    if (acc < maturity) acc = maturity;
    return acc;
  }, dayjs());

  const monthNeeded = finalMaturity.add(1, "month").format("MMMM");
  return {firstDate, monthNeeded, finalMaturity};
};

export const getDate = (incoming: Dayjs) => {
  return incoming.format("YYYY-MM-DD");
};

export const getUpcomingBills = () => {
  return fetch(
    "https://www.treasurydirect.gov/TA_WS/securities/upcoming?format=json"
  )
    .then((res) => res.json())
    .then((data) => {
      return (data as TreasurySecurityType[]).reduce((acc, asset) => {
        if (/CMB|Bill/i.test(asset.securityType)) {
          const {
            cusip,
            issueDate: originalIssueDate,
            securityType,
            securityTerm: securityTermUpper,
            announcementDate: originalAnnouncementDate,
            auctionDate: originalAuctionDate,
            maturityDate: originalMaturityDate,
            averageMedianDiscountRate,
            closingTimeNoncompetitive,
            highDiscountRate,
            highInvestmentRate,
            highPrice,
            noncompetitiveTendersAccepted,
            pricePer100,
            securityTermDayMonth,
            securityTermWeekYear,
            type,
            updatedTimestamp,
          } = asset;

          const announcementDate = dayjs(originalAnnouncementDate);
          const issueDate = dayjs(originalIssueDate);
          const auctionDate = dayjs(originalAuctionDate);
          const maturityInDays = parseInt(securityTermDayMonth.split("-")[0]);
          const daysToAuction = issueDate.diff(auctionDate, "days");
          const daysToAnnounce = auctionDate.diff(announcementDate, "days");
          let maturityDate = issueDate.add(maturityInDays, "days");

          if (originalMaturityDate) {
            maturityDate = dayjs(originalMaturityDate);
          }

          const securityTerm = securityTermUpper.toLocaleLowerCase();
          const key = `${securityTerm}~${getDate(issueDate)}`;

          acc[key] = {
            cusip,
            issueDate: getDate(issueDate),
            maturityDate: getDate(maturityDate),
            announcementDate: getDate(announcementDate),
            auctionDate: getDate(auctionDate),
            securityType,
            maturityInDays,
            securityTerm: securityTerm.toLowerCase(),
            auctionDateYear: 2025,
            averageMedianDiscountRate,
            closingTimeNoncompetitive,
            highDiscountRate,
            highInvestmentRate,
            highPrice,
            noncompetitiveTendersAccepted,
            pricePer100,
            securityTermDayMonth,
            securityTermWeekYear,
            type,
            updatedTimestamp,
          };
        }

        return acc;
      }, {} as RealBillsCollectionType);
    })
    .then((data) => {
      return data;
    })
    .catch((err) => err);
};
