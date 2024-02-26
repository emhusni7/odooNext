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
import AlertDialog from '../components/dialog';
import OdooLib from '../models/odoo';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#722076',
    color: theme.palette.common.white,
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
    width: 40,
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

const EtchingPage = ({ setTitle, setMsgBox, setLoading }) => {
  const router = useRouter();
  const odoo = new OdooLib();
  const [date, setDate] = React.useState({
    minDate: OdooLib.MinDateTime(new Date().toISOString()),
    maxDate: OdooLib.CurrentTime(new Date().toISOString()),
  });

  const shiftId = Number(localStorage.getItem('shiftId'));
  const shiftName = localStorage.getItem('shiftName');

  const { woId, productionId, type } = router.query;
  const mchId = () => {
    if (type === 'etching') {
      return localStorage.getItem('etchingMchId');
    }
    if (type === 'cutting_fab') {
      return localStorage.getItem('cuttingFabMchId');
    }
    return localStorage.getItem('chromateMchId');
  };

  const mchName = () => {
    if (type === 'etching') {
      return localStorage.getItem('etchingMchName');
    }
    if (type === 'cutting_fab') {
      return localStorage.getItem('cuttingFabMchName');
    }
    return localStorage.getItem('chromateMchName');
  };
  const [etching, setEtching] = React.useState({
    id: '',
    shiftId,
    machine: mchName(),
    mchID: Number(mchId()),
    consume: [],
    produce: [],
    weight_std: 0,
    weight_act: 0,
    under_weight: 0,
    recovery: 0,
    total_length: 0,
    kg: 0,
    kg_hour: 0,
    sample: 0,
    ramSpeed: 0,
    presure: 0,
    temp: 0,
    statusCorr: false,
    lotBillet: 0,
    note: '',
  });

  setTitle(etching.name || type.toUpperCase());

  const setDone = async () => {
    setMsgBox({
      variant: 'success',
      message: '',
    });
    setLoading(true);
    if (!etching.savePrd) {
      await setTimeout(setLoading(false), 1000);
      setMsgBox({
        variant: 'error',
        message: 'Product to Produce must be Saved',
      });
    } else if (
      !etching.billetSaved ||
      etching.consume.filter((x) => x.saved && x.btg > 0).length <= 0
    ) {
      await setTimeout(setLoading(false), 1000);
      setMsgBox({
        variant: 'error',
        message: 'Product to Consume must be Saved',
      });
    } else if (etching.problem && !etching.statusCorr) {
      await setTimeout(setLoading(false), 1000);
      setMsgBox({
        variant: 'error',
        message: 'Problem Corrective filled but not Clik Button',
      });
    } else {
      const produce = await odoo.endEtching({...etching,  
        dateStart: etching.dateStart !== '' ? OdooLib.OdooDateTime(etching.dateStart): '',
        dateEnd: etching.dateEnd !== '' ? OdooLib.OdooDateTime(etching.dateEnd): ''});
      if (!produce.faultCode) {
        setEtching({
          ...etching,
          status: 'Done',
        });

        setLoading(false);
        setMsgBox({ variant: 'success', message: 'Transaction Has Been Done' });
      } else {
        await setTimeout(setLoading(false), 1000);
        setMsgBox({ variant: 'error', message: produce.faultString });
      }
    }
  };

  const saveProduce = async () => {
    setLoading(true);
    setMsgBox({ variant: 'success', message: '' });
    console.log(etching.dateEnd)
    const produce = await odoo.saveProduceEtc(
      etching.outputId,
      etching.produce,
      etching.dateStart !== '' ? OdooLib.OdooDateTime(etching.dateStart): '',
      etching.dateEnd !== '' ? OdooLib.OdooDateTime(etching.dateEnd) : ''
    );
    if (!produce.faultCode) {
      setLoading(false);
      setEtching({
        ...etching,
        produce,
        savePrd: true,
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

    const moveLines = await odoo.createPress(
      Number(woId),
      etching.mchID,
      etching.wcId,
      etching.shiftId,
      etching.dieId,
      etching.lotBillet,
      etching.note
    );
    if (!moveLines.faultCode) {
      setEtching((prevState) => ({
        ...prevState,
        ...moveLines,
      }));
    } else {
      setLoading(false);
      setMsgBox({ variant: 'error', message: moveLines.message });
    }
    setLoading(false);
  };

  const saveBillet = async () => {
    setMsgBox({ variant: 'success', message: '' });
    setLoading(true);
    const result = await odoo.saveBillet(
      etching.outputId,
      etching.moname,
      OdooLib.OdooDateTime(etching.dateStart),
      productionId,
      etching.consume.filter((x) => x.saved === false && x.btg > 0)
    );
    if (!result.faultCode) {
      setMsgBox({ variant: 'success', message: 'Data Has Been Saved' });
      setEtching((prevState) => ({
        ...prevState,
        ...result,
      }));
    } else {
      setMsgBox({ variant: 'error', message: result.faultString });
    }
    setLoading(false);
  };

  const getWo = async () => {
    const woOrder = await odoo.getWorkOrder(woId);
    setEtching((prev) => ({
      ...prev,
      ...woOrder,
        dateStart: woOrder.dateStart !== ''
        ? OdooLib.formatDateTime(woOrder.dateStart)
        : '',
        dateEnd: woOrder.dateEnd !== ''
        ? OdooLib.formatDateTime(woOrder.dateEnd)
        : '',
      }));
  };

  useEffect(() => {
    const getDate = async () => {
      const newDate = await odoo.getDateTolerance(new Date().toISOString());
      setDate({ ...date, minDate: newDate });
    };
    getDate();
  }, [date.minDate]);

  useEffect(() => {
    getWo();
  }, []);

  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const remConsume = async (idx) => {
    setMsgBox({ variant: 'success', message: '' });
    const res = await odoo.remBillet(etching.outputId, idx);
    if (!res.faultCode) {
      setEtching((prev) => ({
        ...prev,
        ...res,
      }));
    } else {
      setMsgBox({ variant: 'error', message: res.message });
    }
  };

  const [dialogopen, setOpen] = React.useState({ open: false, delid: 0 });
  const dialClose = () => {
    setOpen({ open: false, delid: 0 });
  };

  const addScrap = async () => {
    setMsgBox({ variant: 'success', message: '' });
    const res = await odoo.addScrap(etching.outputId);
    if (res.faultCode) {
      setMsgBox({ variant: 'error', message: res.message });
    } else {
      setEtching((prev) => ({
        ...prev,
        produce: [...prev.produce, res],
      }));
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
                {etching.status === 'New' ? (
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
                {etching.status === 'In Progress' ? (
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
                  value={etching.machine}
                  className={classes.textField}
                  InputLabelProps={{ shrink: true }}
                  disabled
                />
              </Paper>
            </Grid>

            <Grid item xs={6} md={6} sm={6}>
              <Paper className={classes.paper} elevation={0}>
                <TextField
                    id="date_start"
                    label="Date Start"
                    type="datetime-local"
                    value={etching.dateStart ? etching.dateStart : false}
                    onChange={(e) => {
                       setEtching({ ...etching, dateStart: e.target.value });
                    }}
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      readOnly: etching.status !== 'In Progress',
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
                  value={etching.moname}
                  InputLabelProps={{ shrink: true }}
                  disabled
                />
              </Paper>
            </Grid>

            <Grid item xs={6} md={6} sm={6}>
              <Paper className={classes.paper} elevation={0}>
              <TextField
                        id="date_end"
                        label="Date End"
                        type="datetime-local"
                        value={etching.dateEnd ? etching.dateEnd : ''}
                        onChange={(e) => {
                          setEtching({...etching, dateEnd: e.target.value})
                        }}
                        className={classes.textField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          readOnly: etching.status !== 'In Progress',
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
                  disabled
                />
              </Paper>
            </Grid>
            <Grid item xs={6} md={6} sm={6}>
              <Paper className={classes.paper} elevation={0}>
                <TextField
                  id="qtyOut"
                  label="Qty Outs"
                  value={Number(etching.qty_outs).toFixed(2)}
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled
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
                  indicatorColor="primary"
                  textColor="primary"
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
                        <StyledTableCell align="center">Qty</StyledTableCell>
                        <StyledTableCell align="center">
                          Consume Qty
                        </StyledTableCell>
                        <StyledTableCell align="center">Uom</StyledTableCell>
                        <StyledTableCell align="center">Action</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {etching.consume
                        ? etching.consume.map((row, index) => (
                            <StyledTableRow key={row.product_id}>
                              <StyledTableCell
                                align="left"
                                component="a"
                                scope="row"
                              >
                                {row.product}
                              </StyledTableCell>
                              <StyledTableCell
                                align="left"
                                component="a"
                                scope="row"
                              >
                                {row.location}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {row.productQty}
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
                                    const newData = etching.consume;

                                    newData[index] = {
                                      ...newData[index],
                                      btg: parseFloat(e.target.value),
                                    };
                                    setEtching((prev) => ({
                                      ...prev,
                                      consume: newData,
                                    }));
                                  }}
                                  onFocus={() => {
                                    const newData = etching.consume;
                                    newData[index] = {
                                      ...newData[index],
                                      btg: '',
                                    };
                                    setEtching((prev) => ({
                                      ...prev,
                                      consume: newData,
                                    }));
                                  }}
                                />
                              </StyledTableCell>
                              <StyledTableCell>{row.uom}</StyledTableCell>
                              <StyledTableCell
                                align="center"
                                component="a"
                                scope="row"
                              >
                                {row.saved && etching.status === 'In Progress'
                                  ? delBil(row.id)
                                  : ''}
                              </StyledTableCell>
                            </StyledTableRow>
                          ))
                        : ''}
                    </TableBody>
                  </Table>
                </TableContainer>
                {etching.status === 'In Progress' ? (
                  <Grid container spacing={3} justify="flex-end">
                    <Button
                      variant="outlined"
                      
                      disabled={etching.billetSaved}
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
                  <Table
                    className={classes.table}
                    aria-label="customized table"
                  >
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="center">
                          Product
                        </StyledTableCell>
                        <StyledTableCell align="center">Type</StyledTableCell>
                        <StyledTableCell align="center">Qty</StyledTableCell>
                        <StyledTableCell align="center">UoM</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {etching.produce
                        ? etching.produce.map((row, index) => (
                            <StyledTableRow key={row.product}>
                              <StyledTableCell align="left">
                                {row.product}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {row.result_type}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                <TextField
                                  type="number"
                                  id="outlined-basic"
                                  variant="outlined"
                                  InputProps={{
                                    classes: { input: classes.inputTable },
                                  }}
                                  value={row.qty}
                                  disabled={etching.status === 'Done'}
                                  onChange={(e) => {
                                    const newData = etching.produce;

                                    newData[index] = {
                                      ...newData[index],
                                      qty: e.target.value,
                                    };
                                    setEtching((prev) => ({
                                      ...prev,
                                      produce: newData,
                                      savePrd: false,
                                    }));
                                  }}
                                  onFocus={() => {
                                    const newData = etching.produce;

                                    newData[index] = {
                                      ...newData[index],
                                      qty: '',
                                    };
                                    setEtching((prev) => ({
                                      ...prev,
                                      produce: newData,
                                    }));
                                  }}
                                />
                              </StyledTableCell>

                              <StyledTableCell align="center">
                                {row.uom}
                              </StyledTableCell>
                            </StyledTableRow>
                          ))
                        : ''}
                    </TableBody>
                  </Table>
                </TableContainer>
                {etching.status === 'In Progress' ? (
                  <Grid container spacing={3} justify="flex-end">
                    <Button
                      variant="outlined"
                      className={classes.buttonSaveTab}
                      disabled={etching.produce.length >= 2}
                      onClick={() => {
                        addScrap();
                      }}
                    >
                      add Scrap
                    </Button>
                    <Button
                      variant="contained"
                      className={classes.buttonSaveTab}
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
                        value={etching.note}
                        disabled={etching.status === 'Done'}
                        onChange={(e) => {
                          setEtching({
                            ...etching,
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
          </Grid>
        </>
      </div>
    </>
  );
};

export default EtchingPage;

EtchingPage.propTypes = {
  setTitle: PropTypes.func.isRequired,
  setMsgBox: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
};
