import { Container, IconButton, Typography, Pagination } from '@mui/material';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import { Delete, Settings } from '@mui/icons-material';
import ColoredButton from 'components/ColoredButton';
import Link from 'components/Link';
import TextInput from 'components/TextInput';
import TopBar from 'components/TopBar';
import { AccountContext } from 'context/AccountContext';
import { CommentContext } from 'context/CommentContext';
import { TopicContext } from 'context/TopicContext';
import { format } from 'date-fns';
import { useFormik } from 'formik';
import WYSIGEditor from 'pages/forum/components/WYSIGEditor';
import { getTopicEditRoute, getTopicListRoute } from 'pages/forum/ForumRoutes';
import CommentItem from 'pages/forum/topic/components/CommentItem';
import { getUserRoute } from 'pages/users/UserRoutes';
import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import TopicService from 'services/TopicService';
import ColorsEnum from 'types/ColorsEnum';
import Comment from 'types/Comment';
import { PermissionsEnum } from 'types/PermissionEnum';
import Topic from 'types/Topic';
import { DATETIME_REGEX } from 'utils/date.range';
import { ConfirmationContext } from 'context/ConfirmationContext';

const styles = (theme) =>
  createStyles({
    root: {
      backgroundColor: ColorsEnum.BGLIGHT,
      paddingLeft: '0px',
      paddingRight: '0px',
      textAlign: 'center',
      marginTop: '10px',
      marginBottom: '30px',
    },
    commentForm: {
      padding: '15px',
      textAlign: 'left',
      borderTop: `1px solid ${ColorsEnum.BGDARK}`,
    },
    pagination: {
      marginTop: '30px',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
    },
  });

const TopicPage: React.FunctionComponent<
  WithStyles<typeof styles> & RouteComponentProps<{ id: string; topicId: string }>
> = (props) => {
  const {
    classes,
    match: { params },
    history,
  } = props;

  const { deleteTopic } = useContext(TopicContext);

  const {
    addComment,
    state: { comments, totalPages, page },
    listComments,
  } = useContext(CommentContext);

  const { user } = useContext(AccountContext);
  const confirmationContext = useContext(ConfirmationContext);

  const [topic, setTopic] = useState(null);

  useEffect(() => {
    const setData = async () => {
      const s = await TopicService.getTopic(params.topicId);
      setTopic(s);
      setComment(
        new Comment({
          categoryId: params.id,
          topicId: params.topicId,
          name: `Re: ${s.name}`,
        }),
      );
    };
    setData();
  }, []);

  const deleteWithConfirmation = (t: Topic) => {
    const onConfirm = async () => {
      await deleteTopic(t.id);
    };
    confirmationContext.openConfirmation(onConfirm, null, 'Are you sure you want to delete topic?');
  };

  const [comment, setComment] = useState(null);

  const submitForm = async (values: Comment, { setStatus }) => {
    try {
      await addComment(values);
      // clear current comment
      setComment(
        new Comment({
          categoryId: params.id,
          topicId: params.topicId,
          name: `Re: ${topic.name}`,
        }),
      );
    } catch (e) {
      setStatus(e);
    }
  };

  const formik = useFormik<Comment>({
    initialValues: comment,
    onSubmit: submitForm,
    enableReinitialize: true,
  });

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
        <Typography component="h1" variant="h4" style={{ marginRight: '20px' }}>
          {topic.name}
        </Typography>
      </TopBar>
      <Container component="main" maxWidth="md">
        <div className={classes.pagination}>
          <Pagination
            count={totalPages || 1}
            page={page}
            shape="rounded"
            onChange={(e, p) => listComments(p)}
          />
        </div>
        <div style={{ display: 'flex' }} className={classes.root}>
          <div
            style={{
              minWidth: '200px',
              padding: '15px',
              textAlign: 'left',
              borderRight: `1px solid ${ColorsEnum.BGDARK}`,
            }}
          >
            <div>
              <Typography variant="body1">
                Posted by{' '}
                <Link color={ColorsEnum.OLIVE} to={getUserRoute(topic.user?.id)}>
                  {topic.user?.username}
                </Link>
              </Typography>
            </div>
            <div>
              <Typography variant="body1">{format(topic.createdAt, DATETIME_REGEX)}</Typography>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginTop: '20px',
              }}
            >
              {user?.isAllowed([PermissionsEnum.Category__update]) && (
                <IconButton
                  aria-label="settings"
                  size="small"
                  onClick={() => history.push(getTopicEditRoute(topic.categoryId, topic.id))}
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
            <div style={{ marginTop: '15px' }}>{topic.tag ? `Tag: ${topic.tag}` : ''}</div>
          </div>
          <div style={{ paddingTop: '5px' }}>
            <WYSIGEditor editorState={topic?.description} style={{ width: '100%' }} readOnly />
          </div>
        </div>
        <div className={classes.root}>
          {comments.map((c, index) => (
            <CommentItem comment={c} key={index} />
          ))}
        </div>
        <div className={classes.root}>
          <form noValidate onSubmit={formik.handleSubmit} className={classes.commentForm}>
            <Typography variant="h6">Leave a comment</Typography>
            <TextInput
              id="name"
              margin="normal"
              name="name"
              value={formik.values?.name || ''}
              onChange={formik.handleChange}
              error={!!formik.status?.name}
              helperText={formik.status?.name}
              fullWidth
            />
            <WYSIGEditor
              editorState={formik.values?.description}
              onEditorStateChange={(value) => formik.setFieldValue('description', value)}
            />
            <ColoredButton
              type="submit"
              style={{ marginTop: '20px' }}
              colorVariety={ColorsEnum.OLIVE}
            >
              Submit
            </ColoredButton>
          </form>
        </div>
      </Container>
    </>
  );
};

export default withRouter(withStyles(styles)(TopicPage));
