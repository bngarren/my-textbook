import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles({
  root: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
});

const Loading = () => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <CircularProgress color="primary" />
    </Box>
  );
};

export default Loading;
