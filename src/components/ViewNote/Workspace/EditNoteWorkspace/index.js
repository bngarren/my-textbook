import React from "react";

import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import {
  useNoteAndCards,
  NOTE_AND_CARDS_ACTION,
} from "../../../../hooks/useNoteAndCards";

const useStyles = makeStyles({
  root: {
    minHeight: "25px",
  },
});

const EditNoteWorkspace = () => {
  const classes = useStyles();
  const [noteAndCardsState, dispatchNoteAndCards] = useNoteAndCards();

  const getLastSavedTime = () => {
    const date = noteAndCardsState.lastSaved.toDate();
    return `${date.toLocaleString()}`;
  };

  const handleOnSave = () => {
    dispatchNoteAndCards({
      type: NOTE_AND_CARDS_ACTION.SAVE_NOTE,
      payload: { content: noteAndCardsState.noteOnClient },
    });
  };

  return (
    <Container className={classes.root}>
      <Typography variant="body1">
        <>Last saved {getLastSavedTime()}</>
      </Typography>
      {!noteAndCardsState.noteIsSynced ? (
        <>
          <Button onClick={handleOnSave}>Save</Button>
        </>
      ) : (
        ""
      )}
    </Container>
  );
};

export default EditNoteWorkspace;
