import {
  styled,
  Grid2,
  Typography,
  Accordion,
  AccordionSummary as MuiAccordionSummary,
  AccordionDetails as MUIAccordianDetails,
  AccordionSummaryProps,
  accordionSummaryClasses,
  IconButton,
  Box,
} from "@mui/material";
import {RealBillsCollectionType} from "../types";
import {sortLaddersByStartDateThenDuration} from "../utils";
import {AddCircle, ExpandMore} from "@mui/icons-material";
import Ladder from "./Ladder";

const Container = styled(Grid2)``;
const AccordionDetails = styled(MUIAccordianDetails)`
  padding: 0;
`;

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
  if (ladderList.length === 0) {
    return (
      <Container>
        <Typography textAlign={"center"}>
          No viable ladders can be created with the dates provided.
        </Typography>
      </Container>
    );
  }
  const sortedLadderList: RealBillsCollectionType[][] =
    sortLaddersByStartDateThenDuration(ladderList);
  return (
    <Container>
      {sortedLadderList.map((billArray, idx) => {
        const [, {classList, invalid}] = Object.entries(billArray[0])[0];
        const classes = (classList || "")
          .concat(invalid ? " unavailable" : "")
          .trim();
        return (
          <Accordion
            className={classes}
            defaultExpanded
            disableGutters
            key={idx.toString()}
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
                  onClick={() => {
                    if (!/unavailable|is-passed/i.test(classes)) {
                      addLadder(billArray);
                    }
                  }}
                >
                  {!/unavailable|is-passed/i.test(classes) && (
                    <AddCircle color={"success"} />
                  )}
                </IconButton>
              </Box>
            </Box>
            <AccordionDetails>
              <Ladder billArray={billArray} />
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Container>
  );
};

export default BillLadders;
