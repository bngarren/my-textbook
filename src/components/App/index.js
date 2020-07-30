import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Navigation from "../Navigation";
import * as ROUTES from "../../constants/routes";

import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";

import HomePage from "../HomePage";
import NotesPage from "../NotesPage";
import ViewNotePage from "../ViewNote";
import SignInPage from "../SignInPage";
import SignOutPage from "../SignOutPage";
import SetsPage from "../SetsPage";

import { userContext, useAuth } from "../../hooks/useSession";

const useStyles = makeStyles({
  root: {},
});

const App = () => {
  const classes = useStyles();

  /* We want to match to the note/id 
  See https://reactrouter.com/web/example/url-params */
  const notePath = `${ROUTES.NOTE}/:id`;

  const { status, userSession, userInDb } = useAuth();
  const userContextValue = {
    status: status,
    userSession: userSession,
    userInDb: userInDb,
  };

  return (
    <Router>
      <userContext.Provider value={userContextValue}>
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
      </userContext.Provider>
    </Router>
  );
};

export default App;
