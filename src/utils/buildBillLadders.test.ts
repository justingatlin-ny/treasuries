import dayjs from "dayjs";
import {mockBillLadder} from "../mocks/mockTreasuries";
import {buildBillLadders} from "./buildBillLadders";
import {mockNativeTreasuriesMerged} from "../mocks/mockMerged";

const fail = (message: string) => {
  throw new Error(message);
};

describe("buildLadders()", () => {
  it("should create possible bills", () => {
    jest.useFakeTimers().setSystemTime(new Date("2025-01-08T22:00:00.000Z"));
    const billLadder = buildBillLadders(
      dayjs("2025-03-31T22:00:00.000Z"),
      dayjs(),
      mockNativeTreasuriesMerged
    );

    expect(billLadder).toHaveLength(3);
    expect(billLadder).toEqual(mockBillLadder);
  });

  it("should create bills auctioned on or after Feb 1, 2025 maturing on or before 56 days in the future", () => {
    jest.useFakeTimers().setSystemTime(new Date("2024-12-22T06:00:00.000Z"));
    const startDate = dayjs("2025-02-01T06:00:00.000Z");
    const finalMaturity = startDate.add(56, "days");
    const billLadders = buildBillLadders(
      finalMaturity,
      startDate,
      mockNativeTreasuriesMerged
    );

    billLadders.forEach((ladder) => {
      ladder.forEach(({auctionDate, maturityDate}) => {
        if (dayjs(auctionDate).isBefore(startDate)) {
          fail(`auctionDate ${auctionDate} is before ${startDate}.`);
        } else if (dayjs(maturityDate).isAfter(finalMaturity)) {
          fail(`maturityDate ${maturityDate} is after ${finalMaturity} .`);
        }
      });
    });
  });

  it("should not create bills auctioned on holidays", () => {
    jest.useFakeTimers().setSystemTime(new Date("2024-12-25T06:00:00.000Z"));
    const billLadders = buildBillLadders(
      dayjs("2024-12-18T06:00:00.000Z").add(135, "days"),
      undefined,
      mockNativeTreasuriesMerged
    );

    // Need to check weekends and holidays for each date;
    billLadders.forEach((ladder) => {
      ladder.forEach(({auctionDate, maturityDate, issueDate}) => {
        if (dayjs(auctionDate).isBankingHoliday()) {
          fail(`auctionDate ${auctionDate} is on a holiday.`);
        } else if (dayjs(maturityDate).isBankingHoliday()) {
          fail(`maturityDate ${maturityDate} is on a holiday.`);
        } else if (dayjs(issueDate).isBankingHoliday()) {
          fail(`issueDate ${issueDate} is on a holiday.`);
        }
      });
    });
  });
});
