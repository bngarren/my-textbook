import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import Loading from "../Loading";
import {
  useUserDb,
  useUserSessionStatus,
  USER_SESSION_STATUS,
} from "../../hooks/useSession";

import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

import { useUserClient } from "../../hooks/useUserClient";

import NotesView from "./NotesView";
import DeckView from "../DeckView";
import EnumState from "../EnumState";

import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  root: {
    paddingTop: "30px",
  },
  gridContainerRoot: {
    //border: "1px solid grey",
    justifyContent: "center",
  },
  gridItemNotesView: {
    //background: "rgba(157, 235, 218, 0.3)",
  },
  gridItemDeckView: {
    //background: "rgba(235, 218, 157, 0.1)",
  },
  sectionHeading: {
    fontVariantCaps: "all-small-caps",
    borderBottom: "3px solid black",
  },
});

const SetPage = () => {
  const classes = useStyles();
  const { userDb: user } = useUserDb(); // get our user info
  const userSessionStatus = useUserSessionStatus();
  const { id: setId } = useParams(); // get the setId from the last part of the URL

  const [userClient, userClientDispatch] = useUserClient(); // tracks which set is "active"

  const userReadyRender = () => {
    /* NotesView and DeckView should each handle displaying their own Loading component*/

    return (
      <div className={classes.root}>
        <Typography variant="h4">
          {userClient.activeSet && userClient.activeSet.title}
        </Typography>
        <br />
        <Grid container className={classes.gridContainerRoot} spacing={2}>
          <Grid item className={classes.gridItemNotesView} lg={4} xs={12}>
            <Typography variant="h5" className={classes.sectionHeading}>
              Notes
            </Typography>
            <NotesView setId={setId} user={user} />
          </Grid>
          <Grid item className={classes.gridItemDeckView} lg xs>
            <Typography variant="h5" className={classes.sectionHeading}>
              Deck
            </Typography>
            <DeckView setId={setId} />
          </Grid>
        </Grid>
      </div>
    );
  };

  return (
    <Container>
      <EnumState
        currentStatus={userSessionStatus}
        forStatus={USER_SESSION_STATUS.ANON}
      >
        Need to log in
      </EnumState>
      <EnumState
        currentStatus={userSessionStatus}
        forStatus={USER_SESSION_STATUS.USER_LOADING}
      ></EnumState>
      <EnumState
        currentStatus={userSessionStatus}
        forStatus={USER_SESSION_STATUS.USER_READY}
      >
        {userReadyRender()}
      </EnumState>
    </Container>
  );
};

export default SetPage;
