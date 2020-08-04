import React, { createContext, useContext, useReducer } from "react";

/*
-------------------------------------------------------------------
THIS CODE HAS NOT BEEN IMPLEMENTED AS I DECIDED TO TAKE ANOTHER ROUTE
BUT JUST IN CASE I WANTED TO REPLICATE SOMETHING LIKE THIS IN THE FUTURE
-------------------------------------------------------------------
*/

const initialState = {
  setId: null,
  deckId: null,
  content: {},
};

const deckContext = createContext(initialState);

export const useDeckContext = () => {
  return useContext(deckContext);
};

const DeckContext = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  const [userClient, dispatch] = useUserClient; // to stay up to date with the active set

  useEffect;

  return (
    <deckContext.Provider value={[state, dispatch]}>
      {children}
    </deckContext.Provider>
  );
};

export const ACTION_TYPE = Object.freeze({
  UPDATE_SET_ID: 0,
  UPDATE_DECK_ID: 1,
  UPDATE_CONTENT: 2,
  CLEAR_ALL: 3,
});

const Reducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPE.UPDATE_SET_ID:
      return {
        ...state,
        setId: action.payload,
      };
    case ACTION_TYPE.UPDATE_DECK_ID:
      return {
        ...state,
        deckId: action.payload,
      };
    case ACTION_TYPE.UPDATE_CONTENT:
      return {
        ...state,
        content: action.payload,
      };
    case ACTION_TYPE.CLEAR_ALL:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export default DeckContext;
