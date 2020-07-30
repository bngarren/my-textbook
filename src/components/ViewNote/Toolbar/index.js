import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";
import InfoOutlined from "@material-ui/icons/InfoOutlined";

import Workspace, { WORKSPACES } from "../Workspace";

const useStyles = makeStyles({
  rootToolbar: {
    justifyContent: "center",
  },
  buttonSelected: {
    borderBottom: "3px solid #1c1c1c",
  },
});

const ViewNoteToolbar = (props) => {
  const [currentWorkspace, setCurrentWorkspace] = useState(
    WORKSPACES.INFO_WORKSPACE
  );

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
      </Toolbar>
      <Workspace
        currentTextSelected={props.currentTextSelected}
        currentWorkspace={currentWorkspace}
      ></Workspace>
    </>
  );
};

export default ViewNoteToolbar;
