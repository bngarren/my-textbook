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
  NOTES: "notes",
  USER_SETS: "user-sets",
  SET_NOTES: "set-notes",
  SET_CARDS: "set-cards",
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
  return await db.collection(ROOT_COLLECTION.NOTES).doc(noteId).get();
};

export const getSetForNoteId = async (noteId) => {
  return await db
    .collection(ROOT_COLLECTION.SET_NOTES)
    .where(`notes.${noteId}.title`, ">", "")
    .get();
};

/**
 * Retrieves a document from the 'user-sets' collection
 * @param  {String} userId The userId used as the document key
 * @return {Promise}      A Promise resolved with a DocumentSnapshot containing the current document contents.
 */
export const getDocFromUserSets = (userId) => {
  return db.collection(ROOT_COLLECTION.USER_SETS).doc(userId).get();
};

/**
 * Retrieves a document from the 'set-notes' collection
 * @param  {String} setId The setId used as the document key
 * @return {Promise}      A Promise resolved with a DocumentSnapshot containing the current document contents.
 */
export const getDocFromSetNotes = (setId) => {
  return db.collection(ROOT_COLLECTION.SET_NOTES).doc(setId).get();
};

/**
 * Retrieves a document from the 'set-cards' collection
 * @param  {String} setId The setId used as the document key
 * @return {Promise}      A Promise resolved with a DocumentSnapshot containing the current document contents.
 */
export const getDocFromSetCards = (setId) => {
  return db.collection(ROOT_COLLECTION.SET_CARDS).doc(setId).get();
};

/**
 * Updates and/or creates if necessary, documents in the following collections: 'user-sets', 'set-notes', and 'set-cards', to represent a new set with unique setId for this user
 * @param  {String} userId The userId used as the document key for the 'user-sets' collection
 * @param  {Object} data Object holding the set data, needs at least a 'title' key and value
 * @return {Boolean}      A boolean representing the result of the atomic transaction (all completed or all failed)
 */
export const addSet = async (userId, data) => {
  const { title } = data;

  if (!userId) {
    throw new Error("No userId!");
  }
  if (data == null || title.trim() === "") {
    throw new Error("Insufficient data to add new set to database");
  }

  // ensure atomicity
  try {
    await db.runTransaction(async (t) => {
      // locate the user's 'user-sets' doc or, if null, a new doc will be generated
      const ref_userSetsDoc = db
        .collection(ROOT_COLLECTION.USER_SETS)
        .doc(userId);

      // create a new setId
      const setId = firestoreAutoId();

      // UPDATE USER-SETS
      await t.set(
        ref_userSetsDoc,
        {
          sets_count: firebase.firestore.FieldValue.increment(1),
          sets: {
            [setId]: {
              title: title,
              created_on: firebase.firestore.FieldValue.serverTimestamp(),
            },
          },
        },
        { merge: true }
      );

      // ADD NEW DOC TO SET-NOTES
      const ref_setNotesDoc = db
        .collection(ROOT_COLLECTION.SET_NOTES)
        .doc(setId);

      await t.set(ref_setNotesDoc, {
        setTitle: title,
        userId: userId,
        notes_count: 0,
        max_notes: 5,
        notes: {},
      });

      // ADD NEW DOC to SET-CARDS

      const ref_setCardsDoc = db
        .collection(ROOT_COLLECTION.SET_CARDS)
        .doc(setId);

      await t.set(ref_setCardsDoc, {
        setTitle: title,
        userId: userId,
        cards_count: 0,
        last_modified: firebase.firestore.Timestamp.fromDate(new Date()),
        cards: {},
      });
    });
  } catch (error) {
    throw new Error("Transaction failed for addSet: ", error.message);
  }
  return true;
};

/**
 * Removes set related documents or fields of documents in the following collections: 'user-sets', 'set-notes', and 'set-cards', as well as
 * all documents in the Notes collection that reference the given setId
 * @param  {String} userId The userId used as the document key for the 'user-sets' collection
 * @param  {String} setId The setId used throughout the collections that reference this set
 * @return {Boolean}      A boolean representing the result of the atomic transaction (all completed or all failed)
 */
