import { Checkbox, FormControlLabel } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Container from "@material-ui/core/Container";
import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import SettingsInputAntennaIcon from "@material-ui/icons/SettingsInputAntenna";
import ColoredButton from "components/ColoredButton";
import SelectInput from "components/SelectInput";
import TextInput from "components/TextInput";
import TopBar from "components/TopBar";
import { SensorContext } from "context/SensorContext";
import { getSensorRoute } from "pages/dashboard/DashboardRoutes";
import React, { useContext, useState } from "react";
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
      marginTop: "30px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: ColorsEnum.BGLIGHT,
      padding: "30px",
      border: `1px solid ${ColorsEnum.GRAYDARK}`,
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(1),
      "& >*": {
        width: "100%",
      },
      "& >.MuiFormControl-root, >.MuiAutocomplete-root": {
        width: "calc(50% - 10px)",
        display: "inline-flex",
        "&:nth-of-type(2n+1)": {
          marginRight: "20px",
        },
      },
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
  const { addSensor } = useContext(SensorContext);

  const errs: { [key: string]: string } = {};
  const [errors, setErrors] = useState(errs);
  const [data, setData] = useState({
    name: "",
    displayName: "",
    measurementTypes: [],
    sensorTypes: [],
    location: "",
    boardType: "" as BoardTypeEnum,
    timezone: null,
    private: false,
  });

  const [success, setSuccess] = useState(false);

  const submitForm = async (e) => {
    e.preventDefault();

    try {
      const sensor = await addSensor(data);
      if (sensor) {
        setSuccess(true);
        history.push(getSensorRoute(sensor.id));
      }
    } catch (err) {
      setErrors(err);
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
          Add sensor board
        </Typography>
      </TopBar>
      <Container component="main" maxWidth="sm">
        <div className={classes.paper}>
          {!success && (
            <>
              <Avatar className={classes.avatar}>
                <SettingsInputAntennaIcon />
              </Avatar>
              <form className={classes.form} noValidate onSubmit={submitForm}>
                <TextInput
                  id="name"
                  label="Sensor name"
                  name="name"
                  value={data.name}
                  autoFocus
                  onChange={(e) => fieldChange(e.target.value, "name")}
                  error={!!errors.name}
                  helperText={errors.name}
                />
                <TextInput
                  id="displayName"
                  label="Sensor display name"
                  name="displayName"
                  value={data.displayName}
                  onChange={(e) => fieldChange(e.target.value, "displayName")}
                  error={!!errors.displayName}
                  helperText={errors.displayName}
                />
                <TextInput
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
                  id="select"
                  value={data.boardType}
                  onChange={(e, newVal) => fieldChange(newVal, "boardType")}
                  options={Object.keys(BoardTypeEnum)}
                  label="Board type"
                  error={!!errors.boardType}
                  helperText={errors.boardType}
                />
                <SelectInput
                  id="timezone"
                  value={data.timezone}
                  fullWidth
                  options={listTimeZones()}
                  getOptionLabel={(option) => option}
                  onChange={(e, newVal) => fieldChange(newVal, "timezone")}
                  label="Timezone"
                  error={!!errors.timezone}
                  helperText={errors.timezone}
                />
                <SelectInput
                  multiple
                  id="sensorTypes"
                  value={data.sensorTypes}
                  fullWidth
                  options={Object.values(SensorTypeEnum)}
                  getOptionLabel={(option) => option}
                  onChange={(e, newVal) => fieldChange(newVal, "sensorTypes")}
                  label="Sensor types"
                  error={!!errors.sensorTypes}
                  helperText={errors.sensorTypes}
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
                  label="Measurement types"
                  error={!!errors.measurementTypes}
                  helperText={errors.measurementTypes}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={data.private || false}
                      onChange={(_e, checked) =>
                        fieldChange(checked, "private")
                      }
                    />
                  }
                  label="Private"
                />
                <div style={{ textAlign: "center" }}>
                  <ColoredButton
                    type="submit"
                    style={{ marginTop: "20px" }}
                    colorVariety={ColorsEnum.BLUE}
                  >
                    Submit
                  </ColoredButton>
                </div>
              </form>
            </>
          )}
        </div>
      </Container>
    </>
  );
};

export default withRouter(withStyles(styles)(AddSensorPage));
