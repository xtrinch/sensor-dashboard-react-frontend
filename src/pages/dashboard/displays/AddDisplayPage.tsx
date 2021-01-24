import { Grid } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Container from "@material-ui/core/Container";
import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import SettingsInputAntennaIcon from "@material-ui/icons/SettingsInputAntenna";
import ColoredButton from "components/ColoredButton";
import SelectInput from "components/SelectInput";
import TextInput from "components/TextInput";
import TopBar from "components/TopBar";
import { DisplayContext } from "context/DisplayContext";
import { SensorContext } from "context/SensorContext";
import { getDisplayRoute } from "pages/dashboard/DashboardRoutes";
import React, { useContext, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import BoardTypeEnum from "types/BoardTypeEnum";
import ColorsEnum from "types/ColorsEnum";
import DisplayTypeEnum from "types/DisplayTypeEnum";
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
    boardType: "" as BoardTypeEnum,
    timezone: "",
    measurementTypes: [],
    sensorIds: [],
    displayType: null as DisplayTypeEnum,
  });

  const {
    state: { sensors },
  } = useContext(SensorContext);
  const { addDisplay } = useContext(DisplayContext);

  const [success, setSuccess] = useState(false);

  const submitForm = async (e) => {
    e.preventDefault();

    try {
      const display = await addDisplay(data);
      if (display) {
        setSuccess(true);
        history.push(getDisplayRoute(display.id));
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
      <TopBar alignItems="center">
        <Typography component="h1" variant="h4">
          Add display board
        </Typography>
      </TopBar>
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          {!success && (
            <>
              <Avatar className={classes.avatar}>
                <SettingsInputAntennaIcon />
              </Avatar>
              <form className={classes.form} noValidate onSubmit={submitForm}>
                <TextInput
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
                  onChange={(e) => fieldChange(e.target.value, "location")}
                  error={!!errors.location}
                  helperText={errors.location}
                />
                <SelectInput
                  id="boardType"
                  value={data.boardType}
                  fullWidth
                  options={Object.keys(BoardTypeEnum)}
                  onChange={(e, newVal) => fieldChange(newVal, "boardType")}
                  renderInput={(params) => (
                    <TextInput
                      {...params}
                      label="Board type"
                      variant="outlined"
                      margin="normal"
                      error={!!errors.boardType}
                      helperText={errors.boardType}
                    />
                  )}
                />
                <SelectInput
                  id="displayType"
                  value={data.displayType}
                  fullWidth
                  options={Object.keys(DisplayTypeEnum)}
                  onChange={(e, newVal) => fieldChange(newVal, "displayType")}
                  renderInput={(params) => (
                    <TextInput
                      {...params}
                      label="Display type"
                      variant="outlined"
                      margin="normal"
                      error={!!errors.displayType}
                      helperText={errors.displayType}
                    />
                  )}
                />
                <SelectInput
                  multiple
                  id="measurementTypes"
                  value={data.measurementTypes}
                  fullWidth
                  options={Object.values(MeasurementTypeEnum)}
                  getOptionLabel={(option) => MeasurementTypeLabelsEnum[option]}
                  onChange={(e, newVal) =>
                    fieldChange(newVal, "measurementTypes")
                  }
                  renderInput={(params) => (
                    <TextInput
                      {...params}
                      label="Measurement types"
                      variant="outlined"
                      margin="normal"
                      error={!!errors.measurementTypes}
                      helperText={errors.measurementTypes}
                    />
                  )}
                />
                <SelectInput
                  multiple
                  id="sensorIds"
                  value={data.sensorIds}
                  fullWidth
                  options={sensors.map((s) => s.id)}
                  getOptionLabel={(option) =>
                    sensors.find((s) => s.id === option).name
                  }
                  onChange={(e, newVal) => fieldChange(newVal, "sensorIds")}
                  renderInput={(params) => (
                    <TextInput
                      {...params}
                      label="Sensors"
                      variant="outlined"
                      margin="normal"
                      error={!!errors.sensorIds}
                      helperText={errors.sensorIds}
                    />
                  )}
                />
                <ColoredButton
                  type="submit"
                  fullWidth
                  style={{ marginTop: "20px" }}
                  colorVariety={ColorsEnum.BLUE}
                >
                  Submit
                </ColoredButton>
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
    </>
  );
};

export default withRouter(withStyles(styles)(AddDisplayPage));
