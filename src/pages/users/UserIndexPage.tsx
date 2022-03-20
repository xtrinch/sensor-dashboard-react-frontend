import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import UserListPage from 'pages/users/UserListPage';
import UserPage from 'pages/users/UserPage';
import { UserRoutes } from 'pages/users/UserRoutes';
import React from 'react';
import { Route, RouteComponentProps, withRouter } from 'react-router';

const styles = (theme) => createStyles({});

const ForumIndexPage: React.FunctionComponent<
  WithStyles<typeof styles> & RouteComponentProps<{ id: string }>
> = (props) => {
  return (
    <>
      <Route exact path={UserRoutes.USER_LIST}>
        <UserListPage />
      </Route>
      <Route exact path={UserRoutes.USER}>
        <UserPage />
      </Route>
    </>
  );
};

export default withRouter(withStyles(styles)(ForumIndexPage));
