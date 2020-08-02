import React, { useEffect, useState, useCallback } from "react";
import { IconButton, makeStyles } from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  DatePicker,
  DatePickerView,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import clsx from "clsx";
import {
  isValid,
  addDays,
  addMonths,
  addYears,
  startOfMonth,
  startOfYear,
  startOfWeek,
  addWeeks,
  format,
  isWithinInterval,
  endOfWeek,
  isSameDay,
  getYear,
  getMonth,
  getDate,
} from "date-fns";
import ArrowForward from "@material-ui/icons/ArrowForward";
import ArrowBack from "@material-ui/icons/ArrowBack";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import GroupMeasurementByEnum from "types/GroupMeasurementByEnum";
import { DateRange } from "utils/date.range";

export interface DateInputProps {
  style?: CSSProperties;
  label?: string;
  disabled?: boolean;
  onChange?: (e: string) => void;
  date?: string;
  groupBy?: GroupMeasurementByEnum; // date selector input state
}

export const DATE_REGEX = "MMMM d, yyyy"; // August 31, 2018
export const MONTH_YEAR_REGEX = "MMMM yyyy"; // August 31, 2018

export const DateInput: React.FunctionComponent<DateInputProps> = (props) => {
  const { date, groupBy, onChange } = props;

  const [internalValue, setInternalValue] = useState(new Date());

  const onChangeDate = useCallback(
    (d: Date) => {
      const date = new Date(d);

      switch (groupBy) {
        case GroupMeasurementByEnum.month:
          onChange(`${getYear(date)}/${getMonth(date) + 1}`);
          return;
        case GroupMeasurementByEnum.year:
          onChange(`${getYear(date)}`);
          return;
        case GroupMeasurementByEnum.day:
          onChange(`${getYear(date)}/${getMonth(date) + 1}/${getDate(date)}`);
          return;
        default:
          break;
      }
    },
    [groupBy, onChange]
  );

  useEffect(() => {
    if (!date) {
      return;
    }
    const d = DateRange.parse(date).from;
    setInternalValue(d);
    onChangeDate(d);
  }, [groupBy, date, onChangeDate]);

  const useStyles = makeStyles((theme) => ({
    datepicker: {
      "& fieldset": {},
      "& input": {
        textAlign: "center",
        cursor: "pointer",
        "&:hover": {
          //color: 'blue'
        },
        paddingTop: "11px",
        paddingBottom: "11px",
      },
    },
    dayWrapper: {
      position: "relative",
    },
    day: {
      width: 36,
      height: 36,
      fontSize: theme.typography.caption.fontSize,
      margin: "0 2px",
      color: "inherit",
    },
    customDayHighlight: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: "2px",
      right: "2px",
      border: `1px solid ${theme.palette.secondary.main}`,
      borderRadius: "50%",
    },
    nonCurrentMonthDay: {
      color: theme.palette.text.disabled,
    },
    highlightNonCurrentMonthDay: {
      color: "#676767",
    },
    highlight: {
      background: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
    firstHighlight: {
      extend: "highlight",
      borderTopLeftRadius: "50%",
      borderBottomLeftRadius: "50%",
    },
    endHighlight: {
      extend: "highlight",
      borderTopRightRadius: "50%",
      borderBottomRightRadius: "50%",
    },
  }));

  const classes = useStyles(props);

  const renderLabel = (date, invalidLabel) => {
    if (!isValid(date)) {
      return invalidLabel;
    }

    switch (props.groupBy) {
      case GroupMeasurementByEnum.day:
        return `${format(date, DATE_REGEX)}`;
      case GroupMeasurementByEnum.month:
        return `${format(startOfMonth(date), MONTH_YEAR_REGEX)}`;
      case GroupMeasurementByEnum.week:
        return `Week of ${format(startOfWeek(date), DATE_REGEX)}`;
      case GroupMeasurementByEnum.year:
        return `${format(startOfYear(date), "yyyy")}`;
      default:
        return "";
    }
  };

  const renderDate = (date, selectedDate, dayInCurrentMonth) => {
    const dateClone = new Date(date);
    const selectedDateClone = new Date(selectedDate);
    let start;
    let end;

    switch (props.groupBy) {
      case GroupMeasurementByEnum.day:
      case GroupMeasurementByEnum.month:
      case GroupMeasurementByEnum.year:
        start = selectedDateClone;
        end = selectedDateClone;
        break;
      case GroupMeasurementByEnum.week:
        start = startOfWeek(selectedDateClone);
        end = endOfWeek(selectedDateClone);
        break;
      default:
        break;
    }

    const dayIsBetween = isWithinInterval(dateClone, { start, end });
    const isFirstDay = isSameDay(dateClone, start);
    const isLastDay = isSameDay(dateClone, end);

    const wrapperClassName = clsx({
      [classes.highlight]: dayIsBetween,
      [classes.firstHighlight]: isFirstDay,
      [classes.endHighlight]: isLastDay,
    });

    const dayClassName = clsx(classes.day, {
      [classes.nonCurrentMonthDay]: !dayInCurrentMonth,
      [classes.highlightNonCurrentMonthDay]: !dayInCurrentMonth && dayIsBetween,
    });

    return (
      <div className={wrapperClassName}>
        <IconButton className={dayClassName}>
          <span> {format(dateClone, "d")} </span>
        </IconButton>
      </div>
    );
  };

  const getView = (): DatePickerView[] => {
    switch (props.groupBy) {
      case GroupMeasurementByEnum.day:
        return ["year", "month", "date"];
      case GroupMeasurementByEnum.month:
        return ["month", "year"];
      case GroupMeasurementByEnum.week:
        return ["year", "month", "date"];
      case GroupMeasurementByEnum.year:
        return ["year"];
      default:
        return ["year", "month", "date"];
    }
  };

  const changeDate = (multiplier: number) => {
    let func: Function;

    let date = internalValue;
    switch (props.groupBy) {
      case GroupMeasurementByEnum.day:
        func = addDays;
        break;
      case GroupMeasurementByEnum.month:
        func = addMonths;
        break;
      case GroupMeasurementByEnum.week:
        func = addWeeks;
        break;
      case GroupMeasurementByEnum.year:
        func = addYears;
        break;
      default:
        break;
    }

    date = func(date, multiplier * 1);
    onChangeDate(date);
  };

  return (
    <div style={{ ...props.style }}>
      <div>{props.label}</div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <IconButton
          size="small"
          style={{ marginRight: "10px" }}
          onClick={() => changeDate(-1)}
        >
          <ArrowBack style={{ cursor: "pointer" }} />
        </IconButton>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            size="small"
            views={getView()}
            label=""
            format="MM/dd/yyyy"
            value={internalValue}
            onChange={(e: Date) => onChangeDate(e)}
            inputVariant="filled"
            disabled={props.disabled ? props.disabled : false}
            InputProps={{
              className: classes.datepicker,
            }}
            renderDay={renderDate}
            labelFunc={renderLabel}
            margin={"none"}
          />
        </MuiPickersUtilsProvider>
        <IconButton
          size="small"
          style={{ marginLeft: "10px" }}
          onClick={() => changeDate(1)}
        >
          <ArrowForward style={{ cursor: "pointer" }} />
        </IconButton>
      </div>
    </div>
  );
};
