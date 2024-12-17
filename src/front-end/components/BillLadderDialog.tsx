import {useRef} from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {SavedLadderPayload, RealBillsCollectionType} from "../types";
import {getImportantDates} from "../utils";

const BillLadderDialog: React.FC<{
  onClose: (input: SavedLadderPayload) => void;
  open: boolean;
  selectedBills: RealBillsCollectionType[];
}> = ({onClose, open, selectedBills}) => {
  if (!selectedBills.length) return null;
  const handleClose = (payload?: SavedLadderPayload) => {
    onClose(payload);
  };
  const {monthNeeded, firstDate, finalMaturity} =
    getImportantDates(selectedBills);

  return (
    <Dialog
      aria-modal="true"
      onClose={() => handleClose()}
      open={open}
      sx={{p: 2}}
      PaperProps={{
        component: "form",
        inert: "true",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries((formData as any).entries());
          const notes: string = formJson.notes;
          const id = performance.now();

          handleClose({notes, monthNeeded, selectedBills, id});
        },
      }}
    >
      <DialogTitle>
        Add
        <Typography component={"span"} variant="h6">
          {monthNeeded}
        </Typography>{" "}
        Expenses Ladder
      </DialogTitle>
      <DialogContent>
        <Stack mb={2} spacing={1}>
          <Typography>
            {`${selectedBills.length} transaction${selectedBills.length === 1 ? "" : "s"}`}
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
        <Button onClick={() => handleClose()}>Cancel</Button>
        <Button type="submit">Add Ladder</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BillLadderDialog;
