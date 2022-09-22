import React from 'react';
import LauncherImage from '../../public/static/launcher.png';

const Launcher = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '90vh',
      backgroundColor: 'gray',
    }}
  >
    <img src={LauncherImage} width="200" height="200" alt="launcher" />
  </div>
);

export default Launcher;
