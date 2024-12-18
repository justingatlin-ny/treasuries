import {MouseEvent, useCallback, useEffect, useState} from "react";
import Grid2 from "@mui/material/Grid2";
import dayjs, {Dayjs} from "dayjs";
import {
  BillActionDisplayType,
  DateSelectionType,
  SavedLadderPayload,
  BillActionDatesType,
  AssetDurationTypes,
  SavedBillActionType,
  DateType,
  RealBillsCollectionType,
  TreasurySecurityType,
} from "../types";
import {BondControls} from "./BondControls";
import {buildBillLadder} from "../utils";
import BillLadders from "./BillLadders";
import BillLadderDialog from "./BillLadderDialog";
import SavedLadders from "./SavedLadders";

const Main = () => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Dayjs>(
    dayjs().add(4, "month").set("date", 1)
  );
  const [type, setType] = useState<DateSelectionType>("maturity");
  const [savedLadders, updateSavedLadders] = useState<SavedLadderPayload[]>([]);
  const [ladderList, updateBondList] = useState<RealBillsCollectionType[][]>(
    [] as RealBillsCollectionType[][]
  );
  const [displaysettings, updateDisplaySettings] =
    useState<BillActionDisplayType>({
      auction: true,
      maturity: true,
    });

  const [selectedBills, updateSelectedBill] = useState<
    RealBillsCollectionType[]
  >([]);

  const addLadder = (bills: RealBillsCollectionType[]) => {
    setOpen(true);
    updateSelectedBill(bills);
  };

  const storageUpdated = (event: StorageEvent) => {
    console.log(event);
  };

  useEffect(() => {
    window.addEventListener("onStorageChanged", storageUpdated);
  }, []);

  const handleClose = (payload?: SavedLadderPayload) => {
    if (payload) {
      updateSavedLadders((prev) => prev.concat([payload]));
    }
    setOpen(false);
  };

  const removeLadder = (id: number) => {
    updateSavedLadders((prev) => prev.filter((ladder) => ladder.id !== id));
  };

  const handleChange = (
    eventData: MouseEvent<HTMLButtonElement> | Dayjs,
    newValue?: string | Dayjs
  ) => {
    if (eventData instanceof dayjs) {
      setDate(eventData as Dayjs);
    } else if (newValue) {
      setType(newValue as DateSelectionType);
    }
  };

  useEffect(() => {
    const settings = window.localStorage.getItem("displaySettings");
    if (settings) {
      updateDisplaySettings(JSON.parse(settings));
    }
  }, []);

  useEffect(() => {
    const ladders = window.localStorage.getItem("savedLadders");
    if (ladders) {
      const parsedLadders = JSON.parse(ladders);
      updateSavedLadders(parsedLadders);
    }
  }, []);

  useEffect(() => {
    if (date && type === "maturity") {
      if (window?.electronAPI?.getBills) {
        window.electronAPI
          .getBills()
          .then((realBills: RealBillsCollectionType) => {
            const ladders = buildBillLadder(date, realBills);
            if (ladders?.length) {
              updateBondList(ladders);
            }
          });
      }
    }
  }, [date, type]);

  useEffect(() => {
    window.localStorage.setItem(
      "savedLadders",
      JSON.stringify(savedLadders || [])
    );
  }, [savedLadders]);

  useEffect(() => {
    window.localStorage.setItem(
      "displaySettings",
      JSON.stringify(displaysettings)
    );
  }, [displaysettings]);

  return (
    <Grid2 container spacing={2} sx={{p: 2}} direction={"row"}>
      <SavedLadders savedLadders={savedLadders} removeLadder={removeLadder} />
      <BondControls
        handleChange={handleChange}
        displaySettings={displaysettings}
        type={type}
        date={date}
      />
      <BillLadders addLadder={addLadder} ladderList={ladderList} />

      <BillLadderDialog
        selectedBills={selectedBills}
        onClose={handleClose}
        open={open}
      />
    </Grid2>
  );
};

export default Main;
