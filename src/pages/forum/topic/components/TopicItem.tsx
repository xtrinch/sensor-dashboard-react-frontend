import { TableCell, TableRow } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import { Settings } from "@material-ui/icons";
import DeleteIcon from "@material-ui/icons/Delete";
import Link from "components/Link";
import { AccountContext } from "context/AccountContext";
import { openConfirmation } from "context/ConfirmationContext";
import { TopicContext } from "context/TopicContext";
import { format } from "date-fns";
import { getTopicEditRoute, getTopicRoute } from "pages/forum/ForumRoutes";
import { getUserRoute } from "pages/users/UserRoutes";
import React, { useContext } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import ColorsEnum from "types/ColorsEnum";
import { PermissionsEnum } from "types/PermissionEnum";
import Topic from "types/Topic";
import { DATETIME_REGEX } from "utils/date.range";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: "0px 0px",
      backgroundColor: ColorsEnum.BGLIGHT,
      borderRadius: 0,
      boxShadow: "none",
      borderBottom: `1px solid ${ColorsEnum.GRAYDARK}`,
    },
    action: {
      marginTop: "0px",
    },
    avatar: {
      backgroundColor: ColorsEnum.BLUE,
      color: "white",
    },
    cardHeader: {
      padding: "10px",
    },
  });

const TopicItem: React.FunctionComponent<
  WithStyles<typeof styles> & RouteComponentProps<{}> & { topic: Topic }
> = (props) => {
  const { topic, classes, history } = props;
  const { deleteTopic } = useContext(TopicContext);
  const {
    state: { user },
  } = useContext(AccountContext);

  const deleteWithConfirmation = (topic: Topic) => {
    const onConfirm = async () => {
      await deleteTopic(topic.id);
    };
    openConfirmation(onConfirm, null, "Are you sure you want to delete topic?");
  };

  return (
    <TableRow className={classes.root}>
      <TableCell>
        <div>
          <Link
            color={ColorsEnum.OLIVE}
            to={getTopicRoute(topic.categoryId, topic.id)}
          >
            {topic.name}
          </Link>
          <div>
            By <Link color={ColorsEnum.OLIVE}>{topic.user?.username}</Link>,{" "}
            {format(topic.createdAt, DATETIME_REGEX)}
          </div>
        </div>
      </TableCell>
      <TableCell style={{ padding: "0px" }}>
        {topic.lastComment && (
          <>
            <Link
              color={ColorsEnum.OLIVE}
              to={getTopicRoute(
                topic.lastComment?.categoryId,
                topic.lastComment?.topicId
              )}
            >
              {topic.lastComment?.name}
            </Link>
            <br />
            by{" "}
            <Link
              color={ColorsEnum.OLIVE}
              to={getUserRoute(topic.lastComment?.user?.id)}
            >
              {topic.lastComment?.user?.username}
            </Link>
            ,{" "}
            {topic.lastComment?.createdAt
              ? format(topic.lastComment?.createdAt, DATETIME_REGEX)
              : ""}
          </>
        )}
      </TableCell>
      <TableCell style={{ width: "50px" }}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          {user?.isAllowed([PermissionsEnum.Topic__update]) && (
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
              <DeleteIcon />
            </IconButton>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default withRouter(withStyles(styles)(TopicItem));
