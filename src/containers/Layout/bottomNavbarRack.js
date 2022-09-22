import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import BottomNavigation from '@material-ui/core/BottomNavigation/BottomNavigation';
import React, { useState } from 'react';
import InputIcon from '@material-ui/icons/Create';
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

const BottomNavbarRackSection = () => {
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
        label="Input"
        value="searchRack"
        icon={<InputIcon />}
      />
      <BottomNavigationAction
        label="Scan"
        value="scanRack"
        icon={<PhotoCameraIcon />}
      />
    </BottomNavigation>
  );
};

export default BottomNavbarRackSection;
