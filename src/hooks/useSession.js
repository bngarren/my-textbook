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
  userSession: null,
  userInDB: null,
});

/* --- The following are 2 hooks used to get specific info from the userContext --- */

/* Return the userSession object from our userContext
This contains the information from the Authentication part
of Firebase about the user but not our user specific dataase */
export const useSession = () => {
  const { userSession } = useContext(userContext);
  return userSession;
};

/* Return the useInDb object from our userContext 
This contains the info about the user from our 'users' collection
in the Firestore database */
export const useUserInDb = () => {
  const { userInDb } = useContext(userContext);
  return userInDb;
};

/* This hook will update its state each time its listener receives an
onAuthStateChanged event from Firebase authentication, i.e. user logged in/out, etc.
Its state is what's used to provide the up to date information for the userContext */
export const useAuth = () => {
  const firebase = useFirebase();
  const [sessionState, setSessionState] = useState(() => {
    const userSession = firebase.auth.currentUser;
    return {
      initializing: !userSession,
      userSession: userSession,
    };
  });
  const [userState, setUserState] = useState(null);

  const getUser = useCallback(
    async (uid) => {
      await firebase
        .userByUid(uid)
        .get()
        .then((snapshot) => {
          let docs = snapshot.docs;
          for (let doc of docs) {
            console.log(doc.data());
            setUserState(doc.data());
          }
        });
    },
    [firebase]
  );

  const onChange = useCallback(
    (user) => {
      setSessionState({
        initializing: false,
        userSession: user,
      });

      if (user) {
        getUser(user.uid);
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

  return { sessionState, userInDb: userState };
};

export default useSession;
