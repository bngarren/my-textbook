import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";

import MarkdownIt from "markdown-it";
import clsx from "clsx";

import * as ROUTES from "../../constants/routes";
import { getNoteById, getSetForNoteId } from "../Firebase";
import { useUserClient, ACTION_TYPE } from "../../hooks/useUserClient";
import { NoteAndCardsContextProvider } from "../../hooks/useNoteAndCards";
import ViewNoteToolbar from "./Toolbar";
import ToolDrawer from "./ToolDrawer";
import Loading from "../Loading";

import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import Grid from "@material-ui/core/Grid";
import QuillEditor from "./QuillEditor";

const useStyles = makeStyles({
  root: {
    display: "flex",
  },
  noteViewContainer: {
    flexGrow: 1,
  },
  noteViewContainerShifted: {
    marginRight: "450px",
  },
  toggleBtnGridRoot: {
    justifyContent: "center",
    width: "99%",
  },
  switchBase: {
    "&$switchChecked": {
      color: "#ff5722",
    },
    "&$switchChecked + $switchTrack": {
      backgroundColor: "#ff5722",
    },
  },
  switchTrack: {},
  switchChecked: {},
  noteTitle: {},
});

const ViewNotePage = () => {
  return <NoteView />;
};

const NoteView = () => {
  const classes = useStyles();
  const { id: noteId } = useParams();
  const [noteInDb, setNoteInDb] = useState();
  const [currentTextSelected, setCurrentTextSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(noteInDb ? false : true);
  const history = useHistory();
  const [userClient, userClientDispatch] = useUserClient();
  const prevActiveSet = useRef(userClient.activeSet);
  const [refresh, setRefresh] = useState(false);
  const [toolDrawerOpen, setToolDrawerOpen] = useState(false);

  /* Get note from Firestore db
  - Passing the noteId in the useEffect dependency array
  If these values change, the useEffect hook will be called again */
  useEffect(() => {
    if (noteId == null || noteId.trim() === "") {
      console.log("here");
      // Redirect to home page
      history.push(ROUTES.HOME);
      return;
    }

    setIsLoading(true);

    getNoteById(noteId)
      .then((snapshot) => {
        if (!snapshot.exists) {
          throw new Error(`No document found in 'notes' for noteId ${noteId}`);
        }

        setNoteInDb({ ...snapshot.data(), noteId: snapshot.id });

        // Now we need to reconcile what the "active set" for the app should be
        // e.g. consider that the user arrived to this page via direct url and
        // not through the SetPage
        if (prevActiveSet.current.setId !== snapshot.data().setId) {
          console.debug("ViewNote.js: using getSetForNoteId to identify set");
          // we must use the set-notes document to get the set info for this noteId
          getSetForNoteId(snapshot.id)
            .then((snapshot) => {
              if (snapshot.empty) {
                throw new Error(
                  `couldn't find setId by querying 'set-notes' will noteId`
                );
              } else if (snapshot.size > 1) {
                throw new Error(
                  `located more than 1 document in 'set-notes' that claims this noteId`
                );
              }

              const setData = snapshot.docs[0];

              /* let the rest of the app know that the set that this note
        belongs to should be "active", e.g. to show in Navigation bar or other places*/
              userClientDispatch({
                type: ACTION_TYPE.UPDATE_ACTIVE_SET,
                payload: { setId: setData.id, title: setData.data().setTitle },
              });
              prevActiveSet.current = {
                setId: setData.id,
                title: setData.data().setTitle,
              };
            })
            .catch((error) => {
              console.error(
                `ViewNote.js: Failed to update activeSet for userClientContext: ${error.message}`
              );
            });
        }

        setIsLoading(false);
      })
      .catch((error) => {
        console.error(
          "ViewNote.js: Failed to retrieve doc from 'notes': ",
          error.message
        );
        setIsLoading(false);
      });

    console.log("ViewNote/index: useEffect getNote()");
  }, [noteId, refresh, history, prevActiveSet, userClientDispatch]);

  /* callback for the onMouseUp event */
  /* used to see if there is a text selection within the noteView element */
  const onMouseUp = useCallback(() => {
    const noteViewNode = document.getElementById("noteView");
    const selection = window.getSelection();

    if (selection == null) return;
    // anchor node is the node in which the selection begins
    const anchorNode = selection.anchorNode;

    if (anchorNode == null) return;
    const selectionNode = anchorNode.parentNode;

    // is this selected node a child of the noteview element and not somewhere else on the page
    const selectionDidBeginInsideNoteView = noteViewNode.contains(
      selectionNode
    );

    if (selectionDidBeginInsideNoteView) {
      const selectionString = selection.toString();

      const isNull = selectionString === "";

      const newText = !isNull ? selectionString : null;

      setCurrentTextSelected(newText);
    } else {
      // sending the currentTextSelected variable as 'null' will essentially tell other components
      // when the user has clicked out but not made a new text selection
      setCurrentTextSelected(null);
    }
  }, []);

  /* Add listener for mouseup events to detect new selected text */
  useEffect(() => {
    document.addEventListener("mouseup", onMouseUp);
    // remove the listener
    return () => document.removeEventListener("mouseup", onMouseUp);
  }, [onMouseUp]);

  const onSavedNote = () => {
    setRefresh(!refresh);
  };

  const onToggleToolDrawer = () => {
    setToolDrawerOpen(!toolDrawerOpen);
  };

  // CLSX helper for styling
  const noteViewContainerClasses = clsx();

  if (isLoading) {
    return <Loading type="smallGrey" />;
  } else {
    return (
      <>
        <Grid
          className={classes.toggleBtnGridRoot}
          container
          alignItems="center"
          spacing={1}
        >
          <Grid item>
            <Typography>Edit Note</Typography>
          </Grid>
          <Grid item>
            <Switch
              checked={toolDrawerOpen}
              onChange={onToggleToolDrawer}
              classes={{
                switchBase: classes.switchBase,
                track: classes.switchTrack,
                checked: classes.switchChecked,
              }}
            />
          </Grid>
          <Grid item>
            <Typography>Markup</Typography>
          </Grid>
        </Grid>
        {noteInDb != null ? (
          <div className={classes.root}>
            <NoteAndCardsContextProvider
              initialState={{
                userId: noteInDb.userId,
                setId: noteInDb.setId,
                noteId: noteInDb.noteId,
                noteOnClient: noteInDb.content,
                noteIsSynced: true,
                lastSaved: noteInDb.last_modified,
                saveNoteCallback: onSavedNote,
              }}
            >
              <Container
                className={clsx(classes.noteViewContainer, {
                  [classes.noteViewContainerShifted]: toolDrawerOpen,
                })}
              >
                <div id="noteView" className={classes.noteView}>
                  <Typography variant="h5" className={classes.noteTitle}>
                    {noteInDb.title}
                  </Typography>
                  <QuillEditor
                    initialValue={noteInDb.content}
                    readOnly={toolDrawerOpen}
                  />

                  {/* <div dangerouslySetInnerHTML={{ __html: noteInDb.content }} /> */}
                </div>
              </Container>
              <ToolDrawer open={toolDrawerOpen}>
                <ViewNoteToolbar currentTextSelected={currentTextSelected} />
              </ToolDrawer>
            </NoteAndCardsContextProvider>
          </div>
        ) : (
          <>Could not find this note.</>
        )}
      </>
    );
  }
};

export default ViewNotePage;
