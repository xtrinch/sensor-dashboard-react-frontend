import {
  AppBar,
  createStyles,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import React from "react";
import ColorsEnum from "types/ColorsEnum";

const styles = (theme) =>
  createStyles({
    timePicker: {
      backgroundColor: ColorsEnum.BGLIGHT,
      padding: "13px 20px",
      [theme.breakpoints.up("md")]: {
        left: "270px",
      },
      boxShadow: "none",
    },
  });

const TopBar: React.FunctionComponent<
  WithStyles<typeof styles> & { alignItems?: string }
> = (props) => {
  const { classes } = props;

  return (
    <AppBar
      position="sticky"
      color="secondary"
      className={classes.timePicker}
      style={{ alignItems: props.alignItems }}
    >
      {props.children}
    </AppBar>
  );
};

export default withStyles(styles)(TopBar);
