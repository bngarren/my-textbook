import React, { Component } from "react";

import SaveButton from "./SaveButton";
import FlipButton from "./FlipButton";
import Grid from "@material-ui/core/Grid";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";

import DefinitionInput from "./DefinitionInput";

class DefinitionWorkspace extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTermValue: "",
      currentDefinitionValue: "",
      activeInput: null,
      isReadyToSave: false,
    };
  }

  componentDidUpdate(prevProps) {
    const currentText = this.props.currentTextSelected;
    const previousText = prevProps.currentTextSelected;

    /* Do this if we have an Active input AND text selection from NoteView component has changed from previous
     */
    if (this.state.activeInput !== null && previousText !== currentText) {
      /* Is this new text selection something more than just whitespace?
       */
      if (currentText !== null && currentText.trim() !== "") {
        if (this.state.activeInput === "term") {
          this.setState({
            currentTermValue: currentText,
          });
        } else if (this.state.activeInput === "definition") {
          this.setState({
            currentDefinitionValue: currentText,
          });
        }
      } else {
        /* Else: this new text selection was just blank, probably intending to click out
         */
        this.setState({
          //activeInput: null,
        });
      }
    }

    this.checkReadyToSave();
  }

  onInputClickAway(e) {
    if (
      this.props.currentTextSelected === null ||
      this.props.currentTextSelected === ""
    ) {
      this.setState({
        activeInput: null,
      });
    }
  }

  onFocusInput(e) {
    this.setState({
      activeInput: e.target.name,
    });
  }

  onChangeInput(e) {
    const input = e.target.name;
    if (input === "term") {
      this.setState({
        currentTermValue: e.target.value,
      });
    } else if (input === "definition") {
      this.setState({
        currentDefinitionValue: e.target.value,
      });
    }
  }

  onClearTermInput(e) {
    this.setState({
      currentTermValue: "",
    });
  }

  onClearDefinitionInput(e) {
    this.setState({
      currentDefinitionValue: "",
    });
  }

  onFlip(e) {
    this.setState((prevState) => ({
      currentTermValue: prevState.currentDefinitionValue,
      currentDefinitionValue: prevState.currentTermValue,
    }));
  }

  anInputIsEmpty() {
    return (
      this.state.currentTermValue.trim() === "" ||
      this.state.currentDefinitionValue.trim() === ""
    );
  }

  checkReadyToSave() {
    const inputIsEmpty = this.anInputIsEmpty();

    if (this.state.isReadyToSave && inputIsEmpty) {
      this.setState({
        isReadyToSave: false,
      });
    } else if (!this.state.isReadyToSave && !inputIsEmpty) {
      this.setState({
        isReadyToSave: true,
      });
    }
  }

  render() {
    return (
      <Grid container spacing={2} justify="space-evenly">
        <ClickAwayListener onClickAway={this.onInputClickAway.bind(this)}>
          <Grid container item lg={10} spacing={2}>
            <Grid item xs={12} md={6}>
              <DefinitionInput
                isactive={this.state.activeInput === "term"}
                name="term"
                label="Term"
                onFocus={this.onFocusInput.bind(this)}
                onChange={this.onChangeInput.bind(this)}
                value={this.state.currentTermValue}
                onClearInput={this.onClearTermInput.bind(this)}
                inputIsEmpty={this.state.currentTermValue === ""}
              />
            </Grid>
            <Grid item xs>
              <DefinitionInput
                isactive={this.state.activeInput === "definition"}
                name="definition"
                label="Definition"
                onFocus={this.onFocusInput.bind(this)}
                onChange={this.onChangeInput.bind(this)}
                value={this.state.currentDefinitionValue}
                onClearInput={this.onClearDefinitionInput.bind(this)}
                inputIsEmpty={this.state.currentDefinitionValue === ""}
              />
            </Grid>
          </Grid>
        </ClickAwayListener>
        <Grid item container lg={1} sm={12} justify="center" spacing={2}>
          <Grid item>
            <SaveButton isEnabled={this.state.isReadyToSave} type="submit" />
          </Grid>
          <Grid item>
            <FlipButton isEnabled={true} onClick={this.onFlip.bind(this)} />
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default DefinitionWorkspace;
