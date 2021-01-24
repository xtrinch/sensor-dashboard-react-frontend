import Container from "@material-ui/core/Container";
import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TopBar from "components/TopBar";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import ColorsEnum from "types/ColorsEnum";

const styles = (theme) =>
  createStyles({
    paper: {
      margin: "30px 0px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: ColorsEnum.BGLIGHT,
      padding: "30px",
      border: `1px solid ${ColorsEnum.GRAYDARK}`,
    },
  });

const UserPage: React.FunctionComponent<
  WithStyles<typeof styles> & RouteComponentProps<{ id: string }>
> = (props) => {
  const { classes } = props;
  return (
    <>
      <TopBar alignItems="center">
        <Typography component="h1" variant="h4">
          User info
        </Typography>
      </TopBar>
      <Container component="main" maxWidth="sm">
        <div className={classes.paper}></div>
      </Container>
    </>
  );
};

export default withRouter(withStyles(styles)(UserPage));
