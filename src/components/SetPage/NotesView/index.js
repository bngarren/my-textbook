import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { ListItemSecondaryAction, IconButton } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Popover from "@material-ui/core/Popover";
import Button from "@material-ui/core/Button";
import NoteAddOutlinedIcon from "@material-ui/icons/NoteAddOutlined";

import { NOTE_PAGE } from "../../../constants/routes";
import { getDocFromSetNotes, removeNote } from "../../Firebase";
import { useUserClient, ACTION_TYPE } from "../../../hooks/useUserClient";
import AddNoteForm from "../AddNote";
import Loading from "../../Loading";

const useStyles = makeStyles({
  notesListRoot: {
    width: "400px",
  },
  notesViewToolbar: {
    justifyContent: "space-between",
    minHeight: "36px",
    marginBottom: "36px",
  },
  notesListItemNote: {
    border: "1px solid #e8dbdb",
    borderLeft: "5px solid #03a9f4",
    borderTopLeftRadius: "3px",
    borderBottomLeftRadius: "3px",
    marginBottom: "0.5em",
    "&:hover": {
      borderLeft: "6px solid #0288d1",
    },
  },
  notesListLink: {
    textDecoration: "none",
    color: "#1a3743",
  },
  notesListItemPrimaryText: {
    lineHeight: "1.2em",
  },
  notesListItemAddNote: {
    marginBottom: "1em",
    paddingRight: "0",
    justifyContent: "flex-end",
  },
  notesListItemSecondaryActionRemoveNote: {
    right: "0px",
  },
});

const NotesView = ({ setId, user }) => {
  const classes = useStyles();
  const [setInfo, setSetInfo] = useState(null);
  const [notes, setNotes] = useState(null);
  const [isLoading, setIsLoading] = useState(notes ? false : true);
  const [refresh, setRefresh] = useState(false); // to trigger re-render for NotesView
  const [userClient, userClientDispatch] = useUserClient(); // use context here to track which set is "active"
  const [addNotePopoverAnchor, setAddNotePopoverAnchor] = useState(null);

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

        /* let the rest of the app know that the set that this note
        belongs to should be "active", e.g. to show in Navigation bar or other places*/
        userClientDispatch({
          type: ACTION_TYPE.UPDATE_ACTIVE_SET,
          payload: {
            setId: snapshot.id,
            title: snapshot.data().setTitle,
          },
        });
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
      onCloseAddNotePopover();
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

  const onClickAddNotePopover = (e) => {
    setAddNotePopoverAnchor(e.currentTarget);
  };

  const onCloseAddNotePopover = () => {
    setAddNotePopoverAnchor(null);
  };

  const addNotePopoverOpen = Boolean(addNotePopoverAnchor);

  const toolbar = () => {
    return (
      <Toolbar className={classes.notesViewToolbar}>
        <div>
          <Typography variant="subtitle2">
            {setInfo.notes_count} {`note${setInfo.notes_count > 1 ? "s" : ""}`}
          </Typography>
        </div>
        <div>
          <Tooltip title="Add Note">
            <Button onClick={onClickAddNotePopover}>
              <NoteAddOutlinedIcon />
            </Button>
          </Tooltip>

          <Popover
            open={addNotePopoverOpen}
            onClose={onCloseAddNotePopover}
            anchorEl={addNotePopoverAnchor}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <AddNoteForm
              user={user}
              setId={setId}
              onNewNoteAdded={onNewNoteAdded}
            />
          </Popover>
        </div>
      </Toolbar>
    );
  };

  if (!isLoading) {
    return (
      <>
        {toolbar()}
        <List className={classes.notesListRoot}>
          {notes !== null && (
            <>
              {notes.map((note) => (
                <ListItem
                  key={note.noteId}
                  classes={{
                    container: classes.notesListItemNote,
                  }}
                >
                  <Link
                    to={`${NOTE_PAGE}/${note.noteId}`}
                    className={classes.notesListLink}
                  >
                    <ListItemText
                      primary={note.data.title}
                      primaryTypographyProps={{
                        className: classes.notesListItemPrimaryText,
                      }}
                    />
                  </Link>
                  <ListItemSecondaryAction
                    className={classes.notesListItemSecondaryActionRemoveNote}
                  >
                    <Tooltip title="Delete">
                      <IconButton onClick={(e) => onRemoveNote(e, note.noteId)}>
                        <DeleteForeverIcon />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </>
          )}
        </List>
      </>
    );
  } else {
    return (
      <>
        <Loading type="smallGrey" relative={true} />
      </>
    );
  }
};

export default NotesView;
