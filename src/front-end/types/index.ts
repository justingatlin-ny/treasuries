import { type ChangeEvent } from "react";
import { Grid2Props } from "@mui/material";
import { Dayjs } from "dayjs";

export type DateType = "maturity" | "auction" | "issue";
export type DateSelectionType = "maturity" | "auction";

export type IAddBond = (bond: SelectedBondType) => void;

export const bondData = {
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

export type BondDataType = typeof bondData;
export type AssetDurationTypes = keyof typeof bondData;

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

export type BondActionDatesType = Record<DateType, Dayjs>;
export type BondActionDisplayType = Record<DateSelectionType, boolean>;

export interface BondDisplayContainerProps extends Grid2Props {
  displaysettings: BondActionDisplayType;
}

export interface StyledBondProps extends Grid2Props {
  ispast: boolean;
}

export interface BondControlProps {
  date: Dayjs;
  type: DateType;
  displaySettings: BondActionDisplayType;
  handleChange: (eventData: ChangeEvent<HTMLInputElement> | Dayjs) => void;
}

export interface SelectedBondType extends BondActionDatesType {
  duration: AssetDurationTypes;
  id: number;
}