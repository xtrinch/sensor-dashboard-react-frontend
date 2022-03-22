import { Grid } from '@mui/material';
import { observer } from 'mobx-react-lite';
import ConnectSensorPage from 'pages/ConnectSensorPage';
import SensorsSideMenu from 'pages/dashboard/components/SensorsSideMenu';
import { DashboardRoutes } from 'pages/dashboard/DashboardRoutes';
import AddDisplayPage from 'pages/dashboard/displays/AddDisplayPage';
import DisplayInfoPage from 'pages/dashboard/displays/DisplayInfoPage';
import DisplayListPage from 'pages/dashboard/displays/DisplayListPage';
import AddSensorPage from 'pages/dashboard/sensors/AddSensorPage';
import SensorInfoPage from 'pages/dashboard/sensors/SensorInfoPage';
import MySensorsPage from 'pages/dashboard/sensors/MySensorsPage';
import TopicPageByTag from 'pages/forum/topic/TopicPageByTag';
import React from 'react';
import { Route, useLocation } from 'react-router-dom';
import PublicSensorsPage from './sensors/PublicSensorsPage';
import SensorCanvasPage from './sensors/SensorCanvasPage';

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
        <Route exact path={DashboardRoutes.CANVAS}>
          <SensorCanvasPage />
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
        <Route exact path={DashboardRoutes.DISPLAY_LIST}>
          <DisplayListPage />
        </Route>
        <Route path={DashboardRoutes.TOPIC_BY_TAG}>
          <TopicPageByTag />
        </Route>
      </Grid>
      {location.pathname.indexOf('canvas') < 0 && (
        <Grid item style={{ width: '270px' }}>
          <SensorsSideMenu
            style={{
              position: 'fixed',
              right: '0',
              paddingTop: '65px',
              backgroundColor: 'rgb(58,65,73)',
              zIndex: 1000,
              width: '270px',
              height: 'calc(100vh)',
              overflow: 'auto',
            }}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default observer(DashboardIndexPage);
