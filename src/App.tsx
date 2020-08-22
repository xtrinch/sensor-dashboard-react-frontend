import {
  createStyles,
  MuiThemeProvider,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import SideMenuWrapper from "components/SideMenuWrapper";
import { AccountContextProvider } from "context/AccountContext";
import { AppContextProvider } from "context/AppContext";
import { SensorContextProvider } from "context/SensorContext";
import theme from "layout/Theme";
import LoginPage from "pages/LoginPage";
import RegisterPage from "pages/RegisterPage";
import SensorsPage from "pages/SensorsPage";
import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

const styles = () =>
  createStyles({
    app: {
      backgroundImage: 'url("/background.png")',
      display: "flex",
      flexDirection: "row",
      minHeight: "100vh",
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
                <div className={classes.app}>
                  <SideMenuWrapper />
                  <Route exact path="/">
                    <SensorsPage />
                  </Route>
                  <Route exact path="/login">
                    <LoginPage />
                  </Route>
                  <Route exact path="/register">
                    <RegisterPage />
                  </Route>
                </div>
              </SensorContextProvider>
            </AppContextProvider>
          </AccountContextProvider>
        </MuiThemeProvider>
      </BrowserRouter>
    );
  }
}

export default withStyles(styles)(App);
