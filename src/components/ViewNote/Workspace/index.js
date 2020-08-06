import React from "react";

import Box from "@material-ui/core/Box";

import { useSetCards } from "../../../hooks/useSetCards";
import InfoWorkspace from "./InfoWorkspace";
import DefinitionWorkspace from "./DefinitionWorkspace";

export const WORKSPACES = Object.freeze({
  INFO_WORKSPACE: "infoWorkspace",
  DEFINITION_WORKSPACE: "definitionWorkspace",
});

const Workspace = ({
  currentWorkspace = WORKSPACES.INFO_WORKSPACE,
  ...props
}) => {
  /* this custom hook helps save a card */
  const addCardToSetCards = useSetCards();

  /* When each workspace has its 'save' button clicked, it will be handled here */
  const onWorkspaceSaveCard = (cardData, callback) => {
    const { side_one, side_two } = cardData;
    // the third parameter here is an inline arrow function callback sent to the addCardToSetCards function in the useSetCards hook
    addCardToSetCards(side_one, side_two, (result) => {
      if (typeof callback === "function") {
        // this is the callback provided by the specific workspace so it can know that the addCard is complete
        callback(result);
      }
    });
  };

  const renderWorkspace = (workspace) => {
    workspace = workspace == null ? WORKSPACES.INFO_WORKSPACE : workspace;

    switch (workspace) {
      case WORKSPACES.INFO_WORKSPACE:
        return <InfoWorkspace />;

      case WORKSPACES.DEFINITION_WORKSPACE:
        return (
          <DefinitionWorkspace
            currentTextSelected={props.currentTextSelected}
            onWorkspaceSaveCard={onWorkspaceSaveCard}
          ></DefinitionWorkspace>
        );
      default:
        return "No workspace loaded.";
    }
  };

  return <Box id="workspace">{renderWorkspace(currentWorkspace)}</Box>;
};

export default Workspace;
