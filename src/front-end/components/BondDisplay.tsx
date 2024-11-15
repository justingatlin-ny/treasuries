import React from "react";
import {
  Grid2,
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
  BondActionDatesType,
  BondControlProps,
} from "../types";
import {calcDates} from "../utils";
import dayjs from "dayjs";

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
              {actionDates[action].format("ddd MMM D, YYYY")}
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
}) => {
  if (!selectedDate) {
    return null;
  }
  return (
    <>
      {Object.entries(calcDates({selectedDate, dateType})).map(
        ([duration, actionDates]) => {
          const isPast = actionDates.auction.isBefore(dayjs());
          return (
            <AssetDurationContainer
              size={{xs: 12, sm: 6, md: 4}}
              key={duration}
              className={isPast ? "past" : ""}
            >
              <Card>
                <CardHeader title={duration.toLocaleUpperCase()} />
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
}: Omit<BondControlProps, "handleChange">) => {
  return (
    <BondDisplayContainer
      displaysettings={displaySettings}
      container
      spacing={2}
    >
      <AssetDuration selectedDate={date} dateType={type} />
    </BondDisplayContainer>
  );
};
