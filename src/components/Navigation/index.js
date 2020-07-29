import React from "react";
import { Link } from "react-router-dom";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";

import * as ROUTES from "../../constants/routes";

const Navigation = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Link to={ROUTES.HOME}>
          <Button>HOME</Button>
        </Link>
        <Link to={ROUTES.NOTES_LIST}>
          <Button>NOTES</Button>
        </Link>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
