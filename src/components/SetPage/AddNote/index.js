import React, { useState } from "react";

import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import NoteAddIcon from "@material-ui/icons/NoteAdd";

import { addNote } from "../../Firebase";

const AddNoteForm = ({ user, setId, onNewNoteAdded = (f) => f }) => {
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (user && setId) {
      const title = value;
      const userId = user.uid;

      handleAddNote(userId, setId, { title: title });
    }
  };

  const handleAddNote = (userId, userSetsId, data) => {
    try {
      addNote(userId, setId, data).then((res) => {
        onNewNoteAdded(res); //res is true/false if transaction completed
      });
    } catch (error) {
      console.error("AddNote.js: Error adding new note: ", error.message);
    }
    setValue("");
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <FormControl error>
          <TextField
            variant="outlined"
            label="Add Note"
            value={value}
            onChange={handleChange}
            size="small"
          />
        </FormControl>
        <IconButton type="submit">
          <NoteAddIcon />
        </IconButton>
      </form>
    </>
  );
};

export default AddNoteForm;
