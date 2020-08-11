import React from "react";

import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import CloudDoneIcon from "@material-ui/icons/CloudDone";

import {
  useNoteAndCards,
  NOTE_AND_CARDS_ACTION,
} from "../../../../hooks/useNoteAndCards";

const useStyles = makeStyles({
  root: {
    minHeight: "25px",
  },
  syncStatus: {
    display: "flex",
  },
});

/*
 ****** NOT CURRENTLY IMPLEMENTED SINCE COMMIT 491ace87452624dce7b73e653acc20e5e5738bbe *******
 */

const EditNoteWorkspace = () => {
  const classes = useStyles();
  const [noteAndCardsState, dispatchNoteAndCards] = useNoteAndCards();

  const getTimeSinceLastSaved = () => {
    const lastSaved = noteAndCardsState.lastSaved.toDate();
    const now = new Date();
    const diff = new Date(now - lastSaved);

    const secs = diff / 1000.0;
    const mins = secs / 60.0;
    const hrs = mins / 60.0;
    const days = hrs / 24.0;

    if (days >= 1) {
      return lastSaved.toLocaleDateString();
    } else if (hrs >= 1) {
      const suffix = hrs < 2 ? "" : "s";
      return `${Math.floor(hrs)} hour${suffix} ago`;
    } else if (mins >= 1) {
      const suffix = mins < 2 ? "" : "s";
      return `${Math.floor(mins)} minute${suffix} ago`;
    } else {
      return `1 minute ago`;
    }
  };

  const handleOnSave = () => {
    dispatchNoteAndCards({
      type: NOTE_AND_CARDS_ACTION.SAVE_NOTE,
      payload: { content: noteAndCardsState.noteOnClient },
    });
  };

  return (
    <Container className={classes.root}>
      <div className={classes.syncStatus}>
        {noteAndCardsState.noteIsSynced && <CloudDoneIcon />}
        <Typography>Last saved: {getTimeSinceLastSaved()}</Typography>
      </div>

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
