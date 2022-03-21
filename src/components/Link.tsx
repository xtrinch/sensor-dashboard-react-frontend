import { Link as MaterialLink } from '@mui/material';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import ColorsEnum from 'types/ColorsEnum';

interface LinkProps {
  style?: any;
  onClick?: any;
  href?: string;
  target?: string;
  id?: string;
  to?: string;
  color?: string;
}

const styles = () =>
  createStyles({
    link: {
      '&:hover': {
        // color: `${ColorsEnum.VIOLET}!important`
      },
      cursor: 'pointer',
      fontStyle: 'normal',
      fontSize: '13px',
      color: (props: LinkProps) => props.color || ColorsEnum.BLUE,
      textDecoration: 'none',
    },
  });

const Link: React.FunctionComponent<LinkProps & WithStyles<typeof styles>> = (props) => {
  const { to, target, style, classes, children, href, id, onClick } = props;

  return (
    <>
      {props.to ? (
        <RouterLink
          style={style}
          to={to || '#'}
          target={target}
          className={classes.link}
          id={id}
          onClick={onClick}
        >
          {children}
        </RouterLink>
      ) : (
        <MaterialLink
          style={style}
          className={classes.link}
          onClick={onClick}
          href={href}
          target={target}
          id={id}
        >
          {children}
        </MaterialLink>
      )}
    </>
  );
};

Link.defaultProps = {};

export default withStyles(styles)(Link);
