import React, { useState } from "react";

import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import PlaylistAdd from "@material-ui/icons/PlaylistAdd";

import { addSet } from "../../Firebase";

const AddSetForm = ({ user, onNewSetAdded = (f) => f }) => {
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (user) {
      const title = value;
      const userId = user.uid;

      handleAddSet(userId, { title: title });
    }
  };

  const handleAddSet = (userId, data) => {
    addSet(userId, data)
      .then((res) => {
        onNewSetAdded(res); //res is true/false if transaction completed
      })
      .catch((e) => {
        console.error("AddSet.js: Error adding new set: ", e.message);
      });

    setValue("");
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <FormControl error>
          <TextField
            variant="outlined"
            label="Add Set"
            value={value}
            onChange={handleChange}
            size="small"
          />
        </FormControl>
        <IconButton type="submit">
          <PlaylistAdd />
        </IconButton>
      </form>
    </>
  );
};

export default AddSetForm;
