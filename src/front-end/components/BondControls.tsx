import {
  Grid2,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  Box,
} from "@mui/material";
import {LocalizationProvider, DateCalendar} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {BondControlProps} from "../types";
import dayjs from "dayjs";

export const BondControls: React.FC<BondControlProps> = ({
  maturityDate,
  auctionDate,
  handleChange,
}) => {
  return (
    <Grid2 size={{xs: 12, sm: 12, md: 4}}>
      <Stack spacing={1} direction={"row"} flexGrow={1}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box flexGrow={1}>
            <Typography textAlign={"center"}>{"AUCTION DATE"}</Typography>
            <DateCalendar
              minDate={dayjs()}
              maxDate={maturityDate}
              value={auctionDate}
              onChange={(eventData) => handleChange(eventData, "auction")}
            />
          </Box>
          <Box flexGrow={1}>
            <Typography textAlign={"center"}>{"MATURITY DATE"}</Typography>
            <DateCalendar
              minDate={auctionDate}
              value={maturityDate}
              onChange={(eventData) => handleChange(eventData, "maturity")}
            />
          </Box>
        </LocalizationProvider>
      </Stack>
    </Grid2>
  );
};
