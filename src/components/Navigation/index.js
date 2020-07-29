import React from "react";
import { Link } from "react-router-dom";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import FreeBreakfast from "@material-ui/icons/FreeBreakfast";
import Typography from "@material-ui/core/Typography";

import SignOutButton from "../SignOut";
import * as ROUTES from "../../constants/routes";

import { useSession, useUserInDb } from "../../hooks/useSession";

const useStyles = makeStyles({
  appBarRoot: {
    backgroundColor: "transparent",
  },
});

const Navigation = () => {
  const classes = useStyles();

  /* Get the user session data (i.e. from Firebase authentication)*/
  const userSession = useSession();
  /* Get the user database data (i.e. from Firestore collection 'users')*/
  const user = useUserInDb();

  return (
    <AppBar className={classes.appBarRoot} position="static">
      <Toolbar>
        <Link to={ROUTES.HOME}>
          <Button>
            <FreeBreakfast></FreeBreakfast>
          </Button>
        </Link>
        <Link to={ROUTES.SETS_PAGE}>
          <Button>SETS</Button>
        </Link>
        <Link to={ROUTES.NOTES_PAGE}>
          <Button>NOTES</Button>
        </Link>
        {userSession && <SignOutButton />}
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
