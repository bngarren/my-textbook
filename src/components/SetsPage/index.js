import React, { useState, useEffect } from "react";

import Loading from "../Loading";
import {
  useUserInDb,
  useSession,
  SESSION_STATUS,
} from "../../hooks/useSession";

import EnumState from "../EnumState";

import AddSetForm from "./AddSet";
import SetsView from "./SetsView";

import Typography from "@material-ui/core/Typography";

const SetsPage = () => {
  const userInDb = useUserInDb();
  const [user, setUser] = useState(userInDb && userInDb);
  const sessionState = useSession();

  useEffect(() => {
    if (userInDb) {
      userInDb && setUser(userInDb);
      //console.log(`SetsPage useEffect to setUser passing => ${userInDb}`);
    }
  }, [userInDb]);

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
        currentStatus={sessionState.status}
        forStatus={SESSION_STATUS.ANON}
      >
        Need to log in
      </EnumState>
      <EnumState
        currentStatus={sessionState.status}
        forStatus={SESSION_STATUS.INITIALIZING}
      >
        <Loading />
      </EnumState>
      <EnumState
        currentStatus={sessionState.status}
        forStatus={SESSION_STATUS.USER_READY}
      >
        {userReadyRender()}
      </EnumState>
    </div>
  );
};

export default SetsPage;
