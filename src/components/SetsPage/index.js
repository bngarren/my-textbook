import React, { useState, useEffect, useCallback } from "react";

import { useFirebase } from "../Firebase";
import { useUserInDb, useSession } from "../../hooks/useSession";

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

  if (!sessionState.initializing && sessionState.userSession === null) {
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
      return <div>Loading user data...</div>;
    }
  } else {
    // Put loading indicator here
    return <div>Initializing</div>;
  }
};

export default SetsPage;
