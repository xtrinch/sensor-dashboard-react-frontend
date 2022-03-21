import { Dialog, Grid, Typography } from '@mui/material';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import ColoredButton from 'components/ColoredButton';
import { close, confirm, ConfirmationContext } from 'context/ConfirmationContext';
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

const ConfirmationBox: React.FunctionComponent<WithStyles<typeof styles>> = (props) => {
  const { classes } = props;

  const [confirmationContext] = useContext(ConfirmationContext);

  return (
    <Dialog
      onClose={() => close(confirmationContext)}
      open={confirmationContext.open}
      className={classes.root}
      classes={{
        paper: classes.paper,
      }}
    >
      <Typography variant="h6" style={{ marginBottom: '25px' }}>
        Confirmation needed
      </Typography>
      <Typography variant="body2" style={{ marginBottom: '30px' }}>
        {confirmationContext.content}
      </Typography>
      <Grid container justifyContent="center" spacing={10}>
        <Grid item>
          <ColoredButton
            onClick={() => close(confirmationContext)}
            fullWidth
            size="small"
            colorVariety={ColorsEnum.BGDARK}
          >
            NO
          </ColoredButton>
        </Grid>
        <Grid item>
          <ColoredButton
            onClick={() => confirm(confirmationContext)}
            fullWidth
            colorVariety={ColorsEnum.BLUE}
            size="small"
          >
            YES
          </ColoredButton>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default withStyles(styles)(ConfirmationBox);
