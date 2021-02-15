import { Typography } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import { Delete, Settings } from "@material-ui/icons";
import Link from "components/Link";
import { AccountContext } from "context/AccountContext";
import { CommentContext } from "context/CommentContext";
import { openConfirmation } from "context/ConfirmationContext";
import { format } from "date-fns";
import WYSIGEditor from "pages/forum/components/WYSIGEditor";
import { getUserRoute } from "pages/users/UserRoutes";
// import { getCommentEditRoute } from "pages/forum/ForumRoutes";
import React, { memo, useContext } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import ColorsEnum from "types/ColorsEnum";
import Comment from "types/Comment";
import { PermissionsEnum } from "types/PermissionEnum";
import { DATETIME_REGEX } from "utils/date.range";

const styles = (theme: Theme) => createStyles({});

const CommentItem: React.FunctionComponent<
  WithStyles<typeof styles> & RouteComponentProps<{}> & { comment: Comment }
> = (props) => {
  const { comment } = props;
  const { deleteComment } = useContext(CommentContext);
  const {
    state: { user },
  } = useContext(AccountContext);

  const deleteWithConfirmation = (comment: Comment) => {
    const onConfirm = async () => {
      await deleteComment(comment.id);
    };
    openConfirmation(
      onConfirm,
      null,
      "Are you sure you want to delete comment?"
    );
  };

  return (
    <div
      style={{ display: "flex", borderTop: `1px solid ${ColorsEnum.BGDARK}` }}
    >
      <div
        style={{
          minWidth: "200px",
          padding: "15px",
          textAlign: "left",
          borderRight: `1px solid ${ColorsEnum.BGDARK}`,
        }}
      >
        <div>
          <Typography variant="body1">
            Posted by{" "}
            <Link color={ColorsEnum.OLIVE} to={getUserRoute(comment.user?.id)}>
              {comment.user?.username}
            </Link>
          </Typography>
        </div>
        <div>
          <Typography variant="body1">
            {format(comment.createdAt, DATETIME_REGEX)}
          </Typography>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginTop: "20px",
          }}
        >
          {user?.isAllowed([PermissionsEnum.Comment__update]) && (
            <IconButton
              aria-label="settings"
              size="small"
              onClick={() => {
                // history.push(getCommentEditRoute(comment.categoryId, comment.id))
              }}
            >
              <Settings />
            </IconButton>
          )}
          {user?.isAllowed([PermissionsEnum.Comment__delete]) && (
            <IconButton
              aria-label="settings"
              size="small"
              onClick={() => deleteWithConfirmation(comment)}
            >
              <Delete />
            </IconButton>
          )}
        </div>
      </div>
      <div style={{ flex: "1" }}>
        <div style={{ textAlign: "left", padding: "15px 15px 5px 15px" }}>
          <Typography variant="body1" style={{ textDecoration: "underline" }}>
            {comment.name}
          </Typography>
        </div>
        <WYSIGEditor editorState={comment?.description} readOnly />
      </div>
    </div>
  );
};

export default memo(withRouter(withStyles(styles)(CommentItem)));
