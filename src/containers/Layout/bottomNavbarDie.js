import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import BottomNavigation from '@material-ui/core/BottomNavigation/BottomNavigation';
import React, { useState } from 'react';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import { makeStyles } from '@material-ui/core';
import { useRouter } from 'next/router';

const useStyles = makeStyles(() => ({
  rootBottom: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    zIndex: 20,
  },
}));

const BottomNavbarDieSection = () => {
  const classes = useStyles();
  const router = useRouter();
  const [value, setValue] = useState(router.pathname.replace('/', ''));

  const handleChange = (event, newValue) => {
    setValue(newValue);
    router.push(`/${newValue}`);
  };

  return (
    <BottomNavigation
      value={value}
      onChange={handleChange}
      className={classes.rootBottom}
      showLabelsbp
    >
      <BottomNavigationAction
        label="Scan"
        value="scan"
        icon={<PhotoCameraIcon />}
      />
    </BottomNavigation>
  );
};

export default BottomNavbarDieSection;
