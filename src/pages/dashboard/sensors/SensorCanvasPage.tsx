import { Box, Typography } from '@mui/material';
import { isBefore } from 'date-fns';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import { SensorContext } from 'context/SensorContext';
import React, { useContext, useEffect } from 'react';
import MeasurementService from 'services/MeasurementService';
import ColorsEnum from 'types/ColorsEnum';
import MeasurementTypeEnum from 'types/MeasurementTypeEnum';
import Sensor from 'types/Sensor';
import { observer } from 'mobx-react-lite';
import SensorNow from './components/SensorNow';

const styles = (theme) =>
  createStyles({
    root: {
      padding: '10px',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, minmax(100px, 1fr))',
      gridGap: '10px',
      backgroundColor: ColorsEnum.BGDARK,
      gridAutoRows: 'calc(33vh - 10px)',
      width: '100%',
      boxSizing: 'border-box',
      overflow: 'auto',
    },
  });

const SensorCanvasPage: React.FunctionComponent<WithStyles<typeof styles>> = (props) => {
  const { classes } = props;

  const sensorContext = useContext(SensorContext);

  useEffect(() => {
    const fetch = async () => {
      await sensorContext.listMySensors();
    };
    fetch();
  }, []);

  return (
    <div style={{ width: '100%' }}>
      {sensorContext.mySensors.length === 0 && (
        <Box style={{ textAlign: 'center', marginTop: '50px' }}>
          <Typography variant="h4">No sensors found. Try adding some.</Typography>
        </Box>
      )}
      <div className={classes.root}>
        {sensorContext.mySensors
          .slice()
          .filter((s) => s.lastMeasurements?.length > 0)
          .sort((a, b) => (isBefore(a.lastSeenAt, b.lastSeenAt) ? 1 : -1))
          .map((s) => (
            <SensorNow sensor={s} key={s.id} />
          ))}
      </div>
    </div>
  );
};

export default withStyles(styles)(observer(SensorCanvasPage));
