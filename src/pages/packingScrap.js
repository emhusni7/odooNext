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
import Autocomplete from '@material-ui/lab/Autocomplete';
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
  buttonSaved: {
    width: '100%',
    margin: 10,
    fontWeight: 'bold',
    backgroundColor: 'blue',
    color: 'white',
  },
  button: {
    width: '100%',
    margin: 10,
    fontWeight: 'bold',
    backgroundColor: 'red',
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
  const [date, setDate] = React.useState({
    minDate: OdooLib.MinDateTime(new Date().toISOString()),
    maxDate: OdooLib.CurrentTime(new Date().toISOString()),
  });

  React.useEffect(() => {
    const getDate = async () => {
      const newDate = await odoo.getDateTolerance(new Date().toISOString());
      setDate({ ...date, minDate: newDate });
    };
    getDate();
  }, [date.minDate]);

  const [mvLine, setMvLine] = React.useState({
    productId: 0,
    productName: '--Product--',
    uomId: false,
    locId: 0,
    typeId: 0,
    shiftId: false,
    qty: 0,
    qtyTotal: 0,
    dateTransfer: new Date(),
    pickingId: false,
    typeError: '',
    productError: '',
    qtyError: '',
    qtyScrapError: '',
    dateError: '',
    typeBundleError: '',
    shiftIdError: '',
    note: '',
    consume: []
  });
  const [opt, setOpt] = React.useState({
    optionsLoaded: false,
    options: [],
    isLoading: false,
  });

  const [pack, setPacking] = React.useState([]);

  const packData = [{value: 'inter', title: 'INTERLIVE PLASTIK / KERTAS'},
  {value: 'msn', title: 'MESIN SELONGSONG PLASTIK'},
  {value: 'bdl', title: 'BANDELING'},
  {value: 'box', title: 'BOX'},
  {value: 'pt', title: 'PETIAN'},
  {value: 'pk', title: 'PROTEK'},
  {value: 'gl', title: 'GLANGSING'},
  {value: 'shring', title: 'PLASTIK SHRING'}
]

  const getFinished = async (pickId) => {
    setLoading(true);
    const result = await odoo.getFinishedScrap(pickId);
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
      dateTransfer: OdooLib.CurrentTime(result.dateTransfer),
      locId: pickType.default_location_src_id[0],
      locDestId: pickType.default_location_dest_id[0],
      pickingId: Number(localStorage.getItem('pickScId')),
      productId: mv ? mv.product_id[0] : 0,
      productName: mv ? mv.product_id[1] : '---Product---',
      uomId: mv ? mv.product_uom[0] : '',
      shiftId: false,
      consume: result.moves.map((x) => {
        return {
          productQty: x.product_uom_qty,
          name: x.name,
          type_bundle: x.type_bundle,
          note: x.note,
          id: x.id,
        };
      }),
      
    });
    setLoading(false);
  };

  React.useEffect(() => {
    let loc = localStorage.getItem('pickScId');
    if (!!loc){
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
  const pickingVal = () => odoo.getPickingTypeProd('Packing Scrap');
  
  React.useEffect(() => {
    if (!!mvLine.typeName){
      if (mvLine.typeName.includes('Export')){
        setPacking([
          {value: 'inter', title: 'INTERLIVE PLASTIK / KERTAS'},
          {value: 'msn', title: 'MESIN SELONGSONG PLASTIK'},
          {value: 'bdl', title: 'BANDELING'},
          {value: 'box', title: 'BOX'},
          {value: 'pt', title: 'PETIAN'}
        ])
      } else {
        setPacking([
        {value: 'pk', title: 'PROTEK'},
        {value: 'gl', title: 'GLANGSING'},
        {value: 'bdl', title: 'BANDELING'},
        {value: 'shring', title: 'PLASTIK SHRING'}])
      }
    } 
   
  }, [mvLine.typeName])
 

  const handleSubmit = async () => {
    setMsgBox({ variant: 'success', message: '' });
      setLoading(true);
      setDisable(true);
      setPrintLoading(true);
      const res = await odoo.actionDoneScrap(
        mvLine.pickingId,
        odooLib.OdooDateTime(mvLine.dateTransfer),
      );
      if (!res.faultCode) {
        setTitle(res.name);
        setMvLine((prev) => ({ ...prev, consume: res.lines }));
        setMsgBox({ variant: 'success', message: 'Data Has Been Saved' });
        setLoading(false);
        setValidate(true);
        setPrintLoading(false);
        localStorage.removeItem('pickScId');
      } else {
        setMsgBox({ variant: 'error', message: res.message });
        setLoading(false);
        setDisable(false);
      }
  };

  const addScrap = async () => {
    setMsgBox({ variant: 'success', message: '' });
    if (!mvLine.typeId) {
      setMvLine({ ...mvLine, typeError: 'required Field' });
    } else if (!mvLine.productId) {
      setMvLine({ ...mvLine, productError: 'required Field' });
    } else if (!mvLine.qtyScrap) {
      setMvLine({ ...mvLine, qtyScrapError: 'required Field' });
    } else if (!mvLine.dateTransfer) {
      setMvLine({ ...mvLine, dateError: 'required Field' });
    } else if (!mvLine.typeBundle) {
      setMvLine({ ...mvLine, typeBundleError: 'required Field' });
    }  else {
      setLoading(true);
      const vals = await odoo.addScrap(
        mvLine.pickingId,
        mvLine.typeId,
        mvLine.productId,
        mvLine.productName,
        mvLine.qtyScrap,
        mvLine.locId,
        mvLine.locDestId,
        OdooLib.OdooDateTime(mvLine.dateTransfer),
        mvLine.locProdId,
        mvLine.typeBundle.value,
        mvLine.note,
        mvLine.uomId
      );
      if (!vals.faultCode) {
        if (!localStorage.getItem('pickScId')) {
          localStorage.setItem('pickScId', vals.pickingId);
        }
        setTitle(vals.name);
        setMvLine({
          ...mvLine,
          pickingId: vals.pickingId,
          consume: [
            ...mvLine.consume,
            {
              name: mvLine.productName,
              productQty: mvLine.qtyScrap,
              type_bundle: mvLine.typeBundle.value,
              note: mvLine.note,
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
      localStorage.removeItem('pickScId');
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
        if (!localStorage.getItem('pickScId')) {
          localStorage.setItem('pickScId', vals.pickingId);
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
                    color="secondary"
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
              <Grid item xs={6} md={6} sm={12}>
                {localStorage.getItem('pickScId') ? (
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
              <Grid item xs={6} md={6} sm={12}>
              <TextField
                  id="dateTransfer"
                  placeholder='Date Transfer'
                  type="datetime-local"
                  value={mvLine.dateTransfer ? mvLine.dateTransfer : ''}
                  onChange={(e) => {
                    setMvLine({ ...mvLine, dateTransfer: e.target.value });
                  }}
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    // readOnly: mvLine.status === 'Done',
                    inputProps: {
                      min: date.minDate,
                      max: date.maxDate,
                    },
                  }}
                /><div>
                {mvLine.dateError && (
                  <div
                    style={{ fontSize: '12px', color: 'rgb(244, 67, 54)' }}
                  >
                    Required
                  </div>
                )}
              </div>
              </Grid>
              <Grid item xs={6} md={6} sm={12}>
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
                  isDisabled={disable}
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
              <Grid item xs={6} md={6} sm={6}>
              <Autocomplete
                  options={pack}
                  onChange={(event, value) => {
                    setMvLine({...mvLine,
                      typeBundle: value
                    })
                  }}
                  id="typeBundle"
                  name="typeBundle"
                  getOptionLabel={(val) => val.title }
                  renderInput={(params) => <TextField {...params} required={true} error={!!mvLine.typeBundleError} label="Jenis Packing" margin="normal" />}
                />
              </Grid>
            </Grid>
            <Grid container spacing={1}>
            {/* <Grid item xs={3} md={3} sm={6}>
            <Autocomplete
                  id="shift"
                  name="Shift"
                  options={[{'value':1, title:'Shift 1'},{'value':2, title:'Shift 2'},{'value':3, title:'Shift 3'}]}
                  openOnFocus
                  placeholder='Shift'
                  onChange={(event, val) => { 
                    if(val){
                      setMvLine({
                        ...mvLine,
                        shiftId: val
                      })
                    } else {
                      setMvLine({
                        ...mvLine,
                        shiftId: ''
                      })
                    }
                  } 
                  }
                  value={mvLine.shiftId}
                  getOptionLabel={(val) => val.title }
                  renderInput={(params) => (
                    <TextField {...params} label="Shift" error={!!mvLine.shiftIdError} required variant="standard" />
                  )}
                />
            </Grid> */}
            <Grid item xs={3} md={3} sm={6}>
                <TextField
                  id="qtyScrap"
                  className={classes.textFieldTypeInput}
                  value={mvLine.qtyScrap}
                  onChange={(e) =>
                    setMvLine({ ...mvLine, qtyScrap: Number(e.target.value) })
                  }
                  onFocus={() => setMvLine({ ...mvLine, qtyScrap: '' })}
                  InputProps={{
                    readOnly: false,
                  }}
                  label="Qty Scrap"
                  type="number"
                />
                <div>
                  {mvLine.qtyScrapError && (
                    <div
                      style={{ fontSize: '12px', color: 'rgb(244, 67, 54)' }}
                    >
                      Required
                    </div>
                  )}
                </div>
              </Grid>
              
              <Grid item xs={3} md={3} sm={6}>
                <TextField
                    // error
                    id="note"
                    label="Note"
                    onChange={(e) => {
                      setMvLine({
                        ...mvLine,
                        note: e.target.value
                      })
                    }}
                    value={mvLine.note}
                    helperText="Catatan Scrap"
                    variant="filled"
                    style={{width: '100%'}}
                  />
              </Grid>
              <Grid item xs={2} md={2} sm={6}>
                <Button
                  variant="contained"
                  color="red"
                  className={classes.button}
                  disabled={disable}
                  onClick={() => addScrap()}
                >
                  Add Scrap
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
                        <TableCell align="left">Product</TableCell>
                        <TableCell align="center">Type Scrap</TableCell>
                        <TableCell align="center">Note</TableCell>
                        <TableCell align="right">Qty</TableCell>
                        <TableCell align="center">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mvLine.consume.map((row, index) => (
                        <TableRow key={row.id}>
                          <TableCell align="left">{row.name}</TableCell>
                          <TableCell align="center">{
                           packData.find((y) => y.value===row.type_bundle).title
                          }</TableCell>
                          <TableCell align='center'>{row.note}</TableCell>
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
                      <TableCell colSpan={3}>Subtotal </TableCell>
                      <TableCell align="right">{TotalConsume}</TableCell>
                    </TableRow>
                  </Table>
                </TableContainer>
                <br />
                <br />
                
                
                <Grid container spacing={1}>
                  <Grid item xs={2} md={2} sm={2}>
                    <Button
                      className={classes.buttonSaved}
                      disabled={
                        disable ||
                        mvLine.consume.length === 0 ||
                        TotalConsume < Total
                      }
                      onClick={() => handleSubmit()}
                    >
                    Saved
                    </Button>
                  </Grid>
                  <Grid item xs={2} md={2} sm={2}>
                    <Button
                      
                      color="red"
                      className={classes.buttonCancel}
                      disabled={!mvLine.pickingId || printLoading}
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
