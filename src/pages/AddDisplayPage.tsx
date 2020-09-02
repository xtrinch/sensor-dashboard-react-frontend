import {
  FormControl,
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
import { addDisplay, DisplayContext } from "context/DisplayContext";
import { SensorContext } from "context/SensorContext";
import React, { useContext, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import ColorsEnum from "types/ColorsEnum";
import DisplayBoardTypesEnum from "types/DisplayBoardTypesEnum";
import MeasurementTypeEnum, {
  MeasurementTypeLabelsEnum,
} from "types/MeasurementTypeEnum";

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

const AddDisplayPage: React.FunctionComponent<
  WithStyles<typeof styles> & RouteComponentProps<{ id: string }>
> = (props) => {
  const { classes, history } = props;

  const errs: { [key: string]: string } = {};
  const [errors, setErrors] = useState(errs);
  const [data, setData] = useState({
    name: "",
    location: "",
    boardType: "" as DisplayBoardTypesEnum,
    timezone: "",
    measurementTypes: [],
    sensorIds: [],
  });

  const [sensorState] = useContext(SensorContext);
  const [, displayContextDispatch] = useContext(DisplayContext);
  const [success, setSuccess] = useState(false);

  const submitForm = async (e) => {
    e.preventDefault();

    try {
      const display = await addDisplay(displayContextDispatch, data);
      if (display) {
        setSuccess(true);
        setTimeout(() => {
          history.push(`/displays/${display.id}`);
        }, 3000);
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
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        {!success && (
          <>
            <Avatar className={classes.avatar}>
              <SettingsInputAntennaIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Add display board
            </Typography>
            <form className={classes.form} noValidate onSubmit={submitForm}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="name"
                label="Display name"
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
                {Object.keys(DisplayBoardTypesEnum).map((key) => (
                  <MenuItem key={key} value={key}>
                    {DisplayBoardTypesEnum[key]}
                  </MenuItem>
                ))}
              </TextField>
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
              <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel id="demo-mutiple-name-label">Sensors</InputLabel>
                <Select
                  labelId="demo-mutiple-name-label"
                  id="demo-mutiple-name"
                  multiple
                  value={data.sensorIds}
                  onChange={(e) => fieldChange(e.target.value, "sensorIds")}
                  error={!!errors.sensorIds}
                >
                  {sensorState.sensors.map((sensor) => (
                    <MenuItem key={sensor.id} value={sensor.id}>
                      {sensor.name}
                    </MenuItem>
                  ))}
                </Select>
                {!!errors.sensorIds && (
                  <FormHelperText style={{ color: ColorsEnum.ORANGE }}>
                    {errors.sensorIds}
                  </FormHelperText>
                )}
              </FormControl>
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
            <Grid item>Display successfully added.</Grid>
            <Grid item>Redirecting to display info page...</Grid>
          </Grid>
        )}
      </div>
    </Container>
  );
};

export default withRouter(withStyles(styles)(AddDisplayPage));
