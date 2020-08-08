import React, { useState } from "react";
import MdEditor, { Plugins } from "react-markdown-editor-lite";
import { Markup } from "interweave";

import "react-markdown-editor-lite/lib/index.css";

import {
  useNoteAndCards,
  NOTE_AND_CARDS_ACTION,
} from "../../../hooks/useNoteAndCards";

const EDITOR_PLUGINS = [
  "header",
  "font-bold",
  "font-italic",
  "font-underline",
  "font-strikethrough",
  "block-quote",
  "link",
];

const MarkdownEditor = ({ initialValue }) => {
  const [value, setValue] = useState(initialValue || "");
  const [noteAndCardsState, dispatchNoteAndCards] = useNoteAndCards();

  const handleEditorChange = ({ html, text }) => {
    setValue(text);

    dispatchNoteAndCards({
      type: NOTE_AND_CARDS_ACTION.UPDATE_NOTE_ON_CLIENT,
      payload: text,
    });
  };

  if (noteAndCardsState.noteIsEditable) {
    return (
      <MdEditor
        value={value}
        style={{ height: "500px" }}
        renderHTML={(text) => noteAndCardsState.mdParser.render(text)}
        onChange={handleEditorChange}
        config={{
          view: {
            menu: true,
            md: true,
            html: false,
            hideMenu: false,
          },
        }}
        plugins={EDITOR_PLUGINS}
      />
    );
  } else {
    const html = noteAndCardsState.mdParser.render(
      noteAndCardsState.noteOnClient
    );
    return <Markup content={html} />;
  }
};

export default MarkdownEditor;
