import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import Plus from '@material-ui/icons/Add';
import ColoredButton from 'components/ColoredButton';
import TopBar from 'components/TopBar';
import { RadioContext } from 'context/RadioContext';
import { DashboardRoutes } from 'pages/dashboard/DashboardRoutes';
import RadioItem from 'pages/dashboard/radios/components/RadioItem';
import React, { useContext } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import ColorsEnum from 'types/ColorsEnum';
import Radio from 'types/Radio';

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
  });

const RadioListPage: React.FunctionComponent<
  WithStyles<typeof styles> & RouteComponentProps<{ id: string }>
> = (props) => {
  const { classes, history } = props;
  const {
    state: { radios },
  } = useContext(RadioContext);

  return (
    <>
      <TopBar alignItems="center" color={ColorsEnum.BLUE}>
        <Typography component="h1" variant="h4" style={{ marginRight: '20px' }}>
          Radio list
        </Typography>
        <ColoredButton
          startIcon={<Plus />}
          onClick={() => history.push(DashboardRoutes.ADD_RADIO)}
          colorVariety={ColorsEnum.BLUE}
          size="small"
        >
          Add radio
        </ColoredButton>
      </TopBar>
      <Container component="main" maxWidth="md" className={classes.root}>
        {radios.length !== 0 && (
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
              {radios?.map((radio: Radio, index: number) => (
                <RadioItem radio={radio} key={index} />
              ))}
            </TableBody>
          </Table>
        )}
      </Container>
      {radios.length === 0 && (
        <Typography variant="body2" style={{ margin: '30px 0px', textAlign: 'center' }}>
          No radios added
        </Typography>
      )}
    </>
  );
};

export default withRouter(withStyles(styles)(RadioListPage));
