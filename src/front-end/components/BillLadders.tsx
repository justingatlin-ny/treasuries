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
import {AddCircle, ExpandMore} from "@mui/icons-material";
import Ladder from "./Ladder";
import {RealORPossibleBillsType, TreasurySecurityType} from "../../types";

export const StyledContainer = styled(Grid2)``;
export const StyledAccordionDetails = styled(MUIAccordianDetails)`
  padding: 0;
`;

export const StyledAccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary {...props} />
))(({theme}) => ({
  backgroundColor: "rgba(0, 0, 0, .08)",
  flexDirection: "row-reverse",
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
    {},
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1),
  },
}));

const BillLadders: React.FC<{
  currentLadderOptions: RealORPossibleBillsType[][];
  addLadder: React.Dispatch<React.SetStateAction<RealORPossibleBillsType[]>>;
}> = ({currentLadderOptions, addLadder}) => {
  if (currentLadderOptions.length === 0) {
    return (
      <StyledContainer>
        <Typography textAlign={"center"}>
          No viable ladders can be created with the dates provided.
        </Typography>
      </StyledContainer>
    );
  }

  let ladderOption = 0;
  return (
    <StyledContainer>
      {currentLadderOptions.map((billArray, idx) => {
        const {classList, invalid} = billArray[0] as TreasurySecurityType;
        if (invalid) return null;
        ladderOption++;
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
              <StyledAccordionSummary
                sx={{flexGrow: 1}}
                expandIcon={<ExpandMore />}
              >
                {`Ladder Option ${ladderOption}`}
              </StyledAccordionSummary>
              <Box
                sx={{
                  backgroundColor: "rgba(0, 0, 0, .08)",
                  alignContent: "center",
                }}
              >
                <IconButton
                  name="Add this ladder"
                  onClick={() => {
                    if (!/unavailable|auction-passed/i.test(classes)) {
                      addLadder(billArray);
                    }
                  }}
                >
                  {!/unavailable|auction-passed/i.test(classes) && (
                    <AddCircle color={"success"} />
                  )}
                </IconButton>
              </Box>
            </Box>
            <StyledAccordionDetails>
              <Ladder billArray={billArray} />
            </StyledAccordionDetails>
          </Accordion>
        );
      })}
    </StyledContainer>
  );
};

export default BillLadders;
