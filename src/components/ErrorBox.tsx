import { Dialog, Typography } from '@mui/material';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import ColoredButton from 'components/ColoredButton';
import { ErrorContext } from 'context/ErrorContext';
import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import ColorsEnum from 'types/ColorsEnum';

const styles = () =>
  createStyles({
    root: {},
    paper: {
      backgroundColor: ColorsEnum.BGLIGHT,
      borderRadius: '0px',
      padding: '20px',
      maxWidth: '300px',
    },
  });

const ErrorBox: React.FunctionComponent<WithStyles<typeof styles>> = (props) => {
  const { classes } = props;

  const errorStore = useContext(ErrorContext);

  return (
    <Dialog
      onClose={() => errorStore.clearError()}
      open={!!errorStore.error}
      className={classes.root}
      classes={{
        paper: classes.paper,
      }}
    >
      <Typography variant="h6" style={{ marginBottom: '25px' }}>
        {errorStore.type === 'error' ? 'Error' : 'Info'}
      </Typography>
      <Typography variant="body2" style={{ marginBottom: '30px' }}>
        {errorStore.error?.statusCode} {errorStore.error?.message || errorStore.error}
      </Typography>
      <ColoredButton
        onClick={() => errorStore.clearError()}
        fullWidth
        colorVariety={ColorsEnum.BLUE}
      >
        Close
      </ColoredButton>
    </Dialog>
  );
};

export default withStyles(styles)(observer(ErrorBox));
