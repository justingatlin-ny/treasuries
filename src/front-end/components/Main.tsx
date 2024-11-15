import {type ChangeEvent, useEffect, useState} from "react";
import Grid2 from "@mui/material/Grid2";
import dayjs, {Dayjs} from "dayjs";
import {DateType, BondActionDisplayType} from "../types";
import {BondControls} from "./BondControls";
import {BondDisplay} from "./BondDisplay";

const Main = () => {
  const [date, setDate] = useState<Dayjs>(dayjs());
  const [type, setType] = useState<DateType>("auction");
  const [displaysettings, updateDisplaySettings] =
    useState<BondActionDisplayType>({
      issue: true,
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
        setType(newValue as DateType);
      } else {
        updateDisplaySettings((prev) => ({...prev, [name]: newValue}));
      }
    } else {
      setDate(eventData as Dayjs);
    }
  };

  useEffect(() => {
    const settings = window.localStorage.getItem("displaySettings");
    if (settings) {
      updateDisplaySettings(JSON.parse(settings));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      "displaySettings",
      JSON.stringify(displaysettings)
    );
  }, [displaysettings]);

  return (
    <Grid2 container spacing={2} sx={{p: 2}} maxWidth="lg" direction={"column"}>
      <BondControls
        handleChange={handleChange}
        displaySettings={displaysettings}
        type={type}
        date={date}
      />
      <BondDisplay displaySettings={displaysettings} date={date} type={type} />
    </Grid2>
  );
};

export default Main;
