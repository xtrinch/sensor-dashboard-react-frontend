import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import Container from '@mui/material/Container';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import TopBar from 'components/TopBar';
import { UserContext } from 'context/UserContext';
import { observer } from 'mobx-react-lite';
import UserItem from 'pages/users/components/UserItem';
import React, { useContext, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { RouteComponentProps, withRouter } from 'react-router';
import ColorsEnum from 'types/ColorsEnum';
import User from 'types/User';

const styles = (theme) =>
  createStyles({
    root: {
      backgroundColor: ColorsEnum.BGLIGHT,
      paddingLeft: '0px',
      paddingRight: '0px',
      textAlign: 'center',
      marginTop: '30px',
      marginBottom: '30px',
    },
    actionButton: {
      backgroundColor: ColorsEnum.OLIVE,
      color: ColorsEnum.WHITE,
      width: 'fit-content',
    },
  });

const UserListPage: React.FunctionComponent<
  WithStyles<typeof styles> & RouteComponentProps<{ id: string }>
> = (props) => {
  const { classes } = props;

  const userContext = useContext(UserContext);

  useEffect(() => {
    userContext.reload();
  }, []);

  return (
    <>
      <TopBar alignItems="center">
        <Typography component="h1" variant="h4">
          Users
        </Typography>
      </TopBar>
      <Container component="main" maxWidth="md" className={classes.root}>
        <InfiniteScroll
          dataLength={userContext.users?.length}
          next={() => userContext.reload({ page: userContext.page + 1 })}
          hasMore={userContext.totalItems > userContext.users?.length}
          loader={<h4>Loading...</h4>}
        >
          {userContext.users.length !== 0 && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Created at</TableCell>
                  <TableCell>Last seen at</TableCell>
                  <TableCell>Group</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userContext.users?.map((user: User) => (
                  <UserItem user={user} key={user.id} />
                ))}
              </TableBody>
            </Table>
          )}
        </InfiniteScroll>
        {userContext.users.length === 0 && (
          <Typography variant="body2" component="p" style={{ margin: '30px 0px' }}>
            No users added
          </Typography>
        )}
      </Container>
    </>
  );
};

export default withRouter(withStyles(styles)(observer(UserListPage)));
