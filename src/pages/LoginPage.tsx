import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import ColoredButton from 'components/ColoredButton';
import Link from 'components/Link';
import LoginWithGoogle from 'components/LoginWithGoogle';
import TextInput from 'components/TextInput';
import { AccountContext } from 'context/AccountContext';
import { DisplayContext } from 'context/DisplayContext';
import useQuery from 'hooks/useQuery';
import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import ColorsEnum from 'types/ColorsEnum';
import User from 'types/User';
import { Routes } from 'utils/Routes';

const styles = (theme) =>
  createStyles({
    paper: {
      marginTop: theme.spacing(30),
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
      padding: '20px 0 0 0',
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
      padding: theme.spacing(6, 0, 6),
    },
    loginWithGoogle: {
      backgroundColor: 'white',
      color: 'black',
      padding: '7px 10px',
      borderRadius: '5px',
      minHeight: '40px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

const LoginPage: React.FunctionComponent<WithStyles<typeof styles> & RouteComponentProps<{}>> = (
  props,
) => {
  const { classes, history } = props;
  const { reloadDisplays } = useContext(DisplayContext);

  const errs: { [key: string]: string } = {};
  const [errors, setErrors] = useState(errs);
  const [data, setData] = useState({
    email: '',
    password: '',
  });

  const accountContext = useContext(AccountContext);
  const query = useQuery();

  const getUserDataAndRedirect = async () => {
    if (query.get('success')) {
      const user = await accountContext.getMyData();
      if (user) {
        await uponLoginSuccess(user);
      }
    }
  };

  useEffect(() => {
    getUserDataAndRedirect();
  }, []);

  const uponLoginSuccess = async (user: User) => {
    await reloadDisplays('LOGGED_IN');
    history.push('/');
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      const user = await accountContext.login(data.email, data.password);
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

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <LoginWithGoogle style={{ margin: '30px 0px' }} />
        <Typography component="h1" variant="h5">
          Or sign in using the form below
        </Typography>
        <form className={classes.form} noValidate onSubmit={submitForm}>
          <TextInput
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email address or username"
            name="email"
            autoComplete="email"
            autoFocus
            value={data.email}
            onChange={(e) => fieldChange(e.target.value, 'email')}
            error={!!errors.email}
            helperText={errors.email}
            style={{ marginBottom: '10px' }}
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
            onChange={(e) => fieldChange(e.target.value, 'password')}
            error={!!errors.password}
            helperText={errors.password}
          />
          <div style={{ color: ColorsEnum.RED }}>
            {accountContext.loginState === 'LOGIN_ERROR' && 'Invalid email or password'}
          </div>
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <ColoredButton
            type="submit"
            fullWidth
            style={{ marginTop: '20px' }}
            colorVariety={ColorsEnum.BLUE}
          >
            Sign in
          </ColoredButton>
          <Grid container style={{ marginTop: '10px' }}>
            <Grid item xs>
              <Link to={Routes.REGISTER} color={ColorsEnum.BLUE}>
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link to={Routes.REGISTER} color={ColorsEnum.BLUE}>
                Don&apos;t have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default withRouter(withStyles(styles)(LoginPage));
