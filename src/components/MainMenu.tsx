import { Tab, Tabs, Theme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import { AccountContext } from 'context/AccountContext';
import { DashboardRoutes } from 'pages/dashboard/DashboardRoutes';
import { ForumRoutes, getTopicByTagRoute } from 'pages/forum/ForumRoutes';
import { UserRoutes } from 'pages/users/UserRoutes';
import React, { useContext } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import ColorsEnum from 'types/ColorsEnum';

interface MainMenuProps {}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: '100%',
      marginBottom: '20px',
      marginTop: '40px',
      '& .MuiTabs-flexContainer': {
        flexDirection: 'column',
      },
      '& .MuiTabs-indicator': {
        display: 'none',
      },
    },
    dashboard: {
      '&:before, &:after': {
        backgroundColor: ColorsEnum.BLUE,
        color: `${ColorsEnum.BLUE}`,
      },
      borderColor: ColorsEnum.BLUE,
    },
    forum: {
      '&:before, &:after': {
        backgroundColor: ColorsEnum.OLIVE,
      },
      borderColor: ColorsEnum.OLIVE,
    },
    users: {
      '&:before, &:after': {
        backgroundColor: ColorsEnum.YELLOW,
      },
      borderColor: ColorsEnum.YELLOW,
    },
    about: {
      '&:before, &:after': {
        backgroundColor: ColorsEnum.WHITE,
      },
      borderColor: ColorsEnum.WHITE,
    },
    subTab: {
      textTransform: 'none',
      alignItems: 'flex-start',
      paddingLeft: '60px',
      minHeight: '30px',
      color: 'white',
      '&:before': {
        display: 'block',
        content: "'>'",
        width: '10px',
        height: '10px',
        position: 'absolute',
        left: '35px',
        top: '12px',
        backgroundColor: 'transparent!important',
      },
      '&:not(.Mui-selected):before': {
        color: 'white',
      },
    },
    tab: {
      textTransform: 'none',
      width: '100%',
      maxWidth: '100%',
      opacity: 1,
      minHeight: '40px',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      position: 'relative',
      paddingLeft: '40px',
      color: 'white!important',
      '&:before': {
        display: 'block',
        content: "''",
        width: '10px',
        height: '10px',
        position: 'absolute',
        left: '15px',
        top: '14px',
      },
      '& .MuiTab-wrapper': {
        alignItems: 'flex-start',
        marginLeft: '18px',
      },
      '&.Mui-selected': {
        '&:after': {
          content: "''",
          left: 0,
          bottom: '0px',
          width: '100%',
          height: '2px',
          position: 'absolute',
        },
      },
    },
  }),
);

const MainMenu: React.FunctionComponent<MainMenuProps & RouteComponentProps<{}>> = (props) => {
  const classes = useStyles(props);
  const {
    history,
    location: { pathname },
  } = props;

  const accountStore = useContext(AccountContext);
  return (
    <>
      <Tabs
        className={classes.container}
        value={
          pathname.indexOf('about') >= 0 ? 'about' : `/${pathname.split('/')[1] || 'dashboard'}`
        }
      >
        <Tab
          className={clsx(
            classes.tab,
            classes.dashboard,
            pathname.indexOf('dashboard') >= 0 && 'Mui-selected',
          )}
          onClick={() => {
            history.push(DashboardRoutes.DASHBOARD);
          }}
          value={DashboardRoutes.DASHBOARD}
          label={'IOT'}
        />
        <Tab
          className={clsx(classes.subTab, classes.dashboard)}
          onClick={() => {
            history.push(DashboardRoutes.DASHBOARD);
          }}
          value={DashboardRoutes.DASHBOARD}
          label={'Public graphs'}
        />
        {accountStore.loginState === 'LOGGED_IN' && (
          <Tab
            className={clsx(classes.subTab, classes.dashboard)}
            onClick={() => {
              history.push(DashboardRoutes.PERSONAL_DASHBOARD);
            }}
            value={DashboardRoutes.PERSONAL_DASHBOARD}
            label={'Personal graphs'}
          />
        )}
        {accountStore.loginState === 'LOGGED_IN' && (
          <Tab
            className={clsx(classes.subTab, classes.dashboard)}
            onClick={() => {
              history.push(DashboardRoutes.DRAGGABLE_BOARD);
            }}
            value={DashboardRoutes.DRAGGABLE_BOARD}
            label={'Canvas assembly'}
          />
        )}
        <Tab
          label="Forum"
          className={clsx(classes.tab, classes.forum)}
          onClick={() => {
            history.push(ForumRoutes.FORUM);
          }}
          value={ForumRoutes.FORUM}
        />
        <Tab
          label="Users"
          className={clsx(classes.tab, classes.users)}
          onClick={() => {
            history.push(UserRoutes.USERS);
          }}
          value={UserRoutes.USERS}
        />

        <Tab
          label="About"
          className={clsx(classes.tab, classes.about)}
          onClick={() => {
            history.push(getTopicByTagRoute('about'));
          }}
          value="about"
        />
      </Tabs>
    </>
  );
};

MainMenu.defaultProps = {};

export default withRouter(MainMenu);
