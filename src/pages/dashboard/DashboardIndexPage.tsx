import { Grid } from '@mui/material';
import { observer } from 'mobx-react-lite';
import ConnectSensorPage from 'pages/ConnectSensorPage';
import { DashboardRoutes } from 'pages/dashboard/DashboardRoutes';
import AddDisplayPage from 'pages/dashboard/displays/AddDisplayPage';
import DisplayInfoPage from 'pages/dashboard/displays/DisplayInfoPage';
import DisplayListPage from 'pages/dashboard/displays/DisplayListPage';
import AddSensorPage from 'pages/dashboard/sensors/AddSensorPage';
import MySensorsPage from 'pages/dashboard/sensors/MySensorsPage';
import SensorInfoPage from 'pages/dashboard/sensors/SensorInfoPage';
import React from 'react';
import { Route, useLocation } from 'react-router-dom';
import SensorDraggablePage from './displays/SensorDraggablePage';
import PublicSensorsPage from './sensors/PublicSensorsPage';

const DashboardIndexPage = () => {
  const location = useLocation();

  return (
    <Grid container>
      <Grid item style={{ flex: 1 }}>
        <Route exact path={DashboardRoutes.DASHBOARD}>
          <PublicSensorsPage />
        </Route>
        <Route exact path={DashboardRoutes.PERSONAL_DASHBOARD}>
          <MySensorsPage />
        </Route>
        <Route exact path={DashboardRoutes.ADD_SENSOR}>
          <AddSensorPage />
        </Route>
        <Route exact path={DashboardRoutes.ADD_DISPLAY}>
          <AddDisplayPage />
        </Route>
        <Route exact path={DashboardRoutes.CONNECT_SENSOR}>
          <ConnectSensorPage />
        </Route>
        <Route exact path={DashboardRoutes.SENSOR}>
          <SensorInfoPage />
        </Route>
        <Route exact path={DashboardRoutes.DISPLAY}>
          <DisplayInfoPage />
        </Route>
        <Route exact path={DashboardRoutes.DISPLAY_CANVAS}>
          <SensorDraggablePage />
        </Route>
        <Route exact path={DashboardRoutes.DISPLAY_LIST}>
          <DisplayListPage />
        </Route>
      </Grid>
    </Grid>
  );
};

export default observer(DashboardIndexPage);
