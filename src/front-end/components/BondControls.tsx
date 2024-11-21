import {
  Grid2,
  RadioGroup,
  FormLabel,
  FormControlLabel,
  Radio,
  FormGroup,
  Checkbox,
  Stack,
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
    <Grid2 display={"flex"} size={4}>
      <Stack>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={date}
            onChange={(newValue) => handleChange(newValue)}
          />
        </LocalizationProvider>
        <RadioGroup
          name="search-type"
          onChange={handleChange}
          value={type}
          sx={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr",
            label: {
              alignContent: "center",
            },
          }}
        >
          <FormLabel>Date Type</FormLabel>
          {Object.entries(displaySettings).map(([label]) => {
            return (
              <FormControlLabel
                key={label}
                value={label}
                control={<Radio />}
                label={label}
              />
            );
          })}
        </RadioGroup>
        <FormGroup
          sx={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr",
            label: {
              alignContent: "center",
            },
          }}
        >
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
      </Stack>
    </Grid2>
  );
};
