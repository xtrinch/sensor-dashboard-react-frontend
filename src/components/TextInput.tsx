import { TextField } from "@material-ui/core";
import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import { TextFieldProps } from "@material-ui/core/TextField";
import React from "react";

const styles = (theme) =>
  createStyles({
    submit: {},
  });

interface ITextFieldProps {
  colorVariety?: string;
}

const TextInput: React.FunctionComponent<
  WithStyles<typeof styles> & TextFieldProps & ITextFieldProps
> = (props) => {
  const { classes, colorVariety, children, ...rest } = props;

  return (
    <TextField
      variant={"outlined" as any}
      margin="normal"
      fullWidth
      {...rest}
    />
  );
};

export default withStyles(styles)(TextInput);
