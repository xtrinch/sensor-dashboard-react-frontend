import { BatteryChargingFull, Circle, Compress, Opacity, Thermostat } from '@mui/icons-material';
import { Typography } from '@mui/material';
import { withStyles, WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import clsx from 'clsx';
import { format } from 'date-fns';
import { round } from 'lodash';
import { observer } from 'mobx-react-lite';
import React, { CSSProperties } from 'react';
import ColorsEnum from 'types/ColorsEnum';
import Measurement from 'types/Measurement';
import MeasurementTypeEnum from 'types/MeasurementTypeEnum';
import Sensor from 'types/Sensor';
import { DATETIME_REGEX } from 'utils/date.range';

const styles = () =>
  createStyles({
    root: {
      border: `2px solid ${ColorsEnum.BGLIGHTER}`,
      boxShadow: 'none',
      borderRadius: '0px',
      padding: '15px',
      backgroundImage: 'unset',
      fontSize: '12px',
      backgroundColor: ColorsEnum.BGDARK,
      minHeight: '115px',
    },
    measurements: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridAutoRows: '60px',
      gridGap: '10px',
      marginTop: '15px',
    },
    measurement: {
      border: `1px solid ${ColorsEnum.BGLIGHTER}`,
      backgroundColor: ColorsEnum.BGLIGHT,
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
    lastSeen: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
    },
  });

interface SensorCanvasProps {
  sensor: Sensor;
  width: number;
  height: number;
  className?: string;
  style?: CSSProperties;
  hideMeasurements?: boolean;
}

const SensorCanvas: React.FunctionComponent<SensorCanvasProps & WithStyles<typeof styles>> = (
  props,
) => {
  const { classes, sensor, width, height, className, style, hideMeasurements, ...rest } = props;

  return (
    <div
      className={clsx(classes.root, className)}
      style={{ ...style, color: sensor.color, width, height }}
      {...rest}
    >
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
      <div className={classes.lastSeen}>
        <Typography variant="subtitle2" style={{ color: 'white' }}>
          Last seen:
        </Typography>
        <Typography variant="subtitle2" style={{ marginBottom: '10px' }}>
          {sensor.lastSeenAt ? format(sensor.lastSeenAt, DATETIME_REGEX) : 'Never'}
        </Typography>
      </div>
      {sensor.lastMeasurements?.length > 0 && !hideMeasurements && (
        <div className={classes.measurements}>
          {sensor.lastMeasurements.map((m: Measurement, index) => (
            <div className={classes.measurement} key={index}>
              <span style={{ paddingRight: '8px' }}>
                {m.measurementType === MeasurementTypeEnum.TEMPERATURE && <Thermostat />}
                {m.measurementType === MeasurementTypeEnum.HUMIDITY && <Opacity />}
                {m.measurementType === MeasurementTypeEnum.PRESSURE && <Compress />}
                {m.measurementType === MeasurementTypeEnum.BATTERY_VOLTAGE && (
                  <BatteryChargingFull />
                )}
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
      )}
    </div>
  );
};

export default withStyles(styles)(observer(SensorCanvas));
