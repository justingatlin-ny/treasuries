import {type MouseEvent} from "react";
import {Grid2Props} from "@mui/material";
import {Dayjs} from "dayjs";

export type DateType = "maturity" | "auction" | "issue";
export type DateSelectionType = "maturity" | "auction";

export type TreasurySecurityType = {
  cusip: string;
  issueDate: string;
  securityType: string;
  securityTerm: string;
  maturityDate: string;
  announcementDate: string;
  maturityInDays: number;
  auctionDate: string;
  averageMedianDiscountRate: number;
  closingTimeNoncompetitive: string;
  highDiscountRate: number;
  highInvestmentRate: number;
  highPrice: number;
  noncompetitiveTendersAccepted: string;
  pricePer100: number;
  securityTermDayMonth: string;
  securityTermWeekYear: string;
  type: string;
  invalid?: boolean;
  classList: string;
  id: string;
  updatedTimestamp: Date;
};

export const billMaturityIssueAuctionCalculations = {
  "4-week": {
    maturityInDays: 28,
    daysToIssue: 5,
    auctionDayOfWeek: 4,
  },
  "42-day": {
    maturityInDays: 42,
    daysToIssue: 2,
    auctionDayOfWeek: 2,
  },
  "8-week": {
    maturityInDays: 56,
    daysToIssue: 5,
    auctionDayOfWeek: 4,
  },
  "13-week": {
    maturityInDays: 91,
    daysToIssue: 2,
    auctionDayOfWeek: 1,
  },
  "17-week": {
    maturityInDays: 119,
    daysToIssue: 6,
    auctionDayOfWeek: 3,
  },
} as const;

export type ImportantBondDatesType = Record<string, BillActionDatesType>;
export type GetAssetDatesType = (selectedDate: Dayjs) => ImportantBondDatesType;

export type SavedLadderPayload = {
  id: DOMHighResTimeStamp;
  notes: string;
  monthNeeded: string;
  selectedBills: RealBillsCollectionType[];
  invalid?: boolean;
  firstDate: Dayjs;
  finalMaturity: Dayjs;
};
export type AssetDurationTypes =
  keyof typeof billMaturityIssueAuctionCalculations;
export type BillType = Record<AssetDurationTypes, BillActionDatesType>;

export type SavedBillActionType = Record<DateType, string>;
export type BillActionDatesType = Record<DateType, Dayjs> & {cusip?: string};
export type BillActionDisplayType = Record<DateSelectionType, boolean>;

export type PossibleBill = {
  maturityDate: string;
  issueDate: string;
  auctionDate: string;
  securityTerm: string;
  maturityInDays: number;
};

export type PossibleBillsCollectionType = Record<string, PossibleBill>;
export interface BondDisplayContainerProps extends Grid2Props {
  displaysettings: BillActionDisplayType;
}

export interface BondControlProps {
  maturityDate: Dayjs;
  auctionDate: Dayjs;
  handleChange: (
    eventData: MouseEvent<HTMLElement> | Dayjs,
    newValue?: string | Dayjs
  ) => void;
}

export type RealBillsCollectionType = Record<string, TreasurySecurityType>;
