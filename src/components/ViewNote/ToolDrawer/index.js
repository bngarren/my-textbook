import React, { useState } from "react";

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
    padding: "0 15px 0 2px",
    borderLeft: "none",
  },
  toolDrawerContainer: {
    borderTop: "1px solid #f2f2f2",
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
      <div className={classes.toolDrawerContainer}>{children}</div>
    </Drawer>
  );
};

export default ToolDrawer;
