import dayjs from "dayjs";
import {TreasurySecurityType} from "../types";

const getBillClasslist = ({
  auctionDate,
  closingTimeNoncompetitive,
}: Pick<TreasurySecurityType, "auctionDate" | "closingTimeNoncompetitive">) => {
  const auc = dayjs(auctionDate);
  const isClose = auc.isBefore(dayjs().add(2, "days")) ? "is-close" : "";
  const isToday = auc.isSame(dayjs(), "date") ? "is-today" : "";
  const classList = [];

  if (isClose) {
    classList.push(isClose);
  }
  if (isToday) {
    classList.push(isToday);
  }

  if (closingTimeNoncompetitive) {
    const [time, meridiem] = closingTimeNoncompetitive.split(/\s+/);
    const now = dayjs();

    const timeArray = time.split(":");
    let hours = parseInt(timeArray[0]);
    const minutes = parseInt(timeArray[1]);

    if (/pm/i.test(meridiem) && hours > 12) {
      hours = hours + 12;
    }

    const purchaseDeadline = dayjs(auctionDate)
      .set("hours", hours)
      .set("minutes", minutes)
      .set("seconds", 0);

    if (now.isAfter(purchaseDeadline)) {
      classList.push("auction-passed");
    }

    const brokerageDeadline = dayjs(auctionDate)
      .set("hours", 9)
      .set("minutes", 30)
      .set("seconds", 0);

    if (now.isAfter(brokerageDeadline)) {
      classList.push("passed-brokerage-deadline");
    }
  }
  return classList.length ? classList.join(" ").trim() : "";
};

export default getBillClasslist;
