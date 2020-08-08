import React from "react";

import Box from "@material-ui/core/Box";

import InfoWorkspace from "./InfoWorkspace";
import DefinitionWorkspace from "./DefinitionWorkspace";
import EditNoteWorkspace from "./EditNoteWorkspace";
import {
  useNoteAndCards,
  NOTE_AND_CARDS_ACTION,
} from "../../../hooks/useNoteAndCards";

export const WORKSPACES = Object.freeze({
  INFO_WORKSPACE: "infoWorkspace",
  EDITNOTE_WORKSPACE: "editNoteWorkspace",
  DEFINITION_WORKSPACE: "definitionWorkspace",
});

const Workspace = ({
  currentTextSelected,
  currentWorkspace = WORKSPACES.INFO_WORKSPACE,
}) => {
  const [noteAndCardsState, dispatchNoteAndCards] = useNoteAndCards();

  /* this custom hook helps save a card */
  const addCardToSetCards = useNoteAndCards();

  /* When each workspace has its 'save' button clicked, it will be handled here */
  const onWorkspaceSaveCard = (cardData, specificWorkspaceCallback) => {
    dispatchNoteAndCards({
      type: NOTE_AND_CARDS_ACTION.ADD_CARD,
      payload: {
        cardData: cardData,
        callback: (result) => {
          if (typeof specificWorkspaceCallback === "function") {
            // this is the callback provided by the specific workspace so it can know that the addCard is complete
            specificWorkspaceCallback(result);
          }
        },
      },
    });
  };

  const renderWorkspace = (workspace) => {
    switch (workspace) {
      case WORKSPACES.EDITNOTE_WORKSPACE:
        return <EditNoteWorkspace />;
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

  return <Box id="workspace">{renderWorkspace(currentWorkspace)}</Box>;
};

export default Workspace;
