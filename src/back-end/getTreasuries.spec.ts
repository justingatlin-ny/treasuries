import {
  mockPastBILL,
  mockPastCMB,
  mockMerged2,
  mockUpcoming,
} from "../mocks/mockTreasuries";
import {mockNativeTreasuriesMerged} from "../mocks/mockMerged";
import {getTreasuries} from "./getTreasuries";

describe("getTreasuries()", () => {
  afterEach(jest.resetAllMocks);
  afterAll(jest.useRealTimers);

  it("should return successful treasuries", async () => {
    jest.useFakeTimers().setSystemTime(new Date("2025-01-08T16:05:00.000Z"));
    const mockFetch = jest.spyOn(global, "fetch");

    mockFetch
      .mockImplementationOnce(
        jest.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(mockPastCMB),
        })
      )
      .mockImplementationOnce(
        jest.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(mockPastBILL),
        })
      )
      .mockImplementationOnce(
        jest.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(mockUpcoming),
        })
      ) as jest.Mock;
    const {error, success} = await getTreasuries();
    expect(mockFetch).toHaveBeenCalledTimes(3);
    expect(error).toHaveLength(0);
    expect(success).toEqual(mockNativeTreasuriesMerged);
  });

  it("should force a request", async () => {
    jest.useFakeTimers().setSystemTime(new Date("2025-01-08T16:05:00.000Z"));
    const mockFetch = jest.spyOn(global, "fetch");

    mockFetch
      .mockImplementationOnce(
        jest.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(mockPastCMB),
        })
      )
      .mockImplementationOnce(
        jest.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(mockPastBILL),
        })
      )
      .mockImplementationOnce(
        jest.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(mockUpcoming),
        })
      ) as jest.Mock;
    const {error, success} = await getTreasuries(true);
    expect(mockFetch).toHaveBeenCalledTimes(3);
    expect(error).toHaveLength(0);
    expect(success).toEqual(mockNativeTreasuriesMerged);
  });

  it("should not make another network request", async () => {
    jest.useFakeTimers().setSystemTime(new Date("2025-01-08T16:10:00.000Z"));
    const mockFetch = jest.spyOn(global, "fetch");

    mockFetch
      .mockImplementationOnce(
        jest.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(mockPastCMB),
        })
      )
      .mockImplementationOnce(
        jest.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(mockPastBILL),
        })
      )
      .mockImplementationOnce(
        jest.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(mockUpcoming),
        })
      ) as jest.Mock;
    const {error, success} = await getTreasuries();
    expect(mockFetch).not.toHaveBeenCalled();
    expect(error).toHaveLength(0);
    expect(success).toEqual(mockNativeTreasuriesMerged);
  });

  it("should return 2 failures", async () => {
    jest.useFakeTimers().setSystemTime(new Date("2025-01-08T17:10:00.000Z"));
    const mockFetch = jest.spyOn(global, "fetch");

    mockFetch
      .mockImplementationOnce(jest.fn().mockRejectedValue("promise rejected"))
      .mockImplementationOnce(
        jest.fn().mockResolvedValue({
          ok: false,
          statusText: "mock failure 2",
          url: "mock url 2",
        })
      )
      .mockImplementationOnce(
        jest.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(mockUpcoming),
        })
      ) as jest.Mock;
    const {error, success} = await getTreasuries();
    expect(mockFetch).toHaveBeenCalledTimes(3);
    expect(error).toHaveLength(2);

    expect(error[0].reason).toEqual("promise rejected");
    expect(error[0].url).toBeUndefined();
    expect(new Date(error[0].timestamp).getTime()).not.toBeNaN();

    expect(error[1].reason).toEqual("mock failure 2");
    expect(error[1].url).toEqual("mock url 2");
    expect(new Date(error[1].timestamp).getTime()).not.toBeNaN();

    expect(success).toEqual(mockMerged2);
  });
});
