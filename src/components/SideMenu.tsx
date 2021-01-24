import { createStyles, Grid, ListSubheader } from "@material-ui/core";
import { withStyles, WithStyles } from "@material-ui/styles";
import Logo from "assets/transistor.svg"; // with import
import Link from "components/Link";
import MainMenu from "components/MainMenu";
import { AccountContext } from "context/AccountContext";
import { drawerToggle } from "context/AppContext";
import { openConfirmation } from "context/ConfirmationContext";
import SensorsSideMenu from "pages/dashboard/components/SensorsSideMenu";
import { DashboardRoutes } from "pages/dashboard/DashboardRoutes";
import { getUserRoute } from "pages/users/UserRoutes";
import React, { useContext } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import ColorsEnum from "types/ColorsEnum";
import { Routes } from "utils/Routes";

const styles = () =>
  createStyles({
    root: {
      width: "270px",
      height: "100%",
    },
    subheader: {
      textTransform: "none",
      fontSize: "12px",
      backgroundColor: ColorsEnum.BGLIGHT,
      lineHeight: "19px",
      textAlign: "right",
    },
    listTitle: {
      textTransform: "uppercase",
      padding: "5px 16px",
      minHeight: "40px",
      // borderTop: `1px solid ${ColorsEnum.GRAYDARK}`,
      backgroundColor: ColorsEnum.BGLIGHTER,
      color: "white",
    },
    logoContainer: {
      display: "flex",
      justifyContent: "center",
      width: "40px",
      height: "70px",
      "& img": {
        width: "70px",
      },
    },
    sensorFab: {
      width: "30px",
      height: "30px",
      minHeight: "30px",
      color: ColorsEnum.BLUE,
      backgroundColor: "transparent",
      "& .MuiSvgIcon-root": {
        fontSize: "25px!important",
      },
    },
  });

interface SideMenuProps {}

const SideMenu: React.FunctionComponent<
  SideMenuProps & WithStyles<typeof styles> & RouteComponentProps<{}>
> = (props) => {
  const {
    history,
    location: { pathname },
  } = props;
  const {
    logout,
    state: { loginState, user },
  } = useContext(AccountContext);

  const logoutWithConfirmation = () => {
    const onConfirm = async () => {
      await logout();
      drawerToggle();
      history.push("/");
    };
    openConfirmation(onConfirm, null, "Are you sure you want to logout?");
  };

  const { classes } = props;
  return (
    <div className={classes.root}>
      <ListSubheader disableGutters className={classes.subheader}>
        <Grid container style={{ padding: "15px" }} justify="space-between">
          <Grid item className={classes.logoContainer}>
            <Link to="/" onClick={drawerToggle}>
              <img alt="logo" src={Logo} />
            </Link>
          </Grid>
          {(loginState === "LOGGED_OUT" || loginState === "LOGIN_ERROR") && (
            <Grid item>
              <Link to={Routes.LOGIN} onClick={drawerToggle}>
                Login
              </Link>{" "}
              &nbsp; | &nbsp;
              <Link to={Routes.REGISTER} onClick={drawerToggle}>
                Register
              </Link>
            </Grid>
          )}
          {loginState === "LOGGED_IN" && (
            <Grid item>
              <div>
                Logged in as{" "}
                <Link to={getUserRoute(user.id)} color={ColorsEnum.YELLOW}>
                  {user.username}
                </Link>
              </div>
              <Link onClick={() => logoutWithConfirmation()}>Logout</Link>
            </Grid>
          )}
        </Grid>
        <MainMenu />
      </ListSubheader>
      {pathname.indexOf(DashboardRoutes.DASHBOARD) >= 0 && <SensorsSideMenu />}
    </div>
  );
};

export default withStyles(styles)(withRouter(SideMenu));
