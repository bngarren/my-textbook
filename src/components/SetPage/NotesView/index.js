import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { ListItemSecondaryAction, IconButton } from "@material-ui/core";

import { NOTE_PAGE } from "../../../constants/routes";
import { getSetById, removeNote } from "../../Firebase";
import AddNoteForm from "../AddNote";

const useStyles = makeStyles({
  notesListRoot: {
    width: "400px",
  },
});

const NotesView = ({ setId, user }) => {
  const [set, setSet] = useState(null);
  const [notes, setNotes] = useState(null);
  const [isLoading, setIsLoading] = useState(notes ? false : true);
  const [refresh, setRefresh] = useState(false); // to trigger re-render for NotesView

  const classes = useStyles();

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

  const onRemoveNote = (e, noteId) => {
    if (noteId == null || setId == null) {
      console.error(
        "NotesView.js: Cannot remove note, either invalid noteId or setId"
      );
    }

    try {
      removeNote(noteId, setId).then((res) => {
        res && setRefresh(!refresh);
      });
    } catch (error) {
      console.error("NotesView.js Cannot remove note: ", error.message);
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
          <List className={classes.notesListRoot}>
            {notes.map((note) => (
              <ListItem key={note.noteId}>
                <Link to={`${NOTE_PAGE}/${note.noteId}`}>
                  <ListItemText primary={note.data.title} />
                </Link>
                <ListItemSecondaryAction>
                  <IconButton onClick={(e) => onRemoveNote(e, note.noteId)}>
                    <DeleteForeverIcon />
                  </IconButton>
                </ListItemSecondaryAction>
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
