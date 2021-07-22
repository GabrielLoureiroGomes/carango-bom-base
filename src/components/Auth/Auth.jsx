import React, { useState } from "react";
import {
  Box,
  Button,
  FormHelperText,
  CircularProgress,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";

import useStyles from "./styles";

function Auth({
  children,
  secondaryButton,
  auth,
  redirectTo,
  primaryButtonText,
  shouldSubmit,
  user,
  dispatch,
}) {
  const classes = useStyles();
  const history = useHistory();

  const [{ status, error }, setStatus] = useState({
    status: "idle",
    error: null,
  });

  function handleSubmit(event) {
    event.preventDefault();
    if (shouldSubmit()) {
      submitUser();
    }
  }

  async function submitUser() {
    try {
      setStatus({ status: "loading" });
      await auth({
        user,
        dispatch,
      });
      setStatus({ status: "fulfilled" });
      return history.push(redirectTo);
    } catch (e) {
      setStatus({ status: "rejected", error: e.message });
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Box
        border={1}
        borderColor="grey.500"
        borderRadius={16}
        padding={3}
        display="flex"
        flexDirection="column"
        gridGap={16}
      >
        {children}
        {status === "rejected" ? (
          <FormHelperText error>{error}</FormHelperText>
        ) : null}
        <Box marginTop={2} display="flex" justifyContent="space-between">
          <Button variant="contained" onClick={secondaryButton.onClick}>
            {secondaryButton.name}
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!shouldSubmit()}
          >
            {status === "loading" ? (
              <CircularProgress
                className={classes.colorSecondary}
                color="secondary"
                size={14}
              />
            ) : (
              primaryButtonText
            )}
          </Button>
        </Box>
      </Box>
    </form>
  );
}

Auth.defaultProps = {
  shouldSubmit: () => true,
};

export default Auth;
