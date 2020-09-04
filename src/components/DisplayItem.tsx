import { TableCell, TableRow } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import {
  createStyles,
  Theme,
  WithStyles,
  withStyles,
} from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import SettingsIcon from "@material-ui/icons/Settings";
import {
  ConfirmationContext,
  openConfirmation,
} from "context/ConfirmationContext";
import { deleteDisplay, DisplayContext } from "context/DisplayContext";
import { ToastContext } from "context/ToastContext";
import { format } from "date-fns";
import React, { useContext } from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import ColorsEnum from "types/ColorsEnum";
import Display from "types/Display";
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

const DisplayItem: React.FunctionComponent<
  WithStyles<typeof styles> & RouteComponentProps<{}> & { display: Display }
> = (props) => {
  const { display, classes } = props;

  const [, displayContextDispatch] = useContext(DisplayContext);
  const [, dispatchConfirmationContext] = useContext(ConfirmationContext);
  const [, toastContextDispatch] = useContext(ToastContext);

  const deleteWithConfirmation = (display: Display) => {
    const onConfirm = async () => {
      await deleteDisplay(
        displayContextDispatch,
        display.id,
        toastContextDispatch
      );
    };
    openConfirmation(
      dispatchConfirmationContext,
      onConfirm,
      null,
      "Are you sure you want to delete display?"
    );
  };

  return (
    <TableRow className={classes.root}>
      <TableCell>{display.name}</TableCell>
      <TableCell>{display.boardType}</TableCell>
      <TableCell>{format(display.createdAt, DATETIME_REGEX)}</TableCell>
      <TableCell style={{ width: "100px" }}>
        <Link to={`/displays/${display.id}`}>
          <IconButton aria-label="add to favorites" size="small">
            <SettingsIcon />
          </IconButton>
        </Link>
        <IconButton
          aria-label="settings"
          size="small"
          onClick={() => deleteWithConfirmation(display)}
        >
          <DeleteIcon />
        </IconButton>
      </TableCell>
      {/* <CardHeader
        className={classes.cardHeader}
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {display.name[0]}
          </Avatar>
        }
        title={`${display.name}, ${display.boardType}`}
        subheader={`${format(display.createdAt, DATETIME_REGEX)}`}
        classes={{ action: classes.action }}
        action={
          <CardActions style={{ justifyContent: "flex-end" }}>
            <Link to={`/displays/${display.id}`}>
              <IconButton aria-label="add to favorites" size="small">
                <SettingsIcon />
              </IconButton>
            </Link>
            <IconButton aria-label="settings" size="small" onClick={() => deleteWithConfirmation(display)}>
              <DeleteIcon />
            </IconButton>
          </CardActions>
        }
      /> */}
      {/* <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          Access token: {display.displayAccessToken}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          Sensors:{" "}
          {display.sensors?.length > 0
            ? display.sensors.map((s) => s.name).join(", ")
            : "No sensors"}
        </Typography>
      </CardContent> */}
    </TableRow>
  );
};

export default withRouter(withStyles(styles)(DisplayItem));
