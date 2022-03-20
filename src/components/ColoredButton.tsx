import Button, { ButtonProps } from '@material-ui/core/Button';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import React from 'react';
import ColorsEnum from 'types/ColorsEnum';

const styles = (theme) =>
  createStyles({
    submit: {
      //margin: theme.spacing(3, 0, 2),
      padding: (props: IButtonProps) => (props.size !== 'small' ? '9px 16px' : '6px 16px'),
      backgroundColor: (props: IButtonProps) => props.colorVariety,
      color: ColorsEnum.WHITE,
      minWidth: (props: IButtonProps) => (props.size !== 'small' ? '150px' : undefined),
    },
  });

interface IButtonProps extends ButtonProps {
  colorVariety: string;
}

const ColoredButton: React.FunctionComponent<WithStyles<typeof styles> & IButtonProps> = (
  props
) => {
  const { classes, colorVariety, children, ...rest } = props;

  return (
    <Button variant="contained" className={classes.submit} {...rest}>
      {children}
    </Button>
  );
};

export default withStyles(styles)(ColoredButton);
