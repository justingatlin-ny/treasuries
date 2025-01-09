import dayjs from "dayjs";
import {
  determineStatus,
  getDate,
  getImportantDates,
  getTreasuries,
  humanReadableDate,
  sortBillsByDate,
  sortLaddersByStartDateThenDuration,
} from "./";
import {
  mockPastBILL,
  mockPastCMB,
  mockMerged,
  mockMerged2,
  mockUpcoming,
} from "./mocks/mockTreasuries";
import {mockSavedLadders, selectedBills} from "./mocks/mockSavedLadders";
import {RealBillsCollectionType} from "../types";

describe("getTreasuries()", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("should return successful treasuries", async () => {
    jest.useFakeTimers().setSystemTime(new Date("2025-01-08T22:00:00.000Z"));
    jest
      .spyOn(global, "fetch")
      .mockImplementationOnce(
        jest.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(mockPastCMB),
        })
      )
      .mockImplementationOnce(
        jest.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(mockPastBILL),
        })
      )
      .mockImplementationOnce(
        jest.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(mockUpcoming),
        })
      ) as jest.Mock;
    const {error, success} = await getTreasuries();
    expect(error).toHaveLength(0);
    expect(success).toEqual(mockMerged);
  });

  it("should return 2 failures", async () => {
    jest.useFakeTimers().setSystemTime(new Date("2025-01-08T22:00:00.000Z"));
    jest
      .spyOn(global, "fetch")
      .mockImplementationOnce(jest.fn().mockRejectedValue("promise rejected"))
      .mockImplementationOnce(
        jest.fn().mockResolvedValue({
          ok: false,
          statusText: "mock failure 2",
          url: "mock url 2",
        })
      )
      .mockImplementationOnce(
        jest.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(mockUpcoming),
        })
      ) as jest.Mock;
    const {error, success} = await getTreasuries();
    expect(error).toHaveLength(2);

    expect(error[0].reason).toEqual("promise rejected");
    expect(error[0].url).toBeUndefined();
    expect(new Date(error[0].timestamp).getTime()).not.toBeNaN();

    expect(error[1].reason).toEqual("mock failure 2");
    expect(error[1].url).toEqual("mock url 2");
    expect(new Date(error[1].timestamp).getTime()).not.toBeNaN();

    expect(success).toEqual(mockMerged2);
  });
});

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
    const importantDates = getImportantDates(mockSavedLadders[1].selectedBills);
    const keys = Object.keys(importantDates);
    expect(keys).toHaveLength(3);
    expect(keys).toEqual(
      expect.arrayContaining(["firstDate", "finalMaturity", "monthNeeded"])
    );

    const values = Object.values(importantDates);
    expect(values).toHaveLength(3);
    expect(values.every((date) => date.isValid())).toBeTruthy();

    expect(importantDates.firstDate.format("YYYY-MM-DD")).toEqual("2025-01-09");
    expect(importantDates.finalMaturity.format("YYYY-MM-DD")).toEqual(
      "2025-08-28"
    );
    expect(importantDates.monthNeeded.format("MMMM YYYY")).toEqual(
      "September 2025"
    );
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

  it("should sort bils by auction date", () => {
    jest.useFakeTimers().setSystemTime(new Date("2025-01-08T22:00:00.000Z"));
    const sorted = sortBillsByDate(
      selectedBills as unknown as RealBillsCollectionType[]
    );

    expect(sorted).toEqual([
      {
        "8-week~2025-01-09": {
          cusip: "912797NQ6",
          issueDate: "2025-01-14",
          maturityDate: "2025-03-11",
          announcementDate: "2025-01-07",
          auctionDate: "2025-01-09",
          securityType: "Bill",
          id: "8-week~2025-01-09",
          maturityInDays: 56,
          securityTerm: "8-week",
          closingTimeNoncompetitive: "11:00 AM",
          noncompetitiveTendersAccepted: "Yes",
          securityTermDayMonth: "56-Day",
          securityTermWeekYear: "8-Week",
          type: "Bill",
          classList: "is-close",
          invalid: false,
        },
      },
      {
        "17-week~2025-03-12": {
          maturityDate: "2025-07-15",
          id: "17-week~2025-03-12",
          issueDate: "2025-03-18",
          auctionDate: "2025-03-12",
          securityTerm: "17-week",
          maturityInDays: 119,
        },
      },
      {
        "42-day~2025-07-15": {
          maturityDate: "2025-08-28",
          id: "42-day~2025-07-15",
          issueDate: "2025-07-17",
          auctionDate: "2025-07-15",
          securityTerm: "42-day",
          maturityInDays: 42,
        },
      },
    ]);
  });

  it("should sort by start date then duration", () => {
    // const arr =
    // const sorted = sortLaddersByStartDateThenDuration(mockMerged)
    // expect(sorted).toBeTruthy();
  });
});
