import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import SaveIcon from "@material-ui/icons/Save";

const useStyles = makeStyles({
  root: {
    /*     background:
      "linear-gradient(45deg, rgba(71,145,219,1) 0%, rgba(25,118,210,1) 100%)", */
    border: 0,
    borderRadius: 3,
    boxShadow: "0 2px 4px 1px rgba(2, 2, 2, 0.1)",
    color: "green",
    height: 48,
    padding: "0 30px",
  },
});

export default function SaveButton(props) {
  const classes = useStyles();
  return (
    <Button
      className={classes.root}
      startIcon={<SaveIcon />}
      disabled={!props.isEnabled}
    >
      Save
    </Button>
  );
}
