import React from "react";
import Button from "@material-ui/core/Button";
import { useFirebase } from "../Firebase";

const SignOutButton = () => {
  const firebase = useFirebase();

  return <Button onClick={firebase.doSignOut}>Sign Out</Button>;
};

export default SignOutButton;
