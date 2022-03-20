import { Checkbox, FormControlLabel } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ColoredButton from 'components/ColoredButton';
import TextInput from 'components/TextInput';
import TopBar from 'components/TopBar';
import { CategoryContext } from 'context/CategoryContext';
import { useFormik } from 'formik';
import { ForumRoutes } from 'pages/forum/ForumRoutes';
import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import CategoryService from 'services/CategoryService';
import Category from 'types/Category';
import ColorsEnum from 'types/ColorsEnum';

const styles = (theme) =>
  createStyles({
    paper: {
      marginTop: theme.spacing(30),
      category: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: ColorsEnum.BGLIGHT,
      padding: '30px',
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
  });

const AddCategoryPage: React.FunctionComponent<
  WithStyles<typeof styles> & RouteComponentProps<{ id: string }>
> = (props) => {
  const {
    classes,
    history,
    match: { params },
  } = props;

  const [category, setCategory] = useState(() => new Category());
  const { addCategory, updateCategory } = useContext(CategoryContext);

  const submitForm = async (values: Category, { setStatus }) => {
    try {
      let c;
      if (isEdit()) {
        c = await updateCategory(category.id, values);
      } else {
        c = await addCategory(values);
      }
      if (c) {
        history.push(ForumRoutes.FORUM);
      }
    } catch (e) {
      console.log(e);
      setStatus(e);
    }
  };

  const formik = useFormik<Category>({
    initialValues: category,
    onSubmit: submitForm,
    enableReinitialize: true,
  });

  const isEdit = () => {
    return !!params.id;
  };

  useEffect(() => {
    const setData = async () => {
      if (isEdit()) {
        const s = await CategoryService.getCategory(params.id);
        setCategory(s);
      }
    };
    setData();
  }, []);

  return (
    <>
      <TopBar alignItems="center" backEnabled backTo={ForumRoutes.FORUM} color={ColorsEnum.OLIVE}>
        <Typography component="h1" variant="h4">
          {isEdit() ? 'Edit' : 'Add'} category
        </Typography>
      </TopBar>
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <>
            <form className={classes.form} noValidate onSubmit={formik.handleSubmit}>
              <TextInput
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
              <TextInput
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
              <div>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formik.values.protected}
                      onChange={(e, checked) => formik.setFieldValue('protected', checked)}
                    />
                  }
                  label="Protected"
                />
              </div>
              <ColoredButton
                type="submit"
                style={{ marginTop: '20px', minWidth: '200px' }}
                colorVariety={ColorsEnum.OLIVE}
              >
                Submit
              </ColoredButton>
            </form>
          </>
        </div>
      </Container>
    </>
  );
};

export default withRouter(withStyles(styles)(AddCategoryPage));
