import dayjs from "dayjs";
import {
  determineStatus,
  getDate,
  getImportantDates,
  humanReadableDate,
  sortBillsByDate,
} from "./";
import {possibleHoliday, randomBillsList} from "../mocks/mockTreasuries";
import {mockSavedLadders, mockUnsortedBills} from "../mocks/mockSavedLadders";

describe("utils", () => {
  it("should sort bills by auction date", () => {
    jest.useFakeTimers().setSystemTime(new Date("2025-01-08T22:00:00.000Z"));
    const sorted = sortBillsByDate(mockUnsortedBills);
    const expected = [
      {
        maturityDate: "2025-02-27",
        issueDate: "2025-01-16",
        auctionDate: "2025-01-14",
        securityTerm: "42-day",
        maturityInDays: 42,
        invalid: false,
        id: "42-day~2025-01-14",
        cusip: "912797ML8",
        announcementDate: "2025-01-09",
        securityType: "Bill",
        averageMedianDiscountRate: "",
        closingTimeNoncompetitive: "11:00 AM",
        highDiscountRate: "",
        highInvestmentRate: "",
        highPrice: "",
        noncompetitiveTendersAccepted: "Yes",
        pricePer100: "",
        securityTermDayMonth: "42-Day",
        securityTermWeekYear: "0-Week",
        type: "CMB",
        updatedTimestamp: "2025-01-09T11:02:02",
        classList: "",
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
        maturityDate: "2025-09-25",
        id: "42-day~2025-08-12",
        issueDate: "2025-08-14",
        auctionDate: "2025-08-12",
        securityTerm: "42-day",
        maturityInDays: 42,
      },
    ];
    expect(sorted).toEqual(expected);
  });
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
});
