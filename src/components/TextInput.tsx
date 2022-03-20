import { FormControl, InputLabel, TextField } from '@material-ui/core';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import { TextFieldProps } from '@material-ui/core/TextField';
import React from 'react';

const styles = (theme) =>
  createStyles({
    submit: {},
  });

export interface ITextFieldProps {
  colorVariety?: string;
}

const TextInput: React.FunctionComponent<
  WithStyles<typeof styles> & TextFieldProps & ITextFieldProps
> = (props) => {
  const { classes, colorVariety, children, label, ...rest } = props;

  return (
    <FormControl {...(rest.fullWidth ? { style: { width: '100%' } } : {})}>
      <InputLabel shrink style={{ fontSize: '17px' }}>
        {label}
      </InputLabel>
      <TextField variant={'outlined' as any} margin="normal" fullWidth {...rest} />
    </FormControl>
  );
};

export default withStyles(styles)(TextInput);
