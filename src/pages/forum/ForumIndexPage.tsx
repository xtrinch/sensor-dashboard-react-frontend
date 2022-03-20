import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import { CategoryContextProvider } from 'context/CategoryContext';
import CategoryIndexPage from 'pages/forum/categories/CategoryIndexPage';
import { ForumRoutes } from 'pages/forum/ForumRoutes';
import TopicIndexPage from 'pages/forum/topic/TopicIndexPage';
import React from 'react';
import { Route, RouteComponentProps, withRouter } from 'react-router';

const styles = (theme) => createStyles({});

const ForumIndexPage: React.FunctionComponent<
  WithStyles<typeof styles> & RouteComponentProps<{ id: string }>
> = (props) => {
  return (
    <CategoryContextProvider>
      <Route path={ForumRoutes.FORUM}>
        <CategoryIndexPage />
      </Route>
      <Route path={ForumRoutes.TOPIC_LIST}>
        <TopicIndexPage />
      </Route>
    </CategoryContextProvider>
  );
};

export default withRouter(withStyles(styles)(ForumIndexPage));
