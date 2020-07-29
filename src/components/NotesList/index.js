import React, { useState, useEffect } from "react";
import { useFirebase } from "../Firebase";
import NoteLink from "../NoteLink";
import * as ROUTES from "../../constants/routes";

const NotesList = () => {
  const firebase = useFirebase();
  const [notes, setNotes] = useState(null);

  /* Get note from Firestore db
- Passing both the firebase and noteId in the useEffect dependency array
If these values change, the useEffect hook will be called again */
  useEffect(() => {
    if (!firebase) {
      console.log("cant find firebase");
      return;
    }

    const getNotes = async () => {
      await firebase
        .notes()
        .get()
        .then((snapshot) => {
          let docs = [];
          snapshot.forEach((doc) => {
            docs.push({ ...doc.data(), id: doc.id });
          });
          setNotes(docs);
        })
        .catch((e) => console.log(e));
    };
    console.log("NotesList/index: useEffect getNotes()");
    getNotes();
  }, [firebase]);

  return (
    <>
      {notes != null ? (
        <ul>
          {notes.map((note) => (
            <li key={note.id}>
              <NoteLink noteId={note.id}>{note.title}</NoteLink>
            </li>
          ))}
        </ul>
      ) : (
        "Loading"
      )}
    </>
  );
};

export default NotesList;
