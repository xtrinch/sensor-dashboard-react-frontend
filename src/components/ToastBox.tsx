import { Grid, IconButton } from '@mui/material';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import Check from '@mui/icons-material/Check';
import Close from '@mui/icons-material/Close';
import { ToastContext } from 'context/ToastContext';
import React, { useContext } from 'react';
import ColorsEnum from 'types/ColorsEnum';
import { observer } from 'mobx-react-lite';

const styles = () =>
  createStyles({
    root: {
      position: 'fixed',
      right: '20px',
      backgroundColor: ColorsEnum.BGLIGHT,
      color: ColorsEnum.WHITE,
      zIndex: 10000,
      alignItems: 'center',
      justifyContent: 'center',
      width: 'fit-content',
      borderRadius: '3px',
    },
  });

const ToastBox: React.FunctionComponent<WithStyles<typeof styles>> = (props) => {
  const { classes } = props;

  const toastContext = useContext(ToastContext);

  return (
    <>
      {toastContext.toasts.map((toast, index) => (
        <Grid
          container
          spacing={4}
          className={classes.root}
          style={{
            bottom: `${20 + index * 40}px`,
            backgroundColor: toast.type === 'success' ? ColorsEnum.OLIVE : ColorsEnum.ERROR,
          }}
          key={index}
        >
          <Grid item>{toast.type === 'success' && <Check />}</Grid>
          <Grid item>{toast.message}</Grid>
          <Grid item>
            <IconButton onClick={() => toastContext.removeToast(toast.id)} size="small">
              <Close />
            </IconButton>
          </Grid>
        </Grid>
      ))}
    </>
  );
};

export default withStyles(styles)(observer(ToastBox));
