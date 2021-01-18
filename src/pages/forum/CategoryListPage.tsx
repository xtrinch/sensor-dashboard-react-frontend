import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import Plus from "@material-ui/icons/Add";
import TopBar from "components/TopBar";
import { CategoryContext } from "context/CategoryContext";
import CategoryItem from "pages/forum/components/CategoryItem";
import React, { useContext } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import Category from "types/Category";
import ColorsEnum from "types/ColorsEnum";
import { Routes } from "utils/Routes";

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

const CategoryListPage: React.FunctionComponent<
  WithStyles<typeof styles> & RouteComponentProps<{ id: string }>
> = (props) => {
  const { classes, history } = props;

  const {
    state: { categories },
  } = useContext(CategoryContext);

  return (
    <>
      <TopBar alignItems="center">
        <Typography component="h1" variant="h4" style={{ marginRight: "20px" }}>
          Categories
        </Typography>
        <Button
          variant="contained"
          className={classes.actionButton}
          startIcon={<Plus />}
          onClick={() => history.push(Routes.ADD_CATEGORY)}
        >
          Add
        </Button>
      </TopBar>
      <Container component="main" maxWidth="md" className={classes.root}>
        <CssBaseline />
        {categories.length !== 0 && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Categoryname</TableCell>
                <TableCell>Created at</TableCell>
                <TableCell>Last seen at</TableCell>
                <TableCell>Group</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories?.map((category: Category) => (
                <CategoryItem category={category} key={category.id} />
              ))}
            </TableBody>
          </Table>
        )}
        {categories.length === 0 && (
          <Typography
            variant="body2"
            component="p"
            style={{ margin: "30px 0px" }}
          >
            No categories added
          </Typography>
        )}
      </Container>
    </>
  );
};

export default withRouter(withStyles(styles)(CategoryListPage));
