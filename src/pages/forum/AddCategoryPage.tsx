import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import TopBar from "components/TopBar";
import { CategoryContext } from "context/CategoryContext";
import React, { useContext, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import Category from "types/Category";
import ColorsEnum from "types/ColorsEnum";
import { Routes } from "utils/Routes";

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

  const errs: { [key: string]: string } = {};
  const [errors, setErrors] = useState(errs);
  const [data, setData] = useState({
    name: "",
  });

  const { addCategory } = useContext(CategoryContext);

  const submitForm = async (e) => {
    e.preventDefault();

    try {
      const category = await addCategory(new Category(data));
      if (category) {
        history.push(Routes.FORUM);
      }
    } catch (e) {
      setErrors(e);
    }
  };

  const fieldChange = (val, fieldName) => {
    data[fieldName] = val;
    setData({ ...data });
  };

  return (
    <>
      <TopBar alignItems="center">
        <Typography component="h1" variant="h4">
          Add category
        </Typography>
      </TopBar>
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <>
            <form className={classes.form} noValidate onSubmit={submitForm}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="name"
                label="Category name"
                name="name"
                value={data.name}
                autoFocus
                onChange={(e) => fieldChange(e.target.value, "name")}
                error={!!errors.name}
                helperText={errors.name}
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
