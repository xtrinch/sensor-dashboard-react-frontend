import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import ColoredButton from 'components/ColoredButton';
import TextInput from 'components/TextInput';
import { AccountContext } from 'context/AccountContext';
import useQuery from 'hooks/useQuery';
import React, { useContext, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import ColorsEnum from 'types/ColorsEnum';

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

const ChangePasswordForm: React.FunctionComponent<
  WithStyles<typeof styles> & RouteComponentProps<{}>
> = (props) => {
  const { classes } = props;

  const errs: { [key: string]: string } = {};
  const [errors, setErrors] = useState(errs);
  const [data, setData] = useState({
    newPassword: '',
    repeatNewPassword: '',
  });

  const accountContext = useContext(AccountContext);
  const query = useQuery();

  const submitForm = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      await accountContext.changePassword(data.newPassword, data.repeatNewPassword);
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
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Change password
        </Typography>
        <form className={classes.form} noValidate onSubmit={submitForm}>
          <TextInput
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="newPassword"
            label="New password"
            type="password"
            id="newPassword"
            value={data.newPassword}
            onChange={(e) => fieldChange(e.target.value, 'newPassword')}
            error={!!errors.newPassword}
            helperText={errors.newPassword}
          />
          <TextInput
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="repeatNewPassword"
            label="Repeat new password"
            type="password"
            id="repeatNewPassword"
            value={data.repeatNewPassword}
            onChange={(e) => fieldChange(e.target.value, 'repeatNewPassword')}
            error={!!errors.repeatNewPassword}
            helperText={errors.repeatNewPassword}
            style={{ marginTop: '15px' }}
          />
          <div style={{ color: ColorsEnum.RED }}>
            {errors.message && (
              <Grid item style={{ color: 'red' }}>
                {errors.message}
              </Grid>
            )}
          </div>
          <ColoredButton
            type="submit"
            fullWidth
            style={{ marginTop: '20px' }}
            colorVariety={ColorsEnum.BLUE}
          >
            Change password
          </ColoredButton>
        </form>
      </div>
    </Container>
  );
};

export default withRouter(withStyles(styles)(ChangePasswordForm));
