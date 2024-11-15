import { type ChangeEvent } from "react";
import { Grid2Props } from "@mui/material";
import { Dayjs } from "dayjs";

export type DateType = "maturity" | "auction" | "issue" | "announce";

export interface AssetDurationProps {
  selectedDate: Dayjs;
  dateType: DateType;
}

// export type ActionDatesMapType = {
//   "4-week": number[];
//   "42-day": number[];
//   "8-week": number[];
//   "13-week": number[];
//   "17-week": number[];
// };

export type BondInfoType = {
  maturity: number;
  issue: number;
  auctionDay: number;
}

// export type AssetDurationType = Record<keyof ActionDatesMapType, BondActionDatesType>;

export type BondActionDatesType = Record<Exclude<DateType, "announce">, Dayjs>;
export type BondActionDisplayType = Record<keyof BondActionDatesType, boolean>;

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