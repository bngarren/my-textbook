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
  const userInDb = useUserInDb();
  const [user, setUser] = useState(userInDb && userInDb);
  const sessionState = useSession();

  useEffect(() => {
    if (userInDb) {
      userInDb && setUser(userInDb);
      //console.log(`SetsPage useEffect to setUser passing => ${userInDb}`);
    }
  }, [userInDb]);

  const switchEnum = (status) => {
    switch (status) {
      case SESSION_STATUS.ANON:
        return <>Need to log in.</>;
      case SESSION_STATUS.INITIALIZING:
        return <Loading />;
      case SESSION_STATUS.USER_READY:
        return user ? userReadyRender() : <Loading />;
      default:
        return <>Incorrect enum</>;
    }
  };

  const userReadyRender = () => {
    return (
      <>
        <Typography variant="h3">Sets</Typography>
        <SetsList user={user} />
      </>
    );
  };

  return <div>{switchEnum(sessionState.status)}</div>;
};

const SetsList = ({ user }) => {
  const [setIds, setSetIds] = useState(user && user.set_ids);
  const [sets, setSets] = useState(null);
  const firebase = useFirebase();

  useEffect(() => {
    if (user) {
      setSetIds(user.set_ids);
    }
  }, [user]);

  useEffect(() => {
    if (!firebase) {
      console.log("cant find firebase");
      return;
    }
    const getSets = async () => {
      const refs = await firebase.refsFromSetIds(setIds);
      const docs = await firebase.setsFromRefs(refs).get();
      let setsArray = [];
      docs.forEach((doc) => {
        setsArray.push({ ...doc.data(), id: doc.id });
      });
      setSets(setsArray);
    };

    getSets();
  }, [firebase, setIds]);

  if (sets) {
    return (
      <ul>
        {sets.map((set) => (
          <li key={set.id}>{set.title}</li>
        ))}{" "}
      </ul>
    );
  } else {
    return "Loading user's sets";
  }
};

export default SetsPage;
