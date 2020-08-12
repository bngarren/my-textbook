import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import CheckIcon from "@material-ui/icons/Check";
import { InputAdornment } from "@material-ui/core";

import { addNote } from "../../Firebase";

const useStyles = makeStyles({
  textfieldRoot: {},
  checkIconButton: {
    padding: "3px",
  },
  checkIcon: {
    color: "green",
  },
});

const AddNoteForm = ({ user, setId, onNewNoteAdded = (f) => f }) => {
  const classes = useStyles();
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (user && setId) {
      const title = value;
      const userId = user.uid;

      // TODO: NEED TO ENSURE FORM VALIDATION
      // i.e. IS TITLE NOT EMPTY, NO SPECIAL SYMBOLS, ETC...

      // only then...
      handleAddNote(userId, setId, { title: title });
    }
  };

  const handleAddNote = (userId, setId, data) => {
    addNote(userId, setId, data)
      .then((res) => {
        onNewNoteAdded(res); //res is true/false if transaction completed
      })
      .catch((error) => {
        console.error("AddNote.js: Error adding new note: ", error.message);
      });

    setValue("");
  };

  return (
    <>
      <FormControl error>
        <TextField
          variant="outlined"
          value={value}
          placeholder="Title"
          onChange={handleChange}
          size="small"
          className={classes.textfieldRoot}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleSubmit}
                  className={classes.checkIconButton}
                >
                  {value.length > 0 && (
                    <CheckIcon className={classes.checkIcon} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </FormControl>
    </>
  );
};

export default AddNoteForm;
