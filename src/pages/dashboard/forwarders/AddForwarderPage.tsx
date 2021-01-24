import { Grid } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import SettingsInputAntennaIcon from "@material-ui/icons/SettingsInputAntenna";
import ColoredButton from "components/ColoredButton";
import SelectInput from "components/SelectInput";
import TextInput from "components/TextInput";
import TopBar from "components/TopBar";
import { ForwarderContext } from "context/ForwarderContext";
import { getForwarderRoute } from "pages/dashboard/DashboardRoutes";
import React, { useContext, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import BoardTypeEnum from "types/BoardTypeEnum";
import ColorsEnum from "types/ColorsEnum";

const styles = (theme) =>
  createStyles({
    paper: {
      marginTop: theme.spacing(30),
      forwarder: "flex",
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

const AddForwarderPage: React.FunctionComponent<
  WithStyles<typeof styles> & RouteComponentProps<{ id: string }>
> = (props) => {
  const { classes, history } = props;
  const { addForwarder } = useContext(ForwarderContext);

  const errs: { [key: string]: string } = {};
  const [errors, setErrors] = useState(errs);
  const [data, setData] = useState({
    name: "",
    location: "",
    timezone: "",
    boardType: "" as BoardTypeEnum,
  });

  const [success, setSuccess] = useState(false);

  const submitForm = async (e) => {
    e.preventDefault();

    try {
      const forwarder = await addForwarder(data);
      if (forwarder) {
        setSuccess(true);
        history.push(getForwarderRoute(forwarder.id));
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
          Add forwarder board
        </Typography>
      </TopBar>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
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
                  label="Forwarder name"
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
                  id="select"
                  // label="Board type"
                  value={data.boardType}
                  onChange={(e, newVal) => fieldChange(newVal, "boardType")}
                  fullWidth
                  // error={!!errors.boardType}
                  // helperText={errors.boardType}
                  options={Object.keys(BoardTypeEnum)}
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
              <Grid item>Forwarder successfully added.</Grid>
              <Grid item>Redirecting to forwarder info page...</Grid>
            </Grid>
          )}
        </div>
      </Container>
    </>
  );
};

export default withRouter(withStyles(styles)(AddForwarderPage));
