import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import Typography from '@mui/material/Typography';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ColoredButton from 'components/ColoredButton';
import TextInput from 'components/TextInput';
import { AccountContext } from 'context/AccountContext';
import React, { useContext, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import ColorsEnum from 'types/ColorsEnum';
import { Routes } from 'utils/Routes';
import Link from 'components/Link';
import { addToast } from 'context/ToastContext';
import { Toast } from 'types/Toast';

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
      marginTop: theme.spacing(3),
    },
  });

const RegisterPage: React.FunctionComponent<WithStyles<typeof styles> & RouteComponentProps<{}>> = (
  props,
) => {
  const { classes, history } = props;
  const { register } = useContext(AccountContext);

  const [data, setData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    username: '',
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
        addToast(
          new Toast({ message: 'Registration successful. You can now login', type: 'success' }),
        );
        history.push('/');
      }
    } catch (e) {
      setErrors(e);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
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
            style={{ padding: '15px 0 0 0' }}
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
                  onChange={(e) => fieldChange(e.target.value, 'name')}
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
                  onChange={(e) => fieldChange(e.target.value, 'surname')}
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
                  onChange={(e) => fieldChange(e.target.value, 'username')}
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
                  onChange={(e) => fieldChange(e.target.value, 'email')}
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
                  onChange={(e) => fieldChange(e.target.value, 'password')}
                  helperText={errors.password}
                />
              </Grid>
              {errors.message && (
                <Grid item style={{ color: 'red' }}>
                  {errors.message}
                </Grid>
              )}
            </Grid>
            <ColoredButton
              type="submit"
              fullWidth
              style={{ marginTop: '20px' }}
              colorVariety={ColorsEnum.BLUE}
            >
              Sign up
            </ColoredButton>
            <Grid container justifyContent="flex-end" style={{ marginTop: '10px' }}>
              <Grid item>
                <Link to={Routes.LOGIN} color={ColorsEnum.BLUE}>
                  Already have an account or want to use google login? Sign in
                </Link>
              </Grid>
            </Grid>
          </form>
        </>
      </div>
    </Container>
  );
};

export default withStyles(styles)(withRouter(RegisterPage));
