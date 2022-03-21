import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsInputAntennaIcon from '@mui/icons-material/SettingsInputAntenna';
import ColoredButton from 'components/ColoredButton';
import SelectInput from 'components/SelectInput';
import TextInput from 'components/TextInput';
import TopBar from 'components/TopBar';
import { openConfirmation } from 'context/ConfirmationContext';
import { DisplayContext } from 'context/DisplayContext';
import { SensorContext } from 'context/SensorContext';
import { format } from 'date-fns';
import { DashboardRoutes } from 'pages/dashboard/DashboardRoutes';
import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import DisplayService from 'services/DisplayService';
import BoardTypeEnum from 'types/BoardTypeEnum';
import ColorsEnum from 'types/ColorsEnum';
import Display, { DisplayId } from 'types/Display';
import DisplayTypeEnum from 'types/DisplayTypeEnum';
import MeasurementTypeEnum, { MeasurementTypeLabelsEnum } from 'types/MeasurementTypeEnum';
import { DATETIME_REGEX } from 'utils/date.range';

const styles = (theme) =>
  createStyles({
    paper: {
      marginTop: '30px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: ColorsEnum.BGLIGHT,
      padding: '30px',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
      padding: theme.spacing(6, 0, 6),
    },
    actionButton: {
      backgroundColor: ColorsEnum.ERROR,
      color: ColorsEnum.WHITE,
    },
    action: {
      position: 'absolute',
      right: '25px',
      bottom: '25px',
    },
  });

const DisplayInfoPage: React.FunctionComponent<
  WithStyles<typeof styles> & RouteComponentProps<{ id: string }>
> = (props) => {
  const {
    classes,
    match: {
      params: { id },
    },
    history,
  } = props;

  const errs: { [key: string]: string } = {};
  const [errors, setErrors] = useState(errs);
  const [data, setData] = useState({
    name: '',
    location: '',
    boardType: '' as BoardTypeEnum,
    timezone: '',
    measurementTypes: [],
    sensorIds: [],
    displayType: '' as DisplayTypeEnum,
  });

  const {
    state: { sensors },
  } = useContext(SensorContext);
  const { deleteDisplay, updateDisplay } = useContext(DisplayContext);

  const [display, setDisplay] = useState(null);

  const deleteWithConfirmation = () => {
    const onConfirm = async () => {
      await deleteDisplay(display.id);
      history.push(DashboardRoutes.DISPLAY_LIST);
    };
    openConfirmation(onConfirm, null, 'Are you sure you want to delete display?');
  };

  useEffect(() => {
    const getDisplay = async () => {
      const s = await DisplayService.getDisplay((id as unknown) as DisplayId);
      setDisplay(s);
      setData((d) => ({
        ...d,
        name: s.name,
        location: s.location,
        boardType: s.boardType,
        measurementTypes: s.measurementTypes,
        sensorIds: s.sensorIds,
        displayType: s.displayType,
      }));
    };

    getDisplay();
  }, [id]);

  const submitForm = async (e) => {
    e.preventDefault();

    try {
      await updateDisplay((id as unknown) as DisplayId, new Display(data));
    } catch (e) {
      setErrors(e);
    }
  };

  const fieldChange = (val, fieldName) => {
    data[fieldName] = val;
    setData({ ...data });
  };

  return (
    <>
      <TopBar alignItems="flex-end">
        <ColoredButton
          startIcon={<DeleteIcon />}
          onClick={deleteWithConfirmation}
          colorVariety={ColorsEnum.ERROR}
          size="small"
        >
          Delete
        </ColoredButton>
      </TopBar>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <SettingsInputAntennaIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Display board info
          </Typography>
          <form className={classes.form} noValidate onSubmit={submitForm}>
            <TextInput
              variant="outlined"
              margin="normal"
              fullWidth
              id="accessToken"
              name="accessToken"
              label="Display access token"
              disabled
              value={display?.accessToken || ''}
            />
            <TextInput
              variant="outlined"
              margin="normal"
              fullWidth
              id="accessToken"
              name="accessToken"
              label="Last seen at"
              disabled
              value={display?.lastSeenAt ? format(display?.lastSeenAt, DATETIME_REGEX) : 'Never'}
            />
            <TextInput
              variant="outlined"
              margin="normal"
              fullWidth
              id="name"
              label="Display name"
              name="name"
              value={data.name}
              onChange={(e) => fieldChange(e.target.value, 'name')}
              error={!!errors.name}
              helperText={errors.name}
            />
            <TextInput
              variant="outlined"
              margin="normal"
              fullWidth
              name="location"
              label="Location description"
              type="location"
              id="location"
              autoComplete="current-location"
              value={data.location}
              onChange={(e) => fieldChange(e.target.value, 'location')}
              error={!!errors.location}
              helperText={errors.location}
            />
            <SelectInput
              value={data.boardType}
              onChange={(e, newVal) => fieldChange(newVal, 'boardType')}
              fullWidth
              options={Object.keys(BoardTypeEnum)}
              error={!!errors.boardType}
              helperText={errors.boardType}
            />
            <SelectInput
              value={data.displayType}
              onChange={(e, newVal) => fieldChange(newVal, 'displayType')}
              fullWidth
              options={Object.keys(DisplayTypeEnum)}
              label="Display type"
              variant="outlined"
              margin="normal"
              error={!!errors.displayType}
              helperText={errors.displayType}
            />
            <SelectInput
              multiple
              id="measurementTypes"
              value={data.measurementTypes}
              fullWidth
              options={Object.values(MeasurementTypeEnum)}
              getOptionLabel={(option) => MeasurementTypeLabelsEnum[option]}
              onChange={(e, newVal) => fieldChange(newVal, 'measurementTypes')}
              label="Measurement types"
              error={!!errors.measurementTypes}
              helperText={errors.measurementTypes}
            />
            <SelectInput
              multiple
              id="sensorIds"
              value={data.sensorIds}
              fullWidth
              options={sensors.map((s) => s.id)}
              getOptionLabel={(option) => sensors.find((s) => s.id === option)?.name}
              onChange={(e, newVal) => fieldChange(newVal, 'sensorIds')}
              label="Sensors"
              error={!!errors.sensorIds}
              helperText={errors.sensorIds}
            />
            <ColoredButton
              type="submit"
              fullWidth
              style={{ marginTop: '20px' }}
              colorVariety={ColorsEnum.BLUE}
            >
              Update
            </ColoredButton>
          </form>
        </div>
      </Container>
    </>
  );
};

export default withRouter(withStyles(styles)(DisplayInfoPage));
