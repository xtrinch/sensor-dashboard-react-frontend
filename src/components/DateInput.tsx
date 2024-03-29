import { Grid, IconButton, TextField } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import { WithStyles } from '@mui/styles';
import withStyles from '@mui/styles/withStyles';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

import clsx from 'clsx';
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  endOfWeek,
  format,
  isFuture,
  isSameDay,
  isValid,
  isWithinInterval,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from 'date-fns';
import React, { CSSProperties, useEffect } from 'react';
import ColorsEnum from 'types/ColorsEnum';
import {
  DateRange,
  DateRangeEnum,
  DateRegex,
  DATE_REGEX,
  MONTH_YEAR_REGEX,
} from 'utils/date.range';
import { observer } from 'mobx-react-lite';
import { DatePickerView } from '@mui/lab/DatePicker/shared';

const styles = (theme) =>
  createStyles({
    datepicker: {
      '& fieldset': {},
      '& input': {
        textAlign: 'center',
        cursor: 'pointer',
        paddingTop: '9px',
        paddingBottom: '10px',
      },
      maxWidth: '170px',
      flex: '1',
      backgroundColor: ColorsEnum.BGLIGHTER,
      borderRadius: '0px',
      '&:hover:before': {
        borderBottom: '0px',
      },
      '&:before': {
        borderBottom: '0px',
      },
    },
    dayWrapper: {
      position: 'relative',
    },
    day: {
      width: 36,
      height: 36,
      fontSize: theme.typography.caption.fontSize,
      margin: '0 2px',
      color: 'inherit',
    },
    customDayHighlight: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: '2px',
      right: '2px',
      border: `1px solid ${theme.palette.secondary.main}`,
      borderRadius: '50%',
    },
    nonCurrentMonthDay: {
      color: theme.palette.text.disabled,
    },
    highlightNonCurrentMonthDay: {
      color: '#676767',
    },
    highlight: {
      background: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
    firstHighlight: {
      extend: 'highlight',
      borderTopLeftRadius: '50%',
      borderBottomLeftRadius: '50%',
    },
    endHighlight: {
      extend: 'highlight',
      borderTopRightRadius: '50%',
      borderBottomRightRadius: '50%',
    },
  });
export interface DateInputProps {
  style?: CSSProperties;
  disabled?: boolean;
  onChange?: (e: string) => void;
  date?: DateRegex;
  groupBy?: DateRangeEnum; // date selector input state
}

const DateInput: React.FunctionComponent<DateInputProps & WithStyles<typeof styles>> = (props) => {
  const { groupBy, onChange, date, classes } = props;

  const onChangeDate = (d: Date) => {
    const parsedDate = new Date(d);
    const dateString = DateRange.getDateString(parsedDate, groupBy);

    onChange(dateString);
  };

  useEffect(() => {
    // reset date on group change
    onChangeDate(new Date());
  }, [groupBy]);

  const renderLabel = (d: Date, invalidLabel: string) => {
    if (!isValid(d)) {
      return invalidLabel;
    }

    switch (props.groupBy) {
      case DateRangeEnum.day:
      case DateRangeEnum.hour:
        return `${format(d, DATE_REGEX)}`;
      case DateRangeEnum.month:
        return `${format(startOfMonth(d), MONTH_YEAR_REGEX)}`;
      case DateRangeEnum.week:
        return `Week of ${format(startOfWeek(d), DATE_REGEX)}`;
      case DateRangeEnum.year:
        return `${format(startOfYear(d), 'yyyy')}`;
      default:
        return '';
    }
  };

  const renderDate = (date: any, selectedDate: any[], pickersDayProps) => {
    const dateClone = new Date(date);
    const selectedDateClone = new Date(selectedDate[0]);
    let start: Date;
    let end: Date;

    switch (props.groupBy) {
      case DateRangeEnum.hour:
      case DateRangeEnum.day:
      case DateRangeEnum.month:
      case DateRangeEnum.year:
        start = selectedDateClone;
        end = selectedDateClone;
        break;
      case DateRangeEnum.week:
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
      [classes.nonCurrentMonthDay]: false,
      [classes.highlightNonCurrentMonthDay]: false,
    });

    return (
      <div className={wrapperClassName} onClick={() => pickersDayProps.onDaySelect(dateClone)}>
        <IconButton className={dayClassName} size="large">
          <span> {format(dateClone, 'd')} </span>
        </IconButton>
      </div>
    );
  };

  const getView = (): DatePickerView[] => {
    switch (props.groupBy) {
      case DateRangeEnum.day:
      case DateRangeEnum.hour:
        return ['year', 'day', 'month'];
      case DateRangeEnum.month:
        return ['month', 'year'];
      case DateRangeEnum.week:
        return ['year', 'day', 'month'];
      case DateRangeEnum.year:
        return ['year'];
      default:
        throw new Error('Date range invalid');
    }
  };

  const changeDate = (multiplier: number) => {
    let func: Function;

    let d = DateRange.parse(date).from;
    switch (props.groupBy) {
      case DateRangeEnum.day:
      case DateRangeEnum.hour:
        func = addDays;
        break;
      case DateRangeEnum.month:
        func = addMonths;
        break;
      case DateRangeEnum.week:
        func = addWeeks;
        break;
      case DateRangeEnum.year:
        func = addYears;
        break;
      default:
        break;
    }

    d = func(d, multiplier * 1);
    if (!isFuture(d)) {
      onChangeDate(d);
    }
  };

  return (
    // @ts-ignore
    <div style={props.style}>
      <Grid container alignItems="center" spacing={4} style={{ flexWrap: 'nowrap' }}>
        <Grid item>
          <IconButton size="small" onClick={() => changeDate(-1)}>
            <ArrowBack style={{ cursor: 'pointer' }} />
          </IconButton>
        </Grid>
        <Grid item>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <MobileDatePicker
              views={getView()}
              value={DateRange.parse(date).from}
              onChange={(e: Date) => onChangeDate(e)}
              InputProps={{
                className: classes.datepicker,
              }}
              renderDay={renderDate}
              label={<>{renderLabel(DateRange.parse(date).from, 'Invalid date')}</>}
              disableFuture
              renderInput={(props) => (
                <TextField
                  label=""
                  ref={props.ref}
                  inputRef={props.inputRef}
                  disabled={props.disabled}
                  inputProps={{
                    ...props.inputProps,
                    value: renderLabel(DateRange.parse(date).from, 'Invalid date'),
                  }}
                  className={classes.datepicker}
                />
              )}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item>
          <IconButton size="small" onClick={() => changeDate(1)}>
            <ArrowForward style={{ cursor: 'pointer' }} />
          </IconButton>
        </Grid>
      </Grid>
    </div>
  );
};

export default withStyles(styles)(observer(DateInput));
