import { Button, Table, TableBody, Typography } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import Plus from "@material-ui/icons/Add";
import TopBar from "components/TopBar";
import { AccountContext } from "context/AccountContext";
import { CategoryContext } from "context/CategoryContext";
import { TopicContext } from "context/TopicContext";
import { ForumRoutes, getAddTopicRoute } from "pages/forum/ForumRoutes";
import TopicItem from "pages/forum/topic/components/TopicItem";
import React, { useContext } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import ColorsEnum from "types/ColorsEnum";
import { PermissionsEnum } from "types/PermissionEnum";
import Topic from "types/Topic";

const styles = (theme) =>
  createStyles({
    root: {
      backgroundColor: ColorsEnum.BGLIGHT,
      paddingLeft: "0px",
      paddingRight: "0px",
      textAlign: "center",
      marginTop: "30px",
      marginBottom: "30px",
    },
    actionButton: {
      backgroundColor: ColorsEnum.OLIVE,
      color: ColorsEnum.WHITE,
      width: "fit-content",
    },
  });

const TopicListPage: React.FunctionComponent<
  WithStyles<typeof styles> & RouteComponentProps<{ id: string }>
> = (props) => {
  const {
    classes,
    history,
    match: { params },
  } = props;
  const {
    state: { user },
  } = useContext(AccountContext);

  const {
    state: { topics },
  } = useContext(TopicContext);

  const {
    state: { categories },
  } = useContext(CategoryContext);

  const category = categories.find((c) => c.id === parseInt(params.id));

  return (
    <>
      <TopBar
        alignItems="center"
        backEnabled
        backTo={ForumRoutes.FORUM}
        color={ColorsEnum.OLIVE}
      >
        <Typography component="h1" variant="h4" style={{ marginRight: "20px" }}>
          Topics in category: {category?.name}
        </Typography>
        {user?.isAllowed([PermissionsEnum.Topic__create]) && (
          <Button
            variant="contained"
            className={classes.actionButton}
            startIcon={<Plus />}
            onClick={() => history.push(getAddTopicRoute(category.id))}
          >
            Add topic
          </Button>
        )}
      </TopBar>
      <Container component="main" maxWidth="md" className={classes.root}>
        {topics.length !== 0 && (
          <Table>
            <TableBody>
              {topics?.map((topic: Topic, index: number) => (
                <TopicItem topic={topic} key={index} />
              ))}
            </TableBody>
          </Table>
        )}
        {topics.length === 0 && (
          <Typography
            variant="body2"
            component="p"
            style={{ margin: "30px 0px" }}
          >
            No topics added
          </Typography>
        )}
      </Container>
    </>
  );
};

export default withRouter(withStyles(styles)(TopicListPage));
