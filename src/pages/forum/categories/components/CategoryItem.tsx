import { TableCell, TableRow } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import {
  createStyles,
  Theme,
  WithStyles,
  withStyles,
} from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import { AccountContext } from "context/AccountContext";
import { CategoryContext } from "context/CategoryContext";
import { openConfirmation } from "context/ConfirmationContext";
import { getTopicListRoute } from "pages/forum/ForumRoutes";
import React, { useContext } from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import Category from "types/Category";
import ColorsEnum from "types/ColorsEnum";
import { PermissionsEnum } from "types/PermissionEnum";

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

const CategoryItem: React.FunctionComponent<
  WithStyles<typeof styles> & RouteComponentProps<{}> & { category: Category }
> = (props) => {
  const { category, classes } = props;
  const { deleteCategory } = useContext(CategoryContext);
  const {
    state: { user },
  } = useContext(AccountContext);

  const deleteWithConfirmation = (category: Category) => {
    const onConfirm = async () => {
      await deleteCategory(category.id);
    };
    openConfirmation(
      onConfirm,
      null,
      "Are you sure you want to delete category?"
    );
  };

  return (
    <TableRow className={classes.root}>
      <TableCell>
        <div>
          <Link to={getTopicListRoute(category.id)}>{category.name}</Link>
        </div>
        <div>{category.description}</div>
      </TableCell>
      <TableCell style={{ width: "50px" }}>
        {user?.isAllowed([PermissionsEnum.Category__delete]) && (
          <IconButton
            aria-label="settings"
            size="small"
            onClick={() => deleteWithConfirmation(category)}
          >
            <DeleteIcon />
          </IconButton>
        )}
      </TableCell>
    </TableRow>
  );
};

export default withRouter(withStyles(styles)(CategoryItem));
