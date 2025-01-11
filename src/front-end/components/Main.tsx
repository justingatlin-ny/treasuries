import {useEffect, useState} from "react";
import Grid2 from "@mui/material/Grid2";
import dayjs, {Dayjs} from "dayjs";
import {ILocalStorageData, RealORPossibleBillsType} from "../../types";
import BondDates from "./BondDates";
import {buildBillLadders} from "../../utils";
import BillLadders from "./BillLadders";
import BillLadderDialog from "./BillLadderDialog";
import SavedLadders from "./SavedLadders";
import validateSavedBillsAndUpdateStorage, {
  ON_SAVED_LADDERS_CHANGED,
  SAVED_LADDERS,
} from "../../utils/localStorageManager";
const Main = () => {
  const [maturityDate, setMaturityDate] = useState<Dayjs>(
    dayjs().add(4, "month").set("date", 1)
  );
  const [auctionDate, setAuctionDate] = useState<Dayjs>(dayjs());
  const [currentLadderOptions, updateCurrentLadderOptions] = useState([]);
  const [savedLadders, updateSavedLadders] = useState<string>("");
  const [billsToAdd, updateBillsToAdd] = useState<RealORPossibleBillsType[]>(
    []
  );

  const handleDateChange = (eventData: Dayjs, type: "maturity" | "auction") => {
    if (type === "maturity") {
      setMaturityDate(eventData as Dayjs);
    } else {
      setAuctionDate(eventData as Dayjs);
    }
  };

  function dispatchLocalStorageEvent(
    key: string,
    oldValue: string,
    newValue: string
  ) {
    const event = new CustomEvent<ILocalStorageData>(ON_SAVED_LADDERS_CHANGED, {
      detail: {key, oldValue, newValue},
    });
    window.dispatchEvent(event);
  }

  useEffect(() => {
    const originalSetItem = localStorage.setItem;

    window.localStorage.setItem = function (key: string, newValue: string) {
      const oldValue = window.localStorage.getItem(key) ?? "[]";
      originalSetItem.call(this, key, newValue);
      if (key === SAVED_LADDERS) {
        dispatchLocalStorageEvent(key, oldValue, newValue);
      }
    };
    window.addEventListener(
      ON_SAVED_LADDERS_CHANGED,
      (event: CustomEvent<ILocalStorageData>) => {
        const {
          detail: {newValue},
        } = event;
        updateSavedLadders(newValue);
      }
    );
  }, []);

  useEffect(() => {
    if (maturityDate) {
      if (window?.electronAPI?.getBills) {
        window.electronAPI.getBills().then((realBills) => {
          validateSavedBillsAndUpdateStorage(realBills);

          const ladders = buildBillLadders(
            maturityDate,
            auctionDate,
            realBills
          );
          updateCurrentLadderOptions(ladders);
        });
      }
    }
  }, [maturityDate, auctionDate]);

  return (
    <Grid2 container spacing={2} sx={{p: 2}} direction={"column"}>
      <SavedLadders savedLadders={savedLadders} />
      <BondDates
        handleChange={handleDateChange}
        maturityDate={maturityDate}
        auctionDate={auctionDate}
      />
      <BillLadders
        addLadder={updateBillsToAdd}
        currentLadderOptions={currentLadderOptions}
      />
      <BillLadderDialog
        billsToAdd={billsToAdd}
        updateBillsToAdd={updateBillsToAdd}
      />
    </Grid2>
  );
};

export default Main;
