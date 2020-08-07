import {
  createStyles,
  MuiThemeProvider,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import SideMenuWrapper from "components/SideMenuWrapper";
import { AppContextProvider } from "context/AppContext";
import { SensorContextProvider } from "context/SensorContext";
import theme from "layout/Theme";
import SensorsPage from "pages/SensorsPage";
import React from "react";

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
      <MuiThemeProvider theme={theme}>
        <AppContextProvider>
          <SensorContextProvider>
            <div className={classes.app}>
              <SideMenuWrapper />
              <SensorsPage />
            </div>
          </SensorContextProvider>
        </AppContextProvider>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(App);
