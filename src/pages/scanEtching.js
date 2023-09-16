import { Box } from '@material-ui/core';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Head from 'next/dist/next-server/lib/head';
import BottomNavbarEtching from '../containers/Layout/bottomNavbarEtching';

const QrReader = dynamic(() => import('react-qr-reader'), {
  ssr: false,
});

const ScanPressPage = ({ setTitle }) => {
  setTitle('Scan MO');
  const router = useRouter();

  const handleScan = async (data) => {
    if (data) {
      if (window.navigator) {
        window.navigator.vibrate(300);
        router.push(data);
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  return (
    <>
      <Head>
        <title>ALUBLESS - Scanning MO</title>
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
      <BottomNavbarEtching />
    </>
  );
};

export default ScanPressPage;

ScanPressPage.propTypes = {
  setTitle: PropTypes.func.isRequired,
};
