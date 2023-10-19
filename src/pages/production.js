/* eslint-disable react/require-default-props */
import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/dist/next-server/lib/head';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import TableRow from '@material-ui/core/TableRow';
import Router from 'next/router';
import OdooLib from '../models/odoo';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginLeft: '10px',
    marginRight: '10px',
  },
  table: {
    width: '100%',
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    borderRadius: 10,
  },
  iconButton: {
    padding: 10,
  },
  paper: {
    marginTop: 20,
    marginLeft: 20,
    fontSize: 20,
  },
  textField: {
    width: '100%',
    marginTop: 10,
  },
  button: {
    width: '100%',
    margin: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonCancel: {
    width: '100%',
    margin: 10,
    backgroundColor: 'red',
    fontWeight: 'bold',
    color: 'white',
  },
  paperButton: {
    marginTop: 10,
    fontSize: 20,
  },
  textFieldProduct: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '90%',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  textFieldType: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '30%',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  textFieldTypeInput: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '90%',
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(0),
    paddingBottom: 0,
    paddingTop: 0,
  },
  paperType: {
    padding: theme.spacing(2),
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: theme.palette.primary || 'red'
  },
}));

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    fontWeight: 'bold',
    color: state.isSelected ? 'white' : 'black',
    backgroundColor: state.isSelected ? 'blue' : 'white ',
    "&:hover": {
      backgroundColor: "#2574f4"
    }
  }),
  control: (provided) => ({
    ...provided,
    color: 'black',
    fontWeight: 'bold',
    borderColor: '#2574f4',
    marginTop: '3%',
  }),
  placeholder: (defaultStyles) => {
    return {
        ...defaultStyles,
        color: 'red',
    }
}
};

