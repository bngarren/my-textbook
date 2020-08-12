import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import SaveIcon from "@material-ui/icons/Save";

const useStyles = makeStyles({
  root: {
    border: 0,
    borderRadius: 3,
    boxShadow: "0 1px 2px 1px rgba(2, 2, 2, 0.1)",
    color: "white",
    background: "#ff5722",
    height: 48,
    padding: "0 20px",
    "&:hover": {
      background: "#ffaa90",
    },
  },
  disabled: {
    background: "#fbfbfb",
    color: "rgb(185, 177, 177)",
  },
});

export default function SaveButton(props) {
  const classes = useStyles();
  return (
    <Button
      className={classes.root}
      startIcon={<SaveIcon />}
      disabled={!props.isEnabled}
      onClick={props.onClick}
      classes={{
        disabled: classes.disabled,
      }}
    >
      Save
    </Button>
  );
}
