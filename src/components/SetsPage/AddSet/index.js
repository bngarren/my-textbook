import React, { useState } from "react";

import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import PlaylistAdd from "@material-ui/icons/PlaylistAdd";

import { addSet } from "../../Firebase";
import { InputAdornment } from "@material-ui/core";

const AddSetForm = ({ user, onPreAdd = (f) => f, onPostAdd = (f) => f }) => {
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (user) {
      const title = value;
      const userId = user.uid;

      onPreAdd();
      handleAddSet(userId, { title: title });
    }
  };

  const handleAddSet = (userId, data) => {
    addSet(userId, data)
      .then((res) => {
        onPostAdd(res); //res is true/false if transaction completed
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
            label="Add Set"
            value={value}
            onChange={handleChange}
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton type="submit">
                    {value.length > 0 && <PlaylistAdd />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
      </form>
    </>
  );
};

export default AddSetForm;
