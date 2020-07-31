import React, { useState, useEffect } from "react";
import NoteLink from "../NoteLink";

const NotesList = () => {
  const [notes, setNotes] = useState(null);
  return <>NoteList</>;
};

export default NotesList;

/* useEffect(() => {
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
}, [firebase]); */
