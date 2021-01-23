import { createStyles, WithStyles, withStyles } from "@material-ui/core";
import { DashboardRoutes } from "pages/dashboard/DashboardRoutes";
import AddDisplayPage from "pages/dashboard/displays/AddDisplayPage";
import DisplayInfoPage from "pages/dashboard/displays/DisplayInfoPage";
import DisplayListPage from "pages/dashboard/displays/DisplayListPage";
import AddForwarderPage from "pages/dashboard/forwarders/AddForwarderPage";
import ForwarderInfoPage from "pages/dashboard/forwarders/ForwarderInfoPage";
import ForwarderListPage from "pages/dashboard/forwarders/ForwarderListPage";
import AddSensorPage from "pages/dashboard/sensors/AddSensorPage";
import SensorInfoPage from "pages/dashboard/sensors/SensorInfoPage";
import SensorsPage from "pages/dashboard/sensors/SensorsPage";
import React from "react";
import { Route } from "react-router-dom";

const styles = () => createStyles({});

class DashboardIndexPage extends React.Component<WithStyles<typeof styles>> {
  render() {
    return (
      <>
        <Route exact path={DashboardRoutes.DASHBOARD}>
          <SensorsPage />
        </Route>
        <Route exact path={DashboardRoutes.ADD_SENSOR}>
          <AddSensorPage />
        </Route>
        <Route exact path={DashboardRoutes.ADD_DISPLAY}>
          <AddDisplayPage />
        </Route>
        <Route exact path={DashboardRoutes.ADD_FORWARDER}>
          <AddForwarderPage />
        </Route>
        <Route exact path={DashboardRoutes.SENSOR}>
          <SensorInfoPage />
        </Route>
        <Route exact path={DashboardRoutes.DISPLAY}>
          <DisplayInfoPage />
        </Route>
        <Route exact path={DashboardRoutes.FORWARDER}>
          <ForwarderInfoPage />
        </Route>
        <Route exact path={DashboardRoutes.DISPLAY_LIST}>
          <DisplayListPage />
        </Route>
        <Route exact path={DashboardRoutes.FORWARDER_LIST}>
          <ForwarderListPage />
        </Route>
      </>
    );
  }
}

export default withStyles(styles)(DashboardIndexPage);
