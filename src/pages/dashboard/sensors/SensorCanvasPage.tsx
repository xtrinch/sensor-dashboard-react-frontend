import { Box, CircularProgress, Typography } from '@mui/material';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import TopMenu from 'components/TopMenu';
import { AccountContext } from 'context/AccountContext';
import { AppContext } from 'context/AppContext';
import { SensorContext } from 'context/SensorContext';
import { compact, uniq } from 'lodash';
import SensorCanvas from 'pages/dashboard/sensors/components/SensorCanvas';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import MeasurementService from 'services/MeasurementService';
import ColorsEnum from 'types/ColorsEnum';
import MeasurementTypeEnum from 'types/MeasurementTypeEnum';
import Sensor from 'types/Sensor';
import { observer } from 'mobx-react-lite';
import SensorNow from './components/SensorNow';

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

const SensorCanvasPage: React.FunctionComponent<WithStyles<typeof styles>> = (props) => {
  const { classes } = props;

  const sensorContext = useContext(SensorContext);
  const { loginState } = useContext(AccountContext);
  const appContext = useContext(AppContext);

  const [measurements, setMeasurements] = useState(null);

  const getMeasurements = useCallback(async () => {
    if (sensorContext.mySensors.filter((s) => s.visible).map((s) => s.id).length === 0) {
      setMeasurements({});
      return;
    }
    const resp = await MeasurementService.listMeasurements({
      createdAtRange: appContext.date,
      sensorIds: sensorContext.mySensors.filter((s) => s.visible).map((s) => s.id),
    });
    setMeasurements(resp);
  }, [appContext.date, sensorContext.mySensorsLoaded, loginState]);

  useEffect(() => {
    const fetch = async () => {
      await sensorContext.listMySensors();
      await getMeasurements();
    };
    fetch();
  }, []);

  return (
    <div style={{ width: '100%' }}>
      {sensorContext.mySensors.length === 0 && (
        <Box style={{ textAlign: 'center', marginTop: '50px' }}>
          <Typography variant="h5">No sensors found. Try adding some.</Typography>
        </Box>
      )}
      <div className={classes.root}>
        {sensorContext.mySensors.map((s) => (
          <SensorNow sensor={s} key={s.id} />
        ))}
      </div>
    </div>
  );
};

export default withStyles(styles)(observer(SensorCanvasPage));
