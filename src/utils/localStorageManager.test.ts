import {
  mockNativeTreasuriesMerged,
  mockSavedLaddersWithUnValidatedBills,
} from "../mocks/mockMerged";
import {mockSavedLadders, twoMockSavedLadders} from "../mocks/mockSavedLadders";
import validateSavedBillsAndUpdateStorage, {
  addToStorage,
  getSavedLaddersFromStorage,
  removeFromStorage,
  SAVED_LADDERS,
  updateNotes,
} from "./localStorageManager";

describe("Local Storage Manager", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => {
    jest.resetAllMocks();
    jest.useRealTimers();
  });

  it("should remove a ladder from local storage", () => {
    Storage.prototype.setItem = jest.fn();
    Storage.prototype.getItem = jest
      .fn()
      .mockImplementation(() => JSON.stringify(mockSavedLadders));
    const id = "650ee01c-5f7d-4037-807d-263a28f3246f";
    const expected = JSON.stringify(
      mockSavedLadders.filter((ladder) => id !== ladder.id)
    );
    removeFromStorage(id);
    expect(localStorage.getItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith(SAVED_LADDERS, expected);
  });

  it("should add a ladder to local storage", () => {
    Storage.prototype.setItem = jest.fn();
    Storage.prototype.getItem = jest
      .fn()
      .mockImplementation(() => JSON.stringify(twoMockSavedLadders));

    const newLadder = {
      notes: "",
      selectedBills: [
        {
          maturityDate: "2025-03-20",
          id: "42-day~2025-02-04",
          issueDate: "2025-02-06",
          auctionDate: "2025-02-04",
          securityTerm: "42-day",
          maturityInDays: 42,
          invalid: false,
        },
        {
          maturityDate: "2025-07-29",
          id: "17-week~2025-03-26",
          issueDate: "2025-04-01",
          auctionDate: "2025-03-26",
          securityTerm: "17-week",
          maturityInDays: 119,
        },
        {
          maturityDate: "2025-09-30",
          id: "8-week~2025-07-31",
          issueDate: "2025-08-05",
          auctionDate: "2025-07-31",
          securityTerm: "8-week",
          maturityInDays: 56,
        },
      ],
      id: "cf99a33b-419e-4b60-b3f2-8d147f3c242a",
      firstDate: "2025-02-04T05:00:00.000Z",
      finalMaturity: "2025-09-30T04:00:00.000Z",
      monthNeeded: "October 2025",
    };
    addToStorage(newLadder);
    const expected = JSON.stringify([...twoMockSavedLadders, newLadder]);
    expect(localStorage.getItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith(SAVED_LADDERS, expected);
  });

  it("should update ladder note", () => {
    Storage.prototype.setItem = jest.fn();
    Storage.prototype.getItem = jest
      .fn()
      .mockImplementation(() => JSON.stringify(mockSavedLadders));
    const newNote = "mock new note";
    const id = "650ee01c-5f7d-4037-807d-263a28f3246f";
    const expected = JSON.stringify(
      mockSavedLadders.map((ladder) => {
        if (id === "650ee01c-5f7d-4037-807d-263a28f3246f") {
          ladder.notes = newNote;
        }
        return ladder;
      })
    );
    updateNotes(id, newNote);
    expect(localStorage.getItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith(SAVED_LADDERS, expected);
  });

  it("should merge projected bills with actual bills", () => {
    Storage.prototype.setItem = jest.fn();
    Storage.prototype.getItem = jest
      .fn()
      .mockImplementation(() =>
        JSON.stringify(mockSavedLaddersWithUnValidatedBills)
      );

    // jest.useFakeTimers().setSystemTime(new Date("2025-01-08T05:00:00.000Z"));
    validateSavedBillsAndUpdateStorage(mockNativeTreasuriesMerged);
    expect(localStorage.getItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    const expected = JSON.stringify([
      {
        notes:
          "4-week Treasury Direct bill purchased matures on 1/14/2025. 4.24% yield.",
        selectedBills: [
          {
            maturityDate: "2025-02-27",
            id: "42-day~2025-01-14",
            issueDate: "2025-01-16",
            auctionDate: "2025-01-14",
            securityTerm: "42-day",
            maturityInDays: 42,
            invalid: false,
            cusip: "912797ML8",
            announcementDate: "2025-01-09",
            securityType: "Bill",
            averageMedianDiscountRate: "",
            closingTimeNoncompetitive: "",
            highDiscountRate: "",
            highInvestmentRate: "",
            highPrice: "",
            noncompetitiveTendersAccepted: "",
            pricePer100: "",
            securityTermDayMonth: "42-Day",
            securityTermWeekYear: "0-Week",
            type: "CMB",
            updatedTimestamp: "2025-01-03T10:32:34",
            classList: "",
          },
        ],
        id: "650ee01c-5f7d-4037-807d-263a28f3246f",
        firstDate: "2025-01-14T05:00:00.000Z",
        finalMaturity: "2025-02-27T05:00:00.000Z",
        monthNeeded: "March 2025",
        invalid: false,
      },
      {
        notes: "",
        selectedBills: [
          {
            maturityDate: "2025-05-13",
            id: "17-week~2025-01-08",
            issueDate: "2025-01-14",
            auctionDate: "2025-01-08",
            securityTerm: "17-week",
            maturityInDays: 119,
            cusip: "912797PH4",
            announcementDate: "2025-01-07",
            securityType: "Bill",
            averageMedianDiscountRate: "4.175000",
            closingTimeNoncompetitive: "11:00 AM",
            highDiscountRate: "4.190000",
            highInvestmentRate: "4.308000",
            highPrice: "98.614972",
            noncompetitiveTendersAccepted: "Yes",
            pricePer100: "98.614972",
            securityTermDayMonth: "119-Day",
            securityTermWeekYear: "17-Week",
            type: "Bill",
            updatedTimestamp: "2025-01-08T11:34:14",
            classList:
              "is-close is-today auction-passed passed-brokerage-deadline",
            invalid: false,
          },
          {
            maturityDate: "2025-06-26",
            id: "42-day~2025-05-13",
            issueDate: "2025-05-15",
            auctionDate: "2025-05-13",
            securityTerm: "42-day",
            maturityInDays: 42,
          },
        ],
        id: "d57ed7cb-9990-4a86-adf9-4f147b0e4cba",
        firstDate: "2025-01-08T05:00:00.000Z",
        finalMaturity: "2025-06-26T04:00:00.000Z",
        monthNeeded: "June 2025",
        invalid: false,
      },
    ]);
    expect(localStorage.setItem).toHaveBeenCalledWith(SAVED_LADDERS, expected);
  });

  it("should not find any viable bills to merge", () => {
    jest.setSystemTime(new Date("2024-12-21T05:00:00.000Z"));
    Storage.prototype.setItem = jest.fn();
    Storage.prototype.getItem = jest
      .fn()
      .mockImplementation(() =>
        JSON.stringify(mockSavedLaddersWithUnValidatedBills)
      );

    validateSavedBillsAndUpdateStorage(mockNativeTreasuriesMerged);
    expect(localStorage.getItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it("should return an empty array", () => {
    expect(getSavedLaddersFromStorage()).toEqual([]);
  });
  it("should throw an error if window is not available", () => {
    jest.spyOn(window, "window", "get").mockImplementation(() => undefined);

    try {
      expect(getSavedLaddersFromStorage());
    } catch (err) {
      expect(err.message).toBe("No window object");
    }
  });
});
