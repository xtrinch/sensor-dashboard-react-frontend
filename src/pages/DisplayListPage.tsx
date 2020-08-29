import { Typography } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import DisplayItem from "components/DisplayItem";
import { DisplayContext } from "context/DisplayContext";
import React, { useContext } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import Display from "types/Display";

const styles = (theme) => createStyles({});

const DisplayListPage: React.FunctionComponent<
  WithStyles<typeof styles> & RouteComponentProps<{ id: string }>
> = (props) => {
  const { classes, history } = props;

  const [displayContext, displayContextDispatch] = useContext(DisplayContext);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      {displayContext.displays.map((display: Display) => (
        <DisplayItem display={display} />
      ))}
      {displayContext.displays.length === 0 && (
        <Typography variant="body2" component="p">
          No displays added
        </Typography>
      )}
    </Container>
  );
};

export default withRouter(withStyles(styles)(DisplayListPage));
