import { Container, IconButton, Typography } from "@material-ui/core";
import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import { Delete, Settings } from "@material-ui/icons";
import Link from "components/Link";
import TopBar from "components/TopBar";
import { AccountContext } from "context/AccountContext";
import { openConfirmation } from "context/ConfirmationContext";
import { TopicContext } from "context/TopicContext";
import { format } from "date-fns";
import { convertFromRaw, EditorState } from "draft-js";
import WYSIGEditor from "pages/forum/components/WYSIGEditor";
import { getTopicEditRoute, getTopicListRoute } from "pages/forum/ForumRoutes";
import React, { useContext } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import ColorsEnum from "types/ColorsEnum";
import { PermissionsEnum } from "types/PermissionEnum";
import Topic from "types/Topic";
import { DATETIME_REGEX } from "utils/date.range";

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
    history,
  } = props;

  const {
    state: { topics },
    deleteTopic,
  } = useContext(TopicContext);

  const {
    state: { user },
  } = useContext(AccountContext);

  const topic = topics.find((c) => c.id === parseInt(params.topicId));

  const deleteWithConfirmation = (topic: Topic) => {
    const onConfirm = async () => {
      await deleteTopic(topic.id);
    };
    openConfirmation(onConfirm, null, "Are you sure you want to delete topic?");
  };

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
        <div style={{ display: "flex" }}>
          <div
            style={{
              minWidth: "150px",
              padding: "15px",
              textAlign: "left",
              borderRight: `1px solid ${ColorsEnum.BGDARK}`,
            }}
          >
            <div>
              <Typography variant="body1">
                Posted by{" "}
                <Link color={ColorsEnum.OLIVE}>{topic.user?.username}</Link>
              </Typography>
            </div>
            <div>
              <Typography variant="body1">
                {format(topic.createdAt, DATETIME_REGEX)}
              </Typography>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                marginTop: "20px",
              }}
            >
              {user?.isAllowed([PermissionsEnum.Category__update]) && (
                <IconButton
                  aria-label="settings"
                  size="small"
                  onClick={() =>
                    history.push(getTopicEditRoute(topic.categoryId, topic.id))
                  }
                >
                  <Settings />
                </IconButton>
              )}
              {user?.isAllowed([PermissionsEnum.Topic__delete]) && (
                <IconButton
                  aria-label="settings"
                  size="small"
                  onClick={() => deleteWithConfirmation(topic)}
                >
                  <Delete />
                </IconButton>
              )}
            </div>
          </div>
          <div style={{ paddingTop: "5px" }}>
            <WYSIGEditor
              editorState={EditorState.createWithContent(
                convertFromRaw(topic?.description)
              )}
              readOnly
            />
          </div>
        </div>
      </Container>
    </>
  );
};

export default withRouter(withStyles(styles)(TopicPage));
