import { createStyles, makeStyles, Tab, Tabs, Theme } from '@material-ui/core';
import { DashboardRoutes } from 'pages/dashboard/DashboardRoutes';
import { ForumRoutes, getTopicByTagRoute } from 'pages/forum/ForumRoutes';
import { UserRoutes } from 'pages/users/UserRoutes';
import React from 'react';
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
      '& .MuiTab-root': {
        width: '100%',
        maxWidth: '100%',
        opacity: 1,
        color: 'white',
        minHeight: '40px',
        '&:before': {
          content: "''",
          width: '10px',
          height: '10px',
          position: 'relative',
          left: '5px',
          top: '-1px',
        },
        '& .MuiTab-wrapper': {
          alignItems: 'flex-start',
          marginLeft: '18px',
        },
      },
      '& .Mui-selected': {
        '&:after': {
          content: "''",
          left: 0,
          bottom: '0px',
          width: '100%',
          height: '2px',
          position: 'absolute',
        },
      },
      '& .MuiTabs-indicator': {
        display: 'none',
      },
    },
    dashboard: {
      '&:before, &:after': {
        backgroundColor: ColorsEnum.BLUE,
      },
      borderColor: ColorsEnum.BLUE,
      color: ColorsEnum.BLUE,
    },
    forum: {
      '&:before, &:after': {
        backgroundColor: ColorsEnum.OLIVE,
      },
      borderColor: ColorsEnum.OLIVE,
      color: ColorsEnum.OLIVE,
    },
    users: {
      '&:before, &:after': {
        backgroundColor: ColorsEnum.YELLOW,
      },
      borderColor: ColorsEnum.YELLOW,
      color: ColorsEnum.YELLOW,
    },
    about: {
      '&:before, &:after': {
        backgroundColor: ColorsEnum.WHITE,
      },
      borderColor: ColorsEnum.WHITE,
      color: ColorsEnum.WHITE,
    },
  }),
);

const MainMenu: React.FunctionComponent<MainMenuProps & RouteComponentProps<{}>> = (props) => {
  const classes = useStyles(props);
  const {
    history,
    location: { pathname },
  } = props;

  return (
    <>
      <Tabs
        className={classes.container}
        value={
          pathname.indexOf('about') >= 0 ? 'about' : `/${pathname.split('/')[1] || 'dashboard'}`
        }
      >
        <Tab
          label="IOT dashboard"
          className={classes.dashboard}
          onClick={() => {
            history.push(DashboardRoutes.DASHBOARD);
          }}
          value={DashboardRoutes.DASHBOARD}
        />
        <Tab
          label="Forum"
          className={classes.forum}
          onClick={() => {
            history.push(ForumRoutes.FORUM);
          }}
          value={ForumRoutes.FORUM}
        />
        <Tab
          label="Users"
          className={classes.users}
          onClick={() => {
            history.push(UserRoutes.USERS);
          }}
          value={UserRoutes.USERS}
        />

        <Tab
          label="About"
          className={classes.about}
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
