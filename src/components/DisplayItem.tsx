import { CardContent, Typography } from "@material-ui/core";
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
      margin: "30px 0px",
      backgroundColor: ColorsEnum.BGLIGHT,
      borderRadius: 0,
      boxShadow: "none",
    },
    media: {
      height: 0,
      paddingTop: "56.25%", // 16:9
    },
    expand: {
      transform: "rotate(0deg)",
      marginLeft: "auto",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: "rotate(180deg)",
    },
    avatar: {
      backgroundColor: ColorsEnum.BLUE,
    },
  })
);

export default function DisplayItem(props: { display: Display }) {
  const { display } = props;

  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {display.name[0]}
          </Avatar>
        }
        title={`${display.name}, ${display.boardType}`}
        subheader={`${format(display.createdAt, DATETIME_REGEX)}`}
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          Access token: {display.displayAccessToken}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          Sensors:{" "}
          {display.sensors?.length > 0
            ? display.sensors.map((s) => s.name).join(", ")
            : "No sensors"}
        </Typography>
      </CardContent>
      <CardActions disableSpacing style={{ justifyContent: "flex-end" }}>
        <IconButton aria-label="settings">
          <DeleteIcon />
        </IconButton>
        <Link to={`/displays/${display.id}`}>
          <IconButton aria-label="add to favorites">
            <SettingsIcon />
          </IconButton>
        </Link>
      </CardActions>
    </Card>
  );
}
