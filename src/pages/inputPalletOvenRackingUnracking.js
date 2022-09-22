import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Head from 'next/head';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { useRouter } from 'next/router';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
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

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
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
  iconButton: {
    padding: 10,
  },
}));

const InputPalletOvenRackingUnrackingPage = ({
  setTitle,
  setMsgBox,
  setLoading,
}) => {
  const classes = useStyles();
  const route = useRouter();
  const { type, mode } = route.query;
  const title = mode === 'start' ? 'Start' : 'Finish';
  setTitle(`${title} Input Pallet`);
  const [pallet, setPallet] = React.useState([]);
  const [racks, setRack] = React.useState('');

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

  return (
    <>
      <Head>
        <title>Odoo Warehouse</title>
      </Head>
      <Box className={classes.root}>
        <Paper component="form" className={classes.paperTop}>
          <Box className="row">
            <Box className="col">
              <Box
                className="row"
                style={{ padding: '10px', textAlign: 'center' }}
              >
                <Box className="input">
                  <TextField
                    variant="outlined"
                    id="rack"
                    name="rack"
                    label="Input Pallet"
                    className={classes.textField}
                    onChange={(e) => setRack(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ pattern: '[A-Za-z0-9]+' }}
                    required
                    value={racks}
                  />
                </Box>

                <Box className={classes.wrapper}>
                  <Button
                    onClick={async () => {
                      setMsgBox({ variant: 'success', message: '' });
                      if (racks) {
                        await setTimeout(() => {
                          setPallet([...pallet, racks]);
                        }, 1000);
                        setMsgBox({
                          variant: 'success',
                          message: 'Data Has Been Add',
                        });
                        setRack('');
                      } else {
                        setMsgBox({ variant: 'error', message: 'Rack Kosong' });
                      }
                    }}
                    className={classes.button}
                  >
                    Add Pallet
                  </Button>
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
                        <StyledTableCell align="center">Action</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pallet
                        .filter((val, id, array) => array.indexOf(val) === id)
                        .map((row, idx) => (
                          <StyledTableRow>
                            <StyledTableCell
                              align="left"
                              component="a"
                              scope="row"
                            >
                              {row}
                            </StyledTableCell>

                            <StyledTableCell
                              align="center"
                              component="a"
                              scope="row"
                            >
                              <IconButton
                                className={classes.iconButton}
                                aria-label="delete"
                                onClick={() => {
                                  setPallet(() => {
                                    const data = [...pallet];
                                    data.splice(idx, 1);
                                    return data;
                                  });
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
              <Box className={classes.wrapper}>
                <Button style={{ marginTop: '20px' }} onClick={getProcess}>
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
export default InputPalletOvenRackingUnrackingPage;

InputPalletOvenRackingUnrackingPage.propTypes = {
  setTitle: PropTypes.func.isRequired,
  setMsgBox: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
};
