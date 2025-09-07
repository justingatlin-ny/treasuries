import dayjs from "dayjs";
import { TreasurySecurityType, NativeTreasuryAssetType } from "../types";
import { getDate } from "../utils";
import getBillClasslist from "../utils/getBillClasslist";
let highRate = 0;
let highPrice = 0;

export const billReducer = (
  acc: TreasurySecurityType[],
  asset: NativeTreasuryAssetType
) => {
  const isOld = dayjs(asset.auctionDate).isBefore(dayjs().subtract(14, "days"));
  if (!isOld && /CMB|Bill/i.test(asset.securityType)) {
    const {
      cusip,
      issueDate: originalIssueDate,
      securityType,
      securityTerm: securityTermUpper,
      announcementDate: originalAnnouncementDate,
      auctionDate: originalAuctionDate,
      averageMedianDiscountRate,
      closingTimeNoncompetitive,
      highDiscountRate,
      highInvestmentRate,
      highPrice,
      noncompetitiveTendersAccepted,
      pricePer100,
      securityTermDayMonth,
      securityTermWeekYear,
      type,
      updatedTimestamp,
    } = asset;

    const announcementDate = dayjs(originalAnnouncementDate);
    const issueDate = dayjs(originalIssueDate);
    const auctionDate = getDate(dayjs(originalAuctionDate));

    const maturityInDays = parseInt(securityTermDayMonth.split("-")[0]);

    const maturityDate = issueDate.add(maturityInDays, "days");

    const securityTerm = securityTermUpper.toLocaleLowerCase();
    const id = `${securityTerm}~${auctionDate}`;

    const bill = {
      cusip,
      issueDate: getDate(issueDate),
      maturityDate: getDate(maturityDate),
      announcementDate: getDate(announcementDate),
      auctionDate: auctionDate,
      securityType,
      id,
      maturityInDays,
      securityTerm: securityTerm.toLowerCase(),
      averageMedianDiscountRate,
      closingTimeNoncompetitive,
      highDiscountRate,
      highInvestmentRate,
      highPrice,
      noncompetitiveTendersAccepted,
      pricePer100,
      securityTermDayMonth,
      securityTermWeekYear,
      type,
      updatedTimestamp,
      classList: getBillClasslist({ auctionDate, closingTimeNoncompetitive }),
    };
    const isIncluded = acc.find((included) => included.id === id);
    if (!isIncluded) {
      acc.push(bill);
    }
  }
  return acc;
};
