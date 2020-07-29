import React, { useState } from "react";

import Container from "@material-ui/core";

import { useFirebase } from "../Firebase/context";

const SignInPage = () => {
  const INITIAL_STATE = {
    email: "",
    password: "",
  };

  const [userEntry, setUserEntry] = useState({ ...INITIAL_STATE });
  const [error, setError] = useState(null);

  const firebase = useFirebase();

  const onSubmit = (e) => {
    const { email, password } = userEntry;

    firebase.doSignInWithEmailAndPassword(email, password).then(() => {
      setUserEntry({ ...INITIAL_STATE });
      setError(null);
    });

    e.preventDefault();
  };

  const onChange = (e) => {};

  const isFormValid = () => {
    return userEntry.email !== "" && userEntry.password !== "";
  };

  return (
    <Container>
      <form onSubmit={this.onSubmit}>
        <input
          name="email"
          value={userEntry.email}
          onChange={this.onChange}
          type="text"
          placeholder="Email Address"
        />
        <input
          name="password"
          value={userEntry.password}
          onChange={this.onChange}
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
