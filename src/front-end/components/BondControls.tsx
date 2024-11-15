import {
  Grid2,
  FormControl,
  RadioGroup,
  FormLabel,
  FormControlLabel,
  Radio,
  FormGroup,
  Checkbox,
} from "@mui/material";
import {LocalizationProvider, DatePicker} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {BondControlProps} from "../types";

export const BondControls: React.FC<BondControlProps> = ({
  type,
  date,
  handleChange,
  displaySettings,
}) => {
  return (
    <Grid2 display={"flex"} size="grow">
      <Grid2 size={4}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={date}
            onChange={(newValue) => handleChange(newValue)}
          />
        </LocalizationProvider>
      </Grid2>
      <Grid2 size={4}>
        <FormControl sx={{flexDirection: "row", gap: "1em"}}>
          <RadioGroup name="search-type" onChange={handleChange} value={type}>
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
            {Object.entries(displaySettings).map(([label, value]) => {
              return (
                <FormControlLabel
                  key={label}
                  name={label}
                  control={<Checkbox checked={value} onChange={handleChange} />}
                  label={label}
                />
              );
            })}
          </FormGroup>
        </FormControl>
      </Grid2>
    </Grid2>
  );
};
