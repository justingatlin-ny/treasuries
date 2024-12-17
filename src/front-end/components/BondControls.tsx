import {Grid2, Stack, ToggleButtonGroup, ToggleButton} from "@mui/material";
import {LocalizationProvider, DateCalendar} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {BondControlProps} from "../types";

export const BondControls: React.FC<BondControlProps> = ({
  type,
  date,
  handleChange,
  displaySettings,
}) => {
  return (
    <Grid2 size={{xs: 12, sm: 12, md: 4}}>
      <Stack spacing={1}>
        <ToggleButtonGroup
          size={"medium"}
          exclusive
          onChange={handleChange}
          value={type}
        >
          {Object.entries(displaySettings).map(([label]) => {
            return (
              <ToggleButton
                fullWidth
                key={label}
                name="search-type"
                value={label}
              >
                {label}
              </ToggleButton>
            );
          })}
        </ToggleButtonGroup>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar value={date} onChange={handleChange} />
        </LocalizationProvider>
      </Stack>
    </Grid2>
  );
};
