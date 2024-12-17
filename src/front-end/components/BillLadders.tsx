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
import {RealBillsCollectionType} from "../types";
import {determineStatus, humanReadableDate, sortBillsByDate} from "../utils";
import {AddCircle, ExpandMore} from "@mui/icons-material";
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

const BillLadders: React.FC<{
  ladderList: RealBillsCollectionType[][];
  addLadder: (bills: RealBillsCollectionType[]) => void;
}> = ({ladderList, addLadder}) => {
  return (
    <Container size={{sm: 12, md: 8}}>
      {ladderList.map((billArray, idx) => {
        return (
          <Accordion
            defaultExpanded
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
                {`Ladder Option ${idx + 1}`}
              </AccordionSummary>
              <Box
                sx={{
                  backgroundColor: "rgba(0, 0, 0, .08)",
                  alignContent: "center",
                }}
              >
                <IconButton
                  name="Add this ladder"
                  onClick={() => addLadder(billArray)}
                >
                  <AddCircle color={"success"} />
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
                {sortBillsByDate(billArray).map((bill) => {
                  return Object.entries(bill).map(([, details], num) => {
                    return (
                      <>
                        <Grid2 size={4} key={"duration" + num}>
                          <Typography>
                            {details.securityTerm} {details?.cusip || ""}
                          </Typography>
                        </Grid2>
                        <Grid2 size={4} key={"auction" + num}>
                          <Typography
                            className={
                              determineStatus(details.auctionDate).IsClose
                                ? "isClose"
                                : ""
                            }
                          >
                            {humanReadableDate(details.auctionDate)}
                          </Typography>
                        </Grid2>
                        <Grid2 size={4} key={"maturity" + num}>
                          <Typography>
                            {humanReadableDate(details.maturityDate)}
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

export default BillLadders;
