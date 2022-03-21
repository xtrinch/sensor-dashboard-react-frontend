import DateFnsUtils from '@date-io/date-fns';
import { IconButton } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import Grid from '@mui/material/Grid';
import { CSSProperties } from '@mui/material/styles';
import { WithStyles } from '@mui/styles';
import withStyles from '@mui/styles/withStyles';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import { MuiPickersUtilsProvider, TimePicker } from '@material-ui/pickers';
import { addHours, getHours, isFuture } from 'date-fns';

import React from 'react';
import ColorsEnum from 'types/ColorsEnum';
import { DateRange, DateRangeEnum, DateRegex } from 'utils/date.range';
import { getZeroPaddedNumber } from 'utils/number';

const styles = (theme) =>
  createStyles({
    timepicker: {
      '& input': {
        textAlign: 'center',
        backgroundColor: ColorsEnum.BGLIGHTER,
        width: '100px',
      },
    },
  });

interface TimeInputProps {
  date: DateRegex;
  onChange: (date: string) => void;
  label?: string;
}

const TimeInput: React.FunctionComponent<TimeInputProps & WithStyles<typeof styles>> = (props) => {
  const { label, date, onChange, classes } = props;

  const onChangeDate = (d: Date) => {
    const dateString = DateRange.getDateString(d, DateRangeEnum.hour);

    onChange(dateString);
  };

  const changeDate = (multiplier: number) => {
    let d = DateRange.parse(date).from;
    d = addHours(d, multiplier * 1);

    if (!isFuture(d)) {
      onChangeDate(d);
    }
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container alignItems="center" spacing={4}>
        <Grid item>
          <IconButton size="small" onClick={() => changeDate(-1)}>
            <ArrowBack style={{ cursor: 'pointer' }} />
          </IconButton>
        </Grid>
        <Grid item>
          <TimePicker
            className={classes.timepicker}
            margin="none"
            id="time-picker"
            label={label}
            value={DateRange.parse(date).from}
            onChange={onChangeDate}
            inputVariant="outlined"
            ampm={false}
            size="small"
            views={['hours']}
            labelFunc={(date) =>
              `${getZeroPaddedNumber(getHours(date))}:00 - ${getZeroPaddedNumber(
                getHours(date) + 1,
              )}:00`
            }
            autoOk
          />
        </Grid>
        <Grid item>
          <IconButton size="small" onClick={() => changeDate(1)}>
            <ArrowForward style={{ cursor: 'pointer' }} />
          </IconButton>
        </Grid>
      </Grid>
    </MuiPickersUtilsProvider>
  );
};

export default withStyles(styles)(TimeInput);
