import React from "react";

import clsx from "clsx";

import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import Fade from "@material-ui/core/Fade";

const useStyles = makeStyles({
  root: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  relative: {
    position: "relative",
    transform: "translate(45%, 50%)",
    height: "50%",
  },
  smallGrey: {
    color: "grey",
  },
});

const Loading = ({ type, relative = false, delay = true }) => {
  const classes = useStyles();

  const rootClasses = clsx(
    {
      [classes.relative]: relative,
    },
    { [classes.root]: !relative }
  );

  const progressClasses = clsx({
    [classes.smallGrey]: type === "smallGrey",
  });

  const size = type === "smallGrey" ? 40 : 50;

  return (
    <Fade
      in
      unmountOnExit
      style={{
        transitionDelay: delay ? "300ms" : "0ms",
      }}
    >
      <Box className={rootClasses}>
        <CircularProgress
          color="primary"
          size={size}
          className={progressClasses}
          disableShrink
          thickness={4}
        />
      </Box>
    </Fade>
  );
};

export default Loading;