const prodDetail = ({ setTitle, setLoading, setMsgBox, loading }) => {
  const classes = useStyles();
  const odoo = new OdooLib();
  const [mvLine, setMvLine] = React.useState({
    productId: 0,
    productName: '--Product--',
    lotId: 0,
    lotName: '---Lot---',
    uomId: false,
    locId: 0,
    typeId: 0,
    qty: 0,
    qtyTotal: 0,
    pickingId: false,
    typeError: '',
    productError: '',
    lotError: '',
    qtyError: '',
    qtyTotalError: '',
    lines: [],
    consume: [],
    reportId: false,
    reportLabel: false,
    reportError: '',
    qtyMultiply: 1,
  });
  const [opt, setOpt] = React.useState({
    optionsLoaded: false,
    options: [],
    isLoading: false,
  });

  const handleLoadOptions = async () => {
    const res = await odoo.getQuant('', mvLine.locId, mvLine.productId);
    setTimeout(() => {
      setOpt({
        optionsLoaded: true,
        options: res,
        isLoading: false,
      });
    }, 500);
  };

  const maybeLoadOptions = () => {
    if (!opt.optionsLoaded) {
      setOpt({ ...opt, isLoading: true });
      handleLoadOptions();
    }
  };

  const getFinished = async (pickId) => {
    setLoading(true);
    const result = await odoo.getFinished(pickId);
    let mv = false;
    if (result.consume) {
      // eslint-disable-next-line prefer-destructuring
      mv = result.consume[0];
    }
    const pickType = result.type;
    setTitle(result.name);
    setMvLine({
      ...mvLine,
      typeId: pickType.id,
      typeName: pickType.name,
      locId: pickType.default_location_src_id[0],
      locDestId: pickType.default_location_dest_id[0],
      locProdId: pickType.default_location_prod_id[0],
      pickingId: Number(localStorage.getItem('pickingId')),
      productId: mv ? mv.product_id[0] : 0,
      productName: mv ? mv.product_id[1] : '---Product---',
      uomId: mv ? mv.product_uom[0] : '',
      lines: result.moves.map((x) => {
        return {
          productQty: x.product_uom_qty,
          name: x.name,
          id: x.id,
          lot: x.restrict_lot_id[1],
        };
      }),
      consume: result.consume.map((x) => {
        return {
          productQty: x.product_uom_qty,
          name: x.name,
          id: x.id,
          lot: x.restrict_lot_id[1],
        };
      }),
    });
    setLoading(false);
  };

  React.useEffect(() => {
    let loc = localStorage.getItem('pickingId');
    if (!localStorage.getItem('shiftId') || !localStorage.getItem('lotMchId')) {
      Router.push({
        pathname: '/machine',
        query: { type: 'production' },
      });
    } else if (loc) {
      getFinished(loc);
    }
    return () => {
      loc = false;
    };
  }, []);
  const [disable, setDisable] = React.useState(false);
  const [validate, setValidate] = React.useState(false);
  const [printLoading, setPrintLoading] = React.useState(false);
  const filterValue = (inputValue) => odoo.getProductAll(inputValue);
  const reportValue = (inputVal) => odoo.getReportAll(inputVal);

  const pickingVal = () => odoo.getPickingTypeProd('Create Lot');
  const handleSubmit = async () => {
    setMsgBox({ variant: 'success', message: '' });
    if (!mvLine.reportId) {
      setMvLine({
        ...mvLine,
        reportError: 'Required',
      });
    } else {
      setLoading(true);
      setDisable(true);
      setPrintLoading(true);
      const res = await odoo.printSaved(
        mvLine.pickingId,
        // eslint-disable-next-line no-use-before-define
        TotalConsume,
        // eslint-disable-next-line no-use-before-define
        Total,
        mvLine.reportId,
        localStorage.getItem('odoo_print')
      );
      if (!res.faultCode) {
        setTitle(res.name);
        setMvLine((prev) => ({ ...prev, consume: res.lines }));
        setMsgBox({ variant: 'success', message: 'Data Has Been Saved' });
        setLoading(false);
        setValidate(true);
        setPrintLoading(false);
        localStorage.removeItem('pickingId');
      } else {
        setMsgBox({ variant: 'error', message: res.message });
        setLoading(false);
        setDisable(false);
      }
    }
  };

  const addPackingConsume = async () => {
    setMsgBox({ variant: 'success', message: '' });
    if (!mvLine.typeId) {
      setMvLine({ ...mvLine, typeError: 'required Field' });
    } else if (!mvLine.productId) {
      setMvLine({ ...mvLine, productError: 'required Field' });
    } else if (!mvLine.lotId) {
      setMvLine({ ...mvLine, lotError: 'required Field' });
    } else if (!mvLine.qtyTotal) {
      setMvLine({ ...mvLine, qtyTotalError: 'required Field' });
    } else {
      setLoading(true);
      const vals = await odoo.addPackingConsume(
        mvLine.pickingId,
        mvLine.typeId,
        mvLine.productId,
        mvLine.productName,
        mvLine.qtyTotal,
        mvLine.locId,
        mvLine.locDestId,
        mvLine.locProdId,
        mvLine.lotId,
        mvLine.uomId
      );
      if (!vals.faultCode) {
        if (!localStorage.getItem('pickingId')) {
          localStorage.setItem('pickingId', vals.pickingId);
        }
        setTitle(vals.name);
        setMvLine({
          ...mvLine,
          pickingId: vals.pickingId,
          consume: [
            ...mvLine.consume,
            {
              name: mvLine.productName,
              lot: mvLine.lotName,
              productQty: mvLine.qtyTotal,
              id: vals.moveId,
            },
          ],
        });
        setLoading(false);
        setMsgBox({ variant: 'success', message: 'Consume has been add' });
      } else {
        setLoading(false);
        setMsgBox({ variant: 'error', message: vals.message });
      }
    }
  };

  const actCancel = async () => {
    setLoading(true);
    const res = await odoo.actCancel(mvLine.pickingId);
    setLoading(false);
    if (!res.faultCode) {
      localStorage.removeItem('pickingId');
    } else {
      setMsgBox({ variant: 'error', message: res.message });
    }
    Router.reload();
  };

  const addPacking = async () => {
    setMsgBox({ variant: 'success', message: '' });
    if (!mvLine.qty) {
      setMvLine({ ...mvLine, qtyError: 'required Field' });
      // eslint-disable-next-line no-use-before-define
    } else if (TotalConsume < Total + mvLine.qty * mvLine.qtyMultiply) {
      await setTimeout(setLoading(false), 1000);
      setMsgBox({
        variant: 'error',
        message: 'Qty Over ',
      });
    } else {
      setLoading(true);
      const vals = await odoo.addPackingProduce(
        mvLine.pickingId,
        mvLine.typeId,
        mvLine.productId,
        mvLine.productName,
        mvLine.qty,
        mvLine.locId,
        mvLine.locDestId,
        mvLine.locProdId,
        mvLine.lotId,
        mvLine.uomId,
        mvLine.qtyMultiply
      );
      if (!vals.faultCode) {
        if (!localStorage.getItem('pickingId')) {
          localStorage.setItem('pickingId', vals.pickingId);
        }

        setMvLine({
          ...mvLine,
          pickingId: vals.pickingId,
          lines: [...mvLine.lines, ...vals.lines],
        });
        setLoading(false);
        setMsgBox({ variant: 'success', message: 'Data has been add' });
      } else {
        setLoading(false);
        setMsgBox({ variant: 'error', message: vals.message });
      }
    }
  };

  const Total = mvLine.lines
    ? mvLine.lines.reduce(
        (totalCalories, meal) => totalCalories + meal.productQty,
        0
      )
    : 0;

  const TotalConsume = mvLine.consume
    ? mvLine.consume.reduce(
        (totalCalories, meal) => totalCalories + meal.productQty,
        0
      )
    : 0;

  return (
    <>
      <Head>
        <title>Odoo Warehouse - List Rack</title>
      </Head>
      <div className={classes.root}>
        <form name="contactform" className="contactform">
          <Typography
            className={classes.textFieldProduct}
            style={{ mariginTop: 30 }}
          >
            <Grid container spacing={1}>
              <Grid item xs={4} md={4} sm={6}>
                {validate ? (
                  <Button
                    className={classes.button}
                    variant="outlined"
                    color="primary"
                    type="button"
                    onClick={() => Router.reload()}
                  >
                    Create
                  </Button>
                ) : (
                  ''
                )}
              </Grid>
            </Grid>
          </Typography>
          <Paper className={classes.paperType}>
            <Grid container spacing={1}>
              <Grid item xs={4} md={4} sm={12}>
                {localStorage.getItem('pickingId') ? (
                  <TextField
                    id="typeIdTest"
                    value={mvLine.typeName}
                    autoFocus
                    className={classes.textFieldProduct}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                ) : (
                  <AsyncSelect
                    id="pickingName"
                    name="pickingName"
                    cacheOptions
                    required
                    defaultOptions
                    placeholder="Picking Type"
                    styles={customStyles}
                    onChange={async (value) => {
                      if (value) {
                        setOpt({
                          ...opt,
                          options: [],
                          optionsLoaded: false,
                        });
                        setMvLine({
                          ...mvLine,
                          typeId: value.value,
                          typeName: value.label,
                          locId: value.locId[0],
                          locDestId: value.locDestId[0],
                          locProdId: value.locProdId[0],
                        });
                      }
                    }}
                    loadOptions={pickingVal}
                  />
                )}

                <div>
                  {mvLine.typeError && (
                    <div
                      style={{ fontSize: '12px', color: 'rgb(244, 67, 54)' }}
                    >
                      Required
                    </div>
                  )}
                </div>
              </Grid>
              <Grid item xs={4} md={4} sm={12}>
                <AsyncSelect
                  id="productName"
                  name="productName"
                  cacheOptions
                  required
                  defaultOptions
                  value={{
                    label: mvLine.productName,
                    value: mvLine.productId,
                    uomId: mvLine.uomId,
                  }}
                  isDisabled={disable || mvLine.consume.length > 0}
                  placeholder="Product"
                  styles={customStyles}
                  onChange={async (value) => {
                    if (value) {
                      setOpt({
                        ...opt,
                        options: [],
                        optionsLoaded: false,
                      });
                      setMvLine({
                        ...mvLine,
                        productId: value.value,
                        productName: value.label,
                        uomId: value.uom_id[0],
                        lotId: 0,
                        lotName: '---Lot---',
                        qty: 0,
                        qtyTotal: 0,
                      });
                    }
                  }}
                  loadOptions={filterValue}
                />
                <div>
                  {mvLine.productError && (
                    <div
                      style={{ fontSize: '12px', color: 'rgb(244, 67, 54)' }}
                    >
                      Required
                    </div>
                  )}
                </div>
              </Grid>
              <Grid item xs={4} md={4} sm={12}>
                <AsyncSelect
                  id="report"
                  name="report"
                  cacheOptions
                  required
                  defaultOptions
                  placeholder="Report"
                  onChange={async (value) => {
                    if (value) {
                      setMvLine({
                        ...mvLine,
                        reportId: value.value,
                        reportLabel: value.label,
                      });
                    }
                  }}
                  styles={customStyles}
                  loadOptions={reportValue}
                />
                <div>
                  {mvLine.reportError && (
                    <div
                      style={{ fontSize: '12px', color: 'rgb(244, 67, 54)' }}
                    >
                      Required
                    </div>
                  )}
                </div>
              </Grid>
            </Grid>
            <Grid container spacing={1}>
              <Grid item xs={4} md={4} sm={12}>
                <Select
                  id="lotName"
                  name="lotName"
                  searchable
                  isDisabled={disable}
                  required
                  placeholder="Lot"
                  styles={customStyles}
                  isLoading={opt.isLoading}
                  options={opt.options}
                  value={{
                    value: mvLine.lotId,
                    label: mvLine.lotName,
                    pack: mvLine.qty,
                    qty: mvLine.qtyTotal,
                  }}
                  onFocus={() => maybeLoadOptions()}
                  onChange={(value) => {
                    if (value) {
                      setMvLine({
                        ...mvLine,
                        lotId: value.value,
                        lotName: value.label,
                        qty: value.pack,
                        qtyTotal: value.qty,
                      });
                    }
                  }}
                />
                <div>
                  {mvLine.lotError && (
                    <div
                      style={{ fontSize: '12px', color: 'rgb(244, 67, 54)' }}
                    >
                      Required
                    </div>
                  )}
                </div>
              </Grid>
              <Grid item xs={2} md={2} sm={6}>
                <TextField
                  id="qtyTotal"
                  className={classes.textFieldTypeInput}
                  value={mvLine.qtyTotal}
                  onChange={(e) =>
                    setMvLine({ ...mvLine, qtyTotal: Number(e.target.value) })
                  }
                  onFocus={() => setMvLine({ ...mvLine, qtyTotal: '' })}
                  InputProps={{
                    readOnly: false,
                  }}
                  label="Qty Total"
                  type="number"
                />
                <div>
                  {mvLine.qtyTotalError && (
                    <div
                      style={{ fontSize: '12px', color: 'rgb(244, 67, 54)' }}
                    >
                      Required
                    </div>
                  )}
                </div>
              </Grid>
              <Grid item xs={4} md={4} sm={12}>
                <Button
                  variant="contained"
                  className={classes.button}
                  disabled={disable}
                  onClick={() => addPackingConsume()}
                >
                  Add Consume
                </Button>
              </Grid>
            </Grid>
            <Grid container style={{ marginTop: '5px' }} spacing={4}>
              <Grid item xs={12} md={12} sm={12}>
                <TableContainer component={Paper}>
                  <Table
                    className={classes.table}
                    size="small"
                    aria-label="a dense table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell align="left">Lot</TableCell>
                        <TableCell align="right">Qty</TableCell>
                        <TableCell align="center">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mvLine.consume.map((row, index) => (
                        <TableRow key={row.id}>
                          <TableCell align="left">{row.lot}</TableCell>
                          <TableCell align="right">{row.productQty}</TableCell>
                          <TableCell align="center">
                            <IconButton
                              className={classes.iconButton}
                              aria-label="delete"
                              disabled={
                                disable || loading || Total >= TotalConsume
                              }
                              onClick={async () => {
                                setMsgBox({
                                  variant: 'success',
                                  message: '',
                                });
                                setLoading(true);
                                const data = [...mvLine.consume];
                                let result = false;
                                result = await odoo.delFinished(
                                  mvLine.pickingId,
                                  row.id
                                );
                                if (result.faultCode) {
                                  result = false;
                                }
                                if (result === true) {
                                  data.splice(index, 1);
                                  setMvLine({ ...mvLine, consume: data });
                                } else {
                                  setMsgBox({
                                    variant: 'error',
                                    message: result.message,
                                  });
                                }
                                setLoading(false);
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableRow>
                      {/* <TableCell rowSpan={1} /> */}
                      <TableCell colSpan={1}>Subtotal Consume</TableCell>
                      <TableCell align="right">{TotalConsume}</TableCell>
                    </TableRow>
                  </Table>
                </TableContainer>
                <br />
                <br />
                <Grid container spacing={1}>
                  <Grid item xs={4} md={4} sm={4}>
                    <TextField
                      id="qty"
                      className={classes.textFieldTypeInput}
                      value={mvLine.qty}
                      disabled={disable}
                      InputProps={{}}
                      onChange={(e) =>
                        setMvLine({ ...mvLine, qty: Number(e.target.value) })
                      }
                      onFocus={() => setMvLine({ ...mvLine, qty: '' })}
                      label="Qty Produce"
                      type="number"
                    />
                    X
                    <div>
                      {mvLine.qtyError && (
                        <div
                          style={{
                            fontSize: '12px',
                            color: 'rgb(244, 67, 54)',
                          }}
                        >
                          Required
                        </div>
                      )}
                    </div>
                  </Grid>
                  <Grid item xs={4} md={4} sm={4}>
                    <TextField
                      id="qtyMultiply"
                      className={classes.textFieldTypeInput}
                      value={mvLine.qtyMultiply}
                      InputProps={{}}
                      onChange={(e) =>
                        setMvLine({
                          ...mvLine,
                          qtyMultiply: Number(e.target.value),
                        })
                      }
                      onFocus={() => setMvLine({ ...mvLine, qtyMultiply: 1 })}
                      label="Multiply"
                      type="number"
                    />
                    <div>
                      {mvLine.qtyError && (
                        <div
                          style={{
                            fontSize: '12px',
                            color: 'rgb(244, 67, 54)',
                          }}
                        >
                          Required
                        </div>
                      )}
                    </div>
                  </Grid>
                  <Grid item xs={4} md={4} sm={4}>
                    <Button
                      variant="contained"
                      className={classes.button}
                      disabled={disable}
                      onClick={() => addPacking()}
                    >
                      Add Produce
                    </Button>
                  </Grid>
                </Grid>
                <TableContainer component={Paper}>
                  <Table
                    className={classes.table}
                    size="small"
                    aria-label="a dense table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell align="left">Lot</TableCell>
                        <TableCell align="right">Qty</TableCell>
                        <TableCell align="center">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mvLine.lines.map((row, index) => (
                        <TableRow key={row.name}>
                          <TableCell align="left">{row.lot}</TableCell>
                          <TableCell align="right">{row.productQty}</TableCell>
                          <TableCell align="center">
                            <IconButton
                              className={classes.iconButton}
                              aria-label="delete"
                              disabled={disable || loading}
                              onClick={async () => {
                                setMsgBox({
                                  variant: 'success',
                                  message: '',
                                });
                                setLoading(true);
                                const data = [...mvLine.lines];
                                let result = false;
                                result = await odoo.delFinished(
                                  mvLine.pickingId,
                                  row.id
                                );
                                if (result.faultCode) {
                                  result = false;
                                }
                                if (result === true) {
                                  data.splice(index, 1);
                                  setMvLine({ ...mvLine, lines: data });
                                } else {
                                  setMsgBox({
                                    variant: 'error',
                                    message: result.message,
                                  });
                                }
                                setLoading(false);
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableRow>
                      {/* <TableCell rowSpan={2} /> */}
                      <TableCell colSpan={1}>Subtotal Produce</TableCell>
                      <TableCell align="right">{Total}</TableCell>
                    </TableRow>
                  </Table>
                </TableContainer>
                <Grid container spacing={1}>
                  <Grid item xs={4} md={4} sm={4}>
                    <TextField
                      id="MchName"
                      value={localStorage.getItem('lotMchName')}
                      autoFocus
                      label="Mch Name"
                      className={classes.textFieldProduct}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={4} md={4} sm={4}>
                    <TextField
                      id="ShiftName"
                      value={localStorage.getItem('shiftName')}
                      autoFocus
                      label="shiftName"
                      className={classes.textFieldProduct}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={4} md={4} sm={4}>
                    <Button
                       className={classes.button}
                      disabled={
                        disable ||
                        mvLine.lines.length === 0 ||
                        mvLine.consume.length === 0 ||
                        TotalConsume < Total
                      }
                      variant="contained"
                      onClick={() => handleSubmit()}
                    >
                      Print Saved
                    </Button>
                    {/* <Button
                      className={classes.button}
                      disabled={
                        disable ||
                        mvLine.lines.length === 0 ||
                        mvLine.consume.length === 0
                      }
                      type="button"
                      onClick={() => handleSubmit()}
                    >
                      Validate
                    </Button> */}
                  </Grid>
                  <Grid item xs={4} md={4} sm={4}>
                    <Button
                      className={classes.buttonCancel}
                      disabled={!mvLine.pickingId || printLoading}
                      
                      variant="contained"
                      onClick={() => actCancel()}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </form>
      </div>
    </>
  );
};

prodDetail.propTypes = {
  setTitle: PropTypes.func.isRequired,
  setMsgBox: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};
export default prodDetail;
