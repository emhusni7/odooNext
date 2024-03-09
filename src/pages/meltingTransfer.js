/* eslint-disable no-restricted-globals */
/* eslint-disable use-isnan */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-shadow */
/* eslint-disable no-undef */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-param-reassign */
/* eslint-disable react/prop-types */
import React, { forwardRef, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TextField from '@material-ui/core/TextField';
import MaterialTable from 'material-table';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import Add from '@material-ui/icons/Add';
import { Paper } from '@material-ui/core';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import Head from 'next/dist/next-server/lib/head';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import Router from 'next/router';
import OdooLib from '../models/odoo';
import AutoCProduct from '../components/AutoCProduct';
import LossDialog from './loss';

const tableIcons = {
  Check: forwardRef((props, ref) => <Check ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight ref={ref} />),
  Add: forwardRef((props, ref) => <Add ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear ref={ref} />),
  Search: forwardRef((props, ref) => <Search ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowUpward ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn ref={ref} />),
};

const useStyles = makeStyles((theme) => ({
  root: {
    transform: 'translateZ(0px)',
    
  },
  textFieldSupplier: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(1),
    width: '90%',
    marginTop: theme.spacing(2),
    color: 'black',
  },
  textFieldSourceDocument: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(1),
    width: '90%',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    color: 'black',
  },
  comboBoxType: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(1),
    width: '90%',
    marginTop: theme.spacing(2),
  },
  speedDial: {
    position: 'fixed',
    bottom: theme.spacing(3),
    right: theme.spacing(2),
    // marginBottom: theme.spacing(6),
  },
  speedDialAction: {
    color: 'white',
    background: theme.palette.secondary.main, // 'linear-gradient(45deg, #29b3af 30%, #7c476d 90%)',
    '&:hover': {
      backgroundColor: 'rgb(41,179,175)',
      'no-tabs': 0,
    },
  },
  comboProduct: {
    position: 'relative',
    'z-index': 1000,
  },
  exampleWrapper: {
    position: 'relative',
    // marginTop: theme.spacing(3),
    height: '50%',
    // background:'red',
  },
}));

