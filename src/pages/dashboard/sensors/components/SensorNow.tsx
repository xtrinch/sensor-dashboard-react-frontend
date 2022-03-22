import { Card, Typography } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import { withStyles, WithStyles } from '@mui/styles';
import React from 'react';
import ColorsEnum from 'types/ColorsEnum';
import Sensor from 'types/Sensor';
import { observer } from 'mobx-react-lite';

const styles = () =>
  createStyles({
    root: {
      borderBottom: `1px solid ${ColorsEnum.BGLIGHTER}`,
      boxShadow: 'none',
      borderRadius: '0px',
      backgroundColor: ColorsEnum.BGDARK,
      padding: '15px',
      '& svg': {
        overflow: 'visible',
        position: 'relative',
        top: '-1px',
      },
      '&:nth-of-type(2n + 1)': {
        borderRight: `1px solid ${ColorsEnum.BGLIGHTER}`,
      },
      backgroundImage: 'unset',
      fontSize: '12px',
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
    <Card className={classes.root}>
      <Typography variant="h6" style={{ marginBottom: '7px' }}>
        {sensor.displayName}
      </Typography>
    </Card>
  );
};

export default withStyles(styles)(observer(SensorCanvas));
