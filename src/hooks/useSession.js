import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useFirebase } from "../components/Firebase";

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
  ANON: 0,
  INITIALIZING: 1,
  USER_READY: 2,
};

/* This hook will update its state each time its listener receives an
onAuthStateChanged event from Firebase authentication, i.e. user logged in/out, etc.
Its state is what's used to provide the up to date information for the userContext */
export const useAuth = () => {
  const firebase = useFirebase();
  const [sessionState, setSessionState] = useState(firebase.auth.currentUser);
  const [userState, setUserState] = useState(null);
  const [status, setStatus] = useState(SESSION_STATUS.INITIALIZING);

  const getUser = useCallback(
    async (user) => {
      await firebase
        .userByUid(user.uid)
        .get()
        .then((snapshot) => {
          let docs = snapshot.docs;
          for (let doc of docs) {
            setUserState(doc.data());
            setStatus(SESSION_STATUS.USER_READY);
          }
        });
    },
    [firebase]
  );

  const onChange = useCallback(
    (user) => {
      if (user) {
        setStatus(SESSION_STATUS.INITIALIZING);
        setSessionState(user);
        getUser(user);
      } else {
        setStatus(SESSION_STATUS.ANON);
        setSessionState(null);
      }
    },
    [getUser]
  );

  useEffect(() => {
    // listen for auth state changes
    const unsubscribe = firebase.auth.onAuthStateChanged(onChange);

    console.log("useSession.js: useEffect");
    //unsubscribe to the listener when unmounting
    return () => unsubscribe();
  }, [firebase, onChange]);

  return { status: status, userSession: sessionState, userInDb: userState };
};

export default useSession;
