import { Box, Typography } from '@mui/material';
import { isBefore } from 'date-fns';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import { SensorContext } from 'context/SensorContext';
import React, { useContext, useEffect, useMemo } from 'react';
import ColorsEnum from 'types/ColorsEnum';
import { observer } from 'mobx-react-lite';
import SensorNow from './components/SensorNow';

const styles = (theme) =>
  createStyles({
    container: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
    },
    root: {
      padding: '10px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
      gridGap: '10px',
      backgroundColor: ColorsEnum.BGDARK,
      gridAutoRows: '250px',
      width: '100%',
      boxSizing: 'border-box',
      overflow: 'auto',
      marginRight: '200px',
    },
    rightbar: {
      height: '100vh',
      overflow: 'auto',
      position: 'fixed',
      right: '0',
      top: '0',
      width: '200px',
      backgroundColor: ColorsEnum.BGLIGHTER,
      padding: '10px 10px 0px 10px',
      '& >div': {
        marginBottom: '10px',
      },
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

  const sortedSensors = useMemo(() => {
    return sensorContext.mySensors.slice().sort((a, b) => {
      if (!a.lastSeenAt) {
        return 1;
      }
      if (isBefore(a.lastSeenAt, b.lastSeenAt)) {
        return 1;
      }
      return -1;
    });
  }, [sensorContext.mySensors]);

  const pinnedSensors = useMemo(
    () => sortedSensors.filter((s) => s.lastMeasurements?.length),
    [sortedSensors],
  );

  const sidebarSensors = useMemo(
    () => sortedSensors.filter((s) => !s.lastMeasurements?.length),
    [sortedSensors],
  );

  return (
    <div className={classes.container}>
      {sensorContext.mySensors.length === 0 && (
        <Box style={{ textAlign: 'center', marginTop: '50px' }}>
          <Typography variant="h4">No sensors found. Try adding some.</Typography>
        </Box>
      )}
      <div className={classes.root}>
        {pinnedSensors.map((s) => (
          <SensorNow sensor={s} key={s.id} />
        ))}
      </div>
      <div className={classes.rightbar}>
        {sidebarSensors.map((s) => (
          <SensorNow sensor={s} key={s.id} />
        ))}
      </div>
    </div>
  );
};

export default withStyles(styles)(observer(SensorCanvasPage));
