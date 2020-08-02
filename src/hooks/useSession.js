import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  currentUser,
  onSnapshotUserById,
  doSignOut,
  onAuthStateChanged,
} from "../components/Firebase";

export const USER_SESSION_STATUS = Object.freeze({
  ANON: "ANON",
  USER_LOADING: "USER_LOADING",
  USER_READY: "USER_READY",
});

/* 
See https://benmcmahen.com/using-firebase-with-react-hooks/
*/

/* This context holds the data for the user session (Firebase authentication)
and the specific user data from the Firestore database collection "/users'" 

So if session data or user data is needed anywhere in the app, this context can
be consumed */
/* const userContext = createContext({
  status: null,
  userSession: null,
  userInDB: null,
});
 */

const userSessionContext = createContext({
  initiliazing: null,
  userSession: null,
});
const userDbContext = createContext({
  loadingUser: null,
  userDb: null,
});
const userSessionStatusContext = createContext(USER_SESSION_STATUS.ANON);

export const UserSessionContext = ({
  userSessionValue,
  userDbValue,
  userSessionStatusValue,
  children,
}) => {
  return (
    <userSessionContext.Provider value={userSessionValue}>
      <userDbContext.Provider value={userDbValue}>
        <userSessionStatusContext.Provider value={userSessionStatusValue}>
          {children}
        </userSessionStatusContext.Provider>
      </userDbContext.Provider>
    </userSessionContext.Provider>
  );
};

/* --- The following are 2 hooks used to get specific info from the userContext --- */

export const useUserSession = () => {
  const { initializing, userSession } = useContext(userSessionContext);
  return { initializing, userSession };
};

export const useUserDb = () => {
  const { loadingUser, userDb } = useContext(userDbContext);
  return { loadingUser, userDb };
};

export const useUserSessionStatus = () => {
  const userSessionStatus = useContext(userSessionStatusContext);
  return userSessionStatus;
};

/* This hook will update its state each time its listener receives an
onAuthStateChanged event from Firebase authentication, i.e. user logged in/out, etc.
Its state is what's used to provide the up to date information for the userContext */
export const useOnAuthStateChanged = () => {
  const [sessionState, setSessionState] = useState(currentUser);
  const [userState, setUserState] = useState(null);

  const [initializing, setInitializing] = useState(!sessionState);
  const [loadingUser, setLoadingUser] = useState(null);

  console.debug(
    `useSession.js: useAuth, initializing = ${initializing}, loadingUser = ${loadingUser}`
  );

  /* Listener for our onSnapshot query.
  Must store it in a ref so that it can be unsubcribed on unmount
  Default: empty function */
  const userObserverRef = useRef(null);

  const onChange = useCallback((user) => {
    if (user) {
      setSessionState(user);
      setInitializing(false);
      console.log(
        `useSession.js: onChange, USER SESSION EXISTS (${user.uid} LOGGED IN) initializing = false`
      );
      try {
        setLoadingUser(true);
        console.debug(
          "useSession.js: onChange, Attempting to load User. loadingUser = true"
        );
        userObserverRef.current = onSnapshotUserById(user.uid, (snapshot) => {
          if (snapshot.empty) {
            throw new Error(
              "useSession.js: onChange, couldn't find authenticated user in the 'users' firestore db"
            );
          }
          setUserState(snapshot.data());
          setLoadingUser(false);
          console.debug(
            "useSession.js: getUser has completed, loadingUser = false"
          );
          console.log(snapshot.data());
        });
      } catch (e) {
        console.error(e.message);

        // NEED TO LOG THE USER OUT BECAUSE WE CANT CONTINUE WITH THESE ERRORS
        doSignOut();
      }
    } else {
      setInitializing(false);
      setSessionState(null);
      console.log(
        "useSession.js: onChange, NO USER SESSION (LOGGED OUT). initializing = false"
      );
    }
  }, []);

  useEffect(() => {
    // listen for auth state changes
    const unsubscribe = onAuthStateChanged(onChange);

    console.debug(
      "useSession.js: useEffect -- subscribed to onAuthStateChanged"
    );
    //unsubscribe to the listener when unmounting
    return () => {
      unsubscribe();
    };
  }, [onChange]);

  useEffect(() => {
    //unsubscribe to the listener when unmounting
    return () => {
      if (userObserverRef.current !== null) {
        return userObserverRef.current();
      } else {
        return null;
      }
    };
  }, []);

  const getUserSessionStatus = () => {
    if (!initializing) {
      if (!sessionState) {
        return USER_SESSION_STATUS.ANON;
      }

      if (!userState) {
        return USER_SESSION_STATUS.USER_LOADING;
      } else {
        return USER_SESSION_STATUS.USER_READY;
      }
    } else {
      return USER_SESSION_STATUS.ANON;
    }
  };

  return {
    initializing: initializing,
    userSession: sessionState,
    loadingUser: loadingUser,
    userDb: userState,
    userSessionStatus: getUserSessionStatus(),
  };
};

export default useUserSession;
