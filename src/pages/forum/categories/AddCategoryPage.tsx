import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import TopBar from "components/TopBar";
import { CategoryContext } from "context/CategoryContext";
import { useFormik } from "formik";
import { ForumRoutes } from "pages/forum/ForumRoutes";
import React, { useContext, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import Category from "types/Category";
import ColorsEnum from "types/ColorsEnum";

const styles = (theme) =>
  createStyles({
    paper: {
      marginTop: theme.spacing(30),
      category: "flex",
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: ColorsEnum.BGLIGHT,
      padding: "30px",
    },
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
      padding: theme.spacing(6, 0, 6),
    },
  });

const AddCategoryPage: React.FunctionComponent<
  WithStyles<typeof styles> & RouteComponentProps<{ id: string }>
> = (props) => {
  const { classes, history } = props;

  const [category] = useState(() => new Category());
  const { addCategory } = useContext(CategoryContext);

  const submitForm = async (values: Category, { setStatus }) => {
    try {
      const category = await addCategory(values);
      if (category) {
        history.push(ForumRoutes.FORUM);
      }
    } catch (e) {
      setStatus(e);
    }
  };

  const formik = useFormik<Category>({
    initialValues: category,
    onSubmit: submitForm,
    enableReinitialize: true,
  });

  return (
    <>
      <TopBar
        alignItems="center"
        backEnabled
        backTo={ForumRoutes.FORUM}
        color={ColorsEnum.OLIVE}
      >
        <Typography component="h1" variant="h4">
          Add category
        </Typography>
      </TopBar>
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <>
            <form
              className={classes.form}
              noValidate
              onSubmit={formik.handleSubmit}
            >
              <TextField
                id="name"
                variant="outlined"
                margin="normal"
                fullWidth
                label="Category name"
                name="name"
                value={formik.values.name}
                autoFocus
                onChange={formik.handleChange}
                error={!!formik.status?.name}
                helperText={formik.status?.name}
              />
              <TextField
                id="description"
                variant="outlined"
                margin="normal"
                fullWidth
                label="Description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                error={!!formik.status?.description}
                helperText={formik.status?.description}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                style={{ marginTop: "20px" }}
              >
                Add
              </Button>
            </form>
          </>
        </div>
      </Container>
    </>
  );
};

export default withRouter(withStyles(styles)(AddCategoryPage));
