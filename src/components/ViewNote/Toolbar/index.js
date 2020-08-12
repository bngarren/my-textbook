import React, { useState, useEffect } from "react";

import clsx from "clsx";

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
    justifyContent: "flex-start",
    borderRadius: "4px",
    marginBottom: "30px",
  },
  buttonTool: {
    border: "1px solid grey",
    marginRight: "3px",
  },
  buttonInfo: {},
  buttonSelected: {
    borderBottom: "3px solid #1c1c1c",
  },
});

/*
The ViewNoteToolbar component manages the toolbar buttons and also keeps state on which workspace (i.e. tool) is currently selected

As it stands now, the Workspace component is a child of ViewNoteToolbar
*/
const ViewNoteToolbar = ({ currentTextSelected }) => {
  const [currentWorkspace, setCurrentWorkspace] = useState(
    WORKSPACES.DEFINITION_WORKSPACE
  );
  const [noteAndCardsState, dispatchNoteAndCards] = useNoteAndCards();

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
          name={WORKSPACES.DEFINITION_WORKSPACE}
          onClick={onToolClicked}
          className={clsx(classes.buttonTool, {
            [classes.buttonSelected]:
              currentWorkspace === WORKSPACES.DEFINITION_WORKSPACE,
          })}
        >
          Definition
        </Button>
        <Button
          className={clsx(classes.buttonTool, {
            [classes.buttonSelected]:
              currentWorkspace === WORKSPACES.FILLBLANK_WORKSPACE,
          })}
        >
          Fill blank
        </Button>
        <Button
          name={WORKSPACES.INFO_WORKSPACE}
          onClick={onToolClicked}
          className={clsx(classes.buttonInfo, {
            [classes.buttonSelected]:
              currentWorkspace === WORKSPACES.INFO_WORKSPACE,
          })}
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
