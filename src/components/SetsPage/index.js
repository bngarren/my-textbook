import React, { useState, useEffect, useRef } from "react";

import Loading from "../Loading";
import {
  useUserDb,
  useUserSessionStatus,
  USER_SESSION_STATUS,
} from "../../hooks/useSession";

import EnumState from "../EnumState";

import SetsView from "./SetsView";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import NeedToLogin from "../NeedToLogin";

const useStyles = makeStyles({
  setsPageRoot: {
    display: "flex",
    justifyContent: "center",
    paddingTop: "30px",
  },
});

const SetsPage = () => {
  const classes = useStyles();
  const { userDb: user } = useUserDb(); // get our user info
  const userSessionStatus = useUserSessionStatus();

  // TODO: need UI feedback when completed
  const onNewSetAdded = (res) => {
    // Do something when user adds a new set
  };

  const userReadyRender = () => {
    return (
      <>
        <SetsView user={user} />
      </>
    );
  };

  return (
    <div className={classes.setsPageRoot}>
      <EnumState
        currentStatus={userSessionStatus}
        forStatus={USER_SESSION_STATUS.ANON}
      >
        <NeedToLogin />
      </EnumState>
      <EnumState
        currentStatus={userSessionStatus}
        forStatus={USER_SESSION_STATUS.USER_LOADING}
      >
        {/* <Loading type="smallGrey" /> */}
      </EnumState>
      <EnumState
        currentStatus={userSessionStatus}
        forStatus={USER_SESSION_STATUS.USER_READY}
      >
        {userReadyRender()}
      </EnumState>
    </div>
  );
};

export default SetsPage;
