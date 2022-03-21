import { FormControl, InputLabel, TextField } from '@mui/material';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import { TextFieldProps } from '@mui/material/TextField';
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
