import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import Repeat from "@material-ui/icons/Repeat";

const useStyles = makeStyles({
  root: {
    /*     background:
        "linear-gradient(45deg, rgba(71,145,219,1) 0%, rgba(25,118,210,1) 100%)", */
    border: 0,
    borderRadius: 3,
    boxShadow: "0 1px 2px 1px rgba(2, 2, 2, 0.1)",
    color: "#03a9f4",
    background: "white",
    height: 48,
    padding: "0 20px",
  },
  disabled: {
    background: "#fbfbfb",
    color: "rgb(185, 177, 177)",
  },
});

export default function FlipButton(props) {
  const classes = useStyles();
  return (
    <Button
      className={classes.root}
      startIcon={<Repeat />}
      disabled={!props.isEnabled}
      onClick={props.onClick}
      classes={{
        disabled: classes.disabled,
      }}
    >
      Flip
    </Button>
  );
}
