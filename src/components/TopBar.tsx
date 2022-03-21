import { AppBar, Fab, Grid, IconButton } from '@mui/material';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import MenuIcon from '@mui/icons-material/Menu';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { AppContext } from 'context/AppContext';
import React, { useContext } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import ColorsEnum from 'types/ColorsEnum';
import { observer } from 'mobx-react-lite';

const styles = (theme) =>
  createStyles({
    root: {
      backgroundColor: ColorsEnum.BGLIGHT,
      padding: '13px 20px',
      [theme.breakpoints.up('md')]: {
        left: '270px',
      },
      boxShadow: 'none',
      minHeight: '60px',
      justifyContent: 'center',
      backgroundImage: 'unset',
    },
    menuIcon: {
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
    back: {
      position: 'absolute',
      left: '20px',
    },
  });

interface TopBarProps {
  alignItems?: string;
  noGridItem?: boolean;
  backEnabled?: boolean;
  backTo?: string;
  color?: string;
}

const TopBar: React.FunctionComponent<
  WithStyles<typeof styles> & TopBarProps & RouteComponentProps<{}>
> = (props) => {
  const { classes, backEnabled, history, backTo, color } = props;

  const appContext = useContext(AppContext);

  const handleDrawerToggle = () => {
    appContext.drawerToggle();
  };

  return (
    <AppBar
      position="sticky"
      color="secondary"
      className={classes.root}
      style={{ alignItems: props.alignItems }}
    >
      {backEnabled && (
        <div className={classes.back}>
          <Fab size="small" onClick={() => history.push(backTo)} style={{ backgroundColor: color }}>
            <NavigateBeforeIcon />
          </Fab>
        </div>
      )}
      <Grid container spacing={5} style={{ justifyContent: 'center' }}>
        <Grid item className={classes.menuIcon} xs={1}>
          <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <IconButton
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              size="medium"
              color="secondary"
              style={{ padding: '6px' }}
              edge={false}
            >
              <MenuIcon />
            </IconButton>
          </div>
        </Grid>
        {props.noGridItem && props.children}
        {!props.noGridItem && (
          <Grid
            item
            sm={backEnabled ? 11 : 12}
            xs={backEnabled ? 10 : 11}
            style={{
              justifyContent: props.alignItems,
              alignItems: 'center',
              display: 'flex',
            }}
          >
            {props.children}
          </Grid>
        )}
      </Grid>
    </AppBar>
  );
};

export default withRouter(withStyles(styles)(observer(TopBar)));
