import React, {useState} from "react";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import {Typography, Accordion, IconButton, Box} from "@mui/material";
import {SavedLadderPayload} from "../../types";
import NotesIcon from "@mui/icons-material/Notes";
import {ExpandMore, RemoveCircle} from "@mui/icons-material";
import Ladder from "./Ladder";
import dayjs from "dayjs";
import {
  StyledAccordionDetails,
  StyledAccordionSummary,
  StyledContainer,
} from "./BillLadders";
import Notes from "./Notes";
import {removeFromStorage} from "../../utils/localStorageManager";

const SavedLadders: React.FC<{
  savedLadders: string;
}> = ({savedLadders}) => {
  if (savedLadders === "")
    return (
      <StyledContainer>
        <Typography textAlign={"center"}>No saved ladders</Typography>
      </StyledContainer>
    );

  const [expanded, setExpanded] = useState<{[key: string]: boolean}>({});

  const handleChange = (id: string) => () => {
    setExpanded((prev) => ({
      ...prev,
      [id]: prev[id] ? false : true,
    }));
  };

  const addToCalendar = async (ladder: SavedLadderPayload) => {
    await window.electronAPI.createInvite(ladder);
  };
  const ladderList: SavedLadderPayload[] = JSON.parse(savedLadders);
  return (
    <StyledContainer>
      {ladderList.map((ladder) => {
        const {
          id,
          selectedBills,
          monthNeeded,
          notes,
          invalid,
          firstDate: firstDateString,
        } = ladder;
        const firstDate = dayjs(firstDateString);
        return (
          <Accordion
            disableGutters
            key={id}
            expanded={expanded[id] === true}
            onClick={undefined}
            onChange={handleChange(id)}
          >
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
                <IconButton name="Notes" onClick={handleChange(id)}>
                  {notes ? (
                    <NotesIcon color={"action"} />
                  ) : (
                    <PlaylistAddIcon color={"success"} />
                  )}
                </IconButton>
                <IconButton
                  name="add-to-calendar"
                  onClick={() => addToCalendar(ladder)}
                >
                  <CalendarTodayIcon />
                </IconButton>
                <IconButton name="Remove" onClick={() => removeFromStorage(id)}>
                  <RemoveCircle color={"error"} />
                </IconButton>
              </Box>
            </Box>
            <StyledAccordionDetails>
              <Notes notes={notes} id={id} />
              <Ladder billArray={selectedBills} />
            </StyledAccordionDetails>
          </Accordion>
        );
      })}
    </StyledContainer>
  );
};

export default SavedLadders;
