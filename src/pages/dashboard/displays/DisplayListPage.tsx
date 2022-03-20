import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import Plus from '@material-ui/icons/Add';
import ColoredButton from 'components/ColoredButton';
import TopBar from 'components/TopBar';
import { DisplayContext } from 'context/DisplayContext';
import { DashboardRoutes } from 'pages/dashboard/DashboardRoutes';
import DisplayItem from 'pages/dashboard/displays/components/DisplayItem';
import React, { useContext } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import ColorsEnum from 'types/ColorsEnum';
import Display from 'types/Display';

const styles = (theme) =>
  createStyles({
    root: {
      backgroundColor: ColorsEnum.BGLIGHT,
      paddingLeft: '0px',
      paddingRight: '0px',
      textAlign: 'center',
      marginTop: '30px',
    },
  });

const DisplayListPage: React.FunctionComponent<
  WithStyles<typeof styles> & RouteComponentProps<{ id: string }>
> = (props) => {
  const { classes, history } = props;

  const {
    state: { displays },
  } = useContext(DisplayContext);

  return (
    <>
      <TopBar alignItems="center">
        <Typography component="h1" variant="h4" style={{ marginRight: '20px' }}>
          My display devices
        </Typography>
        <ColoredButton
          startIcon={<Plus />}
          onClick={() => history.push(DashboardRoutes.ADD_DISPLAY)}
          size="small"
          colorVariety={ColorsEnum.BLUE}
        >
          Add
        </ColoredButton>
      </TopBar>
      <Container component="main" maxWidth="md" className={classes.root}>
        {displays.length !== 0 && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Board type</TableCell>
                <TableCell>Created at</TableCell>
                <TableCell>Last seen at</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displays.map((display: Display) => (
                <DisplayItem display={display} key={display.id} />
              ))}
            </TableBody>
          </Table>
        )}
        {displays.length === 0 && (
          <Typography variant="body2" component="p" style={{ margin: '30px 0px' }}>
            No displays added
          </Typography>
        )}
      </Container>
    </>
  );
};

export default withRouter(withStyles(styles)(DisplayListPage));
