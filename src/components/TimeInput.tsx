import DateFnsUtils from '@date-io/date-fns';
import { IconButton, TextField } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import Grid from '@mui/material/Grid';
import { WithStyles } from '@mui/styles';
import withStyles from '@mui/styles/withStyles';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import MobileTimePicker from '@mui/lab/MobileTimePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
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
        cursor: 'pointer',
        paddingTop: '9px',
        paddingBottom: '10px',
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
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Grid container alignItems="center" spacing={4}>
        <Grid item>
          <IconButton size="small" onClick={() => changeDate(-1)}>
            <ArrowBack style={{ cursor: 'pointer' }} />
          </IconButton>
        </Grid>
        <Grid item>
          <MobileTimePicker
            value={DateRange.parse(date).from}
            onChange={onChangeDate}
            ampm={false}
            views={['hours']}
            label={
              <>
                {`${getZeroPaddedNumber(getHours(DateRange.parse(date).from))}:00`} -{' '}
                {`${getZeroPaddedNumber(getHours(DateRange.parse(date).from) + 1)}:00`}
              </>
            }
            renderInput={(props) => (
              <TextField
                label=""
                defaultValue={null}
                ref={props.ref}
                inputRef={props.inputRef}
                disabled={props.disabled}
                inputProps={{
                  ...props.inputProps,
                  value: `${getZeroPaddedNumber(
                    getHours(DateRange.parse(date).from),
                  )}:00 - ${getZeroPaddedNumber(getHours(DateRange.parse(date).from) + 1)}:00`,
                }}
                style={{ maxWidth: '170px', flex: '1' }}
                className={classes.timepicker}
              />
            )}
          />
        </Grid>
        <Grid item>
          <IconButton size="small" onClick={() => changeDate(1)}>
            <ArrowForward style={{ cursor: 'pointer' }} />
          </IconButton>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default withStyles(styles)(TimeInput);
