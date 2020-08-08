import React, { useState, useEffect } from "react";

import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";
import InfoOutlined from "@material-ui/icons/InfoOutlined";

import Workspace, { WORKSPACES } from "../Workspace";
import {
  useNoteAndCards,
  NOTE_AND_CARDS_ACTION,
} from "../../../hooks/useNoteAndCards";

const useStyles = makeStyles({
  rootToolbar: {
    justifyContent: "center",
  },
  buttonSelected: {
    borderBottom: "3px solid #1c1c1c",
  },
});

const ViewNoteToolbar = ({ currentTextSelected }) => {
  const [currentWorkspace, setCurrentWorkspace] = useState(
    WORKSPACES.EDITNOTE_WORKSPACE
  );
  const [noteAndCardsState, dispatchNoteAndCards] = useNoteAndCards();

  useEffect(() => {
    const noteShouldBeEditable = (bool) => {
      dispatchNoteAndCards({
        type: NOTE_AND_CARDS_ACTION.UPDATE_NOTE_IS_EDITABLE,
        payload: bool,
      });
    };
    if (currentWorkspace === WORKSPACES.EDITNOTE_WORKSPACE) {
      noteShouldBeEditable(true);
    } else {
      noteShouldBeEditable(false);
    }
  }, [currentWorkspace]);

  const onToolClicked = (e) => {
    if (currentWorkspace === e.currentTarget.name) {
      setCurrentWorkspace(null);
    } else {
      setCurrentWorkspace(e.currentTarget.name);
    }
    e.preventDefault();
  };

  const classes = useStyles();

  return (
    <>
      <Toolbar className={classes.rootToolbar} disableGutters={true}>
        <Button
          name={WORKSPACES.EDITNOTE_WORKSPACE}
          onClick={onToolClicked}
          className={
            currentWorkspace === WORKSPACES.EDITNOTE_WORKSPACE
              ? classes.buttonSelected
              : null
          }
        >
          Edit Note
        </Button>

        <Button
          name={WORKSPACES.DEFINITION_WORKSPACE}
          onClick={onToolClicked}
          className={
            currentWorkspace === WORKSPACES.DEFINITION_WORKSPACE
              ? classes.buttonSelected
              : null
          }
        >
          Definition
        </Button>
        <Button>Fill blank</Button>
        <Button>List</Button>
        <Button
          name={WORKSPACES.INFO_WORKSPACE}
          onClick={onToolClicked}
          className={
            currentWorkspace === WORKSPACES.INFO_WORKSPACE
              ? classes.buttonSelected
              : null
          }
        >
          <InfoOutlined />
        </Button>
      </Toolbar>
      <Workspace
        currentTextSelected={currentTextSelected}
        currentWorkspace={currentWorkspace}
      ></Workspace>
    </>
  );
};

export default ViewNoteToolbar;
