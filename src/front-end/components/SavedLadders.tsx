import {
  styled,
  Grid2,
  Typography,
  Accordion,
  AccordionSummary as MuiAccordionSummary,
  AccordionDetails,
  AccordionSummaryProps,
  accordionSummaryClasses,
  IconButton,
  Box,
} from "@mui/material";
import {BillType, SavedLadderPayload} from "../types";
import {
  determineStatus,
  getImportantDates,
  humanReadableDate,
  sortBillsByDate,
} from "../utils";
import {ExpandMore, RemoveCircle} from "@mui/icons-material";
import {theme} from "../styles";

const Container = styled(Grid2)``;

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary {...props} />
))(({theme}) => ({
  backgroundColor: "rgba(0, 0, 0, .08)",
  flexDirection: "row-reverse",
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
    {
      // transform: "rotate(180deg)",
    },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1),
  },
}));

const SavedLadders: React.FC<{
  savedLadders: SavedLadderPayload[];
  removeLadder: (bills: BillType[]) => void;
}> = ({savedLadders, removeLadder}) => {
  if (!savedLadders.length) return null;
  return (
    <Container>
      {savedLadders.map(({selectedBills}, idx) => {
        const {monthNeeded, firstDate} = getImportantDates(selectedBills);

        return (
          <Accordion
            disableGutters
            key={idx.toString()}
            sx={{
              ".isClose": {
                color: theme.status.close,
              },
            }}
          >
            <Box sx={{display: "flex"}}>
              <AccordionSummary sx={{flexGrow: 1}} expandIcon={<ExpandMore />}>
                <Typography>{`Ladder for ${monthNeeded}`}</Typography>
                <Typography>{` starts ${firstDate.format("ddd MMM D, YYYY")}`}</Typography>
              </AccordionSummary>
              <Box
                sx={{
                  backgroundColor: "rgba(0, 0, 0, .08)",
                  alignContent: "center",
                }}
              >
                <IconButton
                  name="Add this ladder"
                  onClick={() => removeLadder(selectedBills)}
                >
                  <RemoveCircle color={"error"} />
                </IconButton>
              </Box>
            </Box>
            <AccordionDetails>
              <Grid2 container spacing={2}>
                {["Duration", "Purchase", "Mature"].map((label, idx) => (
                  <Grid2 key={label + idx} size={4}>
                    <Typography>{label}</Typography>
                  </Grid2>
                ))}
                {sortBillsByDate(selectedBills).map((bill) => {
                  return Object.entries(bill).map(([duration, dates], num) => {
                    return (
                      <>
                        <Grid2 size={4} key={"duration" + num}>
                          <Typography>{duration}</Typography>
                        </Grid2>
                        <Grid2 size={4} key={"auction" + num}>
                          <Typography
                            className={
                              determineStatus(dates.auction).IsClose
                                ? "isClose"
                                : ""
                            }
                          >
                            {humanReadableDate(dates.auction)}
                          </Typography>
                        </Grid2>
                        <Grid2 size={4} key={"maturity" + num}>
                          <Typography>
                            {humanReadableDate(dates.maturity)}
                          </Typography>
                        </Grid2>
                      </>
                    );
                  });
                })}
              </Grid2>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Container>
  );
};

export default SavedLadders;
