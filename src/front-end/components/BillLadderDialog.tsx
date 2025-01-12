import {useState} from "react";
import {v4 as uuidV4} from "uuid";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  SelectChangeEvent,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {RealORPossibleBillsType} from "../../types";
import {getImportantDates} from "../../utils";
import dayjs, {Dayjs} from "dayjs";
import {addToStorage} from "../../utils/localStorageManager";

interface MonthDropdownProps {
  finalDate: Dayjs;
}

const formatMonthDisplay = (input: Dayjs) => {
  return input.format("MMMM YYYY");
};

const MonthDropdown: React.FC<MonthDropdownProps> = ({finalDate}) => {
  const dateOfMaturity = finalDate.date();
  const initMonth =
    dateOfMaturity >= 6
      ? finalDate.add(1, "month").set("date", 1)
      : finalDate.set("date", 1);

  const [monthNeeded, setMonthNeeded] = useState<string>(
    formatMonthDisplay(initMonth)
  );

  const handleChange = (event: SelectChangeEvent) => {
    setMonthNeeded(event.target.value);
  };

  const monthList = (initMonth: Dayjs) => {
    const months = [];
    for (let m = 0; m <= 3; m++) {
      const subsequentMonths = dayjs(initMonth).add(m, "months");
      const formatted = formatMonthDisplay(subsequentMonths);
      months.push(
        <MenuItem
          key={subsequentMonths.toISOString()}
          value={formatMonthDisplay(subsequentMonths)}
        >
          {formatted}
        </MenuItem>
      );
    }
    return months;
  };

  return (
    <Select
      autoWidth
      id="month"
      name="monthNeeded"
      defaultValue={monthNeeded}
      onChange={handleChange}
    >
      {monthList(initMonth)}
    </Select>
  );
};

const BillLadderDialog: React.FC<{
  updateBillsToAdd: React.Dispatch<
    React.SetStateAction<RealORPossibleBillsType[]>
  >;
  billsToAdd: RealORPossibleBillsType[];
}> = ({updateBillsToAdd, billsToAdd}) => {
  if (!billsToAdd.length) return null;

  const {firstDate, finalMaturity} = getImportantDates(billsToAdd);

  const onClose = () => updateBillsToAdd([]);

  return (
    <Dialog
      aria-modal="true"
      onClose={onClose}
      open={billsToAdd.length > 0}
      sx={{p: 2}}
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries((formData as FormData).entries());
          const notes = formJson.notes as string;
          const monthNeeded = formJson.monthNeeded as string;
          const payload = {
            notes,
            selectedBills: billsToAdd,
            id: uuidV4(),
            firstDate: firstDate.toISOString(),
            finalMaturity: finalMaturity.toISOString(),
            monthNeeded,
          };
          addToStorage(payload);
          onClose();
        },
      }}
    >
      <DialogTitle>
        <Typography component={"span"} variant="h6">
          <MonthDropdown finalDate={finalMaturity} />
        </Typography>{" "}
        Expenses Ladder
      </DialogTitle>
      <DialogContent>
        <Stack mb={2} spacing={1}>
          <Typography>
            {`${billsToAdd.length} transaction${billsToAdd.length === 1 ? "" : "s"}`}
          </Typography>
          <Typography>
            First Auction: <span>{firstDate.format("ddd MMM D, YYYY")}</span>
          </Typography>
          <Typography>
            Final Maturity:{" "}
            <span>{finalMaturity.format("ddd MMM D, YYYY")}</span>
          </Typography>
        </Stack>
        <Box>
          <TextField
            error={false}
            id="notes"
            name="notes"
            multiline
            fullWidth
            rows={4}
            label={"Notes"}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit">Add Ladder</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BillLadderDialog;
