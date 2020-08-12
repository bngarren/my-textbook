import React, { useState, useEffect, useRef } from "react";

import { useHotkeys } from "react-hotkeys-hook";

import SaveButton from "./SaveButton";
import FlipButton from "./FlipButton";
import Grid from "@material-ui/core/Grid";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";

import DefinitionInput from "./DefinitionInput";

const DefinitionWorkspace = ({
  currentTextSelected,
  onWorkspaceSaveCard = (f) => f,
}) => {
  const [termValue, setTermValue] = useState("");
  const [definitionValue, setDefinitionValue] = useState("");
  const [activeInput, setActiveInput] = useState(null);
  const [readyToSave, setReadyToSave] = useState(false);
  const prevTextSelected = useRef(currentTextSelected);

  useEffect(() => {
    // Only act if we have an active input
    if (activeInput === null) {
      return;
    }

    // Only act if the new selection is different and NOT just whitespace
    if (
      currentTextSelected !== null &&
      currentTextSelected.trim() !== "" &&
      currentTextSelected !== prevTextSelected
    ) {
      switch (activeInput) {
        case "term":
          setTermValue(currentTextSelected);
          break;
        case "definition":
          setDefinitionValue(currentTextSelected);
          break;
      }
    }
  }, [currentTextSelected]);

  const handleHotkeyFor = (inputBox, shouldAddend) => {
    if (activeInput !== null || currentTextSelected == null) {
      return;
    }

    const handleAddend = (value) => {
      if (value.trim() === "") {
        return currentTextSelected;
      } else {
        return value + "\n" + currentTextSelected;
      }
    };

    if (inputBox === "term") {
      if (shouldAddend) {
        setTermValue((value) => handleAddend(value));
      } else {
        setTermValue(currentTextSelected);
      }
    } else if (inputBox === "definition") {
      if (shouldAddend) {
        setDefinitionValue((value) => handleAddend(value));
      } else {
        setDefinitionValue(currentTextSelected);
      }
    }
  };

  /* ------ HOT KEYS ---- */
  useHotkeys("q", () => handleHotkeyFor("term", true), [currentTextSelected]);

  useHotkeys("w", () => handleHotkeyFor("definition", true), [
    currentTextSelected,
  ]);

  /* -------------------------- */

  useEffect(() => {
    if (termValue == null || definitionValue == null) {
      return;
    }
    const anInputIsEmpty =
      termValue.trim() === "" || definitionValue.trim() === "";

    setReadyToSave(!anInputIsEmpty);
  }, [termValue, definitionValue]);

  const onInputClickAway = () => {
    if (currentTextSelected === null || currentTextSelected === "") {
      setActiveInput(null);
    }
  };

  const onFocusInput = (e) => {
    setActiveInput(e.target.name);
  };

  const onChangeInput = (e) => {
    const input = e.target.name;
    if (input === "term") {
      setTermValue(e.target.value);
    } else if (input === "definition") {
      setDefinitionValue(e.target.value);
    }
  };

  const onClearTermInput = () => {
    setTermValue("");
  };

  const onClearDefinitionInput = () => {
    setDefinitionValue("");
  };

  const onSave = () => {
    /*
     * In the 1st paramater we send the card data (side one and side two)
     * In the 2nd paramater we send a callback which will receive a result (boolean) if the
     * addCard was successful or not
     */
    onWorkspaceSaveCard(
      { side_one: termValue, side_two: definitionValue },
      (result) => {
        if (result) {
          setTermValue("");
          setDefinitionValue("");
        }
      }
    );
  };

  const onFlip = () => {
    const term = termValue;
    const def = definitionValue;
    setTermValue(def);
    setDefinitionValue(term);
  };

  return (
    <Grid container spacing={2} justify="space-evenly">
      <ClickAwayListener onClickAway={onInputClickAway}>
        <Grid container item spacing={2}>
          <Grid item xs={12}>
            <DefinitionInput
              isactive={activeInput === "term"}
              name="term"
              label="Term"
              onFocus={(e) => onFocusInput(e)}
              onChange={(e) => onChangeInput(e)}
              value={termValue}
              onClearInput={onClearTermInput}
              inputIsEmpty={termValue === ""}
            />
          </Grid>
          <Grid item xs>
            <DefinitionInput
              isactive={activeInput === "definition"}
              name="definition"
              label="Definition"
              onFocus={(e) => onFocusInput(e)}
              onChange={(e) => onChangeInput(e)}
              value={definitionValue}
              onClearInput={onClearDefinitionInput}
              inputIsEmpty={definitionValue === ""}
            />
          </Grid>
        </Grid>
      </ClickAwayListener>
      <Grid item container xs={12} justify="center" spacing={2}>
        <Grid item>
          <SaveButton isEnabled={readyToSave} onClick={onSave} />
        </Grid>
        <Grid item>
          <FlipButton
            isEnabled={termValue.trim() !== "" || definitionValue.trim() !== ""}
            onClick={onFlip}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DefinitionWorkspace;
