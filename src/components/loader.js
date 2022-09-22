import React from 'react';
import LoaderImage from '../../public/static/loader.gif';

const Loader = () => (
  <>
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <img src={LoaderImage} alt="loader" />
    </div>
  </>
);

export default Loader;
