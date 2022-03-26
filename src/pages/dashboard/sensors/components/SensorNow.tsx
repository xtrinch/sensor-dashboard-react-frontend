import { Card, Typography } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import { withStyles, WithStyles } from '@mui/styles';
import React from 'react';
import ColorsEnum from 'types/ColorsEnum';
import Sensor from 'types/Sensor';
import { observer } from 'mobx-react-lite';
import Measurement from 'types/Measurement';
import { DATETIME_REGEX } from 'utils/date.range';
import { format } from 'date-fns';
import MeasurementTypeEnum from 'types/MeasurementTypeEnum';
import { BatteryChargingFull, Circle, Compress, Opacity, Thermostat } from '@mui/icons-material';
import { round } from 'lodash';

const styles = () =>
  createStyles({
    root: {
      border: `1px solid ${ColorsEnum.BGLIGHTER}`,
      boxShadow: 'none',
      borderRadius: '0px',
      padding: '15px',
      backgroundImage: 'unset',
      fontSize: '12px',
      backgroundColor: ColorsEnum.BGDARK,
    },
    measurements: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridAutoRows: '60px',
      gridGap: '10px',
    },
    measurement: {
      border: `1px solid ${ColorsEnum.BGLIGHTER}`,
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingLeft: '10px',
      fontSize: '18px',
      '& svg': {
        position: 'relative',
        top: '3px',
      },
    },
    name: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  });

interface SensorCanvasProps {
  sensor: Sensor;
}

const SensorCanvas: React.FunctionComponent<SensorCanvasProps & WithStyles<typeof styles>> = (
  props,
) => {
  const { classes, sensor } = props;

  return (
    <div className={classes.root} style={{ color: sensor.color }}>
      <div className={classes.name}>
        <Typography variant="h5" style={{ marginBottom: '7px', color: sensor.color }}>
          {sensor.displayName}
        </Typography>
        <Typography variant="subtitle2" style={{ color: 'white' }}>
          <Circle
            style={{
              color: sensor.lastMeasurements?.length > 0 ? ColorsEnum.GREEN : ColorsEnum.RED,
              fontSize: '12px',
              marginRight: '5px',
            }}
          />
          {sensor.lastMeasurements?.length > 0 ? 'Online' : 'Offline'}
        </Typography>
      </div>
      <div>
        <Typography variant="subtitle2" style={{ color: 'white' }}>
          Last seen:
        </Typography>
      </div>
      <div style={{ marginBottom: '10px' }}>
        {sensor.lastSeenAt ? format(sensor.lastSeenAt, DATETIME_REGEX) : 'Never'}
      </div>
      <div className={classes.measurements}>
        {sensor.lastMeasurements.map((m: Measurement) => (
          <div className={classes.measurement}>
            <span style={{ paddingRight: '8px' }}>
              {m.measurementType === MeasurementTypeEnum.TEMPERATURE && <Thermostat />}
              {m.measurementType === MeasurementTypeEnum.HUMIDITY && <Opacity />}
              {m.measurementType === MeasurementTypeEnum.PRESSURE && <Compress />}
              {m.measurementType === MeasurementTypeEnum.BATTERY_VOLTAGE && <BatteryChargingFull />}
            </span>
            <span>
              <span style={{ color: 'white' }}>
                {round(
                  m.measurement,
                  Sensor.measurementTypeProperties[m.measurementType].decimalPlaces,
                )}
              </span>
              &nbsp;
              <span>{Sensor.measurementTypeProperties[m.measurementType].unit}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default withStyles(styles)(observer(SensorCanvas));
