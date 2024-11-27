import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Stack,
  Paper,
  Typography,
} from "@mui/material";
import {AssetDurationContainer, BondDisplayContainer} from "../styles";
import {
  AssetDurationProps,
  AssetDurationTypes,
  BillActionDatesType,
  BillActionDisplayType,
  DateSelectionType,
  DateType,
  IAddBond,
} from "../types";
import {calcDates, collectDateStatuses, humanReadableDate} from "../utils";
import {Dayjs} from "dayjs";

const DisplayActionInfo: React.FC<{
  addBond: IAddBond;
  actionDates: BillActionDatesType;
}> = ({actionDates, addBond}) => {
  const sortedActions = Object.keys(actionDates).sort() as DateType[];
  return (
    <>
      {sortedActions.map((dateType): JSX.Element => {
        const date = actionDates[dateType];
        return (
          <Paper
            onClick={() => {
              if (dateType !== "issue") {
                addBond({dateType, date});
              }
            }}
            className={dateType}
            elevation={0}
            key={dateType}
          >
            <Typography
              variant={"subtitle2"}
              sx={{textTransform: "capitalize"}}
            >
              {dateType}
            </Typography>
            <Typography variant="subtitle1">
              {humanReadableDate(date)}
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
          BillActionDatesType,
        ]) => {
          const id = performance.now();
          return (
            <AssetDurationContainer
              key={duration}
              className={collectDateStatuses(actionDates)}
              size={{xs: 12, sm: 6, md: 4}}
            >
              <Card>
                <CardHeader title={duration.toLocaleUpperCase()} />
                <CardContent>
                  <Stack gap={2} direction={"column"}>
                    <DisplayActionInfo
                      addBond={addBond}
                      actionDates={actionDates}
                    />
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
  displaySettings: BillActionDisplayType;
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
