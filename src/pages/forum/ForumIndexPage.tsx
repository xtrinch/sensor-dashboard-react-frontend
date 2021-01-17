import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import { CategoryContextProvider } from "context/CategoryContext";
import CategoryListPage from "pages/forum/CategoryListPage";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router";

const styles = (theme) => createStyles({});

const ForumIndexPage: React.FunctionComponent<
  WithStyles<typeof styles> & RouteComponentProps<{ id: string }>
> = (props) => {
  return (
    <CategoryContextProvider>
      <CategoryListPage />
    </CategoryContextProvider>
  );
};

export default withRouter(withStyles(styles)(ForumIndexPage));
