import {
  createStyles,
  Grid,
  IconButton,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import Check from "@material-ui/icons/Check";
import Close from "@material-ui/icons/Close";
import { removeToast, ToastContext } from "context/ToastContext";
import React, { useContext } from "react";
import ColorsEnum from "types/ColorsEnum";

const styles = () =>
  createStyles({
    root: {
      position: "fixed",
      right: "20px",
      backgroundColor: ColorsEnum.BGLIGHT,
      zIndex: 10000,
      alignItems: "center",
      width: "fit-content",
    },
  });

const ToastBox: React.FunctionComponent<WithStyles<typeof styles>> = (
  props
) => {
  const { classes } = props;

  const [toastContext, dispatchToastContext] = useContext(ToastContext);

  return (
    <>
      {toastContext.toasts.map((toast, index) => (
        <Grid
          container
          spacing={4}
          className={classes.root}
          style={{
            top: `${20 + index * 40}px`,
          }}
        >
          <Grid item>
            <Check style={{ color: ColorsEnum.GREEN }} />
          </Grid>
          <Grid item>{toast.message}</Grid>
          <Grid item>
            <IconButton
              onClick={() => removeToast(dispatchToastContext, toast)}
              size="small"
            >
              <Close />
            </IconButton>
          </Grid>
        </Grid>
      ))}
    </>
  );
};

export default withStyles(styles)(ToastBox);
