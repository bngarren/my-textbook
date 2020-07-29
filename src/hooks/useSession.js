import { createContext, useContext, useState, useEffect } from "react";
import { useFirebase } from "../components/Firebase";

/* 
See https://benmcmahen.com/using-firebase-with-react-hooks/
*/

export const userContext = createContext({
  user: null,
});

export const useSession = () => {
  const { user } = useContext(userContext);
  return user;
};

export const useAuth = () => {
  const firebase = useFirebase();
  const [state, setState] = useState(() => {
    const user = firebase.auth.currentUser;
    return {
      initializing: !user,
      user,
    };
  });

  const onChange = (user) => {
    setState({
      initializing: false,
      user,
    });
  };

  useEffect(() => {
    // listen for auth state changes
    const unsubscribe = firebase.auth.onAuthStateChanged(onChange);

    console.log("useSession.js: useEffect");
    //unsubscribe to the listener when unmounting
    return () => unsubscribe();
  }, [firebase]);

  return state;
};

export default useSession;
