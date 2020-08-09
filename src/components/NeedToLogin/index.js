import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import LockIcon from "@material-ui/icons/Lock";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  needToLoginRoot: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "400px",
    height: "400px",
  },
  needToLoginLinks: {
    display: "flex",
    justifyContent: "space-evenly",
    width: "100%",
  },
});

const NeedToLogin = () => {
  const classes = useStyles();

  return (
    <div className={classes.needToLoginRoot}>
      <div>
        <Typography variant="h4">
          <LockIcon fontSize="large" />
          Sorry
        </Typography>
      </div>
      <div>
        <Typography variant="body1">
          You will need to login to view this content.
        </Typography>
      </div>
      <div className={classes.needToLoginLinks}>
        <Link>Login</Link>
        <Link>Sign Up</Link>
      </div>
    </div>
  );
};

export default NeedToLogin;
