import { Container, Typography } from "@material-ui/core";
import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import TopBar from "components/TopBar";
import { TopicContext } from "context/TopicContext";
import { convertFromRaw, EditorState } from "draft-js";
import WYSIGEditor from "pages/forum/components/WYSIGEditor";
import { getTopicListRoute } from "pages/forum/ForumRoutes";
import React, { useContext } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import ColorsEnum from "types/ColorsEnum";

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

const TopicPage: React.FunctionComponent<
  WithStyles<typeof styles> &
    RouteComponentProps<{ id: string; topicId: string }>
> = (props) => {
  const {
    classes,
    match: { params },
  } = props;

  const {
    state: { topics },
  } = useContext(TopicContext);

  const topic = topics.find((c) => c.id === parseInt(params.topicId));

  if (!topic) {
    return null;
  }

  return (
    <>
      <TopBar
        alignItems="center"
        backEnabled
        backTo={getTopicListRoute(topic.categoryId)}
        color={ColorsEnum.OLIVE}
      >
        <Typography component="h1" variant="h4" style={{ marginRight: "20px" }}>
          {topic.name}
        </Typography>
      </TopBar>
      <Container component="main" maxWidth="md" className={classes.root}>
        <WYSIGEditor
          editorState={EditorState.createWithContent(
            convertFromRaw(topic?.description)
          )}
          readOnly
        />
      </Container>
    </>
  );
};

export default withRouter(withStyles(styles)(TopicPage));
