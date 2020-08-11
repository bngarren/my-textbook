import React, { useState } from "react";

import Hidden from "@material-ui/core/Hidden";
import Drawer from "@material-ui/core/Drawer";
import { makeStyles } from "@material-ui/core/styles";

const drawerWidth = 450;

const useStyles = makeStyles({
  drawer: {
    flexShrink: 0,
  },
  drawerPaper: {
    top: "15vh",
    width: drawerWidth,
    padding: "0 10px 0 2px",
    borderLeft: "none",
    borderTop: "5px solid #ff5722",
  },
});

const ToolDrawer = ({ open, children }) => {
  const classes = useStyles();

  return (
    <Drawer
      className={classes.drawer}
      classes={{
        paper: classes.drawerPaper,
      }}
      variant="persistent"
      anchor="right"
      open={open}
    >
      {children}
    </Drawer>
  );
};

export default ToolDrawer;
