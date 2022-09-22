import { Box } from '@material-ui/core';

import React from 'react';
import { useRouter } from 'next/router';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import Head from 'next/dist/next-server/lib/head';
import OdooLib from '../models/odoo';
import BottomNavbarSection from '../containers/Layout/bottomNavbar';

const QrReader = dynamic(() => import('react-qr-reader'), {
  ssr: false,
});

const ScanPage = ({ setTitle }) => {
  const router = useRouter();
  const odoo = new OdooLib();

  setTitle('Scan PO');
  const handleScan = async (data) => {
    if (data) {
      if (window.navigator) {
        window.navigator.vibrate(300);
      }

      const pickings = await odoo.getListPickingIds(parseInt(data, 10));
      if (!pickings) {
        router.push('/?po');
      } else if (pickings.length === 1) {
        router.push(`/edit?id=${pickings[0].id}`);
      } else {
        const fields = pickings[0].origin.split(':');
        if (fields.length > 1) {
          router.push(`/?po=${fields[1]}`);
        } else if (fields.length === 1) {
          router.push(`/?po=${fields[0]}`);
        }
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
        <title>Odoo App - Scanning</title>
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
          Arahkan camera ke Kode QRCODE Purchase Order
        </Typography>
      </Box>
      <BottomNavbarSection />
    </>
  );
};

export default ScanPage;

ScanPage.propTypes = {
  setTitle: PropTypes.func.isRequired,
};
