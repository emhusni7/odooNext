/* eslint-disable no-alert */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/dist/next-server/lib/head';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import { useRouter } from 'next/router';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import AlertDialog from '../components/dialog';
import AutoCProduct from '../components/AutoCProduct';
import OdooLib from '../models/odoo';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#722076',
    color: theme.palette.common.white,
    fontWeight: "bold"
  },
  body: {
    fontSize: 12,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 100,
  },
  root: {
    flexGrow: 1,
    marginLeft: '10px',
    marginRight: '10px',
  },
  formControl: {
    minWidth: '100%',
  },
  paper: {
    height: 50,
  },
  paperAutoComplate: {
    heigth: 50,
    width: '100%',
  },
  paperSave: {
    height: 50,
    backgroundColor: 'red',
    align: 'right',
  },
  paperConsumeBottom: {
    height: 50,
    marginBottom: 20,
  },
  label: {
    paddingTop: 20,
  },
  labelBottom: {
    marginLeft: '10px',
  },
  linkStyle: {
    color: 'blue',
  },
  textField: {
    width: '100%',
    marginTop: 10,
  },
  cardStyle: {
    width: '100%',
  },
  buttonEnd: {
    marginLeft: 10,
    backgroundColor: '#CF4500',
    color: 'white',
    width: '100%',
  },
  buttonPlus: {
    color: 'white',
    background: '#29b3af',
  },
  buttonMinus: {
    color: 'white',
    background: '#29b3af',
  },
  buttonSaveTab: {
    marginTop: 30,
    marginRight: 10,
    align: 'right',
  },
  inputTable: {
    height: 5,
    width: 80,
  },
  paperBottom: {
    marginTop: 5,
    textAlign: 'center',
    height: '100%',
  },
  labelStyle: {
    fontSize: ['0.5rem', '1.5rem'],
  },
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node.isRequired, // PropTypes.node,
  index: PropTypes.objectOf(PropTypes.any).isRequired,
  value: PropTypes.objectOf(PropTypes.any).isRequired, // PropTypes.any.isRequired,
};

