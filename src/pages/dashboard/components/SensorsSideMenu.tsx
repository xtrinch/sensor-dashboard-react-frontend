import { Divider, Fab, Grid, List, ListItem } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import PlusIcon from '@mui/icons-material/Add';
import { CSSProperties, withStyles, WithStyles } from '@mui/styles';
import Link from 'components/Link';
import SideMenuItem from 'components/SideMenuItem';
import { AccountContext } from 'context/AccountContext';
import { AppContext } from 'context/AppContext';
import { DisplayContext } from 'context/DisplayContext';
import { ForwarderContext } from 'context/ForwarderContext';
import { RadioContext } from 'context/RadioContext';
import { SensorContext } from 'context/SensorContext';
import { DashboardRoutes } from 'pages/dashboard/DashboardRoutes';
import React, { useContext } from 'react';
import { RouteComponentProps, useLocation, withRouter } from 'react-router-dom';
import ColorsEnum from 'types/ColorsEnum';
import Sensor from 'types/Sensor';
import { observer } from 'mobx-react-lite';

const styles = () =>
  createStyles({
    subheader: {
      textTransform: 'none',
      fontSize: '12px',
      backgroundColor: ColorsEnum.BGLIGHT,
      lineHeight: '19px',
      textAlign: 'right',
    },
    listTitle: {
      textTransform: 'uppercase',
      padding: '5px 16px',
      minHeight: '40px',
      color: 'white',
      fontWeight: 'normal',
      borderBottom: `2px solid ${ColorsEnum.BLUE}`,
      fontSize: '12px',
    },
    logoContainer: {
      display: 'flex',
      justifyContent: 'center',
      width: '40px',
      height: '70px',
      '& img': {
        width: '70px',
      },
    },
    sensorFab: {
      width: '30px',
      height: '30px',
      minHeight: '30px',
      color: ColorsEnum.BLUE,
      backgroundColor: 'transparent',
      '& .MuiSvgIcon-root': {
        fontSize: '25px!important',
      },
    },
  });

interface SensorsSideMenuProps {
  style?: CSSProperties;
}

const SensorsSideMenu: React.FunctionComponent<
  SensorsSideMenuProps & WithStyles<typeof styles> & RouteComponentProps<{}>
> = (props) => {
  const location = useLocation();

  const { history } = props;
  const appContext = useContext(AppContext);

  const sensorContext = useContext(SensorContext);
  const {
    state: { displays },
  } = useContext(DisplayContext);
  const {
    state: { radios },
  } = useContext(RadioContext);
  const {
    state: { forwarders },
  } = useContext(ForwarderContext);
  const { loginState, user } = useContext(AccountContext);

  const goToDisplays = () => {
    appContext.drawerToggle();
    history.push(DashboardRoutes.DISPLAY_LIST);
  };

  const goToForwarders = () => {
    appContext.drawerToggle();
    history.push(DashboardRoutes.FORWARDER_LIST);
  };

  const goToRadios = () => {
    appContext.drawerToggle();
    history.push(DashboardRoutes.RADIO_LIST);
  };

  const { classes } = props;
  return (
    // @ts-ignore
    <div style={props.style}>
      {loginState === 'LOGGED_IN' && location.pathname.includes('personal') && (
        <>
          <Grid container className={classes.listTitle} alignItems="center">
            <Grid item xs>
              My sensors
            </Grid>
            <Grid item>
              <Link to={DashboardRoutes.ADD_SENSOR} onClick={appContext.drawerToggle}>
                <Fab color="primary" size="small" className={classes.sensorFab}>
                  <PlusIcon />
                </Fab>
              </Link>
            </Grid>
          </Grid>
          <Divider />
          <List disablePadding>
            {sensorContext.mySensors.map((sensor: Sensor) => (
              <SideMenuItem
                item={sensor}
                key={sensor.id}
                type="sensor"
                visibility
                context={SensorContext}
              />
            ))}
          </List>
          <List disablePadding>
            <ListItem
              button
              className={classes.listTitle}
              alignItems="center"
              onClick={goToForwarders}
            >
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>My packet forwarders</Grid>
                <Grid item>
                  <div role="button" onClick={(e) => e.stopPropagation()}>
                    <Link to={DashboardRoutes.ADD_FORWARDER} onClick={appContext.drawerToggle}>
                      <Fab color="primary" size="small" className={classes.sensorFab}>
                        <PlusIcon />
                      </Fab>
                    </Link>
                  </div>
                </Grid>
              </Grid>
            </ListItem>
          </List>
          <Divider />
          <List disablePadding>
            {forwarders.map((forwarder) => (
              <SideMenuItem item={forwarder} key={forwarder.id} type="forwarder" />
            ))}
          </List>
          <List disablePadding>
            <ListItem button className={classes.listTitle} alignItems="center" onClick={goToRadios}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>My radios</Grid>
                <Grid item>
                  <div role="button" onClick={(e) => e.stopPropagation()}>
                    <Link to={DashboardRoutes.ADD_RADIO} onClick={appContext.drawerToggle}>
                      <Fab color="primary" size="small" className={classes.sensorFab}>
                        <PlusIcon />
                      </Fab>
                    </Link>
                  </div>
                </Grid>
              </Grid>
            </ListItem>
          </List>
          <Divider />
          <List disablePadding>
            {radios.map((forwarder) => (
              <SideMenuItem item={forwarder} key={forwarder.id} type="radio" />
            ))}
          </List>
          <List disablePadding>
            <ListItem
              button
              className={classes.listTitle}
              alignItems="center"
              onClick={goToDisplays}
            >
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>My display devices</Grid>
                <Grid item>
                  <div role="button" onClick={(e) => e.stopPropagation()}>
                    <Link to={DashboardRoutes.ADD_DISPLAY} onClick={appContext.drawerToggle}>
                      <Fab color="primary" size="small" className={classes.sensorFab}>
                        <PlusIcon />
                      </Fab>
                    </Link>
                  </div>
                </Grid>
              </Grid>
            </ListItem>
          </List>
          <Divider />
          <List disablePadding>
            {displays.map((item) => (
              <SideMenuItem item={item} key={item.id} type="display" />
            ))}
          </List>
        </>
      )}
      {!location.pathname.includes('personal') && (
        <>
          <Grid container className={classes.listTitle} alignItems="center">
            <Grid item xs>
              All sensors
            </Grid>
          </Grid>
          <Divider />
          <List disablePadding>
            {sensorContext.sensors.map((sensor: Sensor) => (
              <SideMenuItem
                context={SensorContext}
                item={sensor}
                key={sensor.id}
                type="sensor"
                visibility
              />
            ))}
          </List>
        </>
      )}
    </div>
  );
};

export default withStyles(styles)(withRouter(observer(SensorsSideMenu)));
