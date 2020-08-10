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
  },
});

const ToolDrawer = ({ open }) => {
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
      Drawer content
    </Drawer>
  );
};

export default ToolDrawer;
