import React from "react";
import { Link } from "react-router-dom";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import FreeBreakfast from "@material-ui/icons/FreeBreakfast";

import * as ROUTES from "../../constants/routes";

const useStyles = makeStyles({
  appBarRoot: {
    backgroundColor: "transparent",
  },
});

const Navigation = () => {
  const classes = useStyles();

  return (
    <AppBar className={classes.appBarRoot} position="static">
      <Toolbar>
        <Link to={ROUTES.HOME}>
          <Button>
            <FreeBreakfast></FreeBreakfast>
          </Button>
        </Link>
        <Link to={ROUTES.NOTES_LIST}>
          <Button>NOTES</Button>
        </Link>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
