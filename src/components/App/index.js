import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Navigation from "../Navigation";
import * as ROUTES from "../../constants/routes";

import Container from "@material-ui/core/Container";
import Backdrop from "@material-ui/core/Backdrop";
import { makeStyles } from "@material-ui/core/styles";

import Loading from "../Loading";

import HomePage from "../HomePage";
import NotesPage from "../NotesPage";
import ViewNotePage from "../ViewNote";
import SignInPage from "../SignInPage";
import SignOutPage from "../SignOutPage";
import SetsPage from "../SetsPage";

import {
  UserSessionContext,
  useOnAuthStateChanged,
} from "../../hooks/useSession";

import UserClientContext from "../../hooks/useUserClient";

const useStyles = makeStyles({
  root: {},
  backdrop: {
    backgroundColor: "rgba(232, 232, 232, 0.2)",
  },
});

const App = () => {
  const classes = useStyles();

  /* We want to match to the note/id 
  See https://reactrouter.com/web/example/url-params */
  const notePath = `${ROUTES.NOTE}/:id`;

  const {
    initializing,
    userSession,
    loadingUser,
    userDb,
    userSessionStatus,
  } = useOnAuthStateChanged();

  const userSessionValue = {
    initializing: initializing,
    userSession: userSession,
  };
  const userDbValue = {
    loadingUser: loadingUser,
    userDb: userDb,
  };

  if (initializing) {
    return (
      <Backdrop open={initializing} className={classes.backdrop}>
        <Loading />
      </Backdrop>
    );
  } else {
    return (
      <Router>
        <UserSessionContext
          userSessionValue={userSessionValue}
          userDbValue={userDbValue}
          userSessionStatusValue={userSessionStatus}
        >
          <UserClientContext>
            <Navigation />
            <Container className={classes.root}>
              <Switch>
                <Route exact path={ROUTES.HOME} component={HomePage} />
                <Route path={ROUTES.SETS_PAGE} component={SetsPage} />
                <Route path={ROUTES.NOTES_PAGE} component={NotesPage} />
                <Route path={notePath} component={ViewNotePage} />
                <Route path={ROUTES.SIGNIN_PAGE} component={SignInPage} />
                <Route path={ROUTES.SIGNOUT_PAGE} component={SignOutPage} />
              </Switch>
            </Container>
          </UserClientContext>
        </UserSessionContext>
      </Router>
    );
  }
};

export default App;
