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

class Firebase {
  constructor() {
    firebase.initializeApp(firebaseConfig);

    this.db = firebase.firestore();
    this.auth = firebase.auth();
  }

  // Database API

  note = (noteId) => this.db.collection("notes").doc(noteId);

  notes = () => this.db.collection("notes");

  refsFromSetIds = (ids) => {
    const refs = ids.map((id) => this.db.doc(`sets/${id}`));
    return refs;
  };

  setsFromRefs = (refs) =>
    this.db
      .collection("sets")
      .where(firebase.firestore.FieldPath.documentId(), "in", refs);

  // Auth API

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  userByUid = (uid) => this.db.collection("users").where("uid", "==", uid);
}

export default Firebase;
