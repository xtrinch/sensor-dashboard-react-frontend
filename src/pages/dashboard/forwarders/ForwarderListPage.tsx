import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import Container from "@material-ui/core/Container";
import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import Plus from "@material-ui/icons/Add";
import TopBar from "components/TopBar";
import { ForwarderContext } from "context/ForwarderContext";
import ForwarderItem from "pages/dashboard/forwarders/components/ForwarderItem";
import React, { useContext } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import ColorsEnum from "types/ColorsEnum";
import Forwarder from "types/Forwarder";
import { Routes } from "utils/Routes";

const styles = (theme) =>
  createStyles({
    root: {
      backgroundColor: ColorsEnum.BGLIGHT,
      paddingLeft: "0px",
      paddingRight: "0px",
      textAlign: "center",
      marginTop: "30px",
    },
    actionButton: {
      backgroundColor: ColorsEnum.OLIVE,
      color: ColorsEnum.WHITE,
      width: "fit-content",
    },
  });

const ForwarderListPage: React.FunctionComponent<
  WithStyles<typeof styles> & RouteComponentProps<{ id: string }>
> = (props) => {
  const { classes, history } = props;

  const [forwarderContext] = useContext(ForwarderContext);

  return (
    <>
      <TopBar alignItems="center">
        <Typography component="h1" variant="h4" style={{ marginRight: "20px" }}>
          My forwarder devices
        </Typography>
        <Button
          variant="contained"
          className={classes.actionButton}
          startIcon={<Plus />}
          onClick={() => history.push(Routes.ADD_FORWARDER)}
        >
          Add
        </Button>
      </TopBar>
      <Container component="main" maxWidth="md" className={classes.root}>
        {forwarderContext.forwarders.length !== 0 && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Num. forwarded packets</TableCell>
                <TableCell>Created at</TableCell>
                <TableCell>Last seen at</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {forwarderContext.forwarders.map((forwarder: Forwarder) => (
                <ForwarderItem forwarder={forwarder} key={forwarder.id} />
              ))}
            </TableBody>
          </Table>
        )}
        {forwarderContext.forwarders.length === 0 && (
          <Typography
            variant="body2"
            component="p"
            style={{ margin: "30px 0px" }}
          >
            No forwarders added
          </Typography>
        )}
      </Container>
    </>
  );
};

export default withRouter(withStyles(styles)(ForwarderListPage));
