import {
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

/* 
See https://benmcmahen.com/using-firebase-with-react-hooks/
*/

/* This context holds the data for the user session (Firebase authentication)
and the specific user data from the Firestore database collection "/users'" 

So if session data or user data is needed anywhere in the app, this context can
be consumed */
export const userContext = createContext({
  status: null,
  userSession: null,
  userInDB: null,
});

/* --- The following are 2 hooks used to get specific info from the userContext --- */

/* Return the userSession object from our userContext
This contains the information from the Authentication part
of Firebase about the user but not our user specific dataase */
export const useSession = () => {
  const { status, userSession } = useContext(userContext);
  return { status, userSession };
};

/* Return the useInDb object from our userContext 
This contains the info about the user from our 'users' collection
in the Firestore database */
export const useUserInDb = () => {
  const { userInDb } = useContext(userContext);
  return userInDb;
};

export const SESSION_STATUS = {
  ANON: 0, //anonymous, i.e. not logged in
  INITIALIZING: 1,
  USER_READY: 2,
};

/* This hook will update its state each time its listener receives an
onAuthStateChanged event from Firebase authentication, i.e. user logged in/out, etc.
Its state is what's used to provide the up to date information for the userContext */
export const useAuth = () => {
  const [sessionState, setSessionState] = useState(currentUser);
  const [userState, setUserState] = useState(null);
  const [status, setStatus] = useState(SESSION_STATUS.INITIALIZING);

  /* Listener for our onSnapshot query.
  Must store it in a ref so that it can be unsubcribed on unmount
  Default: empty function */
  const userObserverRef = useRef(() => () => null);

  const onChange = useCallback((user) => {
    if (user) {
      setStatus(SESSION_STATUS.INITIALIZING);
      setSessionState(user);
      console.log("useSession.js: onChange, setStatus to INITIALIZING");
      try {
        userObserverRef.current = onSnapshotUserById(user.uid, (snapshot) => {
          if (snapshot.empty) {
            throw new Error(
              "could find authenticated user in the 'users' firestore db"
            );
          }
          setUserState(snapshot.data());
          setStatus(SESSION_STATUS.USER_READY);
          console.log(
            "useSession.js: getUser has completed, setStatus to USER_READY"
          );
          console.log(snapshot.data());
        });
      } catch (e) {
        console.log(e.message);

        // NEED TO LOG THE USER OUT BECAUSE WE CANT CONTINUE WITH THESE ERRORS
        doSignOut();
      }
    } else {
      setStatus(SESSION_STATUS.ANON);
      setSessionState(null);
      console.log("useSession.js: onChange, setStatus to ANON");
    }
  }, []);

  useEffect(() => {
    // listen for auth state changes
    const unsubscribe = onAuthStateChanged(onChange);

    console.log("useSession.js: useEffect -- subscribed to onAuthStateChanged");
    //unsubscribe to the listener when unmounting
    return () => {
      unsubscribe();
    };
  }, [onChange]);

  useEffect(() => {
    //unsubscribe to the listener when unmounting
    return () => userObserverRef();
  }, []);

  return { status: status, userSession: sessionState, userInDb: userState };
};

export default useSession;
