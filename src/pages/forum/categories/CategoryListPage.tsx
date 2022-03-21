import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import Container from '@mui/material/Container';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import Plus from '@mui/icons-material/Add';
import ColoredButton from 'components/ColoredButton';
import TopBar from 'components/TopBar';
import { AccountContext } from 'context/AccountContext';
import { CategoryContext } from 'context/CategoryContext';
import CategoryItem from 'pages/forum/categories/components/CategoryItem';
import { ForumRoutes } from 'pages/forum/ForumRoutes';
import React, { useContext } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import Category from 'types/Category';
import ColorsEnum from 'types/ColorsEnum';
import { PermissionsEnum } from 'types/PermissionEnum';

const styles = (theme) =>
  createStyles({
    root: {
      backgroundColor: ColorsEnum.BGLIGHT,
      paddingLeft: '0px',
      paddingRight: '0px',
      textAlign: 'center',
      marginTop: '30px',
      marginBottom: '30px',
    },
  });

const CategoryListPage: React.FunctionComponent<
  WithStyles<typeof styles> & RouteComponentProps<{ id: string }>
> = (props) => {
  const { classes, history } = props;
  const { user } = useContext(AccountContext);

  const {
    state: { categories },
  } = useContext(CategoryContext);

  return (
    <>
      <TopBar alignItems="center">
        <Typography component="h1" variant="h4" style={{ marginRight: '20px' }}>
          Forum
        </Typography>
        {user?.isAllowed([PermissionsEnum.Category__delete]) && (
          <ColoredButton
            startIcon={<Plus />}
            onClick={() => history.push(ForumRoutes.ADD_CATEGORY)}
            colorVariety={ColorsEnum.OLIVE}
            size="small"
          >
            Add category
          </ColoredButton>
        )}
      </TopBar>
      <Container component="main" maxWidth="md" className={classes.root}>
        {categories.length !== 0 && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell style={{ paddingLeft: '0px' }}>Category name</TableCell>
                <TableCell style={{ paddingLeft: '0px', paddingRight: '0px' }}>Topics</TableCell>
                <TableCell style={{ paddingLeft: '0px', paddingRight: '0px' }}>Comments</TableCell>
                <TableCell style={{ paddingLeft: '0px' }}>Last topic</TableCell>
                <TableCell style={{ paddingLeft: '0px' }}>Last comment</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories?.map((category: Category, index: number) => (
                <CategoryItem category={category} key={index} />
              ))}
            </TableBody>
          </Table>
        )}
        {categories.length === 0 && (
          <Typography variant="body2" component="p" style={{ margin: '30px 0px' }}>
            No categories added
          </Typography>
        )}
      </Container>
    </>
  );
};

export default withRouter(withStyles(styles)(CategoryListPage));
