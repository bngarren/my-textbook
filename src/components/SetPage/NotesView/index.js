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
import { getDocFromSetNotes, removeNote } from "../../Firebase";
import AddNoteForm from "../AddNote";

const useStyles = makeStyles({
  notesListRoot: {
    width: "400px",
  },
});

const NotesView = ({ setId, user }) => {
  const [setInfo, setSetInfo] = useState(null);
  const [notes, setNotes] = useState(null);
  const [isLoading, setIsLoading] = useState(notes ? false : true);
  const [refresh, setRefresh] = useState(false); // to trigger re-render for NotesView

  const classes = useStyles();

  useEffect(() => {
    if (setId == null || setId.trim() === "") {
      return;
    }

    // Get doc from 'set-notes' collection that contains some notes' info
    setIsLoading(true);

    getDocFromSetNotes(setId)
      .then((snapshot) => {
        if (!snapshot.exists) {
          throw new Error(
            `No document found in 'set-notes' for setId ${setId}`
          );
        }

        setSetInfo({
          title: snapshot.data().setTitle,
          notes_count: snapshot.data().notes_count,
          max_notes: snapshot.data().max_notes || 5, // default to max of 5 notes
        });

        if (!("notes" in snapshot.data())) {
          throw new Error(
            "Data model error, there is no 'notes' object in this document!"
          );
        }

        // Try to extract the notes object from the document
        // see if notes object contains any noteId's
        let res = [];
        if (Object.keys(snapshot.data().notes).length > 0) {
          res = notesArrayFromObject(snapshot.data().notes);

          if (res && res.length > 0) {
            setNotes(res);
          }
        } else {
          setNotes(null);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        console.error(
          "NotesList.js: Failed to retrieve doc from 'set-notes': ",
          e.message
        );
        setIsLoading(false);
      });
  }, [setId, refresh]);

  const notesArrayFromObject = (notesObject) => {
    const entries = Object.entries(notesObject);
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