export const removeSet = async (userId, setId) => {
  if (
    userId == null ||
    setId == null ||
    userId.trim() === "" ||
    setId.trim() === ""
  ) {
    throw new Error("Missing userId and/or setId, can't remove set");
  }

  // ensure atomicity
  try {
    await db.runTransaction(async (t) => {
      // remove the doc in 'set-cards'
      const ref_setCardsDoc = db
        .collection(ROOT_COLLECTION.SET_CARDS)
        .doc(setId);
      await t.delete(ref_setCardsDoc);

      /* Remove all documents in 'notes' collection with this setId field.
      Since we are billed for all the documents matched by a query, let's just
      query the 'set-notes' document x1, get the noteId's from that, and then
      perform the delete operation on the 'notes' collection with this array of noteId's
      */
      const snap = await db
        .collection(ROOT_COLLECTION.SET_NOTES)
        .doc(setId)
        .get();
      if (!snap.exists) {
        throw new Error("Could not located the 'set-notes' document");
      }

      const notesObj = snap.data().notes || null;
      if (notesObj == null) {
        throw new Error("Missing 'notes' object in the 'set-notes' document");
      }

      // get array of noteIds
      const noteIds = Object.keys(notesObj);

      if (noteIds.length !== snap.data().notes_count) {
        console.error(
          "firebase.js: removeSet() WARNING: the number of noteId's in the notes object does not match the notes_count field"
        );
      }

      if (noteIds.length > 0) {
        noteIds.forEach(async (id) => {
          const ref_note = db.collection(ROOT_COLLECTION.NOTES).doc(id);
          await t.delete(ref_note);
        });
        console.debug(
          `firebase.js removeSet() will remove ${noteIds.length} doc(s) from 'notes' collection`
        );
      }

      // Remove doc in 'set-notes' now that we are done using it
      const ref_setNotesDoc = db
        .collection(ROOT_COLLECTION.SET_NOTES)
        .doc(setId);
      await t.delete(ref_setNotesDoc);

      // locate associated 'user-sets' document and remove this key-value pair in the sets object
      const ref_userSetsDoc = db
        .collection(ROOT_COLLECTION.USER_SETS)
        .doc(userId);

      await t.update(ref_userSetsDoc, {
        sets_count: firebase.firestore.FieldValue.increment(-1),
        [`sets.${setId}`]: firebase.firestore.FieldValue.delete(),
      });
    });
  } catch (error) {
    throw new Error(`Transaction failed for removeSet: ${error.message}`);
  }
  return true;
};

/**
 * Updates and/or creates if necessary, documents in the following collections: 'set-notes' and 'notes', to represent a new note for this set
 * @param  {String} userId The userId to associate (as owner) with this note
 * @param  {String} setId The setId that this note belongs to
 * @param  {Object} data Object holding the note data, needs at least a 'title' key and value
 * @return {Boolean}      A boolean representing the result of the atomic transaction (all completed or all failed)
 */
export const addNote = async (userId, setId = null, data) => {
  const { title } = data;

  if (userId == null) {
    throw new Error("No userId!");
  } else if (setId == null) {
    throw new Error("No setId!");
  } else if (data == null || title.trim() === "") {
    throw new Error("Insufficient data to create new Note");
  }

  // ensure atomicity
  try {
    await db.runTransaction(async (t) => {
      // Add a new doc to the 'notes' collection, generating a unique noteId
      const ref_newNote = db.collection(ROOT_COLLECTION.NOTES).doc();

      await t.set(ref_newNote, {
        setId: setId,
        userId: userId,
        title: title,
        content: "",
        created_on: firebase.firestore.FieldValue.serverTimestamp(),
        last_modified: firebase.firestore.FieldValue.serverTimestamp(),
      });

      // Update this setId's doc in the 'set-notes' collection
      const ref_setNotesDoc = db
        .collection(ROOT_COLLECTION.SET_NOTES)
        .doc(setId);

      await t.set(
        ref_setNotesDoc,
        {
          notes: {
            [ref_newNote.id]: { title: title },
          },
          notes_count: firebase.firestore.FieldValue.increment(1),
        },
        { merge: true }
      );
    });
  } catch (error) {
    throw new Error("Transaction failed for addNote: ", error.message);
  }
  return true;
};

/**
 * Removes note related documents or fields of documents in the following collections: 'set-notes' and 'notes'
 * @param  {String} noteId The noteId which is the primary key in 'notes' and referenced in 'set-notes'
 * @param  {String} setId The setId of the set which this note belongs
 * @return {Boolean}      A boolean representing the result of the atomic transaction (all completed or all failed)
 */
