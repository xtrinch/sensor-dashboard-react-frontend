import { Collapse, Fab, Grid, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LockIcon from '@mui/icons-material/Lock';
import SettingsIcon from '@mui/icons-material/Settings';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Link from 'components/Link';
import { AccountContext } from 'context/AccountContext';
import { AppContext } from 'context/AppContext';
import { SensorContext } from 'context/SensorContext';
import { differenceInMinutes } from 'date-fns';
import React, { Context, Fragment, useContext } from 'react';
import ColorsEnum from 'types/ColorsEnum';
import { IotDeviceInterface } from 'types/IotDeviceInterface';
import Sensor from 'types/Sensor';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps, withRouter } from 'react-router-dom';

interface SideMenuItemProps {
  item: IotDeviceInterface;
  visibility?: boolean;
  expandable?: boolean;
  type: 'sensor' | 'display' | 'forwarder' | 'radio';
}

const styles = () =>
  createStyles({
    active: {
      position: 'relative',
      '&::before': {
        backgroundColor: `${ColorsEnum.OLIVE}`,
        height: '100%',
        width: '5px',
        position: 'absolute',
        left: '0px',
        bottom: 0,
        content: '""',
        display: 'block',
      },
    },
    private: {
      display: 'inline-flex',
      color: ColorsEnum.GOLD,
      marginLeft: '-3px',
    },
    itemFab: {
      width: '30px',
      height: '30px',
      minHeight: '30px',
      maxHeight: '30px',
      color: 'white',
      marginLeft: '10px',
    },
  });

const SideMenuItem: React.FunctionComponent<
  SideMenuItemProps & WithStyles<typeof styles> & RouteComponentProps<{}>
> = (props) => {
  const { item, classes, history } = props;

  const { user } = useContext(AccountContext);
  const sensorContext = useContext(SensorContext);
  const appContext = useContext(AppContext);

  const toggleVisibility = async (e: any, item: IotDeviceInterface) => {
    e.stopPropagation();

    if (!props.visibility) {
      return;
    }
    sensorContext.toggleSensorVisibility(item as Sensor);
  };

  const toggleExpand = async (e: any, item: IotDeviceInterface) => {
    e.stopPropagation();

    if (!props.expandable) {
      return;
    }

    item.expanded = !item.expanded;
    sensorContext.updateSensor(item.id, item as unknown as Sensor, true);
  };

  const { visibility, expandable, type } = props;

  return (
    <>
      <ListItem
        divider
        button
        onClick={(e) => {
          if (item.userId === user?.id) {
            history.push(`/dashboard-personal/${type}s/${item.id}`);
          }
        }}
        style={{ cursor: item.userId === user?.id ? 'pointer' : 'unset' }}
        className={
          differenceInMinutes(item.lastSeenAt, new Date()) > -60 ? classes.active : undefined
        }
      >
        <ListItemText>
          <Grid container spacing={2}>
            {item.private && (
              <Grid item className={classes.private}>
                <LockIcon fontSize="small" />
              </Grid>
            )}
            <Grid item>
              {item.name},{item.location}
            </Grid>
          </Grid>
          {item.userId !== user?.id && <>({item.user?.username})</>}
        </ListItemText>
        {visibility && (
          <Fab
            color="secondary"
            size="small"
            className={classes.itemFab}
            onClick={(e) => {
              toggleVisibility(e, item);
            }}
          >
            {(item as IotDeviceInterface).visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
          </Fab>
        )}
      </ListItem>
      {expandable && (
        <Collapse in={(item as IotDeviceInterface).expanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {(item as Sensor).measurementTypes.map((m, index) => (
              <ListItem button key={index}>
                <ListItemText primary={`${m}`} />
              </ListItem>
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

SideMenuItem.defaultProps = {};

export default withStyles(styles)(withRouter(observer(SideMenuItem)));
