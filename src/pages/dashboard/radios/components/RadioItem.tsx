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
import { openConfirmation } from "context/ConfirmationContext";
import { RadioContext } from "context/RadioContext";
import { format } from "date-fns";
import {
  DashboardRoutes,
  getRadioRoute,
} from "pages/dashboard/DashboardRoutes";
import React, { useContext } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import ColorsEnum from "types/ColorsEnum";
import Radio from "types/Radio";
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

const RadioItem: React.FunctionComponent<
  WithStyles<typeof styles> & RouteComponentProps<{}> & { radio: Radio }
> = (props) => {
  const { radio, classes, history } = props;
  const { deleteRadio } = useContext(RadioContext);

  const deleteWithConfirmation = (radio: Radio) => {
    const onConfirm = async () => {
      await deleteRadio(radio.id);
      history.push(DashboardRoutes.RADIO_LIST);
    };
    openConfirmation(onConfirm, null, "Are you sure you want to delete radio?");
  };

  return (
    <TableRow className={classes.root}>
      <TableCell>{radio.name}</TableCell>
      <TableCell>{radio.boardType}</TableCell>
      <TableCell>{format(radio.createdAt, DATETIME_REGEX)}</TableCell>
      <TableCell>
        {radio.lastSeenAt ? format(radio.lastSeenAt, DATETIME_REGEX) : "Never"}
      </TableCell>
      <TableCell style={{ width: "100px" }}>
        <Link to={getRadioRoute(radio.id)}>
          <IconButton aria-label="add to favorites" size="small">
            <Settings />
          </IconButton>
        </Link>
        <IconButton
          aria-label="settings"
          size="small"
          onClick={() => deleteWithConfirmation(radio)}
        >
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default withRouter(withStyles(styles)(RadioItem));
