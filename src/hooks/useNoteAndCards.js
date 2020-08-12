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
  ADD_CARD: "addCard",
  UPDATE_NOTE_ON_CLIENT: "updateNoteOnClient",
  SAVE_NOTE: "saveNote",
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
  saveNoteCallback: (f) => f,
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
    case NOTE_AND_CARDS_ACTION.ADD_CARD:
      addCard(state.userId, state.setId, {
        side_one: action.payload.cardData.side_one,
        side_two: action.payload.cardData.side_two,
      })
        .then(() => {
          if (
            action.payload.callback &&
            typeof action.payload.callback === "function"
          ) {
            action.payload.callback(true);
          }
        })
        .catch((e) => {
          console.error(`useNoteAndCards.js: Failed to addCard: ${e.message}`);
          if (
            action.payload.callback &&
            typeof action.payload.callback === "function"
          ) {
            action.payload.callback(false);
          }
        });
      return state;
    case NOTE_AND_CARDS_ACTION.UPDATE_NOTE_ON_CLIENT:
      return {
        ...state,
        noteOnClient: action.payload,
        noteIsSynced: false,
      };

    case NOTE_AND_CARDS_ACTION.SAVE_NOTE:
      saveNote(state.noteId, state.setId, action.payload)
        .then(() => {
          state.saveNoteCallback();
          return {
            ...state,
            noteIsSynced: true,
          };
        })
        .catch((e) => {
          console.error(`useNoteAndCards.js: Failed to saveNote: ${e.message}`);
        });
      return state;
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
