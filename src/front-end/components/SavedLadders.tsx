import {Typography, Accordion, IconButton, Box} from "@mui/material";
import {SavedLadderPayload} from "../types";

import {ExpandMore, RemoveCircle} from "@mui/icons-material";
import Ladder from "./Ladder";
import dayjs from "dayjs";
import {
  StyledAccordionDetails,
  StyledAccordionSummary,
  StyledContainer,
} from "./BillLadders";

const SavedLadders: React.FC<{
  savedLadders: SavedLadderPayload[];
  removeLadder: (id: number) => void;
}> = ({savedLadders, removeLadder}) => {
  if (!savedLadders.length)
    return (
      <StyledContainer>
        <Typography textAlign={"center"}>No saved ladders</Typography>
      </StyledContainer>
    );
  return (
    <StyledContainer>
      {savedLadders.map(
        (
          {id, selectedBills, monthNeeded, invalid, firstDate: firstDateString},
          idx
        ) => {
          const firstDate = dayjs(firstDateString);
          return (
            <Accordion disableGutters key={idx.toString()}>
              <Box sx={{display: "flex"}}>
                <StyledAccordionSummary
                  sx={{flexGrow: 1}}
                  expandIcon={<ExpandMore />}
                >
                  <Typography>Ladder for</Typography>
                  <Typography
                    sx={{ml: 0.5, mr: 0.5, fontWeight: "bold"}}
                    color={invalid ? "error" : ""}
                    className="month"
                  >{`${monthNeeded}`}</Typography>
                  {invalid && (
                    <Typography sx={{pr: 1}} color={"error"} fontWeight={800}>
                      is invalid
                    </Typography>
                  )}
                  <Typography>starts</Typography>
                  <Typography
                    className="start-date"
                    sx={{ml: 0.5, mr: 0.5, fontWeight: "bold"}}
                  >{`${firstDate.format("ddd MMM D, YYYY")}`}</Typography>
                </StyledAccordionSummary>
                <Box
                  sx={{
                    backgroundColor: "rgba(0, 0, 0, .08)",
                    alignContent: "center",
                  }}
                >
                  <IconButton
                    name="Add this ladder"
                    onClick={() => removeLadder(id)}
                  >
                    <RemoveCircle color={"error"} />
                  </IconButton>
                </Box>
              </Box>
              <StyledAccordionDetails>
                <Ladder billArray={selectedBills} />
              </StyledAccordionDetails>
            </Accordion>
          );
        }
      )}
    </StyledContainer>
  );
};

export default SavedLadders;
