import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import {
  buildBillLadders,
  determineStatus,
  getDate,
  getImportantDates,
  humanReadableDate,
  sortBillsByDate,
} from "./";
import {
  mockBillLadder,
  possibleHoliday,
  randomBillsList,
} from "../mocks/mockTreasuries";
import {mockMerged} from "../mocks/mockMerged";
import {
  mockSavedLadders,
  selected2,
  selectedBills,
} from "../mocks/mockSavedLadders";
import {RealORPossibleBillsType} from "../types";

const fail = (message: string) => {
  throw new Error(message);
};

describe("utils", () => {
  it("should return a human readable date", () => {
    const date = "2021-12-31T06:00:00.000Z";
    expect(humanReadableDate(date)).toEqual("Fri Dec 31, 2021");
  });

  it("should return the date in YYYY-MM-DD format", () => {
    const date = "2021-12-31T06:00:00.000Z";
    expect(getDate(dayjs(date))).toEqual("2021-12-31");
  });

  it("should return the important dates from the bills", () => {
    const importantDates = getImportantDates(mockSavedLadders[2].selectedBills);
    const keys = Object.keys(importantDates);
    expect(keys).toHaveLength(3);
    expect(keys).toEqual(
      expect.arrayContaining(["firstDate", "finalMaturity", "monthNeeded"])
    );

    const values = Object.values(importantDates);
    expect(values).toHaveLength(3);
    expect(values.every((date) => date.isValid())).toBeTruthy();

    expect(importantDates.firstDate.format("YYYY-MM-DD")).toEqual("2025-01-14");
    expect(importantDates.finalMaturity.format("YYYY-MM-DD")).toEqual(
      "2025-08-21"
    );
    expect(importantDates.monthNeeded.format("MMMM YYYY")).toEqual(
      "September 2025"
    );

    expect(
      getImportantDates(randomBillsList[3]).monthNeeded.format("MMMM YYYY")
    ).toEqual("May 2025");

    expect(
      getImportantDates(possibleHoliday[5]).monthNeeded.format("MMMM YYYY")
    ).toEqual("April 2025");
  });

  it("should determine the status of the auction date", () => {
    jest.useFakeTimers().setSystemTime(new Date("2025-01-08T22:00:00.000Z"));

    let auctionDate = "2025-01-10T06:00:00.000Z";
    expect(determineStatus(auctionDate)).toEqual({
      IsClose: true,
      IsPassed: false,
    });

    auctionDate = "2025-01-06T22:00:00.000Z";
    expect(determineStatus(auctionDate)).toEqual({
      IsClose: false,
      IsPassed: true,
    });

    auctionDate = "2025-01-20T22:00:00.000Z";
    expect(determineStatus(auctionDate)).toEqual({
      IsClose: false,
      IsPassed: false,
    });
  });

  it("should sort bills by auction date", () => {
    jest.useFakeTimers().setSystemTime(new Date("2025-01-08T22:00:00.000Z"));
    const sorted = sortBillsByDate([
      ...selected2,
      ...selectedBills,
    ] as RealORPossibleBillsType[]);

    expect(sorted).toEqual([
      {
        cusip: "912797KS5",
        issueDate: "2025-01-16",
        maturityDate: "2025-04-17",
        announcementDate: "2025-01-09",
        auctionDate: "2025-01-13",
        securityType: "Bill",
        id: "13-week~2025-01-13",
        maturityInDays: 91,
        securityTerm: "13-week",
        averageMedianDiscountRate: "",
        closingTimeNoncompetitive: "11:00 AM",
        highDiscountRate: "",
        highInvestmentRate: "",
        highPrice: "",
        noncompetitiveTendersAccepted: "Yes",
        pricePer100: "",
        securityTermDayMonth: "91-Day",
        securityTermWeekYear: "13-Week",
        type: "Bill",
        updatedTimestamp: "2025-01-09T11:02:08",
        classList: "",
        invalid: false,
      },
      {
        maturityDate: "2025-04-08",
        id: "8-week~2025-02-06",
        issueDate: "2025-02-11",
        auctionDate: "2025-02-06",
        securityTerm: "8-week",
        maturityInDays: 56,
        invalid: false,
      },
      {
        maturityDate: "2025-08-12",
        id: "17-week~2025-04-09",
        issueDate: "2025-04-15",
        auctionDate: "2025-04-09",
        securityTerm: "17-week",
        maturityInDays: 119,
      },
      {
        maturityDate: "2025-08-26",
        id: "17-week~2025-04-23",
        issueDate: "2025-04-29",
        auctionDate: "2025-04-23",
        securityTerm: "17-week",
        maturityInDays: 119,
      },
      {
        maturityDate: "2025-09-25",
        id: "42-day~2025-08-12",
        issueDate: "2025-08-14",
        auctionDate: "2025-08-12",
        securityTerm: "42-day",
        maturityInDays: 42,
      },
      {
        maturityDate: "2025-09-30",
        id: "4-week~2025-08-28",
        issueDate: "2025-09-02",
        auctionDate: "2025-08-28",
        securityTerm: "4-week",
        maturityInDays: 28,
      },
    ]);
  });

  it("should create possible bills", () => {
    jest.useFakeTimers().setSystemTime(new Date("2025-01-08T22:00:00.000Z"));
    const billLadder = buildBillLadders(
      dayjs("2025-03-31T22:00:00.000Z"),
      dayjs(),
      mockMerged
    );
    expect(billLadder).toHaveLength(3);
    expect(billLadder).toEqual(mockBillLadder);
  });

  it("should create bills auctioned on or after Feb 1, 2025 maturing on or before 56 days in the future", () => {
    jest.useFakeTimers().setSystemTime(new Date("2024-12-22T06:00:00.000Z"));
    const startDate = dayjs("2025-02-01T06:00:00.000Z");
    const finalMaturity = startDate.add(56, "days");
    const billLadders = buildBillLadders(finalMaturity, startDate, mockMerged);

    billLadders.forEach((ladder) => {
      ladder.forEach(({auctionDate, maturityDate}) => {
        if (dayjs(auctionDate).isBefore(startDate)) {
          fail(`auctionDate ${auctionDate} is before ${startDate}.`);
        } else if (dayjs(maturityDate).isAfter(finalMaturity)) {
          fail(`maturityDate ${maturityDate} is after ${finalMaturity} .`);
        }
      });
    });
  });

  it("should not create bills auctioned on holidays", () => {
    jest.useFakeTimers().setSystemTime(new Date("2024-12-25T06:00:00.000Z"));
    const billLadders = buildBillLadders(
      dayjs("2024-12-18T06:00:00.000Z").add(135, "days"),
      undefined,
      mockMerged
    );

    // Need to check weekends and holidays for each date;
    billLadders.forEach((ladder) => {
      ladder.forEach(({auctionDate, maturityDate, issueDate}) => {
        if (dayjs(auctionDate).isBankingHoliday()) {
          fail(`auctionDate ${auctionDate} is on a holiday.`);
        } else if (dayjs(maturityDate).isBankingHoliday()) {
          fail(`maturityDate ${maturityDate} is on a holiday.`);
        } else if (dayjs(issueDate).isBankingHoliday()) {
          fail(`issueDate ${issueDate} is on a holiday.`);
        }
      });
    });
  });
});
