import FirebaseContext, { useFirebase } from "./context";
import {
  ROOT_COLLECTION,
  db,
  doCreateUserWithEmailAndPassword,
  doSignInWithEmailAndPassword,
  doSignOut,
  currentUser,
  onAuthStateChanged,
  userByUid,
  onSnapshotUserById,
  getNoteById,
  getSetForNoteId,
  getDocFromUserSets,
  getDocFromSetNotes,
  getDocFromSetCards,
  addSet,
  removeSet,
  addNote,
  removeNote,
  addCard,
  removeCard,
} from "./firebase";

export { FirebaseContext, useFirebase };
export {
  ROOT_COLLECTION,
  db,
  doCreateUserWithEmailAndPassword,
  doSignInWithEmailAndPassword,
  doSignOut,
  currentUser,
  onAuthStateChanged,
  userByUid,
  onSnapshotUserById,
  getNoteById,
  getSetForNoteId,
  getDocFromUserSets,
  getDocFromSetNotes,
  getDocFromSetCards,
  addSet,
  removeSet,
  addNote,
  removeNote,
  addCard,
  removeCard,
};
