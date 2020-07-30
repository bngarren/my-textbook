import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "center",
    paddingTop: "30px",
  },
});

const SignOutPage = () => {
  const classes = useStyles();

  return (
    <Container className={classes.root}>
      <Typography variant="h5">
        You have successfully been logged out.
      </Typography>
    </Container>
  );
};

export default SignOutPage;
