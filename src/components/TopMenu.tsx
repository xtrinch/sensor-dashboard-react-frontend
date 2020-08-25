import {
  AppBar,
  Button,
  ButtonGroup,
  createStyles,
  Grid,
  IconButton,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import DateInput from "components/DateInput";
import { AppContext } from "context/AppContext";
import React, { useCallback, useContext } from "react";
import ColorsEnum from "types/ColorsEnum";
import { DateRangeEnum } from "utils/date.range";
import TimeInput from "./TimeInput";

const styles = (theme) =>
  createStyles({
    dateButtonGroup: {
      backgroundColor: ColorsEnum.BGLIGHTER,
      "& button": {
        borderRadius: "0px",
        border: `1px solid ${ColorsEnum.GRAYDARK}`,
        "&:hover": {
          border: `1px solid ${ColorsEnum.GRAYDARK}`,
        },
        color: ColorsEnum.GRAY,
      },
    },
    activeButton: {
      backgroundColor: ColorsEnum.BLUE,
      color: `${ColorsEnum.WHITE}!important`,
      border: `1px solid ${ColorsEnum.BLUE}`,
      "&:hover": {
        backgroundColor: ColorsEnum.BLUE,
      },
    },
    timePicker: {
      backgroundColor: ColorsEnum.BGLIGHT,
      padding: "13px 20px",
      [theme.breakpoints.up("md")]: {
        left: "270px",
      },
      boxShadow: "none",
    },
    menuIcon: {
      [theme.breakpoints.up("md")]: {
        display: "none",
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
      <Grid container spacing={5}>
        <Grid item>
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
        </Grid>
        <Grid item>
          <DateInput
            groupBy={groupBy}
            date={date}
            onChange={onChangeDate}
            style={{ width: "260px" }}
          />
        </Grid>
        <Grid item>
          <ButtonGroup
            disableElevation
            disableFocusRipple
            disableRipple
            color="secondary"
            size="large"
            className={classes.dateButtonGroup}
          >
            {Object.values(DateRangeEnum)
              .filter((v) => v !== DateRangeEnum.minute)
              .map((val) => (
                <Button
                  onClick={() => onChangeGroupBy(val)}
                  className={groupBy === val ? classes.activeButton : undefined}
                  key={val}
                >
                  {val}
                </Button>
              ))}
          </ButtonGroup>
        </Grid>
        {groupBy === DateRangeEnum.hour && (
          <Grid item>
            <TimeInput
              date={date}
              onChange={onChangeDate}
              style={{ width: "260px" }}
            />
          </Grid>
        )}
      </Grid>
    </AppBar>
  );
};

export default withStyles(styles)(TopMenu);
