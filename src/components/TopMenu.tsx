import {
  Button,
  ButtonGroup,
  createStyles,
  Grid,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import DateInput from "components/DateInput";
import TopBar from "components/TopBar";
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
  });

const TopMenu: React.FunctionComponent<WithStyles<typeof styles>> = (props) => {
  const { classes } = props;

  const [{ groupBy, date }, dispatch] = useContext(AppContext);

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
    <TopBar>
      <Grid container spacing={5}>
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
    </TopBar>
  );
};

export default withStyles(styles)(TopMenu);
