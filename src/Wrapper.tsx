import { createStyles, withStyles, WithStyles } from "@material-ui/core";
import { AccountContext } from "context/AccountContext";
import { ConfirmationContext } from "context/ConfirmationContext";
import { DisplayContext } from "context/DisplayContext";
import { ErrorContext } from "context/ErrorContext";
import { SensorContext } from "context/SensorContext";
import { ToastContext } from "context/ToastContext";
import React, { useContext } from "react";

const styles = (theme) => createStyles({});

const Wrapper: React.FunctionComponent<WithStyles<typeof styles>> = (props) => {
  const [, dispatchSensor] = useContext(SensorContext);
  const [, dispatchAccount] = useContext(AccountContext);
  const [, dispatchConfirmationContext] = useContext(ConfirmationContext);
  const [, dispatchError] = useContext(ErrorContext);
  const [, dispatchDisplay] = useContext(DisplayContext);
  const [, dispatchToast] = useContext(ToastContext);

  // todo: put in an App.tsx wrapper
  ErrorContext.dispatch = dispatchError;
  SensorContext.dispatch = dispatchSensor;
  DisplayContext.dispatch = dispatchDisplay;
  ConfirmationContext.dispatch = dispatchConfirmationContext;
  ToastContext.dispatch = dispatchToast;
  AccountContext.dispatch = dispatchAccount;

  return <React.Fragment>{props.children}</React.Fragment>;
};

export default withStyles(styles)(Wrapper);
