import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Navigation from "../Navigation";
import * as ROUTES from "../../constants/routes";

import HomePage from "../HomePage";
import NotesPage from "../NotesPage";
import ViewNotePage from "../ViewNote";
import SignInPage from "../SignInPage";

import { userContext, useAuth } from "../../hooks/useSession";

const App = () => {
  /* We want to match to the note/id 
  See https://reactrouter.com/web/example/url-params */
  const notePath = `${ROUTES.NOTE}/:id`;

  const { initializing, user } = useAuth();

  return (
    <Router>
      <userContext.Provider value={{ user }}>
        <Navigation />
        <div>
          <Switch>
            <Route exact path={ROUTES.HOME} component={HomePage} />
            <Route path={ROUTES.NOTES_PAGE} component={NotesPage} />
            <Route path={notePath} component={ViewNotePage} />
            <Route path={ROUTES.SIGNIN_PAGE} component={SignInPage} />
          </Switch>
        </div>
      </userContext.Provider>
    </Router>
  );
};

export default App;
