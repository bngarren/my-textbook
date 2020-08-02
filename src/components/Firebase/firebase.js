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
  USER_SETS: "user-sets",
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

export const userByUid = (uid) => {
  return db.collection(ROOT_COLLECTION.USERS).where("uid", "==", uid).get();
};

export const onSnapshotUserById = (id, callback) => {
  return db
    .collection(ROOT_COLLECTION.USERS)
    .doc(id)
    .onSnapshot(callback, (err) => {
      throw new Error("Encountered error:", err);
    });
};

export const getNoteById = async (noteId) => {
  try {
    return await db.collection(ROOT_COLLECTION.NOTES).doc(noteId).get();
  } catch (error) {
    throw new Error(`Failed getNoteById: ${error.message}`);
  }
};

export const getSetById = async (setId) => {
  try {
    return await db.collection(ROOT_COLLECTION.SETS).doc(setId).get();
  } catch (error) {
    throw new Error(`Failed getSetById: ${error.message}`);
  }
};

export const getUserSets = async (userSetsId) => {
  return await db.collection(ROOT_COLLECTION.USER_SETS).doc(userSetsId).get();
};

export const addSet = async (userId, userSetsId = null, data) => {
  const { title } = data;
  if (!userId) {
    throw new Error("No userId!");
  }
  if (data == null || title.trim() === "") {
    throw new Error("Insufficient data to create new Set");
  }

  // ensure atomicity
  try {
    await db.runTransaction(async (t) => {
      // locate the user's userSets doc or, if null, a new userSet doc will be generated below
      const userSetsRef =
        userSetsId !== null
          ? db.collection(ROOT_COLLECTION.USER_SETS).doc(userSetsId)
          : null;

      // create the doc for this new set in the "sets" collection
      const newSetRef = db.collection(ROOT_COLLECTION.SETS).doc();

      // populate the fields of the new set in the "sets" collection
      const res_set = await t.set(newSetRef, {
        title: title,
        userId: userId,
      });

      const newSetInUserSets = {
        setId: newSetRef.id,
        title: title,
      };

      let res_userSet;
      // update the user's specific "userSets" document with the new set information
      res_userSet = await t.set(
        userSetsRef,
        {
          sets: { [newSetRef.id]: { title: title } },
        },
        { merge: true }
      );
    });
  } catch (error) {
    throw new Error("Transaction failed for addSet: ", error.message);
  }
  return true;
};

export const removeSet = async (userSetsId, setId) => {
  if (!userSetsId || !setId) {
    throw new Error("Missing userSetsId or setId, can't remove set");
  }

  try {
    await db.runTransaction(async (t) => {
      const setRef = db.collection(ROOT_COLLECTION.SETS).doc(setId);
      const userSetsRef = db
        .collection(ROOT_COLLECTION.USER_SETS)
        .doc(userSetsId);

      await t.delete(setRef);

      await t.update(userSetsRef, {
        [`sets.${setId}`]: firebase.firestore.FieldValue.delete(),
      });
    });
  } catch (error) {
    throw new Error("Transaction failed for removeSet: ", error.message);
  }
  return true;
};

export const addNote = async (userId, setId = null, data) => {
  const { title } = data;

  if (userId == null) {
    throw new Error("No userId!");
  } else if (setId == null) {
    throw new Error("No setId!");
  }
  if (data == null || title.trim() === "") {
    throw new Error("Insufficient data to create new Note");
  }

  // ensure atomicity
  /* 1. Need to add new note to Notes collection 
     2. Need to add mapping to the Sets document pertaning to this set under the notes map 
     */
  try {
    await db.runTransaction(async (t) => {
      // create the doc for this new note in the "notes" collection
      const newNoteRef = db.collection(ROOT_COLLECTION.NOTES).doc();

      // populate the fields of the new note in the "notes" collection
      const res_note = await t.set(newNoteRef, {
        title: title,
        userId: userId,
        setId: setId,
      });

      // get the set ref
      const setRef = db.collection(ROOT_COLLECTION.SETS).doc(setId);

      // make the new data object for the note
      const newNoteInSet = {
        title: title,
      };

      // now update this set's document with the new note
      let res_updatedSet;
      res_updatedSet = await t.set(
        setRef,
        {
          notes: { [setRef.id]: newNoteInSet },
        },
        { merge: true }
      );
    });
  } catch (error) {
    throw new Error("Transaction failed for addNote: ", error.message);
  }
  return true;
};
