import React, { useState } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import FreeBreakfast from "@material-ui/icons/FreeBreakfast";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import { useFirebase } from "../Firebase";

import * as ROUTES from "../../constants/routes";

import { useSession, useUserInDb } from "../../hooks/useSession";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  appBarRoot: {
    backgroundColor: "transparent",
  },
  rightContent: {
    display: "flex",
    marginLeft: "auto",
  },
  usernameText: {
    color: "black",
    alignSelf: "center",
  },
});

const Navigation = () => {
  const classes = useStyles();

  /* Get the user session data (i.e. from Firebase authentication)*/
  const sessionState = useSession();
  /* Get the user database data (i.e. from Firestore collection 'users')*/
  const user = useUserInDb();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const firebase = useFirebase();

  const location = useLocation();
  const history = useHistory();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = (event) => {
    setAnchorEl(null);
  };

  const onSignOutClick = (event) => {
    firebase.doSignOut();
    handleCloseMenu(event);
    history.push(ROUTES.SIGNOUT_PAGE);
  };

  return (
    <div className={classes.root}>
      <AppBar className={classes.appBarRoot} position="static">
        <Toolbar>
          <Link to={ROUTES.HOME}>
            <Button>
              <FreeBreakfast></FreeBreakfast>
            </Button>
          </Link>
          <Divider orientation="vertical" variant="middle" flexItem />>
          <Link to={ROUTES.SETS_PAGE}>
            <Button>SETS</Button>
          </Link>
          <Link to={ROUTES.NOTES_PAGE}>
            <Button>NOTES</Button>
          </Link>
          <Divider orientation="vertical" variant="middle" flexItem />
          {sessionState.userSession ? (
            <div className={classes.rightContent}>
              <IconButton onClick={handleMenu} label="test">
                <AccountCircle />
              </IconButton>
              {user && (
                <Typography variant="body1" className={classes.usernameText}>
                  {user.username}
                </Typography>
              )}

              <Menu
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={open}
                onClose={handleCloseMenu}
              >
                <MenuItem onClick={handleCloseMenu}>Profile</MenuItem>
                <Divider orientation="horizontal" />
                <MenuItem onClick={onSignOutClick}>Sign Out</MenuItem>
              </Menu>
            </div>
          ) : (
            location.pathname !== ROUTES.SIGNIN_PAGE && (
              <div className={classes.rightContent}>
                <Link to={ROUTES.SIGNIN_PAGE}>
                  <Button>Log in</Button>
                </Link>
              </div>
            )
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navigation;
