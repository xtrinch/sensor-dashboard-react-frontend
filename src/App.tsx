import { Grid, ThemeProvider, Theme, StyledEngineProvider } from '@mui/material';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import ConfirmationBox from 'components/ConfirmationBox';
import ErrorBox from 'components/ErrorBox';
import SideMenuWrapper from 'components/SideMenuWrapper';
import ToastBox from 'components/ToastBox';
import { AccountContextProvider } from 'context/AccountContext';
import { AppContextProvider } from 'context/AppContext';
import { ConfirmationContextProvider } from 'context/ConfirmationContext';
import { DisplayContextProvider } from 'context/DisplayContext';
import { ErrorContextProvider } from 'context/ErrorContext';
import { SensorContextProvider } from 'context/SensorContext';
import { ToastContextProvider } from 'context/ToastContext';
import { UserContextProvider } from 'context/UserContext';
import theme from 'layout/Theme';
import { observer } from 'mobx-react-lite';
import DashboardIndexPage from 'pages/dashboard/DashboardIndexPage';
import { DashboardRoutes } from 'pages/dashboard/DashboardRoutes';
import ForumIndexPage from 'pages/forum/ForumIndexPage';
import { ForumRoutes } from 'pages/forum/ForumRoutes';
import LoginPage from 'pages/LoginPage';
import RegisterPage from 'pages/RegisterPage';
import UserIndexPage from 'pages/users/UserIndexPage';
import { UserRoutes } from 'pages/users/UserRoutes';
import React from 'react';
import { BrowserRouter, Redirect, Route } from 'react-router-dom';
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

const App: React.FunctionComponent<WithStyles<typeof styles>> = (props) => {
  const { classes } = props;
  return (
    <BrowserRouter>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <ToastContextProvider>
            <AccountContextProvider>
              <AppContextProvider>
                <SensorContextProvider>
                  <ConfirmationContextProvider>
                    <DisplayContextProvider>
                      <UserContextProvider>
                        <ErrorContextProvider>
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
                                <Route path={DashboardRoutes.CANVAS}>
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
                        </ErrorContextProvider>
                      </UserContextProvider>
                    </DisplayContextProvider>
                  </ConfirmationContextProvider>
                </SensorContextProvider>
              </AppContextProvider>
            </AccountContextProvider>
          </ToastContextProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </BrowserRouter>
  );
};

export default withStyles(styles)(observer(App));
