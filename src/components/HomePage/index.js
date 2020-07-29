import React from "react";

import { Link } from "react-router-dom";
import * as ROUTES from "../../constants/routes";

const HomePage = () => {
  // This is just hard coded link for development
  const noteLink = `${ROUTES.NOTE}/cbNW3nAieisZyUuXF8pN`;

  return (
    <div>
      This is the home page
      <br />
      <Link to={noteLink}>Note</Link>
    </div>
  );
};

export default HomePage;
