import { Typography } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import TopBar from "components/TopBar";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import ColorsEnum from "types/ColorsEnum";

const styles = (theme) =>
  createStyles({
    root: {
      backgroundColor: ColorsEnum.BGLIGHT,
      paddingLeft: "0px",
      paddingRight: "0px",
      textAlign: "center",
      marginTop: "30px",
      marginBottom: "30px",
    },
    actionButton: {
      backgroundColor: ColorsEnum.OLIVE,
      color: ColorsEnum.WHITE,
      width: "fit-content",
    },
  });

const ForumIndexPage: React.FunctionComponent<
  WithStyles<typeof styles> & RouteComponentProps<{ id: string }>
> = (props) => {
  const { classes } = props;

  return (
    <>
      <TopBar alignItems="center">
        <Typography component="h1" variant="h4">
          Forum
        </Typography>
      </TopBar>
      <Container component="main" maxWidth="md" className={classes.root}>
        Coming soon!
      </Container>
    </>
  );
};

export default withRouter(withStyles(styles)(ForumIndexPage));
