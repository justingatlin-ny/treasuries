import React, {MouseEvent, ChangeEvent, useRef, useState} from "react";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import {Button, IconButton, styled, TextField, Typography} from "@mui/material";
import {updateNotes} from "../../utils/localStorageManager";

const StyledNotes = styled("div")`
  * {
    display: inline;
  }
  margin: 5px 20px;
`;

const Notes: React.FC<{notes: string; id: string}> = ({notes, id}) => {
  const [isEditing, setIsEditing] = useState(false);
  const originalText = useRef(notes);
  const [text, setText] = useState(notes);
  const ref = useRef<HTMLInputElement>(null);
  const handleEditClick = () => {
    setIsEditing(true);
    ref.current?.focus();
  };

  const handleSave = (event: MouseEvent<HTMLButtonElement>) => {
    const {name} = event.currentTarget;
    const vettedText = name === "delete" ? "" : text;

    updateNotes(id, vettedText);
    setText(vettedText);
    setIsEditing(false);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleBlur = () => {
    setText(originalText.current);
    setIsEditing(false);
  };

  return (
    <StyledNotes>
      {!text && !isEditing ? (
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
        <IconButton data-testid="edit" onClick={handleEditClick}>
          <BorderColorIcon />
        </IconButton>
      )}
    </StyledNotes>
  );
};

export default Notes;
