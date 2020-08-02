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
  getSetById,
  getUserSets,
  addSet,
  removeSet,
  addNote,
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
  getSetById,
  getUserSets,
  addSet,
  removeSet,
  addNote,
};
