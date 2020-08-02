import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";

import { NOTE_PAGE } from "../../../constants/routes";
import { getSetById } from "../../Firebase";
import AddNoteForm from "../AddNote";

const NotesView = ({ setId, user }) => {
  const [set, setSet] = useState(null);
  const [notes, setNotes] = useState(null);
  const [isLoading, setIsLoading] = useState(notes ? false : true);
  const [refresh, setRefresh] = useState(false); // to trigger re-render for NotesView

  useEffect(() => {
    if (setId == null) {
      return;
    }

    // Get set data from "sets" collection to population a list of notes
    setIsLoading(true);
    getSetById(setId)
      .then((snapshot) => {
        if (!snapshot.exists) {
          throw new Error("NotesList.js: snapshot empty");
        }
        console.debug(
          "NotesList.js: getSetById (database), snapshot.data() = ",
          snapshot.data()
        );

        // store the data for the Set
        const set = snapshot.data();
        setSet(set);

        // Try to extract the notes object from Set if  available
        if ("notes" in set) {
          // each note in the notes object is also a object/map
          // need to convert to an array of maps for better iterating ability
          const res = notesArrayFromObject(snapshot.data().notes);

          res && setNotes(res);
        } else {
          console.debug("NotesList.js: This set has no notes map");
        }

        setIsLoading(false);
      })
      .catch((e) => {
        console.error(
          "NotesList.js: Couldn't get notes set from set: ",
          e.message
        );
      });
  }, [setId, refresh]);

  const notesArrayFromObject = (setObject) => {
    const entries = Object.entries(setObject);

    let res = [];

    for (const [key, value] of entries) {
      res.push({ noteId: key, data: value });
    }

    return res;
  };

  const onNewNoteAdded = (updatedNotesView) => {
    if (updatedNotesView) {
      setRefresh(!refresh);
    }
  };

  if (!isLoading) {
    return (
      <>
        <AddNoteForm
          user={user}
          setId={setId}
          onNewNoteAdded={onNewNoteAdded}
        />
        {notes !== null && (
          <List>
            {notes.map((note) => (
              <ListItem key={note.noteId}>
                <Link to={`${NOTE_PAGE}/${note.noteId}`}>
                  <ListItemText primary={note.data.title} />
                </Link>
              </ListItem>
            ))}
          </List>
        )}
      </>
    );
  } else {
    return <></>;
  }
};

export default NotesView;
