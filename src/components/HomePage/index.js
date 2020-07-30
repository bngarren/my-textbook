import React from "react";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import * as ROUTES from "../../constants/routes";

const useStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "center",
    paddingTop: "30px",
  },
});

const HomePage = () => {
  const classes = useStyles();

  // This is just hard coded link for development
  const noteLink = `${ROUTES.NOTE}/cbNW3nAieisZyUuXF8pN`;

  return (
    <Container className={classes.root}>
      <Typography variant="h4">Welcome</Typography>
    </Container>
  );
};

export default HomePage;
