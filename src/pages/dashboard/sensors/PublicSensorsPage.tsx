import { Box, CircularProgress, Typography } from '@mui/material';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import clsx from 'clsx';
import TopMenu from 'components/TopMenu';
import { AccountContext } from 'context/AccountContext';
import { AppContext } from 'context/AppContext';
import { SensorContext } from 'context/SensorContext';
import { compact, uniq } from 'lodash';
import { observer } from 'mobx-react-lite';
import SensorCanvas from 'pages/dashboard/sensors/components/SensorCanvas';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import MeasurementService from 'services/MeasurementService';
import ColorsEnum from 'types/ColorsEnum';
import MeasurementTypeEnum from 'types/MeasurementTypeEnum';
import Sensor from 'types/Sensor';
import SensorsSideMenu from '../components/SensorsSideMenu';

const styles = (theme) =>
  createStyles({
    root: {
      display: 'grid',
      gridTemplateColumns: 'repeat(1, 1fr)',
      backgroundColor: ColorsEnum.BGDARK,
      gridGap: '0px',
      padding: '0px',
      gridAutoRows: 'calc(50vh - 40px)',
      width: '100%',
      boxSizing: 'border-box',
      overflow: 'auto',
      [theme.breakpoints.up('md')]: {
        gridTemplateColumns: 'repeat(2, 1fr)',
      },
    },
    rightMenu: {
      width: '270px',
      maxWidth: '270px',
    },
    fixedRightMenu: {
      [theme.breakpoints.down('md')]: {
        display: 'none',
      },
    },
  });

const PublicSensorsPage: React.FunctionComponent<WithStyles<typeof styles>> = (props) => {
  const { classes } = props;

  const sensorStore = useContext(SensorContext);
  const accountStore = useContext(AccountContext);
  const appContext = useContext(AppContext);

  const [measurements, setMeasurements] = useState(null);

  const getMeasurements = useCallback(async () => {
    if (!sensorStore.sensorsLoaded) {
      return;
    }

    if (sensorStore.sensors.filter((s) => s.visible).map((s) => s.id).length === 0) {
      setMeasurements({});
      return;
    }
    const resp = await MeasurementService.listMeasurements({
      createdAtRange: appContext.date,
      measurementTypes: uniq(
        sensorStore.sensors.reduce((acc, sensor: Sensor) => {
          return [...acc, ...sensor.measurementTypes];
        }, []),
      ),
      sensorIds: sensorStore.sensors.filter((s) => s.visible).map((s) => s.id),
    });
    setMeasurements(resp);
  }, [appContext.date, sensorStore.sensors]);

  useEffect(() => {
    const fetch = async () => {
      await sensorStore.listSensors();
    };
    fetch();
  }, [accountStore.loginState]);

  useEffect(() => {
    if (!appContext.date || !sensorStore.sensors?.length) {
      setMeasurements({});
      return;
    }

    getMeasurements();
  }, [appContext.date, sensorStore.sensors]);

  const sensorTypes = useMemo((): MeasurementTypeEnum[] => {
    if (!measurements) {
      return [];
    }

    // collect all returned measurement types
    let sensorTypes: MeasurementTypeEnum[] = sensorStore.sensors.reduce((acc, sensor: Sensor) => {
      return [...acc, ...sensor.measurementTypes];
    }, []);

    // filter duplicates
    sensorTypes = uniq(sensorTypes);

    // filter out measurement types without any measurements
    sensorTypes = sensorTypes.map((type) => {
      if (!measurements[type]?.length) {
        return null;
      }
      return type;
    });
    sensorTypes = compact(sensorTypes);
    return sensorTypes;
  }, [sensorStore.sensors, measurements]);

  return (
    <div style={{ width: '100%' }}>
      <TopMenu />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ flex: '1' }}>
          {!sensorStore.sensors?.length && (
            <Box style={{ textAlign: 'center', marginTop: '50px' }}>
              <Typography variant="h5">No sensors found. Try adding some.</Typography>
            </Box>
          )}
          {!measurements && (
            <Box style={{ textAlign: 'center', marginTop: '50px' }}>
              <CircularProgress></CircularProgress>
            </Box>
          )}
          {measurements && (
            <div className={classes.root}>
              {sensorTypes.map((type: MeasurementTypeEnum) => {
                return (
                  <SensorCanvas
                    key={type}
                    type={type}
                    date={appContext.date}
                    groupBy={appContext.groupBy}
                    domain={appContext.domain}
                    measurements={measurements[type]}
                  />
                );
              })}
              {!sensorTypes.length && <div style={{ padding: '20px' }}>No results</div>}
            </div>
          )}
        </div>
        <div className={clsx(classes.rightMenu, classes.fixedRightMenu)}>
          <SensorsSideMenu />
        </div>
        {appContext.rightbarOpen && (
          <div className={classes.rightMenu}>
            <SensorsSideMenu />
          </div>
        )}
      </div>
    </div>
  );
};

export default withStyles(styles)(observer(PublicSensorsPage));
