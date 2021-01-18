import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import { CategoryContextProvider } from "context/CategoryContext";
import AddCategoryPage from "pages/forum/AddCategoryPage";
import CategoryListPage from "pages/forum/CategoryListPage";
import React from "react";
import { Route, RouteComponentProps, withRouter } from "react-router";
import { Routes } from "utils/Routes";

const styles = (theme) => createStyles({});

const ForumIndexPage: React.FunctionComponent<
  WithStyles<typeof styles> & RouteComponentProps<{ id: string }>
> = (props) => {
  return (
    <CategoryContextProvider>
      <Route exact path={Routes.FORUM}>
        <CategoryListPage />
      </Route>
      <Route exact path={Routes.ADD_CATEGORY}>
        <AddCategoryPage />
      </Route>
    </CategoryContextProvider>
  );
};

export default withRouter(withStyles(styles)(ForumIndexPage));
