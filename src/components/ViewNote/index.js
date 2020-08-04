import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";

import { getNoteById } from "../Firebase";
import ViewNoteToolbar from "./Toolbar";

import Container from "@material-ui/core/Container";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";

const ViewNotePage = () => {
  return <NoteView />;
};

const NoteView = (props) => {
  const { id: noteId } = useParams();
  const [note, setNote] = useState();
  const [currentTextSelected, setCurrentTextSelected] = useState(null);

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
  }, []);

  /* Get note from Firestore db
  - Passing both the firebase and noteId in the useEffect dependency array
  If these values change, the useEffect hook will be called again */
  useEffect(() => {
    const getNote = (noteId) => {
      getNoteById(noteId).then((snapshot) => {
        if (snapshot.exists) {
          setNote(snapshot.data());
        }
      });
    };
    console.log("ViewNote/index: useEffect getNote()");
    getNote(noteId);
  }, [noteId]);

  return (
    <>
      {note != null ? (
        <>
          <ViewNoteToolbar currentTextSelected={currentTextSelected} />
          <Container>
            <FormControlLabel control={<Checkbox />} label="Scrollable note" />

            <div id="noteView">
              <Typography variant="h3">{note.title}</Typography>
              <br></br>
              <div dangerouslySetInnerHTML={{ __html: note.content }} />
            </div>
          </Container>
        </>
      ) : null}
    </>
  );
};

export default ViewNotePage;
