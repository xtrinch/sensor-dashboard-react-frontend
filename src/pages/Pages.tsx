import { Grid } from '@mui/material';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import ConfirmationBox from 'components/ConfirmationBox';
import { useErrorBoundary, withErrorBoundary } from 'components/ErrorBoundary';
import ErrorBox from 'components/ErrorBox';
import { LazySuspense } from 'components/LazySuspense';
import SideMenuWrapper from 'components/SideMenuWrapper';
import ToastBox from 'components/ToastBox';
import { ErrorContext } from 'context/ErrorContext';
import { observer } from 'mobx-react-lite';
import { DashboardRoutes } from 'pages/dashboard/DashboardRoutes';
import { ForumRoutes } from 'pages/forum/ForumRoutes';
import { UserRoutes } from 'pages/users/UserRoutes';
import React, { lazy, useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import ColorsEnum from 'types/ColorsEnum';
import { Routes } from 'utils/Routes';
import Wrapper from 'Wrapper';

const styles = () =>
  createStyles({
    '@global': {
      '*::-webkit-scrollbar': {
        width: '0.4em',
      },
      '*::-webkit-scrollbar-track': {
        '-webkit-box-shadow': `inset 0 0 6px ${ColorsEnum.BGDARK}`,
      },
      '*::-webkit-scrollbar-thumb': {
        backgroundColor: ColorsEnum.BGLIGHTER,
        outline: '0px solid slategrey',
      },
    },
    app: {
      minHeight: '100vh',
      backgroundColor: ColorsEnum.BGDARK,
      width: '100%',
    },
    main: {
      flex: '1',
    },
  });

const ForumIndexPage = LazySuspense(lazy(() => import('pages/forum/ForumIndexPage')));
const DashboardIndexPage = LazySuspense(lazy(() => import('pages/dashboard/DashboardIndexPage')));
const UserIndexPage = LazySuspense(lazy(() => import('pages/users/UserIndexPage')));
const LoginPage = LazySuspense(lazy(() => import('pages/LoginPage')));
const RegisterPage = LazySuspense(lazy(() => import('pages/RegisterPage')));

const Pages: React.FunctionComponent<WithStyles<typeof styles>> = (props) => {
  const { classes } = props;
  const errorModalStore = useContext(ErrorContext);

  useErrorBoundary((error) => {
    errorModalStore.setError(error);
  });

  return (
    <Wrapper>
      <ToastBox />
      <ConfirmationBox />
      <ErrorBox />
      <Grid container className={classes.app}>
        <Grid item>
          <SideMenuWrapper />
        </Grid>
        <Grid item style={{ flex: '1' }}>
          <Route exact path="/">
            <Redirect to={DashboardRoutes.DASHBOARD} />
          </Route>
          <Route path={ForumRoutes.FORUM}>
            <ForumIndexPage />
          </Route>
          <Route path={ForumRoutes.TOPIC_BY_TAG}>
            <ForumIndexPage />
          </Route>
          <Route path={DashboardRoutes.DASHBOARD}>
            <DashboardIndexPage />
          </Route>
          <Route path={DashboardRoutes.PERSONAL_DASHBOARD}>
            <DashboardIndexPage />
          </Route>
          <Route path={DashboardRoutes.DRAGGABLE_BOARD}>
            <DashboardIndexPage />
          </Route>
          <Route path={UserRoutes.USERS}>
            <UserIndexPage />
          </Route>
          <Route exact path={Routes.LOGIN}>
            <LoginPage />
          </Route>
          <Route exact path={Routes.REGISTER}>
            <RegisterPage />
          </Route>
        </Grid>
      </Grid>
    </Wrapper>
  );
};

export default withStyles(styles)(observer(withErrorBoundary(Pages)));
