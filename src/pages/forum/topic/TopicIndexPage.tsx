import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import { CategoryContext } from "context/CategoryContext";
import { TopicContextProvider } from "context/TopicContext";
import { ForumRoutes } from "pages/forum/ForumRoutes";
import AddTopicPage from "pages/forum/topic/AddTopicPage";
import TopicListPage from "pages/forum/topic/TopicListPage";
import TopicPage from "pages/forum/topic/TopicPage";
import React, { useContext } from "react";
import { Route, RouteComponentProps, withRouter } from "react-router";

const styles = (theme) => createStyles({});

const ForumIndexPage: React.FunctionComponent<
  WithStyles<typeof styles> & RouteComponentProps<{ id: string }>
> = (props) => {
  const {
    match: { params },
  } = props;

  const {
    state: { categories },
  } = useContext(CategoryContext);

  const category = categories.find((c) => c.id === parseInt(params.id));

  if (!category) {
    return null;
  }

  return (
    <TopicContextProvider category={category}>
      <Route exact path={ForumRoutes.TOPIC_LIST}>
        <TopicListPage />
      </Route>
      <Route exact path={ForumRoutes.TOPIC}>
        <TopicPage />
      </Route>
      <Route exact path={ForumRoutes.ADD_TOPIC}>
        <AddTopicPage />
      </Route>
    </TopicContextProvider>
  );
};

export default withRouter(withStyles(styles)(ForumIndexPage));
