import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Clear from "@material-ui/icons/Clear";
import FormControl from "@material-ui/core/FormControl";

const useStyles = makeStyles({
  definitionInput: {},
  termInput: {},
  isActive: {
    background: "rgba(225, 245, 254, 0.3)",
    transition: "background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
  },
  outlinedInput: {
    padding: "15px 12px 15px 8px",
    "&$focused $notchedOutlineActive": {
      border: "1px solid rgba(15, 15, 15, 0.6)",
      borderBottom: "2px solid rgba(137, 137, 137, 0.7)",
    },
  },
  notchedOutlineActive: {
    borderBottom: "2px solid rgba(137, 137, 137, 0.7)",
    boxShadow: "0 3px 5px 2px rgba(2, 2, 2, 0.1)",
  },
  notchedOutlineInactive: {
    border: "1px solid rgba(15, 15, 15, 0.6)",
    boxShadow: "0 3px 5px 2px rgba(2, 2, 2, 0.1)",
  },
  formLabelRoot: {
    "&$focused": {
      color: "#1C1C1C",
      fontWeight: "bold",
    },
  },
  focused: {},
  inputAdornmentRoot: {
    transform: "translate(-15px, -30px)",
  },
});

export default function DefinitionInput({
  onClearInput = (f) => f,
  onFocus = (f) => f,
  onChange = (f) => f,
  inputIsEmpty = true,
  ...props
}) {
  const classes = useStyles();
  const isTerm = props.name === "term";
  const { isactive, value, name, label } = props;
  const className = clsx(
    { [classes.definitionInput]: !isTerm, [classes.termInput]: isTerm },
    {
      [classes.isActive]: isactive,
    }
  );

  return (
    <FormControl fullWidth={true}>
      <TextField
        name={name}
        label={label}
        className={className}
        multiline
        rows={5}
        rowsMax={5}
        variant="outlined"
        inputProps={{
          style: {
            textAlign: "center",
            paddingTop: "20px",
            paddingBottom: "10px",
            fontWeight: "bold",
          },
        }}
        InputLabelProps={{
          shrink: true,
          classes: {
            root: classes.formLabelRoot,
            focused: classes.focused,
          },
        }}
        fullWidth={true}
        InputProps={{
          classes: {
            root: classes.outlinedInput,
            notchedOutline: isactive
              ? classes.notchedOutlineActive
              : classes.notchedOutlineInactive,
            focused: classes.focused,
          },
          startAdornment: (
            <InputAdornment
              position="end"
              className={classes.inputAdornmentRoot}
            >
              <IconButton
                aria-label="clear contents"
                onClick={onClearInput}
                onMouseDown={(e) => e.preventDefault()}
                edge="end"
              >
                {!inputIsEmpty ? <Clear /> : null}
              </IconButton>
            </InputAdornment>
          ),
        }}
        onFocus={onFocus}
        onChange={onChange}
        value={value}
        overflow="hidden"
      />
    </FormControl>
  );
}
