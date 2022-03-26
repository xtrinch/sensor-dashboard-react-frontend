import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import { CategoryContext } from 'context/CategoryContext';
import { CommentContextProvider } from 'context/CommentContext';
import { TopicContextProvider } from 'context/TopicContext';
import { observer } from 'mobx-react-lite';
import { ForumRoutes } from 'pages/forum/ForumRoutes';
import AddTopicPage from 'pages/forum/topic/AddTopicPage';
import TopicListPage from 'pages/forum/topic/TopicListPage';
import TopicPage from 'pages/forum/topic/TopicPage';
import React, { useContext } from 'react';
import { Route, RouteComponentProps, withRouter } from 'react-router';

const styles = (theme) => createStyles({});

const ForumIndexPage: React.FunctionComponent<
  WithStyles<typeof styles> & RouteComponentProps<{ id: string }>
> = (props) => {
  const {
    match: { params },
  } = props;

  const categoryStore = useContext(CategoryContext);

  const category = categoryStore.categories.find((c) => c.id === params.id);

  if (!category) {
    return null;
  }

  return (
    <TopicContextProvider category={category}>
      <Route exact path={ForumRoutes.TOPIC_LIST}>
        <TopicListPage />
      </Route>
      <Route
        exact
        path={ForumRoutes.TOPIC}
        render={({ match }) => (
          <CommentContextProvider categoryId={category.id} topicId={match.params.topicId}>
            <TopicPage />
          </CommentContextProvider>
        )}
      />
      <Route exact path={ForumRoutes.ADD_TOPIC}>
        <AddTopicPage />
      </Route>
      <Route exact path={ForumRoutes.EDIT_TOPIC}>
        <AddTopicPage />
      </Route>
    </TopicContextProvider>
  );
};

export default withRouter(withStyles(styles)(observer(ForumIndexPage)));
