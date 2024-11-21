import {type ChangeEvent, useEffect, useState} from "react";
import Grid2 from "@mui/material/Grid2";
import dayjs, {Dayjs} from "dayjs";
import {
  BondActionDisplayType,
  SelectedBondType,
  IAddBond,
  DateSelectionType,
  AssetDurationTypes,
  BondActionDatesType,
} from "../types";
import {BondControls} from "./BondControls";
import {BondDisplay} from "./BondDisplay";
import BondSelectionContainer from "./BondSelectionContainer";
import {buildBillLadder} from "../utils";

const Main = () => {
  const [date, setDate] = useState<Dayjs>(dayjs().add(4, "months"));
  const [type, setType] = useState<DateSelectionType>("maturity");
  const [billLadders, updateBondList] = useState<
    Record<AssetDurationTypes, BondActionDatesType>[]
  >([]);
  const [displaysettings, updateDisplaySettings] =
    useState<BondActionDisplayType>({
      auction: true,
      maturity: true,
    });

  const handleChange = (
    eventData: ChangeEvent<HTMLInputElement> | Dayjs,
    newValue?: boolean | string
  ) => {
    if ((eventData as ChangeEvent)?.type) {
      const {target} = eventData as ChangeEvent<HTMLInputElement>;
      const {name} = target;
      if (/search-type/i.test(name)) {
        setType(newValue as DateSelectionType);
      } else {
        updateDisplaySettings((prev) => ({...prev, [name]: newValue}));
      }
    } else {
      setDate(eventData as Dayjs);
    }
  };

  const addBond: IAddBond = (bond) => {
    // updateBondList((prev) => prev.concat(bond));
    // setType("maturity");
    // setDate(bond.auction);
  };

  const removeBond = (bondToRemove: number): void => {
    // updateBondList((prev) =>
    //   prev.filter((currentBond) => bondToRemove !== currentBond.id)
    // );
  };

  useEffect(() => {
    const settings = window.localStorage.getItem("displaySettings");
    if (settings) {
      updateDisplaySettings(JSON.parse(settings));
    }
  }, []);

  useEffect(() => {
    if (date && type === "maturity") {
      const ladders = buildBillLadder(date);
      if (ladders?.length) {
        updateBondList(ladders);
      }
    }
  }, [date, type]);

  useEffect(() => {
    window.localStorage.setItem(
      "displaySettings",
      JSON.stringify(displaysettings)
    );
  }, [displaysettings]);

  return (
    <Grid2 container spacing={2} sx={{p: 2}} maxWidth="lg" direction={"row"}>
      <BondControls
        handleChange={handleChange}
        displaySettings={displaysettings}
        type={type}
        date={date}
      />
      <BondSelectionContainer
        billLadders={billLadders}
        removeBond={removeBond}
      />
      <BondDisplay
        addBond={addBond}
        displaySettings={displaysettings}
        date={date}
        type={type}
      />
    </Grid2>
  );
};

export default Main;
