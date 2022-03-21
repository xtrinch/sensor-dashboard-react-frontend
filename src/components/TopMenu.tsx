import { Button, ButtonGroup, Grid } from '@mui/material';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import DateInput from 'components/DateInput';
import TopBar from 'components/TopBar';
import { AppContext } from 'context/AppContext';
import React, { useContext } from 'react';
import ColorsEnum from 'types/ColorsEnum';
import DomainTypeEnum from 'types/DomainTypeEnum';
import { DateRangeEnum } from 'utils/date.range';
import { observer } from 'mobx-react-lite';
import TimeInput from './TimeInput';

const styles = (theme) =>
  createStyles({
    dateButtonGroup: {
      backgroundColor: ColorsEnum.BGLIGHTER,
      '& button': {
        borderRadius: '0px',
        border: `1px solid ${ColorsEnum.GRAYDARK}`,
        '&:hover': {
          border: `1px solid ${ColorsEnum.GRAYDARK}`,
        },
        color: ColorsEnum.GRAY,
      },
      maxWidth: 'calc(100vw - 40px)',
    },
    activeButton: {
      backgroundColor: ColorsEnum.BLUE,
      color: `${ColorsEnum.WHITE}!important`,
      border: `1px solid ${ColorsEnum.BLUE}`,
      '&:hover': {
        backgroundColor: ColorsEnum.BLUE,
      },
    },
    timePicker: {
      backgroundColor: ColorsEnum.BGLIGHT,
      padding: '13px 20px',
      [theme.breakpoints.up('md')]: {
        left: '270px',
      },
      boxShadow: 'none',
    },
    dateGridItem: {
      [theme.breakpoints.down('md')]: {
        marginRight: '0px',
        marginLeft: 'auto',
      },
    },
  });

const TopMenu: React.FunctionComponent<WithStyles<typeof styles>> = (props) => {
  const { classes } = props;

  const appContext = useContext(AppContext);

  const onChangeGroupBy = (val) => {
    appContext.setGroupBy(val);
  };

  const onChangeDate = (val) => {
    appContext.setDate(val);
  };

  return (
    <TopBar noGridItem>
      <Grid item className={classes.dateGridItem}>
        <DateInput groupBy={appContext.groupBy} date={appContext.date} onChange={onChangeDate} />
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
                className={appContext.groupBy === val ? classes.activeButton : undefined}
                key={val}
              >
                {val}
              </Button>
            ))}
        </ButtonGroup>
      </Grid>
      {appContext.groupBy === DateRangeEnum.hour && (
        <Grid item className={classes.dateGridItem}>
          <TimeInput date={appContext.date} onChange={onChangeDate} />
        </Grid>
      )}
      <Grid item className={classes.dateGridItem}>
        <ButtonGroup
          disableElevation
          disableFocusRipple
          disableRipple
          color="secondary"
          size="large"
          className={classes.dateButtonGroup}
        >
          <Button
            style={{
              borderWidth: '0px',
              cursor: 'default',
              backgroundColor: ColorsEnum.BGLIGHT,
              textTransform: 'capitalize',
            }}
          >
            Y Domain:
          </Button>
          <Button
            onClick={() => appContext.setDomain(DomainTypeEnum.FULL)}
            className={appContext.domain === DomainTypeEnum.FULL ? classes.activeButton : undefined}
          >
            FULL
          </Button>
          <Button
            onClick={() => appContext.setDomain(DomainTypeEnum.AUTO)}
            className={appContext.domain === DomainTypeEnum.AUTO ? classes.activeButton : undefined}
          >
            AUTO
          </Button>
        </ButtonGroup>
      </Grid>
      {/* </Grid> */}
    </TopBar>
  );
};

export default withStyles(styles)(observer(TopMenu));
