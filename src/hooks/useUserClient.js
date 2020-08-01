import React, { createContext, useContext, useReducer, useEffect } from "react";

import { useUserDb } from "./useSession";
import { updateActiveSet } from "../components/Firebase";

export const ACTION_TYPE = Object.freeze({
  UPDATE_ACTIVE_SET: 0,
});

const initialState = {
  activeSetId: null,
};

const userClientContext = createContext(initialState);

const UserClientContext = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initialState);
  const { user } = useUserDb();

  return (
    <userClientContext.Provider value={[state, dispatch]}>
      {children}
    </userClientContext.Provider>
  );
};

const Reducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPE.UPDATE_ACTIVE_SET:
      return {
        ...state,
        activeSetId: action.payload.setId,
        activeSetTitle: action.payload.title,
      };
    default:
      return state;
  }
};

export const useUserClient = () => {
  return useContext(userClientContext);
};

export default UserClientContext;
