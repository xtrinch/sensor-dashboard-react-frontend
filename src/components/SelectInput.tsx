import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import { Autocomplete, TextFieldProps } from '@mui/material';
import { AutocompleteProps } from '@mui/lab';
import TextInput from 'components/TextInput';
import React from 'react';

const styles = (theme) =>
  createStyles({
    submit: {},
  });

interface ISelectInputProps {
  colorVariety?: string;
  onChange: (e: any, newVal: any) => void;
}

const SelectInput: React.FunctionComponent<
  WithStyles<typeof styles> &
    AutocompleteProps<any, false | true, false, false> &
    TextFieldProps &
    ISelectInputProps &
    any
> = (props) => {
  const { classes, colorVariety, children, renderInput, ...rest } = props;

  return (
    <Autocomplete
      renderInput={
        renderInput ||
        ((params) => (
          <TextInput
            {...params}
            label={rest.label}
            error={rest.error}
            helperText={rest.helperText}
            placeholder={rest.placeholder}
            margin={rest.margin || 'normal'}
            variant={rest.variant}
            fullWidth
          />
        ))
      }
      {...rest}
    />
  );
};

export default withStyles(styles)(SelectInput);
