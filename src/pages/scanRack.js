import { Box } from '@material-ui/core';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import Head from 'next/dist/next-server/lib/head';
import Router from 'next/router';
import BottomNavbarRackSection from '../containers/Layout/bottomNavbarRack';

const QrReader = dynamic(() => import('react-qr-reader'), {
  ssr: false,
});

const ScanRackPage = ({ setTitle }) => {
  setTitle('Scan Rack');
  const handleScan = async (data) => {
    if (data) {
      if (window.navigator) {
        window.navigator.vibrate(300);
        Router.push({
          pathname: '/rack',
          query: { rack: data },
        });
      }
    }
  };

  const handleError = (err) => {
    // eslint-disable-next-line no-console
    console.error(err);
  };

  return (
    <>
      <Head>
        <title>Odoo App - Scanning Rack</title>
      </Head>
      <Box className="row">
        <QrReader
          delay={5}
          onError={handleError}
          onScan={handleScan}
          style={{ width: '100%' }}
        />
      </Box>
      <Box className="row" style={{ padding: '20px', textAlign: 'center' }}>
        <Typography variant="h5" component="h4">
          Arahkan camera ke Kode QRCODE MO
        </Typography>
      </Box>
      <BottomNavbarRackSection />
    </>
  );
};

export default ScanRackPage;

ScanRackPage.propTypes = {
  setTitle: PropTypes.func.isRequired,
};
