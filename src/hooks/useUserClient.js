import React, { createContext, useContext, useReducer } from "react";

import Cookies from "universal-cookie";

import { useUserDb } from "./useSession";

export const ACTION_TYPE = Object.freeze({
  UPDATE_ACTIVE_SET: 0,
  CLEAR_ACTIVE_SET: 1,
});

const cookies = new Cookies(); // universal-cookie module

/* The userClientContext carries the Cookies object in it */
const initialState = {
  cookies: cookies,
  activeSet: {
    setId: cookies.get("activeSetId") || null,
    title: cookies.get("activeSetTitle") || null,
  },
};

const userClientContext = createContext(initialState);

export const useUserClient = () => {
  return useContext(userClientContext);
};

const UserClientContext = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  return (
    <userClientContext.Provider value={[state, dispatch]}>
      {children}
    </userClientContext.Provider>
  );
};

/* The reducer is able to take previous state and apply actions, returning an updated state */
const Reducer = (state, action) => {
  switch (action.type) {
    /* To update the user's active set, we do 2 things. We store the info in cookies so it can persist between browser sessions/refrehses
    and we store the same info in the top level of state (i.e. in the activeSet map) so that it can be quickly referenced in components needing it */
    case ACTION_TYPE.UPDATE_ACTIVE_SET:
      state.cookies.set("activeSetId", action.payload.setId);
      state.cookies.set("activeSetTitle", action.payload.title);
      return {
        ...state,
        activeSet: {
          setId: action.payload.setId,
          title: action.payload.title,
        },
      };
    case ACTION_TYPE.CLEAR_ACTIVE_SET:
      state.cookies.set("activeSetId", null);
      state.cookies.set("activeSetTitle", null);
      return {
        ...state,
        activeSet: {
          setId: null,
          title: null,
        },
      };
    default:
      return state;
  }
};

export default UserClientContext;
