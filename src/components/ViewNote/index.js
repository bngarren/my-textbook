import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";

import * as ROUTES from "../../constants/routes";
import { getNoteById, getSetForNoteId } from "../Firebase";
import { useUserClient, ACTION_TYPE } from "../../hooks/useUserClient";
import { setCardsContext } from "../../hooks/useSetCards";
import ViewNoteToolbar from "./Toolbar";
import Loading from "../Loading";

import Container from "@material-ui/core/Container";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";

const ViewNotePage = () => {
  return <NoteView />;
};

const NoteView = () => {
  const { id: noteId } = useParams();
  const [note, setNote] = useState();
  const [currentTextSelected, setCurrentTextSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(note ? false : true);
  const history = useHistory();
  const [userClient, userClientDispatch] = useUserClient();
  const prevActiveSet = useRef(userClient.activeSet);

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
        setNote(snapshot.data());

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
  }, [noteId, history, prevActiveSet, userClientDispatch]);

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

  if (isLoading) {
    return <Loading />;
  } else {
    return (
      <>
        {note != null ? (
          <>
            <setCardsContext.Provider
              value={{ userId: note.userId, setId: note.setId }}
            >
              <ViewNoteToolbar currentTextSelected={currentTextSelected} />

              <Container>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Scrollable note"
                />

                <div id="noteView">
                  <Typography variant="h3">{note.title}</Typography>
                  <br></br>
                  <div dangerouslySetInnerHTML={{ __html: note.content }} />
                </div>
              </Container>
            </setCardsContext.Provider>
          </>
        ) : (
          <>Could not find this note.</>
        )}
      </>
    );
  }
};

export default ViewNotePage;
