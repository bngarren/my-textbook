import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import ViewNoteToolbar from "./Toolbar";

import Container from "@material-ui/core/Container";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";

class ViewNotePage extends Component {
  render() {
    return (
      <>
        <NoteView />
      </>
    );
  }
}

class NoteViewBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      note: "",
      loading: false,
      isToolSelected: false,
      currentTextSelected: "",
    };
  }

  componentDidMount() {
    this.setState({
      loading: true,
    });

    this.unsubscribe = this.props.firebase
      .note("cbNW3nAieisZyUuXF8pN")
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          this.setState({
            note: snapshot.data(),
            loading: false,
          });
        }
      });

    this.textHighlightListener();
  }

  textHighlightListener() {
    /* Handle what happens when some text is highlighted. We only want this to work in the noteView element */

    /*     document.onmouseup = (event) => {
      // Let's store the 'noteView' node
      let parentNode = document.getElementById("noteView");

      let x = event.clientX;
      let y = event.clientY;
      let elementMouseIsOver = document.elementFromPoint(x, y);

      if (parentNode != null && parentNode.contains(elementMouseIsOver)) {
        const selection = window.getSelection().toString();
        const isNull = selection === "";

        const newText = !isNull ? selection : null;

        this.setState({
          currentTextSelected: newText,
        });
      } else {
        this.setState({
          currentTextSelected: null,
        });
      }
    }; */

    document.onmouseup = (event) => {
      const selection = window.getSelection();

      const anchorNode = selection.anchorNode;

      if (anchorNode != null) {
        try {
          const selectedNode = anchorNode.parentNode;
          const noteViewNode = document.getElementById("noteView");
          const selectionBeginsWithinNoteView = noteViewNode.contains(
            selectedNode
          );

          if (selectionBeginsWithinNoteView) {
            const selectionString = selection.toString();

            const isNull = selectionString === "";

            const newText = !isNull ? selectionString : null;

            this.setState({
              currentTextSelected: newText,
            });
          } else {
            this.setState({
              currentTextSelected: null,
            });
          }
        } catch (e) {
          console.log(e);
        }
      }
    };
  }

  render() {
    const { note, loading } = this.state;
    return (
      <>
        {note != null ? (
          <>
            <ViewNoteToolbar
              currentTextSelected={this.state.currentTextSelected}
            />
            <Container id="noteView">
              <FormControlLabel
                control={<Checkbox />}
                label="Scrollable note"
              />

              <Typography variant="h3">{note.title}</Typography>
              <br></br>
              <div dangerouslySetInnerHTML={{ __html: note.content }} />
            </Container>
          </>
        ) : null}
      </>
    );
  }
}

const NoteView = withFirebase(NoteViewBase);

export default ViewNotePage;
