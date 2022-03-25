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
import { MeasurementTypeLabelsEnum } from 'types/MeasurementTypeEnum';

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
      <Typography variant="h5" style={{ marginBottom: '7px', color: sensor.color }}>
        {sensor.displayName}
      </Typography>
      <div>
        <Typography variant="subtitle2" style={{ color: 'white' }}>
          Last seen:
        </Typography>
      </div>
      <div style={{ marginBottom: '10px' }}>
        {sensor.lastSeenAt ? format(sensor.lastSeenAt, DATETIME_REGEX) : 'Never'}
      </div>
      <div>
        <Typography variant="subtitle2" style={{ color: 'white' }}>
          Last measurements:
        </Typography>
      </div>
      {sensor.lastMeasurements.map((m: Measurement) => (
        <div>
          <span>
            <u>{MeasurementTypeLabelsEnum[m.measurementType]}</u>
          </span>
          :&nbsp;
          <span>{m.measurement}</span>&nbsp;
          <span>{Sensor.measurementTypeProperties[m.measurementType].unit}</span>
        </div>
      ))}
    </div>
  );
};

export default withStyles(styles)(observer(SensorCanvas));
