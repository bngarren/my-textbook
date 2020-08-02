import React from "react";
import { Link } from "react-router-dom";
import * as ROUTES from "../../constants/routes";

const NoteLink = ({ noteId, children }) => {
  let path = "/";

  if (noteId) {
    path = `${ROUTES.NOTE_PAGE}/${noteId}`;
  }

  return <Link to={path}>{children}</Link>;
};

export default NoteLink;
