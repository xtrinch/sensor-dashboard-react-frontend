import { Box, CircularProgress, Typography } from '@mui/material';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import TopMenu from 'components/TopMenu';
import { AccountContext } from 'context/AccountContext';
import { AppContext } from 'context/AppContext';
import { SensorContext } from 'context/SensorContext';
import { uniq } from 'lodash';
import SensorCanvas from 'pages/dashboard/sensors/components/SensorCanvas';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import MeasurementService from 'services/MeasurementService';
import ColorsEnum from 'types/ColorsEnum';
import MeasurementTypeEnum from 'types/MeasurementTypeEnum';
import Sensor from 'types/Sensor';
import { observer } from 'mobx-react-lite';

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
  });

const SensorsPage: React.FunctionComponent<WithStyles<typeof styles>> = (props) => {
  const { classes } = props;

  const {
    state: { sensors, mySensors, sensorsLoaded, mySensorsLoaded },
  } = useContext(SensorContext);
  const { loginState } = useContext(AccountContext);
  const appContext = useContext(AppContext);

  const [measurements, setMeasurements] = useState(null);

  const getMeasurements = useCallback(async () => {
    if (!sensorsLoaded || (!mySensorsLoaded && loginState === 'LOGGED_IN')) {
      return;
    }

    const allSensors = [...sensors, ...mySensors];

    if (allSensors.filter((s) => s.visible).map((s) => s.id).length === 0) {
      setMeasurements({});
      return;
    }
    const resp = await MeasurementService.listMeasurements({
      createdAtRange: appContext.date,
      measurementTypes: uniq(
        allSensors.reduce((acc, sensor: Sensor) => {
          return [...acc, ...sensor.measurementTypes];
        }, []),
      ),
      sensorIds: allSensors.filter((s) => s.visible).map((s) => s.id),
    });
    setMeasurements(resp);
  }, [appContext.date, sensors, mySensors, sensorsLoaded, mySensorsLoaded, loginState]);

  useEffect(() => {
    if (!appContext.date || sensors.length === 0) {
      setMeasurements({});
      return;
    }

    getMeasurements();
  }, [appContext.date, getMeasurements, sensors]);

  const sensorTypes = (): MeasurementTypeEnum[] => {
    // collect all returned measurement types
    let sensorTypes: MeasurementTypeEnum[] = sensors.reduce((acc, sensor: Sensor) => {
      return [...acc, ...sensor.measurementTypes];
    }, []);

    // filter duplicates
    sensorTypes = uniq(sensorTypes);

    return sensorTypes;
  };

  return (
    <div style={{ width: '100%' }}>
      <TopMenu />
      {sensors.length === 0 && (
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
          {sensorTypes().map((type: MeasurementTypeEnum) => (
            <SensorCanvas
              key={type}
              type={type}
              date={appContext.date}
              groupBy={appContext.groupBy}
              domain={appContext.domain}
              measurements={measurements[type] || []}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default withStyles(styles)(observer(SensorsPage));
