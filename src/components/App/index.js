import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Navigation from "../Navigation";
import * as ROUTES from "../../constants/routes";

import HomePage from "../HomePage";
import NotesPage from "../NotesPage";
import ViewNotePage from "../ViewNote";

const App = () => {
  /* We want to match to the note/id 
  See https://reactrouter.com/web/example/url-params */
  const notePath = `${ROUTES.NOTE}/:id`;

  return (
    <Router>
      <Navigation />
      <div>
        <Switch>
          <Route exact path={ROUTES.HOME} component={HomePage} />
          <Route path={ROUTES.NOTES_PAGE} component={NotesPage} />
          <Route path={notePath} component={ViewNotePage} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
