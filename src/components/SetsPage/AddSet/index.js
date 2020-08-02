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
      const userSetsId = user.userSetsId || null;

      handleAddSet(userId, userSetsId, { title: title });
    }
  };

  const handleAddSet = (userId, userSetsId, data) => {
    try {
      addSet(userId, userSetsId, data).then((res) => {
        onNewSetAdded(res);
      });
    } catch (error) {
      console.log(error.message);
    }
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