export const removeNote = async (noteId, setId) => {
  if (noteId == null) {
    throw new Error("Missing noteId, cannot remove Note");
  } else if (setId == null) {
    throw new Error("Missing setId, cannot remove Note");
  }

  //ensure atomicity
  try {
    await db.runTransaction(async (t) => {
      // Remove the document from 'notes' collection
      const ref_note = db.collection(ROOT_COLLECTION.NOTES).doc(noteId);

      await t.delete(ref_note);

      // Remove the key-value entry in 'set-notes' which is embedded in the notes object
      // Also, update the notes_count field by -1
      const ref_setNotesDoc = db
        .collection(ROOT_COLLECTION.SET_NOTES)
        .doc(setId);

      // we use this special dot notation to access a particular nested field
      await t.update(ref_setNotesDoc, {
        notes_count: firebase.firestore.FieldValue.increment(-1),
        [`notes.${noteId}`]: firebase.firestore.FieldValue.delete(),
      });
    });
  } catch (error) {
    throw new Error("Transaction failed for removeNote: ", error.message);
  }
  return true;
};

export const saveNote = async (noteId, setId, noteData) => {
  if (noteId == null) {
    throw new Error("Missing noteId, cannot update Note");
  } else if (setId == null) {
    throw new Error("Missing setId, cannot update Note");
  } else if (noteData == null) {
    throw new Error("Missing noteData, cannot update Note");
  }

  // Very hacky way to figure out what to update the note document with
  const { title, content } = noteData;

  let writeableNoteData = {};
  if (title && content) {
    writeableNoteData = { title: title, content: content };
  } else if (!title && content) {
    writeableNoteData = { content: content };
  } else if (title && !content) {
    writeableNoteData = { title: title };
  }

  let last_saved;
  //ensure atomicity  NOT SURE WE NEED TRANSACTION HERE??
  try {
    await db.runTransaction(async (t) => {
      const ref_notesDoc = db.collection(ROOT_COLLECTION.NOTES).doc(noteId);

      /* create the timestamp here rather than have the server do it so we can save
      the value and pass it as the return value*/
      last_saved = firebase.firestore.Timestamp.now();

      await t.update(ref_notesDoc, {
        ...writeableNoteData,
        last_modified: last_saved,
      });
    });
  } catch (error) {
    throw new Error("Transaction failed for saveNote: ", error.message);
  }
  return last_saved;
};

/**
 * Adds a card to the set by updating the set's document in the 'set-cards' collection
 * @param  {String} userId The userId to associate (as owner) with this card and set
 * @param  {String} setId The setId that this card belongs to
 * @param  {Object} data Object holding the card data. Requires non-empty fields for 'side_one' and 'side_two'
 * @return {Promise}      A Promise resolved once the data has been successfully written to the backend
 */
export const addCard = async (userId, setId, cardData) => {
  const { side_one, side_two } = cardData;

  if (userId == null) {
    throw new Error("No userId!");
  } else if (setId == null) {
    throw new Error("No setId!");
  } else if (
    cardData == null ||
    side_one.trim() === "" ||
    side_two.trim() === ""
  ) {
    throw new Error("Insufficient data to create new Card");
  }

  // Generate a new cardId for this card
  const cardId = firestoreAutoId();

  // Update this setId's doc in the 'set-card' collection
  const ref_setCardsDoc = db.collection(ROOT_COLLECTION.SET_CARDS).doc(setId);

  return ref_setCardsDoc.update({
    [`cards.${cardId}`]: {
      side_one: side_one,
      side_two: side_two,
      created_on: firebase.firestore.FieldValue.serverTimestamp(),
      last_modified: firebase.firestore.FieldValue.serverTimestamp(),
    },
    cards_count: firebase.firestore.FieldValue.increment(1),
    last_modified: firebase.firestore.FieldValue.serverTimestamp(),
  });
};

/**
 * Removes card with given cardId from the set's document in the 'set-cards' collection
 * @param  {String} cardId The cardId that references this card in document
 * @param  {String} setId The setId of the set which this card belongs
 * @return
 */
export const removeCard = async (cardId, setId) => {
  if (cardId == null) {
    throw new Error("Missing cardId, cannot remove Card");
  } else if (setId == null) {
    throw new Error("Missing setId, cannot remove Card");
  }

  const ref_setCardsDoc = db.collection(ROOT_COLLECTION.SET_CARDS).doc(setId);

  const res = await ref_setCardsDoc.update({
    [`cards.${cardId}`]: firebase.firestore.FieldValue.delete(),
    cards_count: firebase.firestore.FieldValue.increment(-1),
  });

  return res;
};

/* - - - HELPERS - - - */

export const firestoreAutoId = () => {
  const CHARS =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let autoId = "";

  for (let i = 0; i < 20; i++) {
    autoId += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return autoId;
};
