import React, { createContext, useContext, useReducer } from "react";

import { addCard, saveNote } from "../components/Firebase";

/*
 * This is a 'custom hook' but is largely just a custom Context. The NoteAndCardsContextProvider
 * is implemented in the ViewNote>index.js page and sits atop the component tree that includes
 * Toolbar, Workspace, and MarkdownEditor. The intent is to provide common props to all these
 * components without having to pass everything down via prop drilling.
 *
 * The NoteAndCardsContextProvider function is a wrapper for the Context.Provider, but more importantly
 * helps to manage the state of the context's data by way of a useReducer pattern. In this way,
 * when the context is consumed in a child component via useNoteAndCards() hook (which itself calls
 * useContext), that component gets returned the state and a dispatch function which can be
 * used to update state from a child component.
 *
 */

/* An enum that formalizes the different action types that can be called with dispatch*/
export const NOTE_AND_CARDS_ACTION = Object.freeze({
  CARD_ADDED: "cardAdded",
  UPDATE_NOTE_ON_CLIENT: "updateNoteOnClient",
  NOTE_SAVED: "noteSaved",
});

/* These are the data types that the context will carry, initialized to null to start*/
/* Idk if this is kosher, but I even stored a callback function here so that when a certain
dispatch action is performed, the NoteAndCardsContextProvider has access to a certain component
via this callback*/
const initialNullState = {
  setId: null,
  userId: null,
  noteId: null,
  noteOnClient: "",
  noteIsSynced: true,
  lastSaved: null,
  noteSavedCallback: (f) => f,
  cardAddedCallback: (f) => f,
};

// create the context
const NoteAndCardsContext = createContext(initialNullState);

// this is the 'custom hook', but this hook really only gives us the context
export const useNoteAndCards = () => {
  return useContext(NoteAndCardsContext);
};

// this is the meat and potatoes of this module
export const NoteAndCardsContextProvider = ({
  children,
  initialState = { ...initialNullState },
}) => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  return (
    <NoteAndCardsContext.Provider value={[state, dispatch]}>
      {children}
    </NoteAndCardsContext.Provider>
  );
};

// the reducer function implements the action types
const Reducer = (state, action) => {
  switch (action.type) {
    case NOTE_AND_CARDS_ACTION.CARD_ADDED:
      state.cardAddedCallback();
      return state;
    case NOTE_AND_CARDS_ACTION.UPDATE_NOTE_ON_CLIENT:
      return {
        ...state,
        noteOnClient: action.payload,
        noteIsSynced: false,
      };

    case NOTE_AND_CARDS_ACTION.NOTE_SAVED:
      state.noteSavedCallback();
      return {
        ...state,
        noteIsSynced: true,
        lastSaved: action.payload,
      };

    default:
      return state;
  }
};

/* Usually want to memoize any function that is returned from a hook so that it doesn't have to be memoized where it's called*/
/*  const addCardToSetCards = useCallback(
    (side_one, side_two, callback) => {
      addCard(userId, setId, { side_one: side_one, side_two: side_two })
        .then(() => {
          if (callback && typeof callback === "function") {
            callback(true);
          }
        })
        .catch((e) => {
          console.error(`useSetCards.js: Failed to addCard: ${e.message}`);
          callback(false);
        });
    },
    [userId, setId]
  ); */
