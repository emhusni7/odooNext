import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Head from 'next/head';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import dynamic from 'next/dynamic';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { useRouter } from 'next/router';
import BottomNavbarOvenRackingUnrackingSection from '../containers/Layout/bottomNavbarOvenRackingUnracking';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#722076',
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
}))(TableRow);

const QrReader = dynamic(() => import('react-qr-reader'), {
  ssr: false,
});

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
  textField: {
    margin: '10px',
    width: '90%',
  },
  button: {
    width: '60%',
    fontSize: ['10px', '12px', '14px'],
    fontWeight: '500',
    marginTop: '10px',
    marginLeft: '10px',
    marginRight: '10px',
    marginBottom: '10px',
    justifyContent: 'center',
  },
  wrapper: {
    position: 'relative',
  },
  paperTop: {
    padding: theme.spacing(1),
    margin: 'auto',
    width: '90%',
    justifyContent: 'center',
  },
  paperBottom: {
    padding: theme.spacing(2),
    margin: 'auto',
    width: '90%',
    justifyContent: 'center',
    marginTop: '20px',
    marginBottom: '50px',
  },
}));

const ScanPalletOvenRackingUnrackingPage = ({
  setTitle,
  setMsgBox,
  setLoading,
}) => {
  const classes = useStyles();
  const route = useRouter();
  const { type, mode } = route.query;

  setTitle('Scan Pallet');

  const [pallet, setPallet] = React.useState([]);

  const handleScan = async (data) => {
    if (data) {
      setMsgBox({ variant: 'success', message: '' });
      if (window.navigator) {
        setPallet([...pallet, data]);
        setMsgBox({ variant: 'success', message: 'Data Has Been Validate' });
        window.navigator.vibrate(300);
      }
    }
  };

  const getProcess = async () => {
    setLoading(true);
    let mchId;
    if (type === 'oven') {
      mchId = localStorage.getItem('ovenMchId');
    } else if (type === 'racking') {
      mchId = localStorage.getItem('rackingMchId');
    } else if (type === 'unracking') {
      mchId = localStorage.getItem('unrackingMchId');
    } else if (type === 'drawn') {
      mchId = localStorage.getItem('drawnMchId');
    } else if (type === 'anodize') {
      mchId = localStorage.getItem('anodizeMchId');
    } else if (type === 'polish') {
      mchId = localStorage.getItem('polishMchId');
    } else if (type === 'brush') {
      mchId = localStorage.getItem('brushMchId');
    } else if (type === 'hole') {
      mchId = localStorage.getItem('holeMchId');
    } else if (type === 'bending') {
      mchId = localStorage.getItem('bendingMchId');
    } else if (type === 'ulir') {
      mchId = localStorage.getItem('ulirMchId');
    } else if (type === 'painting') {
      mchId = localStorage.getItem('paintingMchId');
    } else if (type === 'cutting') {
      mchId = localStorage.getItem('cuttingMchId');
    } else if (type === 'preChromate') {
      mchId = localStorage.getItem('preChromateMchId');
    } else if (type === 'sandblasting') {
      mchId = localStorage.getItem('snblMchId');
    }
    setLoading(false);
    route.push({
      pathname: '/listPalletOvenRackingUnracking',
      query: {
        type,
        mode,
        pallet,
        mchId,
      },
    });
  };

  const handleError = (err) => {
    console.error(err);
  };

  return (
    <>
      <Head>
        <title>Odoo Warehouse</title>
      </Head>
      <Box className={classes.root}>
        <Paper component="form" className={classes.paperTop}>
          <Box className="row">
            <Box className="col">
              <Box className={classes.wrapper}>
                <Box className="row">
                  <QrReader
                    delay={300}
                    onError={handleError}
                    onScan={handleScan}
                    style={{ width: '100%' }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>
        <Paper component="form" className={classes.paperBottom}>
          <Box className="row">
            <Box className="col">
              <Box className={classes.wrapper}>
                <Typography align="right">
                  {`Jumlah Pallet ${
                    pallet.filter((val, id, array) => array.indexOf(val) === id)
                      .length
                  }`}
                </Typography>
                <TableContainer component={Paper}>
                  <Table
                    className={classes.table}
                    aria-label="customized table"
                  >
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="center">
                          Pallet Name
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pallet
                        .filter((val, id, array) => array.indexOf(val) === id)
                        .map((row) => (
                          <StyledTableRow>
                            <StyledTableCell
                              align="left"
                              component="a"
                              scope="row"
                            >
                              {row}
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
              <Box className={classes.wrapper}>
                <Button
                  variant="contained"
                  style={{ marginTop: '20px' }}
                  onClick={getProcess}
                >
                  Process
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>

      <BottomNavbarOvenRackingUnrackingSection />
    </>
  );
};
export default ScanPalletOvenRackingUnrackingPage;

ScanPalletOvenRackingUnrackingPage.propTypes = {
  setTitle: PropTypes.func.isRequired,
  setMsgBox: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
};
