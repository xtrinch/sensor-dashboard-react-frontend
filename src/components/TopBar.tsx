import {
  AppBar,
  createStyles,
  Fab,
  Grid,
  IconButton,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import { AppContext } from "context/AppContext";
import React, { useContext } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import ColorsEnum from "types/ColorsEnum";

const styles = (theme) =>
  createStyles({
    root: {
      backgroundColor: ColorsEnum.BGLIGHT,
      padding: "13px 20px",
      [theme.breakpoints.up("md")]: {
        left: "270px",
      },
      boxShadow: "none",
      minHeight: "60px",
      justifyContent: "center",
    },
    menuIcon: {
      [theme.breakpoints.up("md")]: {
        display: "none",
      },
    },
  });

interface TopBarProps {
  alignItems?: string;
  noGridItem?: boolean;
  backEnabled?: boolean;
}

const TopBar: React.FunctionComponent<
  WithStyles<typeof styles> & TopBarProps & RouteComponentProps<{}>
> = (props) => {
  const { classes, backEnabled, history } = props;

  const [, dispatch] = useContext(AppContext);

  const handleDrawerToggle = () => {
    dispatch({ type: "toggle" });
  };

  return (
    <AppBar
      position="sticky"
      color="secondary"
      className={classes.root}
      style={{ alignItems: props.alignItems }}
    >
      <Grid container spacing={5} style={{ justifyContent: "center" }}>
        <Grid item className={classes.menuIcon} xs={1}>
          <div
            style={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <IconButton
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              size="medium"
              color="secondary"
              style={{ padding: "6px" }}
              edge={false}
            >
              <MenuIcon />
            </IconButton>
          </div>
        </Grid>
        {backEnabled && (
          <Grid item xs={1}>
            <Fab color="primary" size="small" onClick={() => history.goBack()}>
              <NavigateBeforeIcon />
            </Fab>
          </Grid>
        )}
        {props.noGridItem && props.children}
        {!props.noGridItem && (
          <Grid
            item
            sm={backEnabled ? 11 : 12}
            xs={backEnabled ? 10 : 11}
            style={{
              justifyContent: props.alignItems,
              alignItems: "center",
              display: "flex",
            }}
          >
            {props.children}
          </Grid>
        )}
      </Grid>
    </AppBar>
  );
};

export default withRouter(withStyles(styles)(TopBar));
