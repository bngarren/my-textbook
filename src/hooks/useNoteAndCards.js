import React, {
  createContext,
  useContext,
  useCallback,
  useReducer,
} from "react";

import { addCard, saveNote } from "../components/Firebase";

export const NOTE_AND_CARDS_ACTION = Object.freeze({
  ADD_CARD: "addCard",
  UPDATE_NOTE_IS_EDITABLE: "updateNoteIsEditable",
  UPDATE_NOTE_ON_CLIENT: "updateNoteOnClient",
  SAVE_NOTE: "saveNote",
});

const initialNullState = {
  setId: null,
  userId: null,
  noteId: null,
  noteOnClient: "",
  noteIsEditable: true,
  noteIsSynced: true,
  lastSaved: null,
  saveNoteCallback: (f) => f,
  mdParser: null,
};

const NoteAndCardsContext = createContext(initialNullState);

export const useNoteAndCards = () => {
  return useContext(NoteAndCardsContext);
};

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
    case NOTE_AND_CARDS_ACTION.UPDATE_NOTE_IS_EDITABLE:
      return {
        ...state,
        noteIsEditable: action.payload,
      };
    case NOTE_AND_CARDS_ACTION.SAVE_NOTE:
      saveNote(state.noteId, state.setId, action.payload)
        .then(() => {
          state.saveNoteCallback();
          return state;
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