const MeltingTransferPage = ({ setTitle, setMsgBox, setLoading }) => {
  const classes = useStyles();
  const odoo = new OdooLib();
  const [pickingType, setType] = React.useState([]);
  const [errorType, setError] = React.useState({ helper: '', error: false });
  const [disabled, setDisable] = React.useState(false);
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

  const [picking, setPicking] = React.useState({
    id: '',
    type: '',
    location_id: '',
    location_dest_id: '',
    date_transfer: false,
    location_name: '',
    location_dest_name: '',
    name: '',
    moves: [],
    sourceDocument: '',
  });
  setTitle('Melting Transfer');
  const tableRef = React.createRef();

  const getPickingType = async () => {
    const type = await odoo.getPickingType('%%');
    try {
      if (type) {
        const data = [];
        type.forEach((item) => {
          data.push({
            id: item.id,
            name: item.name,
            location_id: item.default_location_src_id,
            location_dest_id: item.default_location_dest_id,
          });
        });
        setType(data);
      }
    } catch (e) {
      setMsgBox({ variant: 'error', message: e.message });
    }
  };

  const actReload = () => {
    Router.reload();
  };

  const addItem = () => {
    if (picking.lot_id && picking.product_id) {
      setPicking({
        ...picking,
        moves: [
          ...picking.moves,
          {
            product_id: picking.product_id,
            product: picking.product,
            lot_id: picking.lot_id,
            lot_name: picking.lot_name,
            uom_id: picking.uom_id,
            uom: picking.uom,
            qty: 0,
            length: picking.length,
            qty_available: picking.qty,
            btg: 0,
          },
        ],
      });
    }
  };

  const onValidate = async (ref) => {
    if (!picking.type || !picking.date_transfer) {
      setError({ helper: 'Type is Required Field / Date Transfer Empty', error: true });
    } else if (
      ref.current.state.showAddRow ||
      ref.current.state.lastEditingRow
    ) {
      // eslint-disable-next-line no-alert
      alert('Data Belum Disimpan');
    } else {
      setMsgBox({ message: '', variant: 'success' });
      setLoading(true);
      const mv = picking.moves.map((data) => [
        0,
        0,
        {
          product_id: data.product_id,
          name: data.product,
          product_uom_qty: data.qty,
          product_uom: data.uom_id,
          length_billet: data.length,
          qty_billet: data.btg,
          date:  OdooLib.OdooDateTime(picking.date_transfer),
          state: 'draft',
          location_id: picking.location_id,
          location_dest_id: picking.location_dest_id,
          restrict_lot_id: data.lot_id,
          lot_name: data.lot_name,
          qty_available: data.qty_available,
        },
      ]);
      const picks = {...picking, date_transfer: OdooLib.OdooDateTime(picking.date_transfer)}
      const newPick = await odoo.pickMelting(picks, mv);
      setLoading(false);
      if (newPick.faultCode) {
        setMsgBox({ variant: 'error', message: newPick.message });
      } else {
        const mvs = newPick.moves.map((xy) => ({
          ...xy,
          qty_available: parseFloat(xy.qty_available).toFixed(3),
        }));
        setPicking((prevState) => ({
          ...prevState,
          name: newPick.name,
          id: newPick.pickingId,
          moves: mvs,
        }));
        setDisable(true);
        setMsgBox({
          message: `${newPick.name} Transaction Successfull`,
          variant: 'success',
          status: true,
        });
      }
    }
  };

  const computeQty = async (productId, length, pcs) => {
    const res = await odoo.computeQty(productId, length, pcs);
    return res;
  };

  const setMoves = async (state, newData, oldData) => {
    if (state === 'edit') {
      setLoading(true);
      newData.length = Number(newData.length);
      newData.btg = Number(newData.btg);
      setPicking((prevState) => {
        const moves = [...prevState.moves];
        moves[moves.indexOf(oldData)] = newData;
        return { ...prevState, moves };
      });
      const qtyy = await computeQty(
        newData.product_id,
        Number(newData.length),
        Number(newData.btg)
      );
      newData.qty = parseFloat(qtyy).toFixed(3);
      setPicking((prevState) => {
        // console.log(parseFloat(qty).toFixed(3));
        const moves = [...prevState.moves];
        moves[moves.indexOf(oldData)] = newData;
        return { ...prevState, moves };
      });
      setLoading(false);
    } else if (state === 'add') {
      setLoading(true);
      const qtyz = await computeQty(
        newData.product_id,
        Number(newData.length),
        Number(newData.btg)
      );
      newData.qty = parseFloat(qtyz).toFixed(3);
      setPicking((prevState) => {
        const moves = [...prevState.moves];
        moves.push(newData);
        return { ...prevState, moves };
      });
      setLoading(false);
    } else {
      setPicking((prevState) => {
        const moves = [...prevState.moves];
        moves.splice(moves.indexOf(oldData), 1);
        return { ...prevState, moves };
      });
    }
  };

  const setRow = async (row, idx) => {
    setMsgBox({ variant: 'success', message: '' });
    const rows = {
      type_id: row.type_id,
      product_id: row.product_id,
      name: row.product,
      product_uom_qty: row.qty_available,
      product_uom: row.uom_id,
      state: 'draft',
      restrict_lot_id: row.lot_id,
    };
    setLoading(true);
    const loss = await odoo.createLoss(rows);
    setLoading(false);
    try {
      if (!loss.faultCode) {
        const dt = [...picking.moves];
        const record = dt[idx];
        record.qty_available = 0;
        dt[idx] = record;
        setPicking({ ...picking, moves: dt });
      } else {
        setMsgBox({ variant: 'error', message: loss.message });
      }
    } catch (e) {
      setMsgBox({ variant: 'error', message: loss.message });
    }
  };

  React.useEffect(() => {
    getPickingType();
  }, [null]);

  // eslint-disable-next-line react/prop-types
  // eslint-disable-next-line no-unused-vars
  const DetailSection = ({ lines, addMoves, tableRef, setRow }) => {
    return (
      <div
        style={{
          maxWidth: '100%',
          maxHeight: '60%',
          marginLeft: '10px',
          marginRight: '10px',
          marginTop: '10px',
        }}
      >
        <MaterialTable
          icons={tableIcons}
          title="Detail"
          disabled
          tableRef={tableRef}
          options={{
            paging: false,
          }}
          columns={[
            {
              field: 'product_id',
              hidden: true,
            },
            {
              field: 'uom_id',
              hidden: true,
            },
            {
              field: 'lot_id',
              hidden: true,
            },
            {
              title: 'Product',
              field: 'product',
              required: true,
              width: '40%',
              editComponent: (props) => (
                <AutoCProduct
                  key={props.rowData.product_id}
                  id="product"
                  name="product"
                  label="Product"
                  row={{
                    product_id: props.rowData.product_id,
                    product: props.rowData.product,
                    product_uom: props.rowData.uom_id,
                  }}
                  change={(event, val) => {
                    if (val) {
                      props.onRowDataChange({
                        ...props.rowData,
                        product: val.name,
                        uom_id: val.uomId,
                        uom: val.uom,
                        product_id: val.id,
                      });
                    } else {
                      props.onRowDataChange({
                        ...props.rowData,
                        product: '',
                        uom_id: 0,
                        uom: '',
                        product_id: 0,
                      });
                    }
                  }}
                />
              ),
            },
            {
              title: 'Lot',
              field: 'lot_name',
            },
            {
              title: 'Length (CentiMeter)',
              field: 'length',
              editable: picking.location_name
                .toUpperCase()
                .includes('BAHAN BAKU')
                ? 'always'
                : 'never',
              type: 'numeric',
              required: true,
            },
            {
              title: 'Btg',
              field: 'btg',
              type: 'numeric',
              required: true,
            },
            {
              title: 'Qty',
              field: 'qty',
              type: 'numeric',
              editable: 'never',
              required: true,
            },
            {
              title: 'On Hand',
              field: 'qty_available',
              type: 'numeric',
              editable: 'never',
            },
            {
              title: 'Uom',
              field: 'uom',
              editable: 'never',
            },
            {
              title: 'Loss',
              field: 'loss',
              hidden: !disabled,
              render: (rowData) => (
                <LossDialog
                  row={rowData}
                  act={setRow}
                  idx={rowData.tableData.id}
                  setLoading={setLoading}
                />
              ),
            },
          ]}
          data={lines}
          editable={
            // eslint-disable-next-line no-constant-condition
            disabled
              ? false
              : {
                  onRowAdd: (newData) =>
                    // eslint-disable-next-line consistent-return
                    new Promise((resolve, reject) => {
                      if (isNaN(newData.qty) || !newData.product) {
                        return reject();
                      }
                      return resolve(addMoves('add', newData));
                    }),
                  onRowUpdate: (newData, oldData) =>
                    new Promise((resolve, reject) => {
                      if (oldData) {
                        if (isNaN(newData.qty) || !newData.product) {
                          return reject();
                        }
                        return resolve(addMoves('edit', newData, oldData));
                      }
                      return reject();
                    }),
                  onRowDelete: (oldData) =>
                    new Promise((resolve) => {
                      resolve();
                      addMoves('del', false, oldData);
                    }),
                }
          }
        />
      </div>
    );
  };

  const [options, setOptions] = React.useState([]);
  const [open, setOpenC] = React.useState(false);
  let loading = open && options.length === 0;
  React.useEffect(() => {
    let active = true;
    if (!loading) {
      return undefined;
    }

    (async () => {
      const dt = await odoo.getQuantMelting(
        picking.location_id ? picking.location_id : 0,
        ''
      );
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
  return (
    <>
      <Head>
        <title>ALUBLESS - Pemakaian</title>
      </Head>
      <div >
        <>
          <Grid container spacing={1}>
            <Grid item xs={6} md={6} sm={12}>
              <TextField
                label="Picking No."
                id="name"
                className={classes.textFieldSupplier}
                margin="dense"
                variant="outlined"
                value={picking.name}
                InputLabelProps={{
                  style: {color: 'black'}
                }}
                disabled
              />
            </Grid>
            <Grid item xs={6} md={6} sm={12}>
              <Autocomplete
                id="pickingType"
                name="pickingType"
                options={pickingType}
                disabled={disabled || picking.moves.length > 0}
                getOptionSelected={(option, value) => option.id === value.id}
                getOptionLabel={(option) => option.name}
                onChange={(event, value) => {
                  if (value) {
                    setError({ helper: '', error: false });
                    setPicking((prevState) => ({
                      ...prevState,
                      type: value.id,
                      location_id: value.location_id[0],
                      location_dest_id: value.location_dest_id[0],
                      location_name: value.location_id[1],
                      location_dest_name: value.location_dest_id[1],
                    }));
                  }
                }}
                autoHighlight
                renderInput={(params) => (
                  <TextField
                    {...params}
                    margin="dense"
                    variant="outlined"
                    label="Picking Type"
                    error={errorType.error}
                    helperText={errorType.helper}
                    className={classes.comboBoxType}
                    InputLabelProps={{
                      style: {color: 'black'}
                    }}
                    fullWidth={15}
                  />
                )}
              />
            </Grid>
          </Grid>
         

          <Grid container spacing={1}>
            <Grid item xs={6} md={6} sm={12}>
              <TextField
                label="Location Src Name"
                id="location_name"
                className={classes.textFieldSupplier}
                margin="dense"
                variant="outlined"
                value={picking.location_name}
                InputLabelProps={{
                  style: {color: 'black'}
                }}
                disabled
              />
            </Grid>
            <Grid item xs={6} md={6} sm={12}>
              <TextField
                label="Location Dest Name"
                id="location_dest_name"
                className={classes.textFieldSupplier}
                margin="dense"
                variant="outlined"
                value={picking.location_dest_name}
                InputLabelProps={{
                  style: {color: 'black'}
                }}
                disabled
              />
            </Grid>
          </Grid>

          <Grid container spacing={1}>
            <Grid item xs={6} md={6} sm={12}>
              <TextField
                label="Source Document"
                id="name"
                className={classes.textFieldSourceDocument}
                margin="dense"
                disabled={disabled}
                onChange={(e) =>
                  setPicking({
                    ...picking,
                    sourceDocument: e.target.value,
                  })
                }
                InputLabelProps={{
                  style: {color: 'black'}
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6} md={6} sm={12}>
              <Autocomplete
                id="lot_id"
                name="lot_id"
                defaultValue={{}}
                onOpen={() => {
                  setOpenC(true);
                }}
                onClose={() => {
                  setOpenC(false);
                }}
                onChange={(e, val) => {
                  if (val) {
                    setPicking((prev) => ({
                      ...prev,
                      lot_id: val.id,
                      lot_name: val.name,
                      product_id: val.product_id,
                      product: val.name_template,
                      length: val.length_billet,
                      qty: val.qty,
                      uom: val.uom,
                      uom_id: val.uom_id,
                    }));
                  } else {
                    setPicking((prev) => ({
                      ...prev,
                      lot_id: 0,
                      lot_name: '',
                      product_id: 0,
                      product: '',
                      length_billet: 0,
                      qty: 0,
                    }));
                  }
                }}
                // disabled={row.saved || melting.status === 'Done'}
                getOptionSelected={(option, val) => option.name === val.name}
                // onInputChange={(e) => {
                //   setLotName(e.target.value);
                // }}
                getOptionLabel={(option) => option.name}
                options={options}
                loading={loading}
                InputProps={{ isRequired: true }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Lot"
                    margin="dense"
                    variant="outlined"
                    InputLabelProps={{
                      style: {color: 'black'}
                    }}
                    className={classes.comboBoxType}
                    fullWidth={15}
                    onChange={async (e) => {
                      loading = true;
                      const dt = await odoo.getQuantMelting(
                        picking.location_id ? picking.location_id : 0,
                        e.target.value
                      );
                      setOptions(dt);
                    }}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            <Grid container spacing={1}>
              <Grid item xs={6} md={6} sm={6}>
                  <TextField
                      id="date_transfer"
                      label="Date Transfer"
                      type="datetime-local"
                      value={picking.date_transfer ? picking.date_transfer : false}
                      onChange={(e) => {
                        setPicking({ ...picking, date_transfer: e.target.value });
                      }}
                      className={classes.textFieldSupplier}
                      InputLabelProps={{
                        shrink: true,
                        style: {color: 'black'}
                      }}
                      InputProps={{
                        readOnly: picking.state === 'Done',
                        inputProps: {
                          min: date.minDate,
                          max: date.maxDate,
                        },
                      }}
                    />
                
              </Grid>
              <Grid item xs={3} md={3} sm={3}>
                <Button
                  variant="outlined"
                  style={{ backgroundColor: 'blue', marginTop: '10px', marginLeft: '15px' }}
                  color="secondary"
                  disabled={!picking.lot_id || disabled}
                  onClick={() => addItem()}
                >
                  Transfer Billet
                </Button>
            </Grid>
          </Grid>
          </Grid>
        </>

        <DetailSection
          addMoves={setMoves}
          msg={setMsgBox}
          lines={picking.moves}
          tableRef={tableRef}
          setRow={setRow}
        />
        <br />
        <br />
        <Grid container spacing={1}>
          <Grid item xs={8} md={8} sm={8} />
          <Grid item xs={4} md={4} sm={4}>
            <Button
              variant="contained"
              color="secondary"
              type="button"
              style={{ backgroundColor: 'green', marginTop: '10px', marginLeft: '15px' }}
              disabled={disabled || picking.moves.length === 0}
              onClick={() => onValidate(tableRef)}
            >
              Validate
            </Button>
            {'   '}
            <Button
              className={classes.button}
              disabled={!disabled && !picking.name}
              type="button"
              style={{ backgroundColor: 'white', marginTop: '10px', marginLeft: '15px', color: 'black' }}
              variant="outlined"
              color="secondary"
              onClick={() => actReload()}
            >
              Reload
            </Button>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

MeltingTransferPage.propTypes = {
  setTitle: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  setMsgBox: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default MeltingTransferPage;
