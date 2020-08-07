import {
  AppBar,
  Button,
  ButtonGroup,
  createStyles,
  IconButton,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { DateInput } from "components/DateInput";
import { AppContext } from "context/AppContext";
import React, { useCallback, useContext } from "react";
import ColorsEnum from "types/ColorsEnum";
import GroupMeasurementByEnum from "types/GroupMeasurementByEnum";

const styles = (theme) =>
  createStyles({
    activeButton: {
      backgroundColor: ColorsEnum.GRAY,
      color: ColorsEnum.BGDARK,
    },
    timePicker: {
      backgroundColor: ColorsEnum.BGLIGHT,
      padding: "3px 20px 13px 20px",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "row",
      borderBottom: "1px solid rgb(35,40,44)",
      flexWrap: "wrap",
      [theme.breakpoints.up("md")]: {
        left: "270px",
      },
      "& > *": {
        marginTop: "10px",
      },
    },
    picker: {
      marginRight: "10px",
      marginBottom: "10px",
      width: "170px",
    },
    menuIcon: {
      [theme.breakpoints.up("md")]: {
        display: "none",
      },
    },
    dateInputContainer: {
      paddingRight: "20px",
      [theme.breakpoints.up("md")]: {
        marginRight: "50px",
      },
    },
  });

const TopMenu: React.FunctionComponent<WithStyles<typeof styles>> = (props) => {
  const { classes } = props;

  const [{ groupBy, date }, dispatch] = useContext(AppContext);

  const handleDrawerToggle = () => {
    dispatch({ type: "toggle" });
  };

  const onChangeGroupBy = useCallback(
    (val) => {
      dispatch({
        type: "setGroupBy",
        payload: val,
      });
    },
    [dispatch]
  );

  const onChangeDate = useCallback(
    (val) => {
      dispatch({
        type: "setDate",
        payload: val,
      });
    },
    [dispatch]
  );

  return (
    <AppBar position="sticky" color="secondary" className={classes.timePicker}>
      <IconButton
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        className={classes.menuIcon}
        size="small"
        color="secondary"
        style={{ marginRight: "20px" }}
      >
        <MenuIcon />
      </IconButton>
      <div className={classes.dateInputContainer}>
        <DateInput
          groupBy={groupBy}
          date={date}
          onChange={onChangeDate}
          style={{ width: "300px" }}
        />
      </div>
      <div>
        <ButtonGroup color="secondary" size="large">
          {Object.values(GroupMeasurementByEnum).map((val) => (
            <Button
              onClick={() => onChangeGroupBy(val)}
              className={groupBy === val ? classes.activeButton : undefined}
              key={val}
            >
              {val}
            </Button>
          ))}
        </ButtonGroup>
      </div>
    </AppBar>
  );
};

export default withStyles(styles)(TopMenu);
