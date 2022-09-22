import Box from '@material-ui/core/Box';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import LoadingOverlay from 'react-loading-overlay';
import { makeStyles } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

import AppbarSection from './appbar';
import withAuthorization from '../../models/withAuthorization';
import CustomizedSnackbars from '../../components/snackbar';
// eslint-disable-next-line import/no-extraneous-dependencies

const useStyles = makeStyles(() => ({
  divLoading: {
    height: '90vh',
    zIndex: 10,
    paddingTop: '10px',
    paddingLeft: '5px',
    paddingRight: '5px',
    paddingBottom: '50px',
  },
}));

const Layout = ({ children }) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [msgBox, setMsgBox] = useState({ message: '', variant: 'success' });

  const classes = useStyles();

  const childrenWithProps = React.Children.map(children, (child) =>
    React.cloneElement(child, {
      setTitle,
      setLoading,
      setMsgBox,
      loading,
    })
  );

  return (
    <>
      <AppbarSection title={title} />

      <LoadingOverlay
        active={loading}
        spinner={
          <Box>
            <CircularProgress size="80px" />
          </Box>
        }
        text="Please wait. processing...."
        className={classes.divLoading}
      >
        {childrenWithProps}
      </LoadingOverlay>
      <CustomizedSnackbars message={msgBox.message} variant={msgBox.variant} />
    </>
  );
};

export default withAuthorization(Layout);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

/* <BottomNavbarSection /> */
