import {
  WithStyles,
  createStyles,
  withStyles,
  MuiThemeProvider,
} from "@material-ui/core";
import React from "react";
import SideMenu from "components/SideMenu";
import { Provider, observer } from "mobx-react";
import SensorStore from "stores/SensorStore";
import SensorsPage from "pages/SensorsPage";
import theme from "layout/Theme";

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

@observer
class App extends React.Component<WithStyles<typeof styles>> {
  private sensorStore: SensorStore;

  constructor(props: any) {
    super(props);
    this.sensorStore = new SensorStore();
    this.sensorStore.listSensors();
  }

  render() {
    const { classes } = this.props;
    const { sensors } = this.sensorStore;
    return (
      <MuiThemeProvider theme={theme}>
        <Provider sensorStore={this.sensorStore}>
          <div className={classes.app}>
            {sensors && <SideMenu />}
            {sensors && <SensorsPage />}
          </div>
        </Provider>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(App);