const BubutPage = ({ setTitle, setMsgBox, setLoading }) => {
  const router = useRouter();
  const odoo = new OdooLib();

  const shiftId = Number(localStorage.getItem('shiftId'));
  const { woId, productionId, product } = router.query;
  const [bubut, setBubut] = React.useState({
    id: '',
    shiftId,
    moname: '',
    status: '',
    mpo_id: 0,
    note: '',
    type: '',
    woid: woId,
    date_start: '',
    date_finished: '',
    noConsume: false,
    consume: [],
  });

  setTitle(bubut.name || 'Bubut');
  const [dialogopen, setOpen] = React.useState({ open: false, delid: 0 });

  const setDone = async () => {
    setMsgBox({
      variant: 'success',
      message: '',
    });
    setLoading(true);
    if (!bubut.billetSaved) {
      await setTimeout(setLoading(false), 1000);
      setMsgBox({
        variant: 'error',
        message: 'Consume belum di save',
      });
    } else {
      const produce = await odoo.setStartBubut(bubut);

      if (produce.faultCode) {
        setLoading(false);
        setMsgBox({ variant: 'error', message: produce.message });
      } else {
        setLoading(false);
        setBubut({
          ...bubut,
          status: 'Done',
          date_finished: produce.dateFinished,
        });
        setMsgBox({ variant: 'success', message: 'Transaction Has Been Done' });
      }
    }
  };

  const inWork = async () => {
    setMsgBox({ variant: 'success', message: '' });
    setLoading(true);
    const moveLines = await odoo.setStartBubut(bubut);
    if (!moveLines.faultCode) {
      setBubut({
        ...moveLines,
        outputId: moveLines.mpo_id,
      });
    } else {
      setLoading(false);
      setMsgBox({ variant: 'error', message: moveLines.message });
    }
    setLoading(false);
  };

  const getWo = async () => {
    setMsgBox({ variant: 'success', message: '' });
    setLoading(true);
    const woOrder = await odoo.getWorkOrder(woId);
    if (!woOrder.faultCode) {
      setLoading(false);
      setBubut({ ...woOrder, date_start: woOrder.dateStart });
    } else {
      setLoading(false);
      setMsgBox({ variant: 'error', message: woOrder.message });
    }
  };

  useEffect(() => {
    getWo();
  }, []);

  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const saveBillet = async () => {
    setMsgBox({ variant: 'success', message: '' });
    setLoading(true);
    const result = await odoo.saveBillet(
      bubut.outputId,
      bubut.moname,
      bubut.date_start,
      productionId,
      bubut.consume.filter((x) => x.saved === false && x.btg > 0)
    );
    if (!result.faultCode) {
      setMsgBox({ variant: 'success', message: 'Data Has Been Saved' });
      setBubut((prevState) => ({
        ...prevState,
        ...result,
      }));
    } else {
      setMsgBox({ variant: 'error', message: result.faultString });
    }
    setLoading(false);
  };

  const changeProduct = (event, val, idx) => {
    const newData = bubut.consume;
    newData[idx] = {
      ...newData[idx],
      product_id: val.id,
      product: val.name,
      product_uom: val.uomId,
      uom_id: val.uomId,
    };
    setBubut((prev) => ({
      ...prev,
      consume: newData,
    }));
  };

  const dialClose = () => {
    setOpen({ open: false, delid: 0 });
  };

  const remConsume = async (idx) => {
    setMsgBox({ variant: 'success', message: '' });
    const res = await odoo.remBillet(bubut.outputId, idx);
    if (!res.faultCode) {
      setBubut((prev) => ({
        ...prev,
        ...res,
      }));
    } else {
      setMsgBox({ variant: 'error', message: res.message });
    }
  };

  const delBil = (moveId) => {
    return (
      <IconButton aria-label="delete">
        <DeleteOutlineIcon
          onClick={() => setOpen({ open: true, delid: moveId })}
        />
        <AlertDialog
          open={dialogopen.open}
          handleClose={dialClose}
          process={() => remConsume(dialogopen.delid)}
          title="Info"
          message="Yakin untuk menghapus Billet ?"
        />
      </IconButton>
    );
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  function a11yProps(index) {
    return {
      id: `scrollable-auto-tab-${index}`,
      'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
  }
  return (
    <>
      <Head>
        <title>ALUBLESS</title>
      </Head>

      <div className={classes.root}>
        <>
          <Grid container spacing={1}>
            <Grid item xs={3} md={3} sm={3}>
              <Paper className={classes.paper} elevation={0}>
                {bubut.status === 'New' ? (
                  <Button variant="contained" onClick={() => inWork()}>
                    Start
                  </Button>
                ) : (
                  ''
                )}
              </Paper>
            </Grid>

            <Grid item xs={3} md={3} sm={3}>
              <Paper className={classes.paper} elevation={0}>
                {bubut.status === 'In Progress' ? (
                  <Button variant="contained" onClick={() => setDone()}>
                    End
                  </Button>
                ) : (
                  ''
                )}
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={5}>
            <Grid item xs={6} md={6} sm={6}>
              <Paper className={classes.paper} elevation={0}>
                <TextField
                  id="dateStart"
                  name="dateStart"
                  label="Date Start"
                  value={
                    bubut.date_start
                      ? OdooLib.formatDateTime(bubut.date_start)
                      : ''
                  }
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                    readonly: true,
                  }}
                />
              </Paper>
            </Grid>
            <Grid item xs={6} md={6} sm={6}>
              <Paper className={classes.paper} elevation={0}>
                <TextField
                  id="dateEnd"
                  name="dateEnd"
                  label="Date End"
                  value={
                    bubut.date_finished
                      ? OdooLib.formatDateTime(bubut.date_finished)
                      : ''
                  }
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                    readonly: true,
                  }}
                />
              </Paper>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={6} md={6} sm={6}>
              <Paper className={classes.paper} elevation={0}>
                <TextField
                  id="Mo Name"
                  label="Mo Name"
                  value={bubut.moname}
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                    readonly: true,
                  }}
                />
              </Paper>
            </Grid>
            <Grid item xs={6} md={6} sm={6} />
          </Grid>
          <br />
          <br />
          <Grid container spacing={1}>
            <Card className={classes.cardStyle} variant="outlined">
              <AppBar position="static" color="default">
                <Tabs
                  value={value}
                  onChange={handleChange}
                  indicatorcolor="secondary"
                  textcolor="secondary"
                  variant="scrollable"
                  scrollButtons="auto"
                  aria-label="scrollable auto tabs example"
                >
                  <Tab label="To Consume" {...a11yProps(0)} />
                  <Tab label="To Produce" {...a11yProps(0)} />
                </Tabs>
              </AppBar>
              <TabPanel value={value} index={0}>
                <TableContainer component={Paper}>
                  <Table
                    className={classes.table}
                    aria-label="customized table"
                  >
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="left" width="50%">
                          Product
                        </StyledTableCell>
                        <StyledTableCell align="left" width="20%">
                          Location
                        </StyledTableCell>
                        <StyledTableCell align="right" width="15%">
                          Qty
                        </StyledTableCell>
                        <StyledTableCell align="right" width="15%">
                          Action
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {bubut.consume
                        ? bubut.consume.map((row, index) => (
                            <StyledTableRow key={row.product_id}>
                              <StyledTableCell
                                align="left"
                                component="a"
                                scope="row"
                              >
                                <FormControl
                                  className={classes.formControl}
                                  error
                                >
                                  <AutoCProduct
                                    key={row.product_id}
                                    id="product"
                                    name="product"
                                    label="Product"
                                    row={row}
                                    change={(event, val) =>
                                      changeProduct(event, val, index)
                                    }
                                    disabled
                                  />
                                  <FormHelperText>
                                    {!bubut.productId ? 'Required' : ''}
                                  </FormHelperText>
                                </FormControl>
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                {row.location}
                              </StyledTableCell>
                              <StyledTableCell align="right">
                                <TextField
                                  type="number"
                                  id="outlined-basic"
                                  variant="outlined"
                                  InputProps={{
                                    classes: { input: classes.inputTable },
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        {row.uom}
                                      </InputAdornment>
                                    ),
                                  }}
                                  disabled
                                  size="medium"
                                  value={row.productQty}
                                  onChange={(e) => {
                                    const newData = bubut.consume;
                                    newData[index] = {
                                      ...newData[index],
                                      btg: e.target.value,
                                    };
                                    setBubut((prev) => ({
                                      ...prev,
                                      consume: newData,
                                    }));
                                  }}
                                />
                              </StyledTableCell>
                              <StyledTableCell
                                align="center"
                                component="a"
                                scope="row"
                              >
                                {row.saved && bubut.status === 'In Progress'
                                  ? delBil(row.id)
                                  : ''}
                              </StyledTableCell>
                            </StyledTableRow>
                          ))
                        : ''}
                    </TableBody>
                  </Table>
                </TableContainer>
                {bubut.status === 'In Progress' && !bubut.noConsume ? (
                  <Grid container spacing={3} justify="flex-end">
                    <Button
                      disabled={bubut.billetSaved}
                      onClick={() => {
                        saveBillet();
                      }}
                      className={classes.buttonSaveTab}
                    >
                      Save Consume
                    </Button>
                  </Grid>
                ) : (
                  ''
                )}
              </TabPanel>
              <TabPanel value={value} index={1}>
                <TableContainer component={Paper}>
                  <TextField
                    id="die"
                    label="Die"
                    value={product}
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                      readonly: true,
                    }}
                  />
                </TableContainer>
              </TabPanel>
            </Card>
          </Grid>
        </>
      </div>
    </>
  );
};

export default BubutPage;

BubutPage.propTypes = {
  setTitle: PropTypes.func.isRequired,
  setMsgBox: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
};
