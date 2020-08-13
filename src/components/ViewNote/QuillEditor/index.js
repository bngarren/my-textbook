import React, { useState } from "react";

import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";

import "./editorStyle.css";

import { makeStyles } from "@material-ui/core/styles";
import CloudDoneIcon from "@material-ui/icons/CloudDone";
import SaveIcon from "@material-ui/icons/Save";

import Tooltip from "@material-ui/core/Tooltip";

import { saveNote } from "../../Firebase";
import {
  useNoteAndCards,
  NOTE_AND_CARDS_ACTION,
} from "../../../hooks/useNoteAndCards";
import LastSaveTime from "./LastSaveTime";

const useStyles = makeStyles({
  syncStatus: {
    display: "flex",
    padding: "4px 0",
  },
  cloudIcon: {
    color: "#03a9f4",
    marginLeft: "5px",
  },
  saveIcon: {
    color: "#ff5722",
    marginLeft: "5px",
    "&:hover": {
      color: "grey",
      cursor: "pointer",
    },
  },
  editorPaper: {
    borderTopLeftRadius: "0",
    borderTopRightRadius: "0",
  },
  editorPaperReadOnly: {
    borderRadius: "4px",
  },
});

const icons = Quill.import("ui/icons");
icons[
  "background"
] = `<svg xmlns="http://www.w3.org/2000/svg" class="ql-customIcon" viewBox="0 0 544 512"><path d="M0 479.98L99.92 512l35.45-35.45-67.04-67.04L0 479.98zm124.61-240.01a36.592 36.592 0 0 0-10.79 38.1l13.05 42.83-50.93 50.94 96.23 96.23 50.86-50.86 42.74 13.08c13.73 4.2 28.65-.01 38.15-10.78l35.55-41.64-173.34-173.34-41.52 35.44zm403.31-160.7l-63.2-63.2c-20.49-20.49-53.38-21.52-75.12-2.35L190.55 183.68l169.77 169.78L530.27 154.4c19.18-21.74 18.15-54.63-2.35-75.13z"/></svg>`;

const QuillEditor = ({ initialValue, readOnly = false }) => {
  const classes = useStyles();
  const [value, setValue] = useState(initialValue || "");
  const [noteAndCardsState, dispatchNoteAndCards] = useNoteAndCards();

  const toolbarOptions = [
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline", "strike"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["blockquote"],
    [{ script: "sub" }, { script: "super" }],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ["clean"],
  ];

  const onChange = (content, delta, source, editor) => {
    setValue(content);

    console.log(delta);
    console.log(source);

    if (source === "user") {
      dispatchNoteAndCards({
        type: NOTE_AND_CARDS_ACTION.UPDATE_NOTE_ON_CLIENT,
        payload: content,
      });
    }
  };

  const onSave = () => {
    saveNote(noteAndCardsState.noteId, noteAndCardsState.setId, {
      content: value,
    })
      .then((timestamp) => {
        // should give us the lastSaved timestamp back
        console.debug("QuillEditor.js: Note successfully saved.");
        dispatchNoteAndCards({
          type: NOTE_AND_CARDS_ACTION.NOTE_SAVED,
          payload: timestamp,
        });
      })
      .catch((error) => {
        console.error(`QuillEditor.js: Failed to save note: ${error.message}`);
      });
  };

  return (
    <>
      {!readOnly && (
        <div className={classes.syncStatus}>
          <LastSaveTime date={noteAndCardsState.lastSaved.toDate()} />
          {noteAndCardsState.noteIsSynced ? (
            <Tooltip title="Note is synced">
              <CloudDoneIcon className={classes.cloudIcon} />
            </Tooltip>
          ) : (
            <Tooltip title="Save note">
              <SaveIcon className={classes.saveIcon} onClick={onSave} />
            </Tooltip>
          )}
        </div>
      )}

      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        modules={{
          toolbar: readOnly ? false : toolbarOptions,
          clipboard: {
            matchVisual: false,
          },
        }}
        placeholder={value === "" ? "Start you new note..." : ""}
      >
        {/* <Paper
          className={clsx(
            classes.editorPaper,
            { "ql-readOnly": readOnly },
            { [classes.editorPaperReadOnly]: readOnly }
          )}
          elevation={1}
        ></Paper> */}
      </ReactQuill>
    </>
  );
};

export default QuillEditor;
