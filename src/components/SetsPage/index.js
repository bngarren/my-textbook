import React, { useState, useEffect, useCallback } from "react";

import Loading from "../Loading";
import { useFirebase } from "../Firebase";
import {
  useUserInDb,
  useSession,
  SESSION_STATUS,
} from "../../hooks/useSession";

import Typography from "@material-ui/core/Typography";

const SetsPage = () => {
  const [user, setUser] = useState(null);
  const [setIds, setSetIds] = useState(null);
  const sessionState = useSession();
  const userInDb = useUserInDb();

  const firebase = useFirebase();

  useEffect(() => {
    setUser(userInDb);
    console.log("SetsPage useEffect to setUser");
  }, [userInDb]);

  useEffect(() => {
    if (!user) return;

    if (user.set_ids) {
      setSetIds(user.set_ids);
    }
  }, [user]);

  const switchEnum = (status) => {
    switch (status) {
      case SESSION_STATUS.ANON:
        return <>Need to log in.</>;
      case SESSION_STATUS.INITIALIZING:
        return <Loading />;
      case SESSION_STATUS.USER_READY:
        return <>Sets</>;
      default:
        return <>Incorrect enum</>;
    }
  };

  return <div>{switchEnum(sessionState.status)}</div>;
};

export default SetsPage;

/* if (!sessionState.initializing && sessionState.userSession === null) {
  return <div>Log in required.</div>;
}

if (!sessionState.initializing && sessionState.userSession !== null) {
  if (user) {
    return (
      <div>
        <Typography variant="h3">Sets</Typography>
        {console.log("ok")}
      </div>
    );
  } else {
    // Put loading indicator here
    return <Loading />;
  }
} else {
  // Put loading indicator here
  return <Loading />;
} */
