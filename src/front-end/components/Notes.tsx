import React, {MouseEvent, ChangeEvent, useRef, useState} from "react";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import {Button, IconButton, styled, TextField, Typography} from "@mui/material";
import {SavedLadderPayload} from "../types";

const StyledNotes = styled("div")`
  * {
    display: inline;
  }
  margin: 5px 20px;
`;

const Notes: React.FC<{notes: string; id: number}> = ({notes, id}) => {
  const [isEditing, setIsEditing] = useState(false);
  const originalText = useRef(notes);
  const [text, setText] = useState(notes);
  const ref = useRef<HTMLInputElement>(null);
  const handleEditClick = () => {
    setIsEditing(true);
    ref.current?.focus();
  };

  const handleSave = (event: MouseEvent<HTMLButtonElement>) => {
    const {
      target: {name},
    } = event;
    const vettedText = name === "delete" ? "" : text;

    const savedLadders: SavedLadderPayload[] = JSON.parse(
      window.localStorage.getItem("savedLadders")
    );

    const updatedLadders = savedLadders.map((ladder) => {
      if (ladder.id === id) {
        ladder.notes = vettedText;
      }
      return ladder;
    });
    window.localStorage.setItem("savedLadders", JSON.stringify(updatedLadders));
    setIsEditing(false);
    setText(vettedText);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleBlur = (event: MouseEvent<HTMLButtonElement>) => {
    setText(originalText.current);
    setIsEditing(false);
  };

  return (
    <StyledNotes>
      {!notes && !isEditing ? (
        "No notes"
      ) : isEditing ? (
        <>
          <TextField
            sx={{margin: "5px 0 0", width: "100%"}}
            type="text"
            ref={ref}
            value={text}
            label="Update ladder notes"
            variant="outlined"
            onChange={handleInputChange}
          />
          <Button name="save" onClick={handleSave}>
            SAVE
          </Button>
          <Button name="cancel" onClick={handleBlur}>
            CANCEL
          </Button>
          <Button name="delete" onClick={handleSave}>
            DELETE
          </Button>
        </>
      ) : (
        <Typography>{`${text}`}</Typography>
      )}
      {!isEditing && (
        <IconButton onClick={handleEditClick}>
          <BorderColorIcon />
        </IconButton>
      )}
    </StyledNotes>
  );
};

export default Notes;
