import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import { Autocomplete, AutocompleteProps } from "@material-ui/lab";
import React from "react";

const styles = (theme) =>
  createStyles({
    submit: {},
  });

interface ISelectInputProps {
  colorVariety?: string;
}

const SelectInput: React.FunctionComponent<
  WithStyles<typeof styles> &
    AutocompleteProps<any, false | true, false, false> &
    ISelectInputProps
> = (props) => {
  const { classes, colorVariety, children, ...rest } = props;

  return <Autocomplete {...rest} />;
};

export default withStyles(styles)(SelectInput);
