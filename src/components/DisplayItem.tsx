import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import SettingsIcon from "@material-ui/icons/Settings";
import { format } from "date-fns";
import React from "react";
import { Link } from "react-router-dom";
import ColorsEnum from "types/ColorsEnum";
import Display from "types/Display";
import { DATETIME_REGEX } from "utils/date.range";

const useStyles = makeStyles((theme: Theme) =>
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
  })
);

export default function DisplayItem(props: { display: Display }) {
  const { display } = props;

  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardHeader
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
            <IconButton aria-label="settings" size="small">
              <DeleteIcon />
            </IconButton>
          </CardActions>
        }
      />
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
    </Card>
  );
}
