import React, { useState } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import FreeBreakfast from "@material-ui/icons/FreeBreakfast";
import Divider from "@material-ui/core/Divider";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import { doSignOut } from "../Firebase";

import * as ROUTES from "../../constants/routes";

import { useUserSession, useUserDb } from "../../hooks/useSession";
import { useUserClient } from "../../hooks/useUserClient";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  appBarRoot: {
    backgroundColor: "transparent",
  },
  logo: {
    minWidth: "0",
  },
  rightContent: {
    display: "flex",
    marginLeft: "auto",
  },
  doubleArrow: {
    fontSize: "small",
    color: "green",
  },
  usernameText: {
    color: "black",
    alignSelf: "center",
  },
});

const Navigation = () => {
  const classes = useStyles();

  /* Get the user session data (i.e. from Firebase authentication)*/
  const { userSession } = useUserSession();
  /* Get the user database data (i.e. from Firestore collection 'users')*/
  const { userDb: user } = useUserDb();

  /* Get the user data that isn't database stored, i.e. specific to the local app 
  Note that this hook uses a reducer so that it can be updated through certain actions */
  const [userClient, dispatchUserClient] = useUserClient();

  const location = useLocation();
  const history = useHistory();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = (event) => {
    setAnchorEl(null);
  };

  const onSignOutClick = (event) => {
    doSignOut();
    handleCloseMenu(event);
    history.push(ROUTES.SIGNOUT_PAGE);
  };

  return (
    <div className={classes.root}>
      <AppBar className={classes.appBarRoot} position="static">
        <Container>
          <Toolbar>
            <Link to={ROUTES.HOME}>
              <Button className={classes.logo}>
                <FreeBreakfast></FreeBreakfast>
              </Button>
            </Link>
            <Divider orientation="vertical" variant="middle" flexItem />
            <Link to={ROUTES.SETS_PAGE}>
              <Button>SETS</Button>
            </Link>

            {userClient.activeSet.setId !== null && (
              <>
                <DoubleArrowIcon className={classes.doubleArrow} />
                <Button>{userClient.activeSet.title}</Button>
              </>
            )}
            <Divider orientation="vertical" variant="middle" flexItem />
            {userSession ? (
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
        </Container>
      </AppBar>
    </div>
  );
};

export default Navigation;
