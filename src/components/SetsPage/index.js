import React, { useState, useEffect } from "react";

import Loading from "../Loading";
import {
  useUserDb,
  useUserSessionStatus,
  USER_SESSION_STATUS,
} from "../../hooks/useSession";

import EnumState from "../EnumState";

import AddSetForm from "./AddSet";
import SetsView from "./SetsView";

import Typography from "@material-ui/core/Typography";

const SetsPage = () => {
  const { userDb } = useUserDb();
  const [user, setUser] = useState(userDb && userDb);
  const userSessionStatus = useUserSessionStatus();

  useEffect(() => {
    if (userDb) {
      userDb && setUser(userDb);
      //console.log(`SetsPage useEffect to setUser passing => ${userInDb}`);
    }
  }, [userDb]);

  const onNewSetAdded = (res) => {
    // Do something when user adds a new set
  };

  const userReadyRender = () => {
    return (
      <>
        <Typography variant="h3">Sets</Typography>
        <AddSetForm user={user} onNewSetAdded={onNewSetAdded} />
        <SetsView user={user} />
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

export default SetsPage;
