import dayjs, {Dayjs} from "dayjs";
import dayjsBankingDays from "dayjs-banking-days";

dayjs.extend(dayjsBankingDays);

import {
  billMaturityIssueAuctionCalculations,
  RealBillsCollectionType,
  TreasurySecurityType,
  PossibleBillsCollectionType,
} from "../types";

const createUnpublishedBills = (
  latestMaturityForBills: Dayjs,
  earliestAuctionDate = dayjs()
) => {
  const futureBillCollection: PossibleBillsCollectionType = {};
  const maturities = Object.entries(billMaturityIssueAuctionCalculations);

  for (const [
    term,
    {maturityInDays, daysToIssue, auctionDayOfWeek},
  ] of maturities) {
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
    const actionDates = {
      maturityDate: getDate(maturityDate),
      issueDate: getDate(issueDate),
      auctionDate,
      securityTerm: term,
      maturityInDays,
    };

    const hash = `${term}~${auctionDate}`;
    futureBillCollection[hash] = actionDates;
  }

  return futureBillCollection;
};

export const humanReadableDate = (input: string): string => {
  const updatedDate = dayjs(input);
  return updatedDate.format("ddd MMM D, YYYY");
};

const sortBillsByDateFunc = (
  billA: RealBillsCollectionType,
  billB: RealBillsCollectionType
) => {
  const first = dayjs(Object.values(billA)[0].auctionDate);
  const second = dayjs(Object.values(billB)[0].auctionDate);
  return first.isBefore(second) ? -1 : 1;
};

export const sortBillsByDate = (billArray: RealBillsCollectionType[]) => {
  return billArray.sort(sortBillsByDateFunc);
};

export const sortLaddersByStartDateThenDuration = (
  ladderList: RealBillsCollectionType[][]
) => {
  const laddersSortedByStartDate = ladderList.map((ladder) => {
    return sortBillsByDate(ladder);
  });
  return laddersSortedByStartDate.sort(
    (
      ladderA: RealBillsCollectionType[],
      ladderB: RealBillsCollectionType[]
    ) => {
      const auctionA = dayjs(Object.values(ladderA[0])[0].auctionDate);
      const auctionB = dayjs(Object.values(ladderB[0])[0].auctionDate);
      return auctionA.isBefore(auctionB) ? -1 : 1;
    }
  );
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
  firstAuctionDate = dayjs(),
  realBills: RealBillsCollectionType
): RealBillsCollectionType[][] => {
  const today = firstAuctionDate;
  const stackOfBillLadders = [];
  const possibleBills = createUnpublishedBills(
    finalMautityDate,
    firstAuctionDate
  );
  const merged = {...possibleBills, ...realBills} as RealBillsCollectionType;
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
    const merged = {...possibleBills, ...realBills} as RealBillsCollectionType;
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
        const auctionWindow = dayjs().add(7, "days");
        const unavailable = !bill.cusip
          ? billAuctionDate.isBefore(auctionWindow)
          : false;
        // Found a bill, now find other bills to chain after maturity
        bill.unavailable = unavailable;
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
      const auctionWindow = dayjs().add(7, "days");
      const unavailable = !bill.cusip
        ? billAuctionDate.isBefore(auctionWindow)
        : false;
      bill.unavailable = unavailable;
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

const billReducer = (
  acc: RealBillsCollectionType,
  asset: TreasurySecurityType
) => {
  const isOld = dayjs(asset.auctionDate).isBefore(dayjs().subtract(14, "days"));
  if (!isOld && /CMB|Bill/i.test(asset.securityType)) {
    const {
      cusip,
      issueDate: originalIssueDate,
      securityType,
      securityTerm: securityTermUpper,
      announcementDate: originalAnnouncementDate,
      auctionDate: originalAuctionDate,
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

    let announcementDate = dayjs(originalAnnouncementDate);
    let issueDate = dayjs(originalIssueDate);
    let auctionDate = dayjs(originalAuctionDate);

    const maturityInDays = parseInt(securityTermDayMonth.split("-")[0]);
    const daysToAuction = issueDate.diff(auctionDate, "days");
    const daysToAnnounce = auctionDate.diff(announcementDate, "days");

    // if (issueDate.isBefore(dayjs())) {
    //   issueDate = issueDate.set("year", 2025);
    //   auctionDate = issueDate.subtract(Math.abs(daysToAuction), "days");
    //   announcementDate = auctionDate.subtract(
    //     Math.abs(daysToAnnounce),
    //     "days"
    //   );
    // }

    const maturityDate = issueDate.add(maturityInDays, "days");

    const securityTerm = securityTermUpper.toLocaleLowerCase();
    const key = `${securityTerm}~${getDate(auctionDate)}`;

    acc[key] = {
      cusip,
      issueDate: getDate(issueDate),
      maturityDate: getDate(maturityDate),
      announcementDate: getDate(announcementDate),
      auctionDate: getDate(auctionDate),
      securityType,
      maturityInDays,
      securityTerm: securityTerm.toLowerCase(),
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
};

const TREASURY_BASE_URL = "https://www.treasurydirect.gov/TA_WS/";
const SECURITIES_PATH = "securities/";
const TREASURY_PARAMS = "?format=json";
const TreasuryURLS = [
  `${TREASURY_BASE_URL}${SECURITIES_PATH}CMB${TREASURY_PARAMS}`,
  `${TREASURY_BASE_URL}${SECURITIES_PATH}Bill${TREASURY_PARAMS}`,
  `${TREASURY_BASE_URL}${SECURITIES_PATH}upcoming${TREASURY_PARAMS}`,
];

export const getTreasuries = async () => {
  return await Promise.allSettled(TreasuryURLS.map((url) => fetch(url)))
    .then(async (promiseList) => {
      const data: {success: TreasurySecurityType[][]; error: any[]} = {
        success: [],
        error: [],
      };
      for (let p = 0; p < promiseList.length; p++) {
        const {value, status, reason} = promiseList[p];
        if (status === "fulfilled" && value.ok)
          data.success.push(await value.json());
        else {
          console.log(value ? value.statusText : "nothing");
          data.error.push({
            reason,
            url: value?.url,
            statusText: value?.statusText,
          });
        }
      }
      return await data;
    })
    .then(({error, success}) => {
      if (error.length) {
        const words = error.length === 1 ? "error occured" : "errors occured";
        console.error(`${error.length} ${words}`);
      }
      return (success as TreasurySecurityType[][])
        .map((list) => {
          return list.reduce(billReducer, {} as RealBillsCollectionType);
        })
        .reduce((acc, list) => ({...acc, ...list}), {});
    })
    .catch((err) => {
      return err;
    });
};
