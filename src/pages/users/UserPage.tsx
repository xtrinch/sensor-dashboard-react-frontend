import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import TopBar from 'components/TopBar';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import UserService from 'services/UserService';
import ColorsEnum from 'types/ColorsEnum';
import { DATETIME_REGEX } from 'utils/date.range';
import ChangePasswordForm from './components/ChangePasswordForm';

const styles = (theme) =>
  createStyles({
    paper: {
      margin: '30px 0px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: ColorsEnum.BGLIGHT,
      padding: '30px',
      border: `1px solid ${ColorsEnum.GRAYDARK}`,
    },
  });

const UserPage: React.FunctionComponent<
  WithStyles<typeof styles> & RouteComponentProps<{ id: string }>
> = (props) => {
  const {
    classes,
    match: { params },
  } = props;
  const [user, setUser] = useState(null);

  useEffect(() => {
    const setData = async () => {
      const s = await UserService.getUser(params.id);
      setUser(s);
    };
    setData();
  }, []);

  return (
    <>
      <TopBar alignItems="center">
        <Typography component="h1" variant="h4">
          User info
        </Typography>
      </TopBar>
      <Container component="main" maxWidth="sm">
        <div className={classes.paper}>
          <Typography variant="subtitle1">Username: {user?.username}</Typography>
          <Typography variant="subtitle1">
            Joined at: {user?.createdAt ? format(user?.createdAt, DATETIME_REGEX) : ''}
          </Typography>
          <Typography variant="subtitle1">User group: {user?.group || '/'}</Typography>
          {params.id === 'me' && <ChangePasswordForm />}
        </div>
      </Container>
    </>
  );
};

export default withRouter(withStyles(styles)(UserPage));
