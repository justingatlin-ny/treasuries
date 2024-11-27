import {type ChangeEvent, useEffect, useState} from "react";
import Grid2 from "@mui/material/Grid2";
import dayjs, {Dayjs} from "dayjs";
import {
  BillActionDisplayType,
  IAddBond,
  DateSelectionType,
  BillType,
} from "../types";
import {BondControls} from "./BondControls";
import {BondDisplay} from "./BondDisplay";
import BondSelectionContainer from "./BondSelectionContainer";
import {buildBillLadder} from "../utils";

const Main = () => {
  const [date, setDate] = useState<Dayjs>(
    dayjs().add(4, "month").set("date", 1)
  );
  const [type, setType] = useState<DateSelectionType>("maturity");
  const [ladderList, updateBondList] = useState<BillType[][]>(
    [] as BillType[][]
  );
  const [displaysettings, updateDisplaySettings] =
    useState<BillActionDisplayType>({
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

  const addBond: IAddBond = ({dateType, date}) => {
    setType(dateType);
    setDate(date);
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
      <BondSelectionContainer ladderList={ladderList} />
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
