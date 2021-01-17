import { TableCell, TableRow, TextField } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import {
  createStyles,
  Theme,
  WithStyles,
  withStyles,
} from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { openConfirmation } from "context/ConfirmationContext";
import { UserContext } from "context/UserContext";
import { format } from "date-fns";
import React, { useContext } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import ColorsEnum from "types/ColorsEnum";
import { GroupEnum } from "types/GroupEnum";
import User from "types/User";
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

const UserItem: React.FunctionComponent<
  WithStyles<typeof styles> & RouteComponentProps<{}> & { user: User }
> = (props) => {
  const { user, classes } = props;
  const { deleteUser, updateUser } = useContext(UserContext);

  const deleteWithConfirmation = (user: User) => {
    const onConfirm = async () => {
      await deleteUser(user.id);
    };
    openConfirmation(onConfirm, null, "Are you sure you want to delete user?");
  };

  const groupChange = async (val) => {
    console.log(val);
    await updateUser(user.id, new User({ ...user, group: val }));
  };

  return (
    <TableRow className={classes.root}>
      <TableCell>{user.fullName}</TableCell>
      <TableCell>
        {user.createdAt ? format(user.createdAt, DATETIME_REGEX) : ""}
      </TableCell>
      <TableCell>
        {user.lastSeenAt ? format(user.lastSeenAt, DATETIME_REGEX) : ""}
      </TableCell>
      <TableCell style={{ padding: "0px" }}>
        <Autocomplete
          value={user.group}
          fullWidth
          options={Object.values(GroupEnum)}
          onChange={(e, newVal) => groupChange(newVal)}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Group"
              variant="standard"
              margin="none"
            />
          )}
        />
      </TableCell>
      <TableCell style={{ width: "100px" }}>
        <IconButton
          aria-label="settings"
          size="small"
          onClick={() => deleteWithConfirmation(user)}
        >
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default withRouter(withStyles(styles)(UserItem));
