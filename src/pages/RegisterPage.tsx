import Avatar from "@material-ui/core/Avatar";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import ColoredButton from "components/ColoredButton";
import TextInput from "components/TextInput";
import { AccountContext } from "context/AccountContext";
import React, { useContext, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import ColorsEnum from "types/ColorsEnum";

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
      marginTop: theme.spacing(3),
    },
  });

const RegisterPage: React.FunctionComponent<
  WithStyles<typeof styles> & RouteComponentProps<{}>
> = (props) => {
  const { classes, history } = props;
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const { register } = useContext(AccountContext);

  const [data, setData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    username: "",
  });

  const errs: { [key: string]: string } = {};
  const [errors, setErrors] = useState(errs);

  const fieldChange = (val, fieldName) => {
    data[fieldName] = val;
    setData({ ...data });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      const user = await register(data);

      if (user) {
        setRegisterSuccess(true);
        setTimeout(() => {
          history.push("/");
        }, 4000);
      }
    } catch (e) {
      setErrors(e);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        {!registerSuccess && (
          <>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <form
              onSubmit={submitForm}
              className={classes.form}
              noValidate
              style={{ padding: "15px 0 0 0" }}
            >
              <Grid container spacing={10}>
                <Grid item xs={12} sm={6}>
                  <TextInput
                    autoComplete="fname"
                    name="firstName"
                    variant="outlined"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    value={data.name}
                    error={!!errors.name}
                    helperText={errors.name}
                    onChange={(e) => fieldChange(e.target.value, "name")}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextInput
                    variant="outlined"
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="lname"
                    value={data.surname}
                    error={!!errors.surname}
                    helperText={errors.surname}
                    onChange={(e) => fieldChange(e.target.value, "surname")}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextInput
                    variant="outlined"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    value={data.username}
                    error={!!errors.username}
                    helperText={errors.username}
                    onChange={(e) => fieldChange(e.target.value, "username")}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextInput
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={data.email}
                    error={!!errors.email}
                    helperText={errors.email}
                    onChange={(e) => fieldChange(e.target.value, "email")}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextInput
                    variant="outlined"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={data.password}
                    error={!!errors.password}
                    onChange={(e) => fieldChange(e.target.value, "password")}
                    helperText={errors.password}
                  />
                </Grid>
                {errors.message && (
                  <Grid item style={{ color: "red" }}>
                    {errors.message}
                  </Grid>
                )}
              </Grid>
              <ColoredButton
                type="submit"
                fullWidth
                style={{ marginTop: "20px" }}
                colorVariety={ColorsEnum.BLUE}
              >
                Sign up
              </ColoredButton>
              <Grid container justify="flex-end">
                <Grid item>
                  <Link href="#" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </form>
          </>
        )}
        {registerSuccess && (
          <Grid container spacing={10} direction={"column"}>
            <Grid item>Registration successful! You can now login.</Grid>
            <Grid item>Redirecting to home page...</Grid>
          </Grid>
        )}
      </div>
    </Container>
  );
};

export default withStyles(styles)(withRouter(RegisterPage));
