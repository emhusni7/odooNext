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
import FormControl from '@material-ui/core/FormControl';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AlertDialog from '../components/dialog';
import AutoCProduct from '../components/AutoCProduct';
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
  const [potong, setPotong] = React.useState({
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
    error: '',
  });

  setTitle(potong.name || 'Potong');
  const [dialogopen, setOpen] = React.useState({ open: false, delid: 0 });

  const setDone = async () => {
    setMsgBox({
      variant: 'success',
      message: '',
    });
    setLoading(true);
    if (!potong.billetSaved) {
      await setTimeout(setLoading(false), 1000);
      setMsgBox({
        variant: 'error',
        message: 'Consume belum di save',
      });
    } else {
      const produce = await odoo.setStartPotong(potong);

      if (produce.faultCode) {
        setLoading(false);
        setMsgBox({ variant: 'error', message: produce.message });
      } else {
        setLoading(false);
        setPotong({
          ...potong,
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
    const moveLines = await odoo.setStartPotong(potong);
    if (!moveLines.faultCode) {
      setPotong({
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
      setPotong({ ...woOrder, date_start: woOrder.dateStart });
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
  // eslint-disable-next-line consistent-return
  const saveConsume = async () => {
    setMsgBox({ variant: 'success', message: '' });
    if (
      potong.consume.filter((x) => (x.lot_id === '' || !x.lot_id) && x.btg > 0)
        .length > 0
    ) {
      setMsgBox({ variant: 'error', message: 'Lot is Required' });
    } else {
      setLoading(true);
      const result = await odoo.saveConsume(
        potong.outputId,
        potong.moname,
        potong.date_start,
        productionId,
        potong.consume.filter((x) => x.saved === false && x.btg > 0)
      );
      if (!result.faultCode) {
        setMsgBox({ variant: 'success', message: 'Data Has Been Saved' });
        setPotong((prevState) => ({
          ...prevState,
          ...result,
        }));
      } else {
        setMsgBox({ variant: 'error', message: result.faultString });
      }
      setLoading(false);
    }
  };

  const changeProduct = (event, val, idx) => {
    const newData = potong.consume;
    newData[idx] = {
      ...newData[idx],
      product_id: val.id,
      product: val.name,
      product_uom: val.uomId,
      uom_id: val.uomId,
    };
    setPotong((prev) => ({
      ...prev,
      consume: newData,
    }));
  };

  const dialClose = () => {
    setOpen({ open: false, delid: 0 });
  };

  const remConsume = async (idx) => {
    setMsgBox({ variant: 'success', message: '' });
    setLoading(true);
    const res = await odoo.remBillet(potong.outputId, idx);
    if (!res.faultCode) {
      setPotong((prev) => ({
        ...prev,
        ...res,
      }));
    } else {
      setMsgBox({ variant: 'error', message: res.message });
    }
    setLoading(false);
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

  function a11yProps(index) {
    return {
      id: `scrollable-auto-tab-${index}`,
      'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
  }
  return (
    <>
      <Head>
        <title>Odoo App</title>
      </Head>

      <div className={classes.root}>
        <>
          <Grid container spacing={1}>
            <Grid item xs={3} md={3} sm={3}>
              <Paper className={classes.paper} elevation={0}>
                {potong.status === 'New' ? (
                  <Button onClick={() => inWork()}>Start</Button>
                ) : (
                  ''
                )}
              </Paper>
            </Grid>

            <Grid item xs={3} md={3} sm={3}>
              <Paper className={classes.paper} elevation={0}>
                {potong.status === 'In Progress' ? (
                  <Button onClick={() => setDone()}>End</Button>
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
                    potong.date_start
                      ? OdooLib.formatDateTime(potong.date_start)
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
                    potong.date_finished
                      ? OdooLib.formatDateTime(potong.date_finished)
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
                  value={potong.moname}
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
                  indicatorColor="primary"
                  textColor="primary"
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
                        <StyledTableCell align="left" width="40%">
                          Product
                        </StyledTableCell>
                        <StyledTableCell align="left" width="15%">
                          LOT
                        </StyledTableCell>
                        <StyledTableCell align="left" width="15%">
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
                      {potong.consume
                        ? potong.consume.map((row, index) => (
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
                                </FormControl>
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
                                  isRequired
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
                                      const cons = potong.consume;
                                      const dataC = cons[index];
                                      dataC.lot_id = val.id;
                                      dataC.lot_name = val.name;
                                      cons[index] = dataC;
                                      setPotong({
                                        ...potong,
                                        consume: cons,
                                      });
                                    } else {
                                      const cons = potong.consume;
                                      const dataC = cons[index];
                                      dataC.lot_id = '';
                                      dataC.lot_name = '';
                                      cons[index] = dataC;
                                      setPotong({
                                        ...potong,
                                        consume: cons,
                                      });
                                    }
                                  }}
                                  disabled={row.saved}
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
                                        setPotong((prevState) => {
                                          //   error: "",
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
                                  size="medium"
                                  disabled={row.saved}
                                  value={row.btg}
                                  onChange={(e) => {
                                    const newData = potong.consume;
                                    newData[index] = {
                                      ...newData[index],
                                      btg: e.target.value,
                                    };
                                    setPotong((prev) => ({
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
                                {row.saved && potong.status === 'In Progress'
                                  ? delBil(row.id)
                                  : ''}
                              </StyledTableCell>
                            </StyledTableRow>
                          ))
                        : ''}
                    </TableBody>
                  </Table>
                </TableContainer>
                {potong.status === 'In Progress' ? (
                  <Grid container spacing={3} justify="flex-end">
                    <Button
                      disabled={potong.billetSaved}
                      onClick={() => {
                        saveConsume();
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
