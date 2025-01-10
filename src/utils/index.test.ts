import dayjs from "dayjs";
import {
  buildBillLadders,
  determineStatus,
  getDate,
  getImportantDates,
  humanReadableDate,
  sortBillsByDate,
} from "./";
import {
  mockPastBILL,
  mockPastCMB,
  mockMerged2,
  mockUpcoming,
  mockBillLadder,
} from "./mocks/mockTreasuries";
import {mockMerged, mockNativeTreasuriesMerged} from "./mocks/mockMerged";
import {
  mockSavedLadders,
  selected2,
  selectedBills,
} from "./mocks/mockSavedLadders";
import {RealORPossibleBillsType} from "../types";
import {getTreasuries} from "../back-end/getTreasuries";

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
    expect(success).toEqual(mockNativeTreasuriesMerged);
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
});
