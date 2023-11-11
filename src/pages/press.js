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
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import AlertDialog from '../components/dialog';
import PotBillet from './potBillet';
import OdooLib from '../models/odoo';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#0b4be0',
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

const PressPage = ({ setTitle, setMsgBox, setLoading }) => {
  const router = useRouter();
  const odoo = new OdooLib();
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

  const shiftName = localStorage.getItem('shiftName');
  const { woId, productionId } = router.query;
  const mchID = Number(localStorage.getItem('pressMchId'));
  const [press, setPress] = React.useState({
    id: '',
    shiftId: Number(localStorage.getItem('shiftId')),
    machine: localStorage.getItem('pressMchName'),
    mchID: Number(localStorage.getItem('pressMchId')),
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
    isRecal: false,
  });

  setTitle(press.name || 'Press Production');

  const setDone = async () => {
    setMsgBox({
      variant: 'success',
      message: '',
    });
    setLoading(true);
    if (!press.savePrd) {
      await setTimeout(setLoading(false), 1000);
      setMsgBox({
        variant: 'error',
        message: 'Product to Produce must be Saved',
      });
    } else if (press.problem && !press.statusCorr) {
      await setTimeout(setLoading(false), 1000);
      setMsgBox({
        variant: 'error',
        message: 'Problem Corrective filled but not Clik Button',
      });
    } else if (!press.isRecal) {
      await setTimeout(setLoading(false), 1000);
      setMsgBox({
        variant: 'error',
        message: 'Press Belum di Recalculate',
      });
    } else {
      const produce = await odoo.endPress({
        ...press,
        mchID,
        dateStart: OdooLib.OdooDateTime(press.dateStart),
        dateEnd: OdooLib.OdooDateTime(press.dateEnd),
      });
      if (!produce.faultCode) {
        setPress({
          ...press,
          status: 'Done',
          dateEnd: OdooLib.formatDateTime(produce.date_finished),
          weight_std: produce.total_std_weight,
          weight_act: produce.total_act_weight,
          under_weight: produce.uo_weight,
          recovery: produce.recovery,
          total_length: produce.total_length,
          kg: produce.weight_per_length,
          kg_hour: produce.production_rate,
        });

        setLoading(false);
        setMsgBox({ variant: 'success', message: 'Transaction Has Been Done' });
      } else {
        await setTimeout(setLoading(false), 1000);
        setMsgBox({ variant: 'error', message: produce.faultString });
      }
    }
  };

  const addRoll = async () => {
    setMsgBox({ variant: 'success', message: '' });
    const res = await odoo.addRoll(press.outputId);
    if (res.faultCode) {
      setMsgBox({ variant: 'error', message: res.message });
    } else {
      setPress((prev) => ({
        ...prev,
        produce: [...prev.produce, res],
      }));
    }
  };

  const addBattScrap = async () => {
    setMsgBox({ variant: 'success', message: '' });
    const res = await odoo.addBattScrap(press.outputId);
    if (res.faultCode) {
      setMsgBox({ variant: 'error', message: res.message });
    } else {
      setPress((prev) => ({
        ...prev,
        produce: [...prev.produce, ...res],
      }));
    }
  };

  const saveProduce = async () => {
    setLoading(true);
    setMsgBox({ variant: 'success', message: '' });
    const produce = await odoo.saveProducePress(press.outputId, press.produce);
    if (!produce.faultCode) {
      setLoading(false);
      setPress({
        ...press,
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
      mchID,
      press.wcId,
      press.shiftId,
      press.dieId,
      press.lotBillet,
      press.note,
      OdooLib.OdooDateTime(press.dateStart)
    );
    if (!moveLines.faultCode) {
      const dtCons3 = moveLines.consume.map((x) => {
        return { ...x, date: press.dateStart };
      });
      setPress({
        ...moveLines,
        temp: 520,
        dateStart: press.dateStart,
        // eslint-disable-next-line no-nested-ternary
        dateEnd: press.dateEnd
          ? OdooLib.formatDateTime(press.dateEnd)
          : OdooLib.CurrentTime(new Date().toISOString()),
        consume: dtCons3,
      });
    } else {
      setLoading(false);
      setMsgBox({ variant: 'error', message: moveLines.message });
    }
    setLoading(false);
  };

  const recalculate = async () => {
    setMsgBox({ variant: 'success', message: '' });
    setLoading(true);
    const result = await odoo.recalculatePress(press);
    if (result.faultCode) {
      setMsgBox({ variant: 'error', message: result.message });
    } else {
      setPress((prev) => ({
        ...prev,
        weight_std: result.total_std_weight,
        weight_act: result.total_act_weight,
        under_weight: result.uo_weight,
        recovery: result.recovery,
        total_length: result.total_length,
        kg: result.weight_per_length,
        kg_hour: result.production_rate,
        isRecal: true,
      }));
    }
    setLoading(false);
  };

  const addBillet = async () => {
    setMsgBox({ variant: 'success', message: '' });
    const res = await odoo.addBillet(press.outputId);
    const result = { ...res, date: press.dateStart };
    if (res.faultCode) {
      setMsgBox({ variant: 'error', message: res.message });
    } else {
      setPress((prev) => ({
        ...prev,
        consume: [...prev.consume, result],
        billetSaved: false,
      }));
    }
  };

  const addPotBillet = async (row, typeId, length, btg, qty, idx) => {
    setLoading(true);
    const res = await odoo.addPotBillet(
      row,
      typeId,
      length,
      btg,
      qty,
      press.moname,
      press.outputId
    );
    setLoading(false);
    if (!res.faultCode) {
      setPress((prevState) => {
        const consume = [...prevState.consume];
        const dtCons = consume[idx];
        consume[idx] = { ...dtCons, potBil: res };
        return { ...prevState, consume };
      });
    } else {
      setMsgBox({ variant: 'error', message: res.message });
    }

    return res;
  };

  const saveBillet = async () => {
    setMsgBox({ variant: 'success', message: '' });
    setLoading(true);
    const dtCons = press.consume.filter(
      (x) => x.saved === false && x.btg * x.length > 0
    );
    const result = await odoo.saveBillet(
      press.outputId,
      press.moname,
      dtCons
        ? OdooLib.OdooDateTime(dtCons[0].date)
        : OdooLib.OdooDateTime(press.dateStart),
      productionId,
      dtCons
    );
    if (!result.faultCode) {
      setMsgBox({ variant: 'success', message: 'Data Has Been Saved' });
      const dtCons2 = press.consume.map((x) => {
        return { ...x, date: x.date };
      });
      setPress({
        ...press,
        consume: dtCons2,
        billetSaved: result.billetSaved,
      });
    } else {
      setMsgBox({ variant: 'error', message: result.faultString });
    }
    setLoading(false);
  };

  const saveCorr = async (die, pr, problem) => {
    setLoading(true);
    setMsgBox({ variant: 'success', message: '' });
    if (!problem) {
      await setTimeout(setLoading(false), 1000);
      setMsgBox({ variant: 'error', message: 'Problem must be Defined' });
    } else {
      const corr = await odoo.saveCorr(die, pr, problem);
      if (!corr.faultCode) {
        setPress({
          ...press,
          statusCorr: true,
        });
        setLoading(false);
        setMsgBox({
          variant: 'success',
          message: 'Corrective Has Been Created',
        });
      } else {
        setLoading(false);
        setMsgBox({ variant: 'error', message: corr.faultString });
      }
    }
  };

  const getWo = async () => {
    setLoading(true);
    const woOrder = await odoo.getWorkOrder(woId);
    const arrCons = woOrder.consume
      ? woOrder.consume.map((x) => {
          return {
            ...x,
            date: x.date
              ? OdooLib.formatDateTime(x.date)
              : OdooLib.formatDateTime(woOrder.dateStart),
          };
        })
      : [];
    const newWo = {
      ...woOrder,
      dateStart: woOrder.dateStart
        ? OdooLib.formatDateTime(woOrder.dateStart)
        : OdooLib.CurrentTime(new Date().toISOString()),
      // eslint-disable-next-line no-nested-ternary
      dateEnd: woOrder.dateEnd
        ? OdooLib.formatDateTime(woOrder.dateEnd)
        : woOrder.status !== 'New'
        ? OdooLib.CurrentTime(new Date().toISOString())
        : false,
      consume: arrCons,
    };
    console.log(newWo)
    setPress({
      ...press,
      ...newWo,
    });
    setLoading(false);
  };

  useEffect(() => {
    getWo();
  }, []);

  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const remConsume = async (idx) => {
    setMsgBox({ variant: 'success', message: '' });
    const res = await odoo.remBillet(press.outputId, idx);
    const result = res.consume.map((x) => {
      return {
        ...x,
        date: OdooLib.formatDateTime(x.date ? x.date : press.dateStart),
      };
    });
    res.consume = result;
    if (!res.faultCode) {
      setPress((prev) => ({
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

  const [options, setOptions] = React.useState([]);
  const [open, setOpenC] = React.useState(false);
  const [load, setload] = React.useState(false);
  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

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
                {press.status === 'New' ? (
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
                {press.status === 'In Progress' ? (
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
                  value={press.machine}
                  className={classes.textField}
                  InputLabelProps={{ shrink: true }}
                  disabled
                />
              </Paper>
            </Grid>

            <Grid item xs={6} md={6} sm={6}>
              <Paper className={classes.paper} elevation={0}>
                <TextField
                  id="dateStart"
                  label="Start Date"
                  type="datetime-local"
                  value={press.dateStart ? press.dateStart : ''}
                  onChange={(e) => {
                    setPress({ ...press, dateStart: e.target.value });
                  }}
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    readOnly: press.status === 'Done',
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
                  value={press.moname}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ readOnly: true }}
                />
              </Paper>
            </Grid>

            <Grid item xs={6} md={6} sm={6}>
              <Paper className={classes.paper} elevation={0}>
                <TextField
                  id="dateFinish"
                  label="End Date"
                  type="datetime-local"
                  value={press.dateEnd ? press.dateEnd : ''}
                  onChange={(e) => {
                    setPress({
                      ...press,
                      dateEnd: e.target.value,
                    });
                  }}
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    readOnly: press.status !== 'In Progress',
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
                  value={Number(press.qty_outs).toFixed(2)}
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
                {press.dies ? (
                  <Autocomplete
                    options={press.dies}
                    value={
                      press.dies.filter((x) => x.id === press.dieId).length > 0
                        ? press.dies.filter((x) => x.id === press.dieId)[0]
                        : {}
                    }
                    getOptionLabel={(option) => option.default_code}
                    onChange={async (event, val) => {
                      if (val) {
                        setLoading(true);
                        setMsgBox({ variant: 'success', message: '' });
                        const res = await odoo.changeDie(
                          press.outputId,
                          val.id,
                          Number(productionId)
                        );
                        if (!res.faultCode) {
                          setPress({
                            ...press,
                            die: val.default_code,
                            dieId: val.id,
                          });
                        } else {
                          setMsgBox({
                            variant: 'error',
                            message: res.message,
                          });
                        }
                        setLoading(false);
                      }
                    }}
                    id="die"
                    disabled={
                      press.status === 'Done' ||
                      press.status === 'In Progress' ||
                      press.disabled
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        style={{ width: '100%' }}
                        label="Die"
                      />
                    )}
                  />
                ) : (
                  ''
                )}
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
                  {press.status !== 'New' ? (
                    <Tab label="Corective" {...a11yProps(2)} />
                  ) : (
                    ''
                  )}
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
                          Date Consume
                        </StyledTableCell>
                        <StyledTableCell align="center">Lot</StyledTableCell>
                        <StyledTableCell align="center">Length</StyledTableCell>
                        <StyledTableCell align="center">Batang</StyledTableCell>
                        <StyledTableCell align="center" colSpan="2">
                          Action
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {press.consume
                        ? press.consume.map((row, index) => (
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
                              <StyledTableCell align="left">
                                <TextField
                                  id="date"
                                  type="datetime-local"
                                  defaultValue={row.date}
                                  value={row.date}
                                  onChange={(e) => {
                                    const dtCons = press.consume;
                                    const consIdx = press.consume[index];
                                    consIdx.date = e.target.value;
                                    dtCons[index] = consIdx;
                                    setPress({
                                      ...press,
                                      consume: dtCons,
                                    });
                                  }}
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  InputProps={{
                                    readOnly: row.saved || press.billetSaved,
                                  }}
                                />
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                <Autocomplete
                                  id="lot_id"
                                  name="lot_id"
                                  style={{ width: 150 }}
                                  defaultValue={{
                                    id: row.lot_id,
                                    name: row.lot_name,
                                    product_id: row.product_id,
                                  }}
                                  value={{
                                    id: row.lot_id,
                                    name: row.lot_name,
                                    product_id: row.product_id,
                                  }}
                                  onOpen={() => {
                                    setOpenC(true);
                                  }}
                                  onClose={() => {
                                    setOpenC(false);
                                  }}
                                  onChange={(e, val) => {
                                    if (val) {
                                      const cons = press.consume;
                                      const dataC = cons[index];
                                      dataC.lot_id = val.id;
                                      dataC.lot_name = val.name;
                                      cons[index] = dataC;
                                      setPress({
                                        ...press,
                                        consume: cons,
                                      });
                                    } else {
                                      const cons = press.consume;
                                      const dataC = cons[index];
                                      dataC.lot_id = '';
                                      dataC.lot_name = '';
                                      cons[index] = dataC;
                                      setPress({
                                        ...press,
                                        consume: cons,
                                      });
                                    }
                                  }}
                                  disabled={row.saved || press.billetSaved}
                                  getOptionSelected={(option, val) =>
                                    option.name === val.name
                                  }
                                  getOptionLabel={(option) => option.name}
                                  options={options}
                                  loading={load}
                                  InputProps={{ isRequired: true }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Lot"
                                      margin="dense"
                                      variant="outlined"
                                      className={classes.comboBoxType}
                                      fullWidth={15}
                                      value={row.lot_name}
                                      onChange={async (e) => {
                                        const name = e.target.value;
                                        setPress((prevState) => {
                                          const consume = [
                                            ...prevState.consume,
                                          ];
                                          consume[index].lot_name = name;
                                          return { ...prevState, consume };
                                        });
                                        setload(true);
                                        const dt = await odoo.getLotPress(
                                          row.product_id ? row.product_id : 0,
                                          row.loc_id ? row.loc_id : 0,
                                          e.target.value
                                        );
                                        setOptions(dt);
                                        setload(false);
                                      }}
                                    />
                                  )}
                                />
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                <TextField
                                  type="number"
                                  id="outlined-basic"
                                  variant="outlined"
                                  InputProps={{
                                    classes: { input: classes.inputTable },
                                  }}
                                  disabled={row.saved || press.billetSaved}
                                  value={row.length}
                                  onChange={(e) => {
                                    const newData = press.consume;

                                    newData[index] = {
                                      ...newData[index],
                                      length: e.target.value,
                                    };
                                    setPress((prev) => ({
                                      ...prev,
                                      consume: newData,
                                    }));
                                  }}
                                  onFocus={() => {
                                    const newData = press.consume;
                                    newData[index] = {
                                      ...newData[index],
                                      length: '',
                                    };
                                    setPress((prev) => ({
                                      ...prev,
                                      consume: newData,
                                    }));
                                  }}
                                />
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                <Fab
                                  size="small"
                                  className={classes.buttonMinus}
                                  aria-label="remove"
                                  onClick={() => {
                                    const newData = press.consume;

                                    newData[index] = {
                                      ...newData[index],
                                      btg: Number(newData[index].btg) - 1,
                                    };
                                    setPress((prev) => ({
                                      ...prev,
                                      consume: newData,
                                    }));
                                  }}
                                  disabled={row.saved || press.billetSaved}
                                >
                                  <RemoveIcon />
                                </Fab>
                                <TextField
                                  type="number"
                                  id="btg"
                                  name="btg"
                                  variant="outlined"
                                  value={row.btg}
                                  disabled={row.saved || press.billetSaved}
                                  InputProps={{
                                    classes: { input: classes.inputTable },
                                  }}
                                  onChange={(e) => {
                                    const newData = press.consume;

                                    newData[index] = {
                                      ...newData[index],
                                      btg: e.target.value,
                                    };
                                    setPress((prev) => ({
                                      ...prev,
                                      consume: newData,
                                    }));
                                  }}
                                  onFocus={() => {
                                    const newData = press.consume;
                                    newData[index] = {
                                      ...newData[index],
                                      btg: '',
                                    };
                                    setPress((prev) => ({
                                      ...prev,
                                      consume: newData,
                                    }));
                                  }}
                                />
                                <Fab
                                  size="small"
                                  className={classes.buttonPlus}
                                  aria-label="add"
                                  disabled={row.saved || press.billetSaved}
                                  onClick={() => {
                                    const newData = press.consume;

                                    newData[index] = {
                                      ...newData[index],
                                      btg: Number(newData[index].btg) + 1,
                                    };
                                    setPress((prev) => ({
                                      ...prev,
                                      consume: newData,
                                    }));
                                  }}
                                >
                                  <AddIcon />
                                </Fab>
                              </StyledTableCell>
                              <StyledTableCell
                                align="center"
                                component="a"
                                scope="row"
                              >
                                {press.status === 'Done' && !row.potBil ? (
                                  <PotBillet
                                    row={row}
                                    act={addPotBillet}
                                    idx={index}
                                  />
                                ) : (
                                  row.potBil
                                )}
                              </StyledTableCell>
                              <StyledTableCell
                                align="center"
                                component="a"
                                scope="row"
                              >
                                {(row.saved || press.billetSaved) &&
                                press.status === 'In Progress'
                                  ? delBil(row.id)
                                  : ''}
                              </StyledTableCell>
                            </StyledTableRow>
                          ))
                        : ''}
                    </TableBody>
                  </Table>
                </TableContainer>
                {press.status === 'In Progress' ? (
                  <Grid container spacing={3} justify="flex-end">
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.buttonSaveTab}
                      onClick={() => {
                        addBillet();
                      }}
                      disabled={!press.billetSaved}
                    >
                      Add Billet
                    </Button>
                    <Button
                      variant="contained"
                      disabled={press.billetSaved}
                      onClick={() => {
                        saveBillet();
                      }}
                      className={classes.buttonSaveTab}
                    >
                      Save Billet
                    </Button>
                  </Grid>
                ) : (
                  ''
                )}

                <Grid container spacing={3}>
                  <Grid item xs={3} sm={3}>
                    <Paper className={classes.paper} elevation={0}>
                      <TextField
                        variant="outlined"
                        type="number"
                        id="sample"
                        name="sample"
                        label="Sample"
                        disabled={press.status === 'Done'}
                        className={classes.textField}
                        value={press.sample}
                        InputLabelProps={{ shrink: true }}
                        onChange={(event) => {
                          setPress({
                            ...press,
                            sample: Number(event.target.value),
                          });
                        }}
                      
                      />
                    </Paper>
                  </Grid>

                  <Grid item xs={3} sm={3}>
                    <Paper className={classes.paper} elevation={0}>
                      <TextField
                        variant="outlined"
                        type="number"
                        id="presure"
                        name="presure"
                        disabled={press.status === 'Done'}
                        label="Pressure"
                        className={classes.textField}
                        value={press.presure}
                        InputLabelProps={{ shrink: true }}
                        onChange={(e) =>
                          setPress({
                            ...press,
                            presure: Number(e.target.value),
                          })
                        }
                      
                      />
                    </Paper>
                  </Grid>

                  <Grid item xs={3} sm={3}>
                    <Paper className={classes.paperConsumeBottom} elevation={0}>
                      <TextField
                        variant="outlined"
                        type="number"
                        label="Lot Billet"
                        disabled={press.status === 'Done'}
                        value={press.lotBillet}
                        onChange={(e) => {
                          setPress({
                            ...press,
                            lotBillet: parseFloat(e.target.value, 10),
                          });
                        }}
                        
                        className={classes.textField}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Paper>
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={3} sm={3}>
                    <Paper className={classes.paperConsumeBottom} elevation={0}>
                      <TextField
                        variant="outlined"
                        type="number"
                        id="ramSpeed"
                        name="ramSpeed"
                        disabled={press.status === 'Done'}
                        label="Ram Speed"
                        value={press.rarm_speed}
                        className={classes.textField}
                        InputLabelProps={{ shrink: true }}
                        onChange={(e) =>
                          setPress({
                            ...press,
                            rarm_speed: Number(e.target.value),
                          })
                        }
                       
                      />
                    </Paper>
                  </Grid>
                  <Grid item xs={3} sm={3}>
                    <Paper className={classes.paperConsumeBottom} elevation={0}>
                      <TextField
                        variant="outlined"
                        type="number"
                        id="temp"
                        name="temp"
                        disabled={press.status === 'Done'}
                        value={press.temp}
                        label="Temperature Exit"
                        onChange={(e) =>
                          setPress({
                            ...press,
                            temp: e.target.value,
                          })
                        }
                       
                        className={classes.textField}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Paper>
                  </Grid>
                  <Grid item xs={3} sm={3}>
                    <Paper className={classes.paperConsumeBottom} elevation={0}>
                      <TextField
                        variant="outlined"
                        type="number"
                        id="temp_billet"
                        name="temp_billet"
                        disabled={press.status === 'Done'}
                        value={press.temp_billet}
                        label="Temperature Billet"
                        onChange={(e) =>
                          setPress({
                            ...press,
                            temp_billet: e.target.value,
                          })
                        }
                       
                        className={classes.textField}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Paper>
                  </Grid>
                </Grid>
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
                      {press.produce
                        ? press.produce.map((row, index) => (
                            <StyledTableRow key={row.product}>
                              <StyledTableCell align="left">
                                {row.product}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {row.note === 'Roll' ? (
                                  <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    defaultValue={
                                      row.result_type === 'good' ? 2 : 1
                                    }
                                    value={row.roll_type}
                                    onChange={(e) => {
                                      e.preventDefault();
                                      const outs = [...press.produce];
                                      const out = { ...outs[index] };
                                      out.roll_type = e.target.value;
                                      outs[index] = out;
                                      setPress({
                                        ...press,
                                        produce: outs,
                                      });
                                    }}
                                  >
                                    <MenuItem value={1}>Roll Press</MenuItem>
                                    <MenuItem value={2}>Roll Oven</MenuItem>
                                  </Select>
                                ) : (
                                  row.result_type
                                )}
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
                                  disabled={press.status === 'Done'}
                                  onChange={(e) => {
                                    const newData = press.produce;

                                    newData[index] = {
                                      ...newData[index],
                                      qty: e.target.value,
                                    };
                                    setPress((prev) => ({
                                      ...prev,
                                      produce: newData,
                                      savePrd: false,
                                    }));
                                  }}
                                  onFocus={() => {
                                    const newData = press.produce;

                                    newData[index] = {
                                      ...newData[index],
                                      qty: '',
                                    };
                                    setPress((prev) => ({
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
                {press.status === 'In Progress' ? (
                  <Grid container spacing={3} justify="flex-end">
                    <Button
                      variant="contained"
                      className={classes.buttonSaveTab}
                      disabled={
                        press.produce.findIndex(
                          (x) => x.result_type === 'scrap'
                        ) > -1
                      }
                      onClick={() => {
                        addBattScrap();
                      }}
                    >
                      Add Batt Scrap
                    </Button>
                    <Button
                      variant="contained"
                      className={classes.buttonSaveTab}
                      disabled={
                        press.produce.findIndex((x) => x.note === 'Roll') > -1
                      }
                      onClick={() => {
                        addRoll();
                      }}
                    >
                      Add Roll
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
                        value={press.note}
                        disabled={press.status === 'Done'}
                        onChange={(e) => {
                          setPress({
                            ...press,
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
              <TabPanel value={value} index={2}>
                <Grid container spacing={1}>
                  <Grid item xs={6} md={6} sm={6}>
                    <Paper elevation={0}>
                      <div>{press.die ? press.die : ''}</div>
                    </Paper>
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={6} md={6} sm={6}>
                    <Paper elevation={0}>
                      <TextareaAutosize
                        size="medium"
                        aria-label="empty textarea"
                        placeholder="Problem"
                        rowsMin={5}
                        value={press.problem}
                        style={{ width: '100%' }}
                        disabled={press.statusCorr}
                        onChange={(e) => {
                          setPress({
                            ...press,
                            problem: e.target.value,
                          });
                        }}
                      />
                    </Paper>
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Button
                    variant="contained"
                    className={classes.buttonSaveTab}
                    onClick={() =>
                      saveCorr(press.dieId, press.outputId, press.problem)
                    }
                    disabled={press.statusCorr}
                  >
                    Create Corr
                  </Button>
                </Grid>
              </TabPanel>
            </Card>

            <Grid container spacing={3}>
              <Grid item xs={6} md={6} sm={6}>
                <Paper
                  className={classes.paper}
                  elevation={0}
                  style={{ marginTop: 20 }}
                >
                  {press.status === 'In Progress' ? (
                    <Button
                      variant="contained"
                      className={classes.buttonHover}
                      onClick={() => {
                        recalculate();
                      }}
                    >
                      RE-CALCULATE
                    </Button>
                  ) : (
                    ''
                  )}
                </Paper>
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs>
                <Paper className={classes.paperBottom} elevation={0}>
                  <TextField
                    id="weightStd"
                    name="weightStd"
                    value={press.weight_std}
                    label="weight STD (Kg)"
                    className={classes.textField}
                    InputLabelProps={{ shrink: true }}
                    disabled
                  />
                  <TextField
                    id="weight_act"
                    name="weight_act"
                    label="weight ACT (Kg)"
                    className={classes.textField}
                    value={press.weight_act}
                    InputLabelProps={{ shrink: true }}
                    disabled
                  />
                  <TextField
                    id="kgHour"
                    name="kgHour"
                    value={press.kg_hour}
                    label="Production (Kg/Hour)"
                    className={classes.textField}
                    InputLabelProps={{ shrink: true }}
                    disabled
                  />
                </Paper>
              </Grid>
              <Grid item xs>
                <Paper className={classes.paperBottom} elevation={0}>
                  <TextField
                    id="uoWeight"
                    name="uoWeight"
                    value={press.under_weight}
                    label="Under/Over Wh"
                    className={classes.textField}
                    InputLabelProps={{ shrink: true }}
                    disabled
                  />

                  <TextField
                    id="recovery"
                    name="recovery"
                    value={press.recovery}
                    label="Recovery (%)"
                    className={classes.textField}
                    InputLabelProps={{ shrink: true }}
                    disabled
                  />
                </Paper>
              </Grid>
              <Grid item xs>
                <Paper className={classes.paperBottom} elevation={0}>
                  <TextField
                    id="totalLength"
                    name="totalLength"
                    label="Total Length (M)"
                    value={press.total_length}
                    className={classes.textField}
                    InputLabelProps={{ shrink: true }}
                    disabled
                  />

                  <TextField
                    id="kg"
                    name="kg"
                    label="Kg / M"
                    value={press.kg}
                    className={classes.textField}
                    InputLabelProps={{ shrink: true }}
                    disabled
                  />
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </>
      </div>
    </>
  );
};

export default PressPage;

PressPage.propTypes = {
  setTitle: PropTypes.func.isRequired,
  setMsgBox: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
};
