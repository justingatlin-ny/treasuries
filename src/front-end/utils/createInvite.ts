import fs from "fs";
import dayjs from "dayjs";
import {SavedLadderPayload, TreasurySecurityType} from "../types";
import path from "path";
import {shell} from "electron";

const timezoneBlock = [
  "BEGIN:VTIMEZONE",
  "TZID:America/New_York",
  "LAST-MODIFIED:20050809T050000",
  "BEGIN:STANDARD",
  "DTSTART:20071104T020000",
  "TZOFFSETFROM:-0400",
  "TZOFFSETTO:-0500",
  "TZNAME:EST",
  "END:STANDARD",
  "BEGIN:DAYLIGHT",
  "DTSTART:20070311T020000",
  "TZOFFSETFROM:-0500",
  "TZOFFSETTO:-0400",
  "TZNAME:EDT",
  "END:DAYLIGHT",
  "END:VTIMEZONE",
];

const getAlarms = () => {
  return [
    ...[
      "BEGIN:VALARM",
      `TRIGGER:-PT5M`,
      "ACTION:DISPLAY",
      "DESCRIPTION:Purchase treasury",
      "END:VALARM",
    ],
    ...[
      "BEGIN:VALARM",
      `TRIGGER:-P2D`,
      "ACTION:DISPLAY",
      "DESCRIPTION:Check treasury status.",
      "END:VALARM",
    ],
  ];
};

const dynamicEvents = (ladder: SavedLadderPayload) => {
  const {id, selectedBills, notes} = ladder;
  return selectedBills.reduce((acc, bill, idx) => {
    const auctionDatesList = selectedBills.map((bill) => {
      const [, {auctionDate, maturityDate, cusip}] = Object.entries(bill)[0];
      return {auctionDate, maturityDate, cusip};
    });
    const [, data] = Object.entries(bill)[0];
    const {auctionDate, securityTerm, closingTimeNoncompetitive, cusip, type} =
      data as unknown as TreasurySecurityType;
    const numOfBills = selectedBills.length;
    const billNum = idx + 1;

    const getDescription = () => {
      let text = "";
      if (numOfBills === 1) {
        text = `Purchase ${cusip}`;
      } else {
        const auctionDatesString = auctionDatesList
          .map(
            (info, num) =>
              `#${num + 1}: ${dayjs(info.auctionDate).format("ddd MMM D, YYYY")}`
          )
          .join("\\n");

        if (billNum === 1) {
          text = `Bills in series.\\n` + auctionDatesString;
        } else if (billNum === numOfBills) {
          text = "Final bill in series.";
        } else {
          text = `${billNum} of ${numOfBills}`;
        }
      }
      text = text + `\\nLadder Notes: ${notes}`;
      // "https://www.treasurydirect.gov/RS/UN-Display.do";
      return text;
    };

    const description = getDescription();

    const [time, meridiem] = (closingTimeNoncompetitive || "11:00 AM").split(
      /\s+/
    );

    const timeArray = time.split(":");
    let hours = parseInt(timeArray[0]);
    const minutes = parseInt(timeArray[1]);

    if (/pm/i.test(meridiem) && hours > 12) {
      hours = hours + 12;
    }

    const purchaseDateTime = dayjs(auctionDate)
      .set("hours", hours)
      .set("minutes", minutes)
      .set("seconds", 0);

    const summary = `Purchase ${securityTerm} ${type} ${billNum} of ${numOfBills} ${cusip}`;
    const startTime = purchaseDateTime
      .set("hours", 8)
      .set("minutes", 0)
      .set("seconds", 0);

    const event = [
      "BEGIN:VEVENT",
      `DTSTART:${startTime.format("YYYYMMDDTHHmmss")}`,
      `DTEND:${purchaseDateTime.format("YYYYMMDDTHHmmss")}`,
      `DTSTAMP:${dayjs().format("YYYYMMDDTHHmmss")}`,
      "ORGANIZER;CN=US Treasury Manager:mailto:treasury-ladders@vikingstamp.com",
      `UID:${id}-${idx}`,
      `DESCRIPTION:${description}`,
      `LAST-MODIFIED:${dayjs().format("YYYYMMDDTHHmmss")}`,
      `SUMMARY:${summary}`,
      "TRANSP:TRANSPARENT",
    ];
    if (idx > 0) {
      event.push(`RELATED-TO:${id}-0`);
    }

    event.push(...getAlarms());
    event.push("END:VEVENT");

    acc.push(...event);
    return acc;
  }, [] as string[]);
};

const createInvite = (ladder: SavedLadderPayload): string => {
  const calTemplate = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ZContent.net//Zap Calendar 1.0//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...timezoneBlock,
    ...dynamicEvents(ladder),
    "END:VCALENDAR",
  ];

  const calInvite = [...calTemplate];

  return calInvite.reduce((acc, line) => {
    acc = acc.concat("\r\n" + line.trim());
    return acc;
  }, "");
};

export default createInvite;
