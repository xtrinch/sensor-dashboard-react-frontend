import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
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
