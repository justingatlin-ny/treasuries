import {SavedLadderPayload} from "../../types";

export const mockSavedLadders: SavedLadderPayload[] = [
  {
    notes:
      "4-week Treasury Direct bill purchased matures on 1/14/2025. 4.24% yield.",
    selectedBills: [
      {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        "42-day~2025-01-14": {
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
          // averageMedianDiscountRate: "",
          closingTimeNoncompetitive: "",
          // highDiscountRate: "",
          // highInvestmentRate: "",
          // highPrice: "",
          noncompetitiveTendersAccepted: "",
          // pricePer100: "",
          securityTermDayMonth: "42-Day",
          securityTermWeekYear: "0-Week",
          type: "CMB",
          // updatedTimestamp: "2025-01-03T10:32:34",
          classList: "",
        },
      },
    ],
    id: "650ee01c-5f7d-4037-807d-263a28f3246f",
    // firstDate: "2025-01-14T05:00:00.000Z",
    // finalMaturity: "2025-02-27T05:00:00.000Z",
    monthNeeded: "March 2025",
    invalid: false,
  },
  {
    notes: "Mock notes",
    selectedBills: [
      {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
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
          // averageMedianDiscountRate: "",
          closingTimeNoncompetitive: "11:00 AM",
          // highDiscountRate: "",
          // highInvestmentRate: "",
          // highPrice: "",
          noncompetitiveTendersAccepted: "Yes",
          // pricePer100: "",
          securityTermDayMonth: "56-Day",
          securityTermWeekYear: "8-Week",
          type: "Bill",
          // updatedTimestamp: "2025-01-07T11:02:10",
          classList: "is-close",
          invalid: false,
        },
      },
      {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        "42-day~2025-07-15": {
          maturityDate: "2025-08-28",
          id: "42-day~2025-07-15",
          issueDate: "2025-07-17",
          auctionDate: "2025-07-15",
          securityTerm: "42-day",
          maturityInDays: 42,
        },
      },
    ],
    id: "49e2339b-795e-4edd-a5fa-a8a931320b5f",
    // firstDate: "2025-01-09T05:00:00.000Z",
    // finalMaturity: "2025-08-28T04:00:00.000Z",
    monthNeeded: "September 2025",
  },
];

export const selectedBills = [
  {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
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
      // averageMedianDiscountRate: "",
      closingTimeNoncompetitive: "11:00 AM",
      // highDiscountRate: "",
      // highInvestmentRate: "",
      // highPrice: "",
      noncompetitiveTendersAccepted: "Yes",
      // pricePer100: "",
      securityTermDayMonth: "56-Day",
      securityTermWeekYear: "8-Week",
      type: "Bill",
      // updatedTimestamp: "2025-01-07T11:02:10",
      classList: "is-close",
      invalid: false,
    },
  },
  {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    "42-day~2025-07-15": {
      maturityDate: "2025-08-28",
      id: "42-day~2025-07-15",
      issueDate: "2025-07-17",
      auctionDate: "2025-07-15",
      securityTerm: "42-day",
      maturityInDays: 42,
    },
  },
  {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    "17-week~2025-03-12": {
      maturityDate: "2025-07-15",
      id: "17-week~2025-03-12",
      issueDate: "2025-03-18",
      auctionDate: "2025-03-12",
      securityTerm: "17-week",
      maturityInDays: 119,
    },
  },
];
