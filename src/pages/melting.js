/* eslint-disable no-alert */
import React, { useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import Head from 'next/dist/next-server/lib/head';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { useRouter } from 'next/router';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import IconButton from '@material-ui/core/IconButton';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputAdornment from '@material-ui/core/InputAdornment';
import DateTimePicker from 'react-datetime';
import moment from 'moment';

import CalcDialog from './calculate';
import AutoCProduct from '../components/AutoCProduct';
import AlertDialog from '../components/dialog';
import OdooLib from '../models/odoo';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#0b4be0',
    color: theme.palette.common.white,
    fontWeight:'bold',
    fontSize: 17,
  },
  body: {
    fontSize: 14,
    fontWeight: "bold",
    color:'#000',
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
}))(TableRow);

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

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles({
  table: {
    minWidth: 100,
  },
  root: {
    flexGrow: 1,
    marginLeft: '10px',
    marginRight: '10px',
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
    width: 90,
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

const MeltingPage = ({ setTitle, setMsgBox, setLoading }) => {
  const router = useRouter();
  const odoo = new OdooLib();

  const shiftId = Number(localStorage.getItem('shiftId'));
  const shiftName = localStorage.getItem('shiftName');
  const [options, setOptions] = React.useState([]);
  const [open, setOpenC] = React.useState(false);
  const { woId, productionId } = router.query;
  const [melting, setMelting] = React.useState({
    id: '',
    shiftId,
    machine: localStorage.getItem('meltingMchName'),
    mchID: Number(localStorage.getItem('meltingMchId')),
    consume: [],
    produce: [],
    note: '',
    lot: '',
  });
  setTitle(melting.name || 'Melting Production');
  const loading = open && options.length === 0;

  const [date, setDate] = React.useState({
    minDate: OdooLib.MinDateTime(new Date().toISOString()),
    maxDate: OdooLib.CurrentTime(new Date().toISOString()),
  });

  useEffect(() => {
    const getDate = async () => {
      const newDate = await odoo.getDateTolerance(new Date().toISOString());
      setDate({ ...date, minDate: newDate });
    };
    getDate();
  }, [date.minDate]);


  React.useEffect(() => {
    let active = true;
    (async () => {
      const dt = await odoo.getLocation();
      if (active) {
        setOptions(dt);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const setDone = async () => {
    setMsgBox({
      variant: 'success',
      message: '',
    });
    setLoading(true);
    if (
      melting.produce.filter((x) => !x.saved).length > 0 ||
      melting.produce.length <= 0
    ) {
      await setTimeout(setLoading(false), 1000);
      setMsgBox({
        variant: 'error',
        message: 'Product to Produce must be Saved and Required',
      });
    } else if (!melting.billetSaved || melting.consume.length <= 0) {
      await setTimeout(setLoading(false), 1000);
      setMsgBox({
        variant: 'error',
        message: 'Product to Consume must be Saved and Required',
      });
    } else {

      const produce = await odoo.endMelting(melting, OdooLib.OdooDateTime(melting.dateEnd));
      if (!produce.faultCode) {
        setMelting({
          ...melting,
          status: 'Done',
          dateEnd: melting.dateEnd,
        });
        setLoading(false);
        setMsgBox({ variant: 'success', message: 'Transaction Has Been Done' });
      } else {
        setLoading(false);
        await setTimeout(
          setMsgBox({ variant: 'error', message: produce.faultString }),
          1000
        );
      }
    }
  };

  const addProduce = async () => {
    setMsgBox({ variant: 'success', message: '' });
    const res = await odoo.addPMelting(melting.outputId);
    if (res.faultCode) {
      setMsgBox({ variant: 'error', message: res.message });
    } else {
      setMelting((prev) => ({
        ...prev,
        produce: [...prev.produce, res],
      }));
    }
  };

  const saveProduce = async () => {
    setLoading(true);
    setMsgBox({ variant: 'success', message: '' });
    const produce = await odoo.saveProduceMlt(
      melting.outputId,
      melting.produce
    );
    if (!produce.faultCode) {
      setLoading(false);
      setMelting({
        ...melting,
        produce,
        prdSaved: true,
      });
      setMsgBox({ variant: 'success', message: 'Data Has Been Saved' });
    } else {
      setLoading(false);
      setMsgBox({ variant: 'error', message: 'Transaction Error' });
    }
  };

  const inWork = async () => {
    setMsgBox({ variant: 'success', message: '' });
    setLoading(true);
    const moveLines = await odoo.startMelting(
      Number(woId),
      melting.mchID,
      melting.wcId,
      melting.shiftId,
      melting.note,
      OdooLib.OdooDateTime(melting.dateStart)
    );
   
    setLoading(false);
    if (!moveLines.faultCode) {
      setMelting((prevState) => ({
        ...prevState,
        ...moveLines,
          dateStart: melting.dateStart
        
      }));
    } else {
      setMsgBox({ variant: 'error', message: moveLines.message });
    }
  };

  const changeProduct = (event, val, idx) => {
    if (val) {
      const newData = melting.consume;
      newData[idx] = {
        ...newData[idx],
        product_id: val.id,
        product: val.name,
        product_uom: val.uomId,
        uom_id: val.uomId,
        uom: val.uom,
      };
      setMelting((prev) => ({
        ...prev,
        consume: newData,
      }));
    }
  };

  const changeProductProduce = (event, val, idx) => {
    if (val) {
      const newData = melting.produce;
      newData[idx] = {
        ...newData[idx],
        product_id: val.id,
        product: val.name,
        product_uom: val.uomId,
        uomId: val.uomId,
        uom: val.uom,
      };
      setMelting((prev) => ({
        ...prev,
        produce: newData,
      }));
    }
  };

  const addCMelting = async () => {
    setMsgBox({ variant: 'success', message: '' });
    const res = await odoo.addCMelting(melting.outputId);
    if (res.faultCode) {
      setMsgBox({ variant: 'error', message: res.message });
    } else {
      setMelting((prev) => ({
        ...prev,
        consume: [...prev.consume, res],
        billetSaved: false,
      }));
    }
  };

  const getListConsume = async () => {
    setMsgBox({ variant: 'success', message: '' });
    setLoading(true);
    const res = await odoo.getListCMlt(melting.outputId);
    setLoading(false);
    if (res.faultCode) {
      setMsgBox({ variant: 'error', message: res.message });
    } else {
      setMelting({
        ...melting,
        consume: res,
        billetSaved: false,
      });
    }
  };

  const saveCMlt = async () => {
    setMsgBox({ variant: 'success', message: '' });
    if (melting.consume.filter((x) => !x.product_id).length > 0) {
      setMsgBox({ variant: 'error', message: 'Product harus di Isi' });
    } else {
      setLoading(true);
      const result = await odoo.saveCMlt(
        melting.outputId,
        melting.moname,
        moment(melting.dateConsume, 'DD/MM/YYYY HH:mm:ss').format(
          'YYYY-MM-DD HH:mm:ss'
        ),
        productionId,
        melting.consume
      );
      setLoading(false);
      if (!result.faultCode) {
        setMsgBox({ variant: 'success', message: 'Data Has Been Saved' });
        setMelting((prevState) => ({
          ...prevState,
          consume: result,
          billetSaved: true,
        }));
      } else {
        setMsgBox({ variant: 'error', message: result.faultString });
      }
    }
  };

  const getWo = async () => {
    setLoading(true);
    const woOrder = await odoo.getWorkOrderMelting(woId);
    const NewWorder = {...woOrder, dateStart: OdooLib.formatDateTime(woOrder.dateStart), dateEnd: OdooLib.formatDateTime(woOrder.dateEnd)}
    setMelting((prevState) => ({ ...prevState, ...NewWorder }));
    setLoading(false);
  };

  useEffect(() => {
    getWo();
  }, []);

  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const remConsume = async (idx) => {
    setMsgBox({ variant: 'success', message: '' });
    setLoading(true);
    const res = await odoo.remCMlt(melting.outputId, idx);
    setLoading(false);
    if (!res.faultCode) {
      setMelting((prev) => ({
        ...prev,
        consume: res,
      }));
    } else {
      setMsgBox({ variant: 'error', message: res.message });
    }
  };

  const remProduce = async (idx) => {
    setMsgBox({ variant: 'success', message: '' });
    setLoading(true);
    const res = await odoo.remProduce(melting.outputId, idx);
    setLoading(false);
    if (!res.faultCode) {
      setMelting((prev) => ({
        ...prev,
        produce: res,
      }));
    } else {
      setMsgBox({ variant: 'error', message: res.message });
    }
  };

  const remPrd = async (index) => {
    const newData = [...melting.produce];
    newData.splice(index, 1);
    setMelting({
      ...melting,
      produce: newData,
    });
  };

  const remC = async (index) => {
    const newData = melting.consume;
    newData.splice(index, 1);
    setMelting({
      ...melting,
      consume: newData,
    });
  };

  const [dialogopen, setOpen] = React.useState({ open: false, delid: 0 });
  const dialClose = () => {
    setOpen({ open: false, delid: 0 });
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
          message="Yakin untuk menghapus Consume ?"
        />
      </IconButton>
    );
  };

  const delProduce = (moveId) => {
    return (
      <IconButton aria-label="delete">
        <DeleteOutlineIcon
          onClick={() => setOpen({ open: true, delid: moveId })}
        />
        <AlertDialog
          open={dialogopen.open}
          handleClose={dialClose}
          process={() => remProduce(dialogopen.delid)}
          title="Info"
          message="Yakin untuk menghapus Produce ?"
        />
      </IconButton>
    );
  };

  const delPrd = (index) => {
    return (
      <IconButton aria-label="delete">
        <DeleteOutlineIcon onClick={() => remPrd(index)} />
      </IconButton>
    );
  };

  const delConsume = (index) => {
    return (
      <IconButton aria-label="delete">
        <DeleteOutlineIcon onClick={() => remC(index)} />
      </IconButton>
    );
  };

  const pad = (num, size) => {
    let s = `${num}`;
    while (s.length < size) s = `0${s}`;
    return s;
  };

  const generateLot = () => {
    let i = 0;
    const prdc = melting.produce.map((pdc) => {
      if (pdc.dest_id !== melting.location_src_id) {
        i += 1;
        return {
          ...pdc,
          lot: `${melting.lot}-${pad(i, 2)}`,
        };
      }
      return {
        ...pdc,
        lot: '',
      };
    });
    setMelting({ ...melting, produce: prdc });
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const setCal = (mv, index, result) => {
    const prd = [...melting.produce];
    const dt = prd[index];
    dt.qty = result;
    dt.qty_billet = mv.btg;
    dt.length_billet = mv.length;
    prd[index] = dt;
    setMelting({
      ...melting,
      produce: prd,
    });
  };

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
                {melting.status === 'New' ? (
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
                {melting.status === 'In Progress' ? (
                  <Button variant="contained" onClick={() => setDone()}>
                    End
                  </Button>
                ) : (
                  ''
                )}
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={6} md={6} sm={6}>
              <Paper className={classes.paper} elevation={0}>
                <TextField
                  id="outlined-basic"
                  label="Machine Name"
                  value={melting.machine}
                  className={classes.textField}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    readOnly: true
                   
                  }}
                />
              </Paper>
            </Grid>

            <Grid item xs={6} md={6} sm={6}>
              <Paper className={classes.paper} elevation={0}>
              <TextField
                  id="dateStart"
                  label="Start Date"
                  type="datetime-local"
                  value={melting.dateStart ? melting.dateStart : ''}
                  onChange={(e) => 
                    setMelting({ ...melting, dateStart: e.target.value })
                  }
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    readOnly: melting.status === 'Done',
                    inputProps: {
                      min: date.minDate,
                      max: date.maxDate,
                    },
                  }}
                />
               
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={6} md={6} sm={6}>
              <Paper className={classes.paper} elevation={0}>
                <TextField
                  id="outlined-basic"
                  label="MO Number"
                  className={classes.textField}
                  value={melting.moname}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    readOnly: true
                   
                  }}
                />
              </Paper>
            </Grid>

            <Grid item xs={6} md={6} sm={6}>
              <Paper className={classes.paper} elevation={0}>
              <TextField
                  id="dateEnd"
                  label="End Date"
                  type="datetime-local"
                  value={melting.dateEnd ? melting.dateEnd : ''}
                  onChange={(e) => 
                    setMelting({ ...melting, dateEnd: e.target.value })
                  }
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    readOnly: melting.status === 'Done',
                    inputProps: {
                      min: date.minDate,
                      max: date.maxDate,
                    },
                  }}
                />
              </Paper>
            </Grid>
            <Grid item xs={6} md={6} sm={6}>
              <Paper className={classes.paper} elevation={0}>
                <TextField
                  id="shift"
                  label="Shift"
                  value={shiftName}
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    readOnly: true
                   
                  }}
               a
                />
              </Paper>
            </Grid>
            <Grid item xs={6} md={6} sm={6}>
              <Paper className={classes.paper} elevation={0}>
                <TextField
                  id="noLot"
                  label="Nomor Lot"
                  value={melting.lot}
                  onChange={(e) => {
                    setMelting({ ...melting, lot: e.target.value });
                  }}
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Paper>
            </Grid>
            <Grid item xs={6} md={6} sm={6}>
              <Paper className={classes.paper} elevation={0}>
                <DateTimePicker
                  value={melting.dateConsume}
                  onChange={(valDate) => {
                    setMelting((prev) => ({
                      ...prev,
                      dateConsume: valDate,
                    }));
                  }}
                  dateFormat="DD/MM/YYYY"
                  timeFormat="HH:mm"
                />
              </Paper>
            </Grid>
          </Grid>
          <br />
          <br />

          <Grid container spacing={1}>
            <Card className={classes.cardStyle} variant="outlined">
              <AppBar position="static" color="default">
                <Tabs
                  value={value}
                  onChange={handleChange}
                  // indicatorcolor="secondary"
                  textcolor="secondary"
                  variant="scrollable"
                  scrollButtons="auto"
                  aria-label="scrollable auto tabs example"
                >
                  <Tab label="To Consume" {...a11yProps(0)} />
                  <Tab label="To Produce" {...a11yProps(1)} />
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
                        <StyledTableCell align="center">
                          Product
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Location
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Quantity
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          To Consume
                        </StyledTableCell>
                        {melting.billetSaved ? (
                          <StyledTableCell align="center">Date</StyledTableCell>
                        ) : (
                          ''
                        )}

                        <StyledTableCell align="center">Uom</StyledTableCell>
                        <StyledTableCell align="center">Action</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {melting.consume
                        ? melting.consume.map((row, index) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <StyledTableRow key={index}>
                              <StyledTableCell align="left">
                                <AutoCProduct
                                  key={row.product_id}
                                  id="product"
                                  name="product"
                                  label="Product"
                                  disabled={!!row.id}
                                  row={row}
                                  change={(event, val) =>
                                    changeProduct(event, val, index)
                                  }
                                />
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {row.location}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                <TextField
                                  type="number"
                                  id="outlined-basic"
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                  value={row.productQty}
                                />
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                <TextField
                                  type="number"
                                  id="btg"
                                  name="btg"
                                  variant="outlined"
                                  value={row.btg}
                                  disabled={row.saved}
                                  InputProps={{
                                    classes: { input: classes.inputTable },
                                  }}
                                  onChange={(e) => {
                                    const newData = melting.consume;

                                    newData[index] = {
                                      ...newData[index],
                                      btg: e.target.value,
                                    };
                                    setMelting((prev) => ({
                                      ...prev,
                                      consume: newData,
                                    }));
                                  }}
                                  onFocus={() => {
                                    const newData = melting.consume;
                                    newData[index] = {
                                      ...newData[index],
                                      btg: '',
                                    };
                                    setMelting((prev) => ({
                                      ...prev,
                                      consume: newData,
                                    }));
                                  }}
                                />
                              </StyledTableCell>

                              {melting.billetSaved ? (
                                <StyledTableCell>
                                  {OdooLib.formatDateTime(row.date)}
                                </StyledTableCell>
                              ) : (
                                ''
                              )}

                              <StyledTableCell>{row.uom}</StyledTableCell>
                              <StyledTableCell align="center">
                                {row.saved && melting.status === 'In Progress'
                                  ? delBil(row.id)
                                  : ''}
                                {!row.saved && melting.status === 'In Progress'
                                  ? delConsume(index)
                                  : ''}
                              </StyledTableCell>
                            </StyledTableRow>
                          ))
                        : ''}
                    </TableBody>
                  </Table>
                </TableContainer>
                {melting.status === 'In Progress' ? (
                  <Grid container spacing={3} justify="flex-end">
                    <Button
                      variant="outlined"
                      color="secondary"
                      className={classes.buttonSaveTab}
                      onClick={() => {
                        addCMelting();
                      }}
                      disabled={melting.billetSaved}
                    >
                      Add Consume
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      className={classes.buttonSaveTab}
                      onClick={() => {
                        getListConsume();
                      }}
                      disabled={!melting.billetSaved}
                    >
                      List Consume
                    </Button>
                    <Button
                      variant="contained"
                      disabled={melting.billetSaved}
                      onClick={() => {
                        saveCMlt();
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
                  <Table
                    className={classes.table}
                    aria-label="customized table"
                  >
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="center">
                          Product
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Src Location
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Dest Location
                        </StyledTableCell>
                        {!melting.prdSaved ? (
                          <StyledTableCell align="center">Qty</StyledTableCell>
                        ) : (
                          ''
                        )}
                        <StyledTableCell align="center">Lot</StyledTableCell>
                        <StyledTableCell align="center">
                          Panjang
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Produce Qty
                        </StyledTableCell>
                        <StyledTableCell align="center">UoM</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {melting.produce
                        ? melting.produce.map((row, index) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <StyledTableRow key={index}>
                              <StyledTableCell align="left">
                                {row.id === 0 ? (
                                  <AutoCProduct
                                    key={row.product_id}
                                    id="productProduce"
                                    name="productProduce"
                                    label="Product"
                                    row={row}
                                    change={(event, val) =>
                                      changeProductProduce(event, val, index)
                                    }
                                  />
                                ) : (
                                  row.product
                                )}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {row.loc_src}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                <Autocomplete
                                  id="dest_loc_id"
                                  name="dest_loc_id"
                                  fullWidth="true"
                                  defaultValue={{
                                    id: row.dest_id,
                                    name: row.loc_dest,
                                  }}
                                  style={{ width: 200 }}
                                  onOpen={() => {
                                    setOpenC(true);
                                  }}
                                  onClose={() => {
                                    setOpenC(false);
                                  }}
                                  onChange={(e, val) => {
                                    if (val) {
                                      const newData = melting.produce;
                                      newData[index] = {
                                        ...newData[index],
                                        dest_id: val.id,
                                        loc_dest: val.name,
                                      };
                                      setMelting((prev) => ({
                                        ...prev,
                                        produce: newData,
                                      }));
                                    } else {
                                      const newData = melting.produce;
                                      newData[index] = {
                                        ...newData[index],
                                        dest_id: 0,
                                        loc_dest: '',
                                      };
                                      setMelting((prev) => ({
                                        ...prev,
                                        produce: newData,
                                      }));
                                    }
                                  }}
                                  disabled={
                                    row.saved || melting.status === 'Done'
                                  }
                                  getOptionSelected={(option, val) =>
                                    option.name === val.name
                                  }
                                  getOptionLabel={(option) => option.name}
                                  options={options}
                                  loading={loading}
                                  InputProps={{ isRequired: true }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Location"
                                      // error={!row.product_id}
                                      InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                          <>
                                            {loading ? (
                                              <CircularProgress
                                                color="inherit"
                                                size={20}
                                              />
                                            ) : null}
                                            {params.InputProps.endAdornment}
                                          </>
                                        ),
                                      }}
                                    />
                                  )}
                                />
                              </StyledTableCell>
                              {!melting.prdSaved ? (
                                <StyledTableCell align="center">
                                  {row.product_qty}
                                </StyledTableCell>
                              ) : (
                                ''
                              )}
                              <StyledTableCell align="center">
                                <TextField
                                  type="text"
                                  id="lot"
                                  variant="outlined"
                                  InputProps={{
                                    classes: { input: classes.inputTable },
                                  }}
                                  value={row.lot}
                                  disabled={melting.status === 'Done'}
                                  onChange={(e) => {
                                    const newData = melting.produce;

                                    newData[index] = {
                                      ...newData[index],
                                      lot: e.target.value,
                                    };
                                    setMelting((prev) => ({
                                      ...prev,
                                      produce: newData,
                                      savePrd: false,
                                    }));
                                  }}
                                />
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {row.length_billet}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                <TextField
                                  type="number"
                                  id="outlined-basic"
                                  variant="outlined"
                                  InputProps={{
                                    classes: { input: classes.inputTable },
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        {melting.status === 'Done' ||
                                        row.saved ||
                                        !row.product
                                          .toUpperCase()
                                          .includes('BILLET') ? (
                                          ''
                                        ) : (
                                          <CalcDialog
                                            row={{
                                              productId:
                                                melting.produce[index]
                                                  .product_id,
                                              length: 0,
                                              btg: 0,
                                            }}
                                            act={setCal}
                                            idx={index}
                                            setLoading={setLoading}
                                          />
                                        )}
                                      </InputAdornment>
                                    ),
                                  }}
                                  value={row.qty}
                                  disabled={
                                    melting.status === 'Done' ||
                                    row.saved ||
                                    row.product.toUpperCase().includes('BILLET')
                                  }
                                  onChange={(e) => {
                                    const newData = melting.produce;

                                    newData[index] = {
                                      ...newData[index],
                                      qty: e.target.value,
                                    };
                                    setMelting((prev) => ({
                                      ...prev,
                                      produce: newData,
                                      savePrd: false,
                                    }));
                                  }}
                                  onFocus={() => {
                                    const newData = melting.produce;

                                    newData[index] = {
                                      ...newData[index],
                                      qty: '',
                                    };
                                    setMelting((prev) => ({
                                      ...prev,
                                      produce: newData,
                                    }));
                                  }}
                                />
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {row.uom}
                                {melting.status === 'In Progress' && row.saved
                                  ? delProduce(row.id)
                                  : ''}
                                {melting.status === 'In Progress' && !row.saved
                                  ? delPrd(index)
                                  : ''}
                              </StyledTableCell>
                            </StyledTableRow>
                          ))
                        : ''}
                    </TableBody>
                  </Table>
                </TableContainer>
                {melting.status === 'In Progress' ? (
                  <Grid container spacing={3} justify="flex-end">
                    <Button
                      variant="outlined"
                      color="secondary"
                      className={classes.buttonSaveTab}
                      onClick={() => {
                        generateLot();
                      }}
                    >
                      Generate Lot
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      className={classes.buttonSaveTab}
                      onClick={() => {
                        addProduce();
                      }}
                      disabled={melting.status === 'Done'}
                    >
                      Add Produce
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      className={classes.buttonSaveTab}
                      disabled={
                        melting.prdSaved &&
                        melting.produce.filter((x) => !x.saved).length < 1
                      }
                      onClick={() => {
                        saveProduce();
                      }}
                    >
                      Save Produce
                    </Button>
                  </Grid>
                ) : (
                  ''
                )}
                <Grid container spacing={3}>
                  <Grid item xs={3} sm={3}>
                    <Paper className={classes.paperConsumeBottom} elevation={0}>
                      <TextField
                        variant="outlined"
                        label="Note"
                        value={melting.note}
                        disabled={melting.status === 'Done'}
                        onChange={(e) => {
                          setMelting({
                            ...melting,
                            note: e.target.value,
                          });
                        }}
                        className={classes.textField}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Paper>
                  </Grid>
                </Grid>
              </TabPanel>
            </Card>

            <Grid container spacing={3} />
          </Grid>
        </>
      </div>
    </>
  );
};

export default MeltingPage;

MeltingPage.propTypes = {
  setTitle: PropTypes.func.isRequired,
  setMsgBox: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
};
