import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import { Container, Typography } from "@material-ui/core";

import { doSignInWithEmailAndPassword } from "../Firebase";

import * as ROUTES from "../../constants/routes";

const SignInPage = () => {
  const INITIAL_STATE = {
    email: "",
    password: "",
  };

  const [userEntry, setUserEntry] = useState({ ...INITIAL_STATE });
  const [error, setError] = useState(null);

  const history = useHistory();

  const onSubmit = (e) => {
    e.preventDefault();
    const { email, password } = userEntry;

    doSignInWithEmailAndPassword(email, password)
      .then(() => {
        setUserEntry({ ...INITIAL_STATE });
        setError(null);
        history.push(ROUTES.HOME);
      })
      .catch((e) => setError(e));
  };

  const onChange = (e) => {
    e.preventDefault();
    setUserEntry({
      ...userEntry,
      [e.target.name]: e.target.value,
    });
  };

  const isFormValid = () => {
    return userEntry.email !== "" && userEntry.password !== "";
  };

  return (
    <Container>
      <Typography variant="h2">Sign In</Typography>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          value={userEntry.email}
          onChange={onChange}
          type="text"
          placeholder="Email Address"
        />
        <input
          name="password"
          value={userEntry.password}
          onChange={onChange}
          type="password"
          placeholder="Password"
        />
        <button disabled={!isFormValid} type="submit">
          Sign In
        </button>

        {error && <p>{error.message}</p>}
      </form>
    </Container>
  );
};

export default SignInPage;
