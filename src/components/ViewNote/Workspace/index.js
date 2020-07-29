import React from "react";

import Box from "@material-ui/core/Box";

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
  const renderWorkspace = (workspace) => {
    workspace = workspace == null ? WORKSPACES.INFO_WORKSPACE : workspace;

    switch (workspace) {
      case WORKSPACES.INFO_WORKSPACE:
        return <InfoWorkspace />;

      case WORKSPACES.DEFINITION_WORKSPACE:
        return (
          <DefinitionWorkspace
            currentTextSelected={props.currentTextSelected}
          ></DefinitionWorkspace>
        );
      default:
        return "No workspace loaded.";
    }
  };

  return <Box id="workspace">{renderWorkspace(currentWorkspace)}</Box>;
};

export default Workspace;
