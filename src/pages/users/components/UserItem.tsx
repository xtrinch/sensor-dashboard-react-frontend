import { TableCell, TableRow } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { Theme } from '@mui/material/styles';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import DeleteIcon from '@mui/icons-material/Delete';
import Link from 'components/Link';
import SelectInput from 'components/SelectInput';
import { openConfirmation } from 'context/ConfirmationContext';
import { UserContext } from 'context/UserContext';
import { format } from 'date-fns';
import { getUserRoute } from 'pages/users/UserRoutes';
import React, { useContext } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import ColorsEnum from 'types/ColorsEnum';
import { GroupEnum } from 'types/GroupEnum';
import User from 'types/User';
import { DATETIME_REGEX } from 'utils/date.range';
import { AccountContext } from 'context/AccountContext';
import { PermissionsEnum } from 'types/PermissionEnum';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: '0px 0px',
      backgroundColor: ColorsEnum.BGLIGHT,
      borderRadius: 0,
      boxShadow: 'none',
      borderBottom: `1px solid ${ColorsEnum.GRAYDARK}`,
    },
    action: {
      marginTop: '0px',
    },
    avatar: {
      backgroundColor: ColorsEnum.BLUE,
      color: 'white',
    },
    cardHeader: {
      padding: '10px',
    },
  });

const UserItem: React.FunctionComponent<
  WithStyles<typeof styles> & RouteComponentProps<{}> & { user: User }
> = (props) => {
  const { user, classes } = props;
  const { deleteUser, updateUser } = useContext(UserContext);
  const accountContext = useContext(AccountContext);

  const deleteWithConfirmation = (user: User) => {
    const onConfirm = async () => {
      await deleteUser(user.id);
    };
    openConfirmation(onConfirm, null, 'Are you sure you want to delete user?');
  };

  const groupChange = async (val) => {
    await updateUser(user.id, new User({ ...user, group: val }));
  };

  return (
    <TableRow className={classes.root}>
      <TableCell>
        <Link to={getUserRoute(user.id)} color={ColorsEnum.YELLOW}>
          {user.username}
        </Link>
      </TableCell>
      <TableCell>{user.createdAt ? format(user.createdAt, DATETIME_REGEX) : ''}</TableCell>
      <TableCell>{user.lastSeenAt ? format(user.lastSeenAt, DATETIME_REGEX) : ''}</TableCell>
      <TableCell style={{ padding: '0px' }}>
        <SelectInput
          value={user.group}
          fullWidth
          options={Object.values(GroupEnum)}
          onChange={(e, newVal) => groupChange(newVal)}
          placeholder="Group"
          margin="none"
          variant="standard"
          disabled={!accountContext.user?.isAllowed([PermissionsEnum.User__update])}
        />
      </TableCell>
      <TableCell style={{ width: '100px' }}>
        {accountContext.user?.isAllowed([PermissionsEnum.User__delete]) && (
          <IconButton
            aria-label="settings"
            size="small"
            onClick={() => deleteWithConfirmation(user)}
          >
            <DeleteIcon />
          </IconButton>
        )}
      </TableCell>
    </TableRow>
  );
};

export default withRouter(withStyles(styles)(UserItem));
