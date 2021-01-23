import Button, { ButtonProps } from "@material-ui/core/Button";
import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import React from "react";
import ColorsEnum from "types/ColorsEnum";

const styles = (theme) =>
  createStyles({
    submit: {
      margin: theme.spacing(3, 0, 2),
      padding: theme.spacing(6, 0, 6),
      backgroundColor: (props: IButtonProps) => props.colorVariety,
      color: ColorsEnum.WHITE,
    },
  });

interface IButtonProps {
  colorVariety: string;
}

const ColoredButton: React.FunctionComponent<
  WithStyles<typeof styles> & ButtonProps & IButtonProps
> = (props) => {
  const { classes, colorVariety, children, ...rest } = props;

  return (
    <Button variant="contained" className={classes.submit} {...rest}>
      {children}
    </Button>
  );
};

export default withStyles(styles)(ColoredButton);
