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
import AddSensorPage from "pages/AddSensorPage";
import LoginPage from "pages/LoginPage";
import RegisterPage from "pages/RegisterPage";
import SensorInfoPage from "pages/SensorInfoPage";
import SensorsPage from "pages/SensorsPage";
import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import ColorsEnum from "types/ColorsEnum";

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
      display: "flex",
      flexDirection: "row",
      minHeight: "100vh",
      backgroundColor: ColorsEnum.BGDARK,
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
                  <Route exact path="/add-sensor">
                    <AddSensorPage />
                  </Route>
                  <Route exact path="/sensor/:id">
                    <SensorInfoPage />
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
