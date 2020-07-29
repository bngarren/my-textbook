import app from "firebase/app";
import "firebase/firestore";

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
    app.initializeApp(firebaseConfig);

    this.db = app.firestore();
  }

  // Database API

  note = (noteId) => this.db.collection("notes").doc(noteId);

  notes = () => this.db.collection("notes");
}

export default Firebase;
