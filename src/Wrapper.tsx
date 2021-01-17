import { createStyles, withStyles, WithStyles } from "@material-ui/core";
import { AccountContext } from "context/AccountContext";
import { AppContext } from "context/AppContext";
import { ConfirmationContext } from "context/ConfirmationContext";
import { ErrorContext } from "context/ErrorContext";
import { ForwarderContext } from "context/ForwarderContext";
import { SensorContext } from "context/SensorContext";
import { ToastContext } from "context/ToastContext";
import React, { useContext } from "react";

const styles = (theme) => createStyles({});

const Wrapper: React.FunctionComponent<WithStyles<typeof styles>> = (props) => {
  const [, dispatchSensor] = useContext(SensorContext);
  const [, dispatchAccount] = useContext(AccountContext);
  const [, dispatchConfirmationContext] = useContext(ConfirmationContext);
  const [, dispatchError] = useContext(ErrorContext);
  const [, dispatchForwarder] = useContext(ForwarderContext);
  const [, dispatchToast] = useContext(ToastContext);
  const [, dispatchApp] = useContext(AppContext);

  ErrorContext.dispatch = dispatchError;
  SensorContext.dispatch = dispatchSensor;
  ForwarderContext.dispatch = dispatchForwarder;
  ConfirmationContext.dispatch = dispatchConfirmationContext;
  ToastContext.dispatch = dispatchToast;
  AccountContext.dispatch = dispatchAccount;
  AppContext.dispatch = dispatchApp;

  return <React.Fragment>{props.children}</React.Fragment>;
};

export default withStyles(styles)(Wrapper);
