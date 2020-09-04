import { MenuItem } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import SettingsInputAntennaIcon from "@material-ui/icons/SettingsInputAntenna";
import TopBar from "components/TopBar";
import {
  ConfirmationContext,
  openConfirmation,
} from "context/ConfirmationContext";
import {
  deleteSensor,
  SensorContext,
  updateSensor,
} from "context/SensorContext";
import { format } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import SensorService from "services/SensorService";
import { listTimeZones } from "timezone-support";
import ColorsEnum from "types/ColorsEnum";
import { SensorId } from "types/Sensor";
import SensorBoardTypesEnum from "types/SensorBoardTypesEnum";
import { DATETIME_REGEX } from "utils/date.range";

const styles = (theme) =>
  createStyles({
    paper: {
      marginTop: "30px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: ColorsEnum.BGLIGHT,
      padding: "30px",
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: "100%", // Fix IE 11 issue.
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
  });

const SensorInfoPage: React.FunctionComponent<
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
    name: "",
    location: "",
    boardType: "" as SensorBoardTypesEnum,
    timezone: "",
  });

  const [, sensorContextDispatch] = useContext(SensorContext);
  const [sensor, setSensor] = useState(null);
  const [, dispatchConfirmationContext] = useContext(ConfirmationContext);

  const deleteWithConfirmation = () => {
    const onConfirm = async () => {
      await deleteSensor(sensorContextDispatch, sensor.id);
      history.push("/");
    };
    openConfirmation(
      dispatchConfirmationContext,
      onConfirm,
      null,
      "Are you sure you want to delete sensor? Action is irreversible and will delete all your measurements."
    );
  };

  useEffect(() => {
    const getSensor = async () => {
      const s = await SensorService.getSensor((id as unknown) as SensorId);
      setSensor(s);
      setData((d) => ({
        ...d,
        name: s.name,
        location: s.location,
        boardType: s.boardType,
        timezone: s.timezone,
      }));
    };

    getSensor();
  }, [id]);

  const submitForm = async (e) => {
    e.preventDefault();

    try {
      await updateSensor(
        sensorContextDispatch,
        (id as unknown) as SensorId,
        data
      );
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
        <Button
          variant="contained"
          className={classes.actionButton}
          startIcon={<DeleteIcon />}
          onClick={deleteWithConfirmation}
        >
          Delete
        </Button>
      </TopBar>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <SettingsInputAntennaIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sensor board info
          </Typography>
          <form className={classes.form} noValidate onSubmit={submitForm}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="accessToken"
              name="accessToken"
              label="Sensor access token"
              disabled
              value={sensor?.sensorAccessToken || ""}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="accessToken"
              name="accessToken"
              label="Last seen at"
              disabled
              value={
                sensor?.lastSeenAt
                  ? format(sensor?.lastSeenAt, DATETIME_REGEX)
                  : "Never"
              }
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="name"
              label="Sensor name"
              name="name"
              value={data.name}
              onChange={(e) => fieldChange(e.target.value, "name")}
              error={!!errors.name}
              helperText={errors.name}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              name="location"
              label="Location description"
              type="location"
              id="location"
              autoComplete="current-location"
              value={data.location}
              onChange={(e) => fieldChange(e.target.value, "location")}
              error={!!errors.location}
              helperText={errors.location}
            />
            <TextField
              select
              id="select"
              label="Board type"
              variant="outlined"
              margin="normal"
              value={data.boardType}
              onChange={(e) => fieldChange(e.target.value, "boardType")}
              fullWidth
              error={!!errors.boardType}
              helperText={errors.boardType}
            >
              {Object.keys(SensorBoardTypesEnum).map((key) => (
                <MenuItem key={key} value={key}>
                  {SensorBoardTypesEnum[key]}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              id="timezone"
              variant="outlined"
              margin="normal"
              label="Timezone"
              value={data.timezone}
              onChange={(e) => fieldChange(e.target.value, "timezone")}
              fullWidth
            >
              {listTimeZones().map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              style={{ marginTop: "20px" }}
            >
              Update
            </Button>
          </form>
        </div>
      </Container>
    </>
  );
};

export default withRouter(withStyles(styles)(SensorInfoPage));
