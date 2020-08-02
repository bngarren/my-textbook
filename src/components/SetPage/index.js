import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import Loading from "../Loading";
import {
  useUserDb,
  useUserSessionStatus,
  USER_SESSION_STATUS,
} from "../../hooks/useSession";

import { useUserClient } from "../../hooks/useUserClient";

import NotesView from "./NotesView";
import EnumState from "../EnumState";

import Typography from "@material-ui/core/Typography";

const SetPage = () => {
  const { userDb: user } = useUserDb(); // get our user info
  const userSessionStatus = useUserSessionStatus();
  const { id: setId } = useParams(); // get the setId from the last part of the URL

  const [userClient, userClientDispatch] = useUserClient(); // tracks which set is "active"

  const userReadyRender = () => {
    return (
      <>
        <Typography variant="h6">
          {userClient.activeSet && userClient.activeSet.title}
        </Typography>
        <NotesView setId={setId} user={user} />
      </>
    );
  };

  return (
    <div>
      <EnumState
        currentStatus={userSessionStatus}
        forStatus={USER_SESSION_STATUS.ANON}
      >
        Need to log in
      </EnumState>
      <EnumState
        currentStatus={userSessionStatus}
        forStatus={USER_SESSION_STATUS.USER_LOADING}
      >
        <Loading />
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

export default SetPage;
