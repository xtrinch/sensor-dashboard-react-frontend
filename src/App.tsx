import {
  WithStyles,
  createStyles,
  withStyles,
  MuiThemeProvider,
} from "@material-ui/core";
import React from "react";
import SideMenu from "components/SideMenu";
import SensorsPage from "pages/SensorsPage";
import theme from "layout/Theme";
import { SensorContextProvider } from "context/SensorContext";

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
        <SensorContextProvider>
          <div className={classes.app}>
            <SideMenu />
            <SensorsPage />
          </div>
        </SensorContextProvider>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(App);
