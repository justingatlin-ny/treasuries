import {type MouseEvent} from "react";
// import {Grid2Props} from "@mui/material";
import {Dayjs} from "dayjs";
import {Grid2Props} from "@mui/material";

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
  averageMedianDiscountRate: string;
  closingTimeNoncompetitive: string;
  highDiscountRate: string;
  highInvestmentRate: string;
  highPrice: string;
  noncompetitiveTendersAccepted: string;
  pricePer100: string;
  securityTermDayMonth: string;
  securityTermWeekYear: string;
  type: string;
  invalid?: boolean;
  classList: string;
  id: string;
  updatedTimestamp: string;
};

export const POSSIBLE_BILL_CALCULATIONS = [
  {
    securityTerm: "4-week",
    maturityInDays: 28,
    daysToIssue: 5,
    auctionDayOfWeek: 4,
  },
  {
    securityTerm: "42-day",
    maturityInDays: 42,
    daysToIssue: 2,
    auctionDayOfWeek: 2,
  },
  {
    securityTerm: "8-week",
    maturityInDays: 56,
    daysToIssue: 5,
    auctionDayOfWeek: 4,
  },
  {
    securityTerm: "13-week",
    maturityInDays: 91,
    daysToIssue: 2,
    auctionDayOfWeek: 1,
  },
  {
    securityTerm: "17-week",
    maturityInDays: 119,
    daysToIssue: 6,
    auctionDayOfWeek: 3,
  },
] as const;

const MOCK_TREASURY_ASSET = {
  cusip: "912797ML8",
  issueDate: "2025-01-16T00:00:00",
  securityType: "Bill",
  securityTerm: "42-Day",
  maturityDate: "",
  interestRate: "",
  refCpiOnIssueDate: "",
  refCpiOnDatedDate: "",
  announcementDate: "2025-01-09T00:00:00",
  auctionDate: "2025-01-14T00:00:00",
  auctionDateYear: "2025",
  datedDate: "",
  accruedInterestPer1000: "",
  accruedInterestPer100: "",
  adjustedAccruedInterestPer1000: "",
  adjustedPrice: "",
  allocationPercentage: "",
  allocationPercentageDecimals: "",
  announcedCusip: "",
  auctionFormat: "",
  averageMedianDiscountRate: "",
  averageMedianInvestmentRate: "",
  averageMedianPrice: "",
  averageMedianDiscountMargin: "",
  averageMedianYield: "",
  backDated: "",
  backDatedDate: "",
  bidToCoverRatio: "",
  callDate: "",
  callable: "",
  calledDate: "",
  cashManagementBillCMB: "Yes",
  closingTimeCompetitive: "",
  closingTimeNoncompetitive: "",
  competitiveAccepted: "",
  competitiveBidDecimals: "",
  competitiveTendered: "",
  competitiveTendersAccepted: "",
  corpusCusip: "",
  cpiBaseReferencePeriod: "",
  currentlyOutstanding: "",
  directBidderAccepted: "",
  directBidderTendered: "",
  estimatedAmountOfPubliclyHeldMaturingSecuritiesByType: "",
  fimaIncluded: "",
  fimaNoncompetitiveAccepted: "",
  fimaNoncompetitiveTendered: "",
  firstInterestPeriod: "",
  firstInterestPaymentDate: "",
  floatingRate: "No",
  frnIndexDeterminationDate: "",
  frnIndexDeterminationRate: "",
  highDiscountRate: "",
  highInvestmentRate: "",
  highPrice: "",
  highDiscountMargin: "",
  highYield: "",
  indexRatioOnIssueDate: "",
  indirectBidderAccepted: "",
  indirectBidderTendered: "",
  interestPaymentFrequency: "",
  lowDiscountRate: "",
  lowInvestmentRate: "",
  lowPrice: "",
  lowDiscountMargin: "",
  lowYield: "",
  maturingDate: "",
  maximumCompetitiveAward: "",
  maximumNoncompetitiveAward: "",
  maximumSingleBid: "",
  minimumBidAmount: "",
  minimumStripAmount: "",
  minimumToIssue: "",
  multiplesToBid: "",
  multiplesToIssue: "",
  nlpExclusionAmount: "",
  nlpReportingThreshold: "",
  noncompetitiveAccepted: "",
  noncompetitiveTendersAccepted: "",
  offeringAmount: "",
  originalCusip: "",
  originalDatedDate: "",
  originalIssueDate: "",
  originalSecurityTerm: "26-Week",
  pdfFilenameAnnouncement: "",
  pdfFilenameCompetitiveResults: "",
  pdfFilenameNoncompetitiveResults: "",
  pdfFilenameSpecialAnnouncement: "",
  pricePer100: "",
  primaryDealerAccepted: "",
  primaryDealerTendered: "",
  reopening: "Yes",
  securityTermDayMonth: "42-Day",
  securityTermWeekYear: "0-Week",
  series: "",
  somaAccepted: "",
  somaHoldings: "",
  somaIncluded: "",
  somaTendered: "",
  spread: "",
  standardInterestPaymentPer1000: "",
  strippable: "",
  term: "",
  tiinConversionFactorPer1000: "",
  tips: "No",
  totalAccepted: "",
  totalTendered: "",
  treasuryRetailAccepted: "",
  treasuryRetailTendersAccepted: "",
  type: "CMB",
  unadjustedAccruedInterestPer1000: "",
  unadjustedPrice: "",
  updatedTimestamp: "2025-01-03T10:32:34",
  xmlFilenameAnnouncement: "",
  xmlFilenameCompetitiveResults: "",
  xmlFilenameSpecialAnnouncement: "",
  tintCusip1: "",
  tintCusip2: "",
  tintCusip1DueDate: "",
  tintCusip2DueDate: "",
};

export type NativeTreasuryAssetType = typeof MOCK_TREASURY_ASSET;

export type RealORPossibleBillsType = TreasurySecurityType | PossibleBillType;
export type ImportantBondDatesType = Record<string, BillActionDatesType>;
export type GetAssetDatesType = (selectedDate: Dayjs) => ImportantBondDatesType;

export type SavedLadderPayload = {
  id: string;
  notes: string;
  monthNeeded: string;
  selectedBills: RealORPossibleBillsType[];
  invalid?: boolean;
  firstDate: string;
  finalMaturity: string;
};

// export type SavedBillActionType = Record<DateType, string>;
export type BillActionDatesType = Record<DateType, Dayjs> & {cusip?: string};
export type BillActionDisplayType = Record<DateSelectionType, boolean>;

export type PossibleBillType = {
  maturityDate: string;
  id: string;
  issueDate: string;
  auctionDate: string;
  securityTerm: string;
  maturityInDays: number;
  invalid?: boolean;
};

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
export interface IHandleCloseProps {
  (payload?: SavedLadderPayload): void;
}

export type TreasuryErrorType = {
  url?: string;
  statusText?: string;
  reason: string;
  timestamp: string;
};

export interface ILocalStorageData {
  key: string;
  oldValue: string;
  newValue: string;
}
