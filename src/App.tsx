import {
  createStyles,
  Grid,
  MuiThemeProvider,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import ConfirmationBox from "components/ConfirmationBox";
import ErrorBox from "components/ErrorBox";
import SideMenuWrapper from "components/SideMenuWrapper";
import ToastBox from "components/ToastBox";
import { AccountContextProvider } from "context/AccountContext";
import { AppContextProvider } from "context/AppContext";
import { ConfirmationContextProvider } from "context/ConfirmationContext";
import { DisplayContextProvider } from "context/DisplayContext";
import { ErrorContextProvider } from "context/ErrorContext";
import { ForwarderContextProvider } from "context/ForwarderContext";
import { SensorContextProvider } from "context/SensorContext";
import { ToastContextProvider } from "context/ToastContext";
import { UserContextProvider } from "context/UserContext";
import theme from "layout/Theme";
import DashboardIndexPage from "pages/dashboard/DashboardIndexPage";
import { DashboardRoutes } from "pages/dashboard/DashboardRoutes";
import ForumIndexPage from "pages/forum/ForumIndexPage";
import { ForumRoutes } from "pages/forum/ForumRoutes";
import LoginPage from "pages/LoginPage";
import RegisterPage from "pages/RegisterPage";
import UserListPage from "pages/users/UserListPage";
import { UserRoutes } from "pages/users/UserRoutes";
import React from "react";
import { BrowserRouter, Redirect, Route } from "react-router-dom";
import ColorsEnum from "types/ColorsEnum";
import { Routes } from "utils/Routes";
import Wrapper from "Wrapper";

const styles = () =>
  createStyles({
    "@global": {
      "*::-webkit-scrollbar": {
        width: "0.4em",
      },
      "*::-webkit-scrollbar-track": {
        "-webkit-box-shadow": `inset 0 0 6px ${ColorsEnum.BGDARK}`,
      },
      "*::-webkit-scrollbar-thumb": {
        backgroundColor: ColorsEnum.BGLIGHTER,
        outline: "0px solid slategrey",
      },
    },
    app: {
      minHeight: "100vh",
      backgroundColor: ColorsEnum.BGDARK,
      width: "100%",
    },
    main: {
      flex: "1",
    },
  });

class App extends React.Component<WithStyles<typeof styles>> {
  render() {
    const { classes } = this.props;
    return (
      <BrowserRouter>
        <MuiThemeProvider theme={theme}>
          <AccountContextProvider>
            <AppContextProvider>
              <SensorContextProvider>
                <ConfirmationContextProvider>
                  <DisplayContextProvider>
                    <UserContextProvider>
                      <ForwarderContextProvider>
                        <ToastContextProvider>
                          <ErrorContextProvider>
                            <Wrapper>
                              <ToastBox />
                              <ConfirmationBox />
                              <ErrorBox />
                              <Grid container className={classes.app}>
                                <Grid item>
                                  <SideMenuWrapper />
                                </Grid>
                                <Grid item style={{ flex: "1" }}>
                                  <Route exact path="/">
                                    <Redirect to={DashboardRoutes.DASHBOARD} />
                                  </Route>
                                  <Route path={DashboardRoutes.DASHBOARD}>
                                    <DashboardIndexPage />
                                  </Route>
                                  <Route path={ForumRoutes.FORUM}>
                                    <ForumIndexPage />
                                  </Route>
                                  <Route exact path={UserRoutes.USERS}>
                                    <UserListPage />
                                  </Route>
                                  <Route exact path={Routes.LOGIN}>
                                    <LoginPage />
                                  </Route>
                                  <Route exact path={Routes.REGISTER}>
                                    <RegisterPage />
                                  </Route>
                                </Grid>
                              </Grid>
                            </Wrapper>
                          </ErrorContextProvider>
                        </ToastContextProvider>
                      </ForwarderContextProvider>
                    </UserContextProvider>
                  </DisplayContextProvider>
                </ConfirmationContextProvider>
              </SensorContextProvider>
            </AppContextProvider>
          </AccountContextProvider>
        </MuiThemeProvider>
      </BrowserRouter>
    );
  }
}

export default withStyles(styles)(App);
