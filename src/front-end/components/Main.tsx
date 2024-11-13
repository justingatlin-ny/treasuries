import {type ChangeEvent, type FC, useEffect, useState} from "react";
import Grid2, {Grid2Props} from "@mui/material/Grid2";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import {
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  FormGroup,
  Paper,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import dayjs, {Dayjs} from "dayjs";

interface StyledGridProps extends Grid2Props {
  displaysettings: BondActionDisplayType;
}

const StyledGrid = styled(Grid2, {
  shouldForwardProp: (prop) => prop !== "displaysettings",
})<StyledGridProps>(({displaysettings}) => ({
  ...Object.entries(displaysettings).reduce(
    (acc, [key, value]) => {
      if (!value) {
        acc[`.${key}`] = {display: "none"};
      }
      return acc;
    },
    {} as Record<string, {[key: string]: string}>
  ),
}));

type DateType = "maturity" | "auction" | "issue" | "announce";

interface AssetDurationProps {
  selectedDate: Dayjs;
  dateType: DateType;
}

// [maturity, auction, announce]
// days from maturity
const actionDatesMap = {
  // add maturity days;
  ["4-week"]: [28, 5, 7],
  ["42-day"]: [42, 2, 7],
  ["8-week"]: [56, 5, 7],
  ["13-week"]: [91, 2, 7],
  ["17-week"]: [119, 6, 7],
};

type ActionDatesMapType = typeof actionDatesMap;
type AssetDurationType = Record<keyof ActionDatesMapType, BondActionDatesType>;

type BondActionDatesType = Record<Exclude<DateType, "announce">, string>;
type BondActionDisplayType = Record<keyof BondActionDatesType, boolean>;

const calcDates = ({selectedDate, dateType}: AssetDurationProps) => {
  switch (dateType) {
    case "maturity":
      return Object.entries(actionDatesMap).reduce(
        (acc, [key, days]: [keyof ActionDatesMapType, number[]]) => {
          const maturityInDays = days[0];
          const daysToIssue = days[1];
          const actionDates = {
            maturity: selectedDate.format("ddd MMM D, YYYY"),
            issue: selectedDate
              .add(-maturityInDays, "days")
              .format("ddd MMM D, YYYY"),
            auction: selectedDate
              .add(-(daysToIssue + maturityInDays), "days")
              .format("ddd MMM D, YYYY"),
          } as BondActionDatesType;
          acc[key] = actionDates;
          return acc;
        },
        {} as AssetDurationType
      );
    case "issue":
      return Object.entries(actionDatesMap).reduce(
        (acc, [key, days]: [keyof ActionDatesMapType, number[]]) => {
          const maturityInDays = days[0];
          const daysToIssue = days[1];
          const actionDates = {
            issue: selectedDate.format("ddd MMM D, YYYY"),
            maturity: selectedDate
              .add(maturityInDays, "days")
              .format("ddd MMM D, YYYY"),
            auction: selectedDate
              .add(-daysToIssue, "days")
              .format("ddd MMM D, YYYY"),
          } as BondActionDatesType;

          acc[key] = actionDates;
          return acc;
        },
        {} as AssetDurationType
      );
    case "auction":
      // [maturity, issue, auction]
      return Object.entries(actionDatesMap).reduce(
        (acc, [key, days]: [keyof ActionDatesMapType, number[]]) => {
          const maturityInDays = days[0];
          const daysToIssue = days[1];

          const actionDates = {
            auction: selectedDate.format("ddd MMM D, YYYY"),
            issue: selectedDate
              .add(daysToIssue, "days")
              .format("ddd MMM D, YYYY"),
            maturity: selectedDate
              .add(daysToIssue + maturityInDays, "days")
              .format("ddd MMM D, YYYY"),
          } as BondActionDatesType;

          acc[key] = actionDates;
          return acc;
        },
        {} as AssetDurationType
      );
  }
};

const DisplayActionInfo: FC<{actionDates: BondActionDatesType}> = ({
  actionDates,
}) => {
  const sortedActions = Object.keys(actionDates).sort();
  return (
    <>
      {sortedActions.map((action: keyof BondActionDatesType) => {
        return (
          <Paper className={action} elevation={0} key={action}>
            <Typography
              variant={"subtitle2"}
              sx={{textTransform: "capitalize"}}
            >
              {action}
            </Typography>
            <Typography variant="subtitle1">{actionDates[action]}</Typography>
          </Paper>
        );
      })}
    </>
  );
};

const AssetDuration: FC<AssetDurationProps> = ({selectedDate, dateType}) => {
  if (!selectedDate) {
    return null;
  }
  return (
    <>
      {Object.entries(calcDates({selectedDate, dateType})).map(
        ([duration, actionDates]) => (
          <Grid2 key={duration} size={6}>
            <Card>
              <CardHeader title={duration.toLocaleUpperCase()} />
              <CardContent>
                <Stack gap={2} direction={"row"}>
                  <DisplayActionInfo actionDates={actionDates} />
                </Stack>
              </CardContent>
            </Card>
          </Grid2>
        )
      )}
    </>
  );
};

const Main = () => {
  const [date, setDate] = useState<Dayjs>(dayjs());
  const [type, setType] = useState<DateType>("maturity");
  const [displaysettings, updateDisplaySettings] =
    useState<BondActionDisplayType>({
      issue: true,
      auction: true,
      maturity: true,
    });

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
    newValue: DateType
  ) => {
    setType(newValue);
  };

  const handleDisplayChange = (
    event: ChangeEvent<HTMLInputElement>,
    newValue: boolean
  ) => {
    const {target} = event;
    const {name} = target;

    updateDisplaySettings((prev) => ({...prev, [name]: newValue}));
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
      <Grid2
        display={"flex"}
        size="grow"
        justifyContent={"center"}
        alignItems={"center"}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker value={date} onChange={(newValue) => setDate(newValue)} />
        </LocalizationProvider>
        <FormControl sx={{flexDirection: "row", gap: "1em"}}>
          <RadioGroup
            name="radio-buttons-group"
            onChange={handleChange}
            value={type}
          >
            <FormLabel>Date Type</FormLabel>
            <FormControlLabel
              value="maturity"
              control={<Radio />}
              label="Maturity"
            />
            <FormControlLabel value="issue" control={<Radio />} label="Issue" />
            <FormControlLabel
              value="auction"
              control={<Radio />}
              label="Auction"
            />
          </RadioGroup>
          <FormGroup>
            <FormLabel>Display Settings</FormLabel>
            {Object.entries(displaysettings).map(([label, value]) => {
              return (
                <FormControlLabel
                  key={label}
                  name={label}
                  control={
                    <Checkbox checked={value} onChange={handleDisplayChange} />
                  }
                  label={label}
                />
              );
            })}
          </FormGroup>
        </FormControl>
      </Grid2>
      <StyledGrid
        displaysettings={displaysettings}
        container
        display={"flex"}
        size="grow"
        justifyContent={"start"}
        alignItems={"center"}
      >
        <AssetDuration selectedDate={date} dateType={type} />
      </StyledGrid>
    </Grid2>
  );
};

export default Main;
