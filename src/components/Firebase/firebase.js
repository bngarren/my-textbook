import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDbYsgfn--OVImQkitEy5dzsoFgiqCdWvY",
  authDomain: "my-textbook-7d4db.firebaseapp.com",
  databaseURL: "https://my-textbook-7d4db.firebaseio.com",
  projectId: "my-textbook-7d4db",
  storageBucket: "my-textbook-7d4db.appspot.com",
  messagingSenderId: "685663840714",
  appId: "1:685663840714:web:a82aef34bd87490e7bc733",
};

export const ROOT_COLLECTION = {
  USERS: "users",
  SETS: "sets",
  NOTES: "notes",
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
const auth = firebase.auth();

// ~-~-~-~-~-~-~-~-~-~-~- Auth -~-~-~-~-~-~-~-~-~-~-~

export const doCreateUserWithEmailAndPassword = (email, password) => {
  return auth.createUserWithEmailAndPassword(email, password);
};

export const doSignInWithEmailAndPassword = (email, password) => {
  return auth.signInWithEmailAndPassword(email, password);
};

export const doSignOut = () => auth.signOut();

export const currentUser = () => auth.currentUser;

export const onAuthStateChanged = (callback) => {
  return auth.onAuthStateChanged(callback);
};

// ~-~-~-~-~-~-~-~-~-~-~- Firestore -~-~-~-~-~-~-~-~-~-~-~

export const userByUid = (uid) =>
  db.collection(ROOT_COLLECTION.USERS).where("uid", "==", uid);

export const getNoteById = (noteId) => {
  return db.collection(ROOT_COLLECTION.NOTES).doc(noteId).get();
};

export const getSetsByIds = (ids) => {
  const refs = ids.map((id) => db.doc(`${ROOT_COLLECTION.SETS}/${id}`));

  return db
    .collection(ROOT_COLLECTION.SETS)
    .where(firebase.firestore.FieldPath.documentId(), "in", refs)
    .get();
};
