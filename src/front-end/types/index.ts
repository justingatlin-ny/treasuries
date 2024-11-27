import { type ChangeEvent } from "react";
import { Grid2Props } from "@mui/material";
import { Dayjs } from "dayjs";

export type DateType = "maturity" | "auction" | "issue";
export type DateSelectionType = "maturity" | "auction";

export type IAddBond = (assetInfo: { dateType: DateSelectionType, date: Dayjs }) => void;

export const billMaturityIssueAuctionCalculations = {
  "4-week": {
    maturity: 28,
    issue: 5,
    auctionDay: 4,
  },
  "42-day": {
    maturity: 42,
    issue: 2,
    auctionDay: 2,
  },
  "8-week": {
    maturity: 56,
    issue: 5,
    auctionDay: 4,
  },
  "13-week": {
    maturity: 91,
    issue: 2,
    auctionDay: 1,
  },
  "17-week": {
    maturity: 119,
    issue: 6,
    auctionDay: 3,
  },
} as const;

const exampleBillLadder = [
  [
    {
      "8-week": {
        "maturity": "2025-02-25T15:18:51.843Z",
        "issue": "2024-12-31T15:18:51.843Z",
        "auction": "2024-12-26T15:18:51.843Z"
      }
    }
  ],
  [
    {
      "42-day": {
        "maturity": "2025-02-27T15:18:51.843Z",
        "issue": "2025-01-16T15:18:51.843Z",
        "auction": "2025-01-14T15:18:51.843Z"
      }
    },
    {
      "4-week": {
        "maturity": "2025-01-14T15:18:51.843Z",
        "issue": "2024-12-17T15:18:51.843Z",
        "auction": "2024-12-12T15:18:51.843Z"
      }
    }
  ],
  [
    {
      "4-week": {
        "maturity": "2025-02-25T15:18:51.843Z",
        "issue": "2025-01-28T15:18:51.843Z",
        "auction": "2025-01-23T15:18:51.843Z"
      }
    },
    {
      "4-week": {
        "maturity": "2025-01-21T15:18:51.843Z",
        "issue": "2024-12-24T15:18:51.843Z",
        "auction": "2024-12-19T15:18:51.843Z"
      }
    }
  ]
]

export type BondDataType = typeof billMaturityIssueAuctionCalculations;
export type AssetDurationTypes = keyof typeof billMaturityIssueAuctionCalculations;
export type BillType = Record<AssetDurationTypes, BillActionDatesType>;
export interface AssetDurationProps {
  selectedDate: Dayjs;
  dateType: DateType;
  addBond: IAddBond;
}

export type BondInfoType = {
  maturity: number;
  issue: number;
  auctionDay: number;
}

export type BillActionDatesType = Record<DateType, Dayjs>;
export type BillActionDisplayType = Record<DateSelectionType, boolean>;

export interface BondDisplayContainerProps extends Grid2Props {
  displaysettings: BillActionDisplayType;
}

export interface StyledBondProps extends Grid2Props {
  ispast: boolean;
}

export interface BondControlProps {
  date: Dayjs;
  type: DateType;
  displaySettings: BillActionDisplayType;
  handleChange: (eventData: ChangeEvent<HTMLInputElement> | Dayjs) => void;
}

export interface SelectedBondType extends BillActionDatesType {
  duration: AssetDurationTypes;
  id: number;
}