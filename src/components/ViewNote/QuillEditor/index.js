import React, { useState } from "react";
import clsx from "clsx";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import "./editorStyle.css";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import CloudDoneIcon from "@material-ui/icons/CloudDone";
import SaveIcon from "@material-ui/icons/Save";
import IconButton from "@material-ui/core/IconButton";

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

const QuillEditor = ({ initialValue, readOnly = false }) => {
  const classes = useStyles();
  const [value, setValue] = useState(initialValue || "");
  const [noteAndCardsState, dispatchNoteAndCards] = useNoteAndCards();

  const toolbarOptions = [
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline", "strike"],
    ["blockquote"],
    [{ script: "sub" }, { script: "super" }],
    [{ indent: "-1" }, { indent: "+1" }],
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
    dispatchNoteAndCards({
      type: NOTE_AND_CARDS_ACTION.SAVE_NOTE,
      payload: { content: value },
    });
  };

  /*   const getTimeSinceLastSaved = () => {
    const lastSaved = noteAndCardsState.lastSaved.toDate();
    const now = new Date();
    const diff = new Date(now - lastSaved);

    const secs = diff / 1000.0;
    const mins = secs / 60.0;
    const hrs = mins / 60.0;
    const days = hrs / 24.0;

    if (days >= 1) {
      return lastSaved.toLocaleDateString();
    } else if (hrs >= 1) {
      const suffix = hrs < 2 ? "" : "s";
      return `${Math.floor(hrs)} hour${suffix} ago`;
    } else if (mins >= 1) {
      const suffix = mins < 2 ? "" : "s";
      return `${Math.floor(mins)} minute${suffix} ago`;
    } else {
      return `1 minute ago`;
    }
  }; */

  return (
    <>
      {!readOnly && (
        <div className={classes.syncStatus}>
          <LastSaveTime date={noteAndCardsState.lastSaved.toDate()} />
          {noteAndCardsState.noteIsSynced ? (
            <CloudDoneIcon className={classes.cloudIcon} />
          ) : (
            <SaveIcon className={classes.saveIcon} onClick={onSave} />
          )}
        </div>
      )}
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        modules={{
          toolbar: readOnly ? null : toolbarOptions,
          clipboard: {
            matchVisual: false,
          },
        }}
        placeholder={value === "" ? "Start you new note..." : ""}
      >
        <Paper
          className={clsx(
            classes.editorPaper,
            { "ql-readOnly": readOnly },
            { [classes.editorPaperReadOnly]: readOnly }
          )}
          elevation={1}
        ></Paper>
      </ReactQuill>
    </>
  );
};

export default QuillEditor;
