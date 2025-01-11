import {mockSavedLadders} from "../mocks/mockSavedLadders";
import {
  addToStorage,
  removeFromStorage,
  SAVED_LADDERS,
} from "./localStorageManager";

describe("Local Storage Manager", () => {
  jest.spyOn(Storage.prototype, "setItem");
  Storage.prototype.setItem = jest.fn();
  Storage.prototype.getItem = jest
    .fn()
    .mockImplementation(() => JSON.stringify(mockSavedLadders));
  it("should get a ladder from local storage", () => {
    const id = "650ee01c-5f7d-4037-807d-263a28f3246f";
    const expected = JSON.stringify(
      mockSavedLadders.filter((ladder) => id !== ladder.id)
    );
    removeFromStorage(id);
    expect(localStorage.getItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith(SAVED_LADDERS, expected);
  });
});
