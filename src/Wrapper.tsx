import { createStyles, withStyles, WithStyles } from '@material-ui/core';
import { ConfirmationContext } from 'context/ConfirmationContext';
import { ErrorContext } from 'context/ErrorContext';
import { ToastContext } from 'context/ToastContext';
import React, { useContext } from 'react';

const styles = (theme) => createStyles({});

const Wrapper: React.FunctionComponent<WithStyles<typeof styles>> = (props) => {
  const [, dispatchConfirmationContext] = useContext(ConfirmationContext);
  const [, dispatchError] = useContext(ErrorContext);
  const [, dispatchToast] = useContext(ToastContext);

  ErrorContext.dispatch = dispatchError;
  ConfirmationContext.dispatch = dispatchConfirmationContext;
  ToastContext.dispatch = dispatchToast;

  return <>{props.children}</>;
};

export default withStyles(styles)(Wrapper);
