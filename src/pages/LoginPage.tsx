import Avatar from "@material-ui/core/Avatar";
import Checkbox from "@material-ui/core/Checkbox";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import ColoredButton from "components/ColoredButton";
import TextInput from "components/TextInput";
import config from "config/Config";
import { AccountContext } from "context/AccountContext";
import { DisplayContext } from "context/DisplayContext";
import { SensorContext } from "context/SensorContext";
import React, { useContext, useState } from "react";
import {
  GoogleLogin,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";
import { RouteComponentProps, withRouter } from "react-router";
import ColorsEnum from "types/ColorsEnum";
import User from "types/User";
import Link from "components/Link";
import { Routes } from "utils/Routes";

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

const LoginPage: React.FunctionComponent<
  WithStyles<typeof styles> & RouteComponentProps<{}>
> = (props) => {
  const { classes, history } = props;
  const { reloadDisplays } = useContext(DisplayContext);

  const errs: { [key: string]: string } = {};
  const [errors, setErrors] = useState(errs);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const {
    login,
    loginWithGoogle,
    state: { loginState },
  } = useContext(AccountContext);
  const { reloadSensors } = useContext(SensorContext);

  const uponLoginSuccess = async (user: User) => {
    await reloadSensors("LOGGED_IN", user);
    await reloadDisplays("LOGGED_IN");
    history.push("/");
  };

  const submitForm = async (e) => {
    e.preventDefault();

    try {
      const user = await login(data.email, data.password);
      if (user) {
        // todo move out of here
        await uponLoginSuccess(user);
      }
    } catch (e) {
      setErrors(e);
    }
  };

  const fieldChange = (val, fieldName) => {
    data[fieldName] = val;
    setData({ ...data });
  };

  const responseGoogle = async (
    response: GoogleLoginResponse | GoogleLoginResponseOffline | any
  ) => {
    console.log(response);
    if (!response.error) {
      const user = await loginWithGoogle(response.tokenId);
      if (user) {
        uponLoginSuccess(user);
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate onSubmit={submitForm}>
          <TextInput
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={data.email}
            onChange={(e) => fieldChange(e.target.value, "email")}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextInput
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={data.password}
            onChange={(e) => fieldChange(e.target.value, "password")}
            error={!!errors.password}
            helperText={errors.password}
          />
          <div style={{ color: ColorsEnum.RED }}>
            {loginState === "LOGIN_ERROR" && "Invalid email or password"}
          </div>
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <ColoredButton
            type="submit"
            fullWidth
            style={{ marginTop: "20px" }}
            colorVariety={ColorsEnum.BLUE}
          >
            Sign in
          </ColoredButton>
          <Grid container style={{ marginTop: "10px" }}>
            <Grid item xs>
              <Link to={Routes.REGISTER} color={ColorsEnum.BLUE}>
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link to={Routes.REGISTER} color={ColorsEnum.BLUE}>
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
        <div style={{ marginTop: "30px" }}>
          <GoogleLogin
            clientId={config.googleClientId}
            buttonText="Login with Google"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={"single_host_origin"}
          />
        </div>
      </div>
    </Container>
  );
};

export default withRouter(withStyles(styles)(LoginPage));
