import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Stack,
  Paper,
  Typography,
  IconButton,
} from "@mui/material";
import {AssetDurationContainer, BondDisplayContainer} from "../styles";
import {
  AssetDurationProps,
  AssetDurationTypes,
  BondActionDatesType,
  BondActionDisplayType,
  DateType,
  IAddBond,
} from "../types";
import {calcDates, humanReadableDate} from "../utils";
import dayjs, {Dayjs} from "dayjs";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const DisplayActionInfo: React.FC<{actionDates: BondActionDatesType}> = ({
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
            <Typography variant="subtitle1">
              {humanReadableDate(actionDates[action])}
            </Typography>
          </Paper>
        );
      })}
    </>
  );
};

const AssetDuration: React.FC<AssetDurationProps> = ({
  selectedDate,
  dateType,
  addBond,
}) => {
  if (!selectedDate) {
    return null;
  }
  return (
    <>
      {Object.entries(calcDates({selectedDate, dateType})).map(
        ([duration, actionDates]: [
          AssetDurationTypes,
          BondActionDatesType,
        ]) => {
          const id = performance.now();
          const className = Object.entries(actionDates)
            .reduce((acc, [key, value]) => {
              const isPast = value.isBefore(dayjs());
              if (isPast) {
                acc.push(`${key.toLowerCase()}IsPassed`);
              }
              return acc;
            }, [])
            .join(" ");
          return (
            <AssetDurationContainer
              key={duration}
              className={className}
              size={4}
            >
              <Card>
                <CardHeader
                  title={duration.toLocaleUpperCase()}
                  action={
                    <IconButton
                      title="Add bond to ladder"
                      onClick={() => {
                        addBond({...actionDates, duration, id});
                      }}
                    >
                      <AddCircleIcon />
                    </IconButton>
                  }
                />
                <CardContent>
                  <Stack gap={2} direction={"column"}>
                    <DisplayActionInfo actionDates={actionDates} />
                  </Stack>
                </CardContent>
              </Card>
            </AssetDurationContainer>
          );
        }
      )}
    </>
  );
};

export const BondDisplay = ({
  displaySettings,
  date,
  type,
  addBond,
}: {
  displaySettings: BondActionDisplayType;
  date: Dayjs;
  type: DateType;
  addBond: IAddBond;
}) => {
  return (
    <BondDisplayContainer
      displaysettings={displaySettings}
      container
      spacing={2}
      size="grow"
    >
      <AssetDuration addBond={addBond} selectedDate={date} dateType={type} />
    </BondDisplayContainer>
  );
};
