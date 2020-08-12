import React, { useState } from "react";

import Box from "@material-ui/core/Box";

import InfoWorkspace from "./InfoWorkspace";
import DefinitionWorkspace from "./DefinitionWorkspace";
import Loading from "../../Loading";
import {
  useNoteAndCards,
  NOTE_AND_CARDS_ACTION,
} from "../../../hooks/useNoteAndCards";
import { findAllByDisplayValue } from "@testing-library/react";

export const WORKSPACES = Object.freeze({
  INFO_WORKSPACE: "infoWorkspace",
  DEFINITION_WORKSPACE: "definitionWorkspace",
  FILLBLANK_WORKSPACE: "fillBlankWorkspace",
});

/*
  This Workspace component houses the individual workspaces and implements functionality that should be common
  to all workspaces, e.g. Save Card.
*/
const Workspace = ({
  currentTextSelected,
  currentWorkspace = WORKSPACES.INFO_WORKSPACE,
}) => {
  const [noteAndCardsState, dispatchNoteAndCards] = useNoteAndCards();
  const [isLoading, setIsLoading] = useState(false);

  /* When each workspace has its 'save' button clicked, it will be handled here 
  The 'specificWorkspaceCallback' parameter is provided by the child workspace component
  who initiated the save card action and should be a callback function so that this 
  child component can be notified when save action is completed
  */
  const onWorkspaceSaveCard = (cardData, specificWorkspaceCallback) => {
    setIsLoading(true);

    //this dispatch function takes it own callback function as a parameter
    dispatchNoteAndCards({
      type: NOTE_AND_CARDS_ACTION.ADD_CARD,
      payload: {
        cardData: cardData,
        callback: (result) => {
          if (typeof specificWorkspaceCallback === "function") {
            // this is the callback provided by the specific workspace so it can know that the addCard is complete
            specificWorkspaceCallback(result);
          }
          setIsLoading(false);
        },
      },
    });
  };

  const renderWorkspace = (workspace) => {
    switch (workspace) {
      case WORKSPACES.DEFINITION_WORKSPACE:
        return (
          <DefinitionWorkspace
            currentTextSelected={currentTextSelected}
            onWorkspaceSaveCard={onWorkspaceSaveCard}
          ></DefinitionWorkspace>
        );
      case WORKSPACES.INFO_WORKSPACE:
        return <InfoWorkspace />;
      default:
        return null;
    }
  };

  return (
    <Box id="workspace">
      {isLoading ? (
        <Loading type="smallGrey" relative={true} delay={false} />
      ) : (
        renderWorkspace(currentWorkspace)
      )}
    </Box>
  );
};

export default Workspace;
