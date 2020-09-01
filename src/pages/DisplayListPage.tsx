import { Typography } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import DisplayItem from "components/DisplayItem";
import { DisplayContext } from "context/DisplayContext";
import React, { useContext } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import ColorsEnum from "types/ColorsEnum";
import Display from "types/Display";

const styles = (theme) =>
  createStyles({
    root: {
      backgroundColor: ColorsEnum.BGLIGHT,
      paddingLeft: "0px",
      paddingRight: "0px",
      textAlign: "center",
    },
  });

const DisplayListPage: React.FunctionComponent<
  WithStyles<typeof styles> & RouteComponentProps<{ id: string }>
> = (props) => {
  const { classes } = props;

  const [displayContext] = useContext(DisplayContext);

  return (
    <Container
      component="main"
      maxWidth="sm"
      style={{ margin: "20px auto" }}
      className={classes.root}
    >
      <CssBaseline />
      <Typography component="h1" variant="h5" style={{ margin: "20px" }}>
        My display devices
      </Typography>
      {displayContext.displays.map((display: Display) => (
        <DisplayItem display={display} key={display.id} />
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
