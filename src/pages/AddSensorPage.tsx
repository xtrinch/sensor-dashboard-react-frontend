import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import SettingsInputAntennaIcon from "@material-ui/icons/SettingsInputAntenna";
import TopBar from "components/TopBar";
import { addSensor } from "context/SensorContext";
import React, { useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { listTimeZones } from "timezone-support";
import BoardTypeEnum from "types/BoardTypeEnum";
import ColorsEnum from "types/ColorsEnum";
import MeasurementTypeEnum, {
  MeasurementTypeLabelsEnum,
} from "types/MeasurementTypeEnum";
import SensorTypeEnum from "types/SensorTypeEnum";

const styles = (theme) =>
  createStyles({
    paper: {
      marginTop: theme.spacing(30),
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
  });

const AddSensorPage: React.FunctionComponent<
  WithStyles<typeof styles> & RouteComponentProps<{ id: string }>
> = (props) => {
  const { classes, history } = props;

  const errs: { [key: string]: string } = {};
  const [errors, setErrors] = useState(errs);
  const [data, setData] = useState({
    name: "",
    displayName: "",
    measurementTypes: [],
    sensorTypes: [],
    location: "",
    boardType: "" as BoardTypeEnum,
    timezone: "",
    private: false,
  });

  const [success, setSuccess] = useState(false);

  const submitForm = async (e) => {
    e.preventDefault();

    try {
      const sensor = await addSensor(data);
      if (sensor) {
        setSuccess(true);
        history.push(`/sensors/${sensor.id}`);
      }
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
      <TopBar alignItems="flex-end" />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          {!success && (
            <>
              <Avatar className={classes.avatar}>
                <SettingsInputAntennaIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Add sensor board
              </Typography>
              <form className={classes.form} noValidate onSubmit={submitForm}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="name"
                  label="Sensor name"
                  name="name"
                  value={data.name}
                  autoFocus
                  onChange={(e) => fieldChange(e.target.value, "name")}
                  error={!!errors.name}
                  helperText={errors.name}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="displayName"
                  label="Sensor display name"
                  name="displayName"
                  value={data.displayName}
                  onChange={(e) => fieldChange(e.target.value, "displayName")}
                  error={!!errors.displayName}
                  helperText={errors.displayName}
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
                  {Object.keys(BoardTypeEnum).map((key) => (
                    <MenuItem key={key} value={key}>
                      {BoardTypeEnum[key]}
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
                <FormControl variant="outlined" fullWidth margin="normal">
                  <InputLabel id="demo-mutiple-name-label">
                    Sensor types
                  </InputLabel>
                  <Select
                    labelId="demo-mutiple-name-label"
                    id="demo-mutiple-name"
                    multiple
                    value={data.sensorTypes}
                    onChange={(e) => fieldChange(e.target.value, "sensorTypes")}
                    error={!!errors.sensorTypes}
                  >
                    {Object.values(SensorTypeEnum).map((key) => (
                      <MenuItem key={key} value={key}>
                        {key}
                      </MenuItem>
                    ))}
                  </Select>
                  {!!errors.sensorTypes && (
                    <FormHelperText style={{ color: ColorsEnum.ORANGE }}>
                      {errors.sensorTypes}
                    </FormHelperText>
                  )}
                </FormControl>
                <FormControl variant="outlined" fullWidth margin="normal">
                  <InputLabel id="demo-mutiple-name-label">
                    Measurement types
                  </InputLabel>
                  <Select
                    labelId="demo-mutiple-name-label"
                    id="demo-mutiple-name"
                    multiple
                    value={data.measurementTypes}
                    onChange={(e) =>
                      fieldChange(e.target.value, "measurementTypes")
                    }
                    error={!!errors.measurementTypes}
                  >
                    {Object.values(MeasurementTypeEnum).map((key) => (
                      <MenuItem key={key} value={key}>
                        {MeasurementTypeLabelsEnum[key]}
                      </MenuItem>
                    ))}
                  </Select>
                  {!!errors.measurementTypes && (
                    <FormHelperText style={{ color: ColorsEnum.ORANGE }}>
                      {errors.measurementTypes}
                    </FormHelperText>
                  )}
                </FormControl>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={data.private || false}
                      onChange={(e, checked) => fieldChange(checked, "private")}
                    />
                  }
                  label="Private"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  style={{ marginTop: "20px" }}
                >
                  Add
                </Button>
              </form>
            </>
          )}
          {success && (
            <Grid container spacing={10} direction={"column"}>
              <Grid item>Sensor successfully added.</Grid>
              <Grid item>Redirecting to sensor info page...</Grid>
            </Grid>
          )}
        </div>
      </Container>
    </>
  );
};

export default withRouter(withStyles(styles)(AddSensorPage));
