import {Grid2, Typography} from "@mui/material";
import {LocalizationProvider, DateCalendar} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {BondControlProps} from "../../types";
import dayjs from "dayjs";

const BondDates: React.FC<BondControlProps> = ({
  maturityDate,
  auctionDate,
  handleChange,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid2 container spacing={{xs: 1, sm: 2}} columnSpacing={1}>
        <Grid2 size={{xs: 12, sm: 6}}>
          <Typography textAlign={"center"}>{"AUCTION DATE"}</Typography>
          <DateCalendar
            minDate={dayjs()}
            maxDate={maturityDate}
            value={auctionDate}
            onChange={(eventData) => handleChange(eventData, "auction")}
          />
        </Grid2>
        <Grid2 size={{xs: 12, sm: 6}}>
          <Typography textAlign={"center"}>{"MATURITY DATE"}</Typography>
          <DateCalendar
            minDate={auctionDate}
            value={maturityDate}
            onChange={(eventData) => handleChange(eventData, "maturity")}
          />
        </Grid2>
      </Grid2>
    </LocalizationProvider>
  );
};

export default BondDates;
