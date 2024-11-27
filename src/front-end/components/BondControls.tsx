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
// MuiCheckbox-root MuiRadio-root

const formChildrenStyles = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr 1fr",
  alignItems: "start",
  ".MuiCheckbox-root, .MuiRadio-root": {
    padding: "0 9px",
  },
};
export const BondControls: React.FC<BondControlProps> = ({
  type,
  date,
  handleChange,
  displaySettings,
}) => {
  return (
    <Grid2 size={{sm: 12, md: 4}}>
      <Stack spacing={1}>
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
          row
          sx={formChildrenStyles}
        >
          <FormLabel>Date Type</FormLabel>
          {Object.entries(displaySettings).map(([label]) => {
            return (
              <FormControlLabel
                labelPlacement="bottom"
                key={label}
                value={label}
                control={<Radio />}
                label={label}
              />
            );
          })}
        </RadioGroup>
        <FormGroup row sx={formChildrenStyles}>
          <FormLabel>Display Settings</FormLabel>
          {Object.entries(displaySettings).map(([label, value]) => {
            return (
              <FormControlLabel
                labelPlacement="bottom"
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
