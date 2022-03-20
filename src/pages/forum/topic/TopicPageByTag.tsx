import { Container, IconButton, Typography } from '@material-ui/core';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { Delete, Settings } from '@material-ui/icons';
import Link from 'components/Link';
import TopBar from 'components/TopBar';
import { AccountContext } from 'context/AccountContext';
import { openConfirmation } from 'context/ConfirmationContext';
import { TopicContext } from 'context/TopicContext';
import { format } from 'date-fns';
import WYSIGEditor from 'pages/forum/components/WYSIGEditor';
import { getTopicEditRoute, getTopicRoute } from 'pages/forum/ForumRoutes';
import { getUserRoute } from 'pages/users/UserRoutes';
import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import TopicService from 'services/TopicService';
import ColorsEnum from 'types/ColorsEnum';
import { PermissionsEnum } from 'types/PermissionEnum';
import Topic from 'types/Topic';
import { DATETIME_REGEX } from 'utils/date.range';

const styles = (theme) =>
  createStyles({
    root: {
      backgroundColor: ColorsEnum.BGLIGHT,
      paddingLeft: '0px',
      paddingRight: '0px',
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
  WithStyles<typeof styles> & RouteComponentProps<{ tag: string }>
> = (props) => {
  const {
    classes,
    match: { params },
    history,
  } = props;

  const { deleteTopic } = useContext(TopicContext);

  const { user } = useContext(AccountContext);

  const [topic, setTopic] = useState(null);

  useEffect(() => {
    const setData = async () => {
      const s = await TopicService.getTopicByTag(params.tag);
      setTopic(s);
    };
    setData();
  }, []);

  const deleteWithConfirmation = (topic: Topic) => {
    const onConfirm = async () => {
      await deleteTopic(topic.id);
    };
    openConfirmation(onConfirm, null, 'Are you sure you want to delete topic?');
  };

  if (!topic) {
    return null;
  }

  return (
    <>
      <TopBar alignItems="center" color={ColorsEnum.OLIVE}>
        <Typography component="h1" variant="h4" style={{ marginRight: '20px' }}>
          {topic.name}
        </Typography>
      </TopBar>
      <Container component="main" maxWidth="md">
        <div className={classes.root}>
          <div style={{ paddingTop: '5px' }}>
            <WYSIGEditor editorState={topic?.description} style={{ width: '100%' }} readOnly />
          </div>
          <div
            style={{
              minWidth: '200px',
              padding: '10px',
              textAlign: 'left',
              borderRight: `1px solid ${ColorsEnum.BGDARK}`,
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <div>
              <div>
                <Typography variant="body1">
                  Posted by{' '}
                  <Link color={ColorsEnum.YELLOW} to={getUserRoute(topic.user?.id)}>
                    {topic.user?.username}
                  </Link>
                </Typography>
              </div>
              <div>
                <Typography variant="body1">{format(topic.createdAt, DATETIME_REGEX)}</Typography>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginLeft: '20px',
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
          </div>
          <div style={{ padding: '10px' }}>
            <Link color={ColorsEnum.OLIVE} to={getTopicRoute(topic.categoryId, topic.id)}>
              Leave a comment in the forum
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
};

export default withRouter(withStyles(styles)(TopicPage));
