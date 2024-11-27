import {
  styled,
  Grid2,
  Typography,
  Accordion,
  AccordionSummary as MuiAccordionSummary,
  AccordionDetails,
  AccordionSummaryProps,
  accordionSummaryClasses,
} from "@mui/material";
import {BillType} from "../types";
import {determineStatus, humanReadableDate, sortBillsByDate} from "../utils";
import {ExpandMore} from "@mui/icons-material";
import {theme} from "../styles";

const Container = styled(Grid2)``;

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary {...props} />
))(({theme}) => ({
  backgroundColor: "rgba(0, 0, 0, .03)",
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1),
  },
  ...theme.applyStyles("dark", {
    backgroundColor: "rgba(255, 255, 255, .05)",
  }),
}));

const BondSelectionContainer: React.FC<{
  ladderList: BillType[][];
}> = ({ladderList}) => {
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
            <AccordionSummary expandIcon={<ExpandMore />}>
              {`Ladder Option ${idx + 1}`}
            </AccordionSummary>
            <AccordionDetails>
              <Grid2 container spacing={2}>
                {["Duration", "Purchase", "Mature"].map((label, idx) => (
                  <Grid2 key={label + idx} size={4}>
                    <Typography>{label}</Typography>
                  </Grid2>
                ))}
                {sortBillsByDate(billArray).map((bill) => {
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

export default BondSelectionContainer;
