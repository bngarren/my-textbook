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
  getSetsByIds,
  getUserSets,
  addSet,
  removeSet,
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
  getSetsByIds,
  getUserSets,
  addSet,
  removeSet,
};
