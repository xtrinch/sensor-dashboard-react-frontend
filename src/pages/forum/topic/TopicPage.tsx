import { Container, IconButton, Typography } from "@material-ui/core";
import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import { Delete, Settings } from "@material-ui/icons";
import ColoredButton from "components/ColoredButton";
import Link from "components/Link";
import TextInput from "components/TextInput";
import TopBar from "components/TopBar";
import { AccountContext } from "context/AccountContext";
import { CommentContext } from "context/CommentContext";
import { openConfirmation } from "context/ConfirmationContext";
import { TopicContext } from "context/TopicContext";
import { format } from "date-fns";
import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import { useFormik } from "formik";
import WYSIGEditor from "pages/forum/components/WYSIGEditor";
import { getTopicEditRoute, getTopicListRoute } from "pages/forum/ForumRoutes";
import React, { useContext, useEffect, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import TopicService from "services/TopicService";
import ColorsEnum from "types/ColorsEnum";
import Comment from "types/Comment";
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
    commentForm: {
      padding: "15px",
      textAlign: "left",
      borderTop: `1px solid ${ColorsEnum.BGDARK}`,
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

  const { addComment } = useContext(CommentContext);

  const {
    state: { user },
  } = useContext(AccountContext);

  const [topic, setTopic] = useState(null);

  useEffect(() => {
    const setData = async () => {
      const s = await TopicService.getTopic(parseInt(params.topicId));
      setTopic(s);
    };
    setData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const deleteWithConfirmation = (topic: Topic) => {
    const onConfirm = async () => {
      await deleteTopic(topic.id);
    };
    openConfirmation(onConfirm, null, "Are you sure you want to delete topic?");
  };

  const submitForm = async (values: Comment, { setStatus }) => {
    try {
      let newComment;
      newComment = await addComment(values);
    } catch (e) {
      setStatus(e);
    }
  };

  const [comment, setComment] = useState(
    () => new Comment({ categoryId: params.id, topicId: params.topicId })
  );
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const formik = useFormik<Comment>({
    initialValues: comment,
    onSubmit: submitForm,
    enableReinitialize: true,
  });

  const onEditorStateChange = (change: EditorState) => {
    setEditorState(change);
    formik.setFieldValue(
      "description",
      convertToRaw(change.getCurrentContent())
    );
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
        <form
          noValidate
          onSubmit={formik.handleSubmit}
          className={classes.commentForm}
        >
          <Typography variant="h6">Leave a comment</Typography>
          <TextInput
            id="name"
            margin="normal"
            label="Name"
            name="name"
            value={formik.values.name}
            autoFocus
            onChange={formik.handleChange}
            error={!!formik.status?.name}
            helperText={formik.status?.name}
            fullWidth
          />
          <WYSIGEditor
            editorState={editorState}
            onEditorStateChange={onEditorStateChange}
          />
          <ColoredButton
            type="submit"
            style={{ marginTop: "20px" }}
            colorVariety={ColorsEnum.OLIVE}
          >
            Submit
          </ColoredButton>
        </form>
      </Container>
    </>
  );
};

export default withRouter(withStyles(styles)(TopicPage));
