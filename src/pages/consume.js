import React, { forwardRef } from 'react';
import Grid from '@material-ui/core/Grid';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TextField from '@material-ui/core/TextField';
import MaterialTable, { MTableEditField } from 'material-table';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import Add from '@material-ui/icons/Add';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import Head from 'next/dist/next-server/lib/head';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AsyncSelect from 'react-select/async';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction/SpeedDialAction';
import SpeedDial from '@material-ui/lab/SpeedDial/SpeedDial';
import Done from '@material-ui/icons/Done';
import PropTypes from 'prop-types';
import AlertDialog from '../components/dialog';
import OdooLib from '../models/odoo';

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
    flexGrow: 1,
  },
  textFieldSupplier: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(1),
    width: '90%',
    marginTop: theme.spacing(2),
  },
  textFieldSourceDocument: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(1),
    width: '90%',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
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

const ConsumePage = ({ setTitle, setLoading, setMsgBox }) => {
  const classes = useStyles();
  const odoo = new OdooLib();

  const [pickingType, setType] = React.useState([]);
  const [errorType, setError] = React.useState({ helper: '', error: false });
  const [disabled, setDisable] = React.useState(false);
  const [picking, setPicking] = React.useState({
    id: '',
    type: '',
    location_id: '',
    location_dest_id: '',
    name: '',
    moves: [],
    sourceDocument: '',
  });
  setTitle('Pemakaian');

  const [open, setOpen] = React.useState(false);
  const [dialogopen, setdialogOpen] = React.useState(false);
  const getPickingType = async () => {
    const type = await odoo.getPickingType('%pemakaian%');
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

  const setMoves = (state, newData, oldData) => {
    if (state === 'edit') {
      setPicking((prevState) => {
        const moves = [...prevState.moves];
        moves[moves.indexOf(oldData)] = newData;
        return { ...prevState, moves };
      });
    } else if (state === 'add') {
      setPicking((prevState) => {
        const moves = [...prevState.moves];
        moves.push(newData);
        return { ...prevState, moves };
      });
    } else {
      setPicking((prevState) => {
        const moves = [...prevState.moves];
        moves.splice(moves.indexOf(oldData), 1);
        return { ...prevState, moves };
      });
    }
  };

  React.useEffect(() => {
    getPickingType();
  }, [null]);

  const onValidate = async () => {
    if (!picking.type) {
      setError({ helper: 'Type is Required Field', error: true });
    } else {
      setMsgBox({ message: '', variant: 'success' });

      setLoading(true);
      if (picking.id) {
        try {
          await odoo.cancelPicking(picking.id);
        } catch (e) {
          setMsgBox({ variant: 'error', message: e.message });
        }
      }

      const mv = picking.moves.map((data) => [
        0,
        0,
        {
          product_id: data.product_id,
          name: data.product,
          product_uom_qty: data.qty,
          product_uom: data.uom_id,
          state: 'draft',
          location_id: picking.location_id,
          location_dest_id: picking.location_dest_id,
        },
      ]);

      const newPick = await odoo.createPicking(picking, mv);

      if (newPick instanceof Error) {
        setMsgBox({ variant: 'error', message: Error.message });
      } else if ('warning' in newPick) {
        setPicking((prevState) => ({
          ...prevState,
          id: newPick.warning[0].picking_id[0],
          name: newPick.warning[0].picking_id[1],
        }));
        setLoading(false);
        newPick.warning.map((dt) =>
          setMsgBox({
            message: `${dt.name} Quantity not available `,
            variant: 'error',
            status: true,
          })
        );
      } else {
        setPicking((prevState) => ({
          ...prevState,
          name: newPick[0].name,
          id: newPick[0].id,
        }));
        setDisable(true);
        setLoading(false);
        setMsgBox({
          message: `${newPick[0].name} Transaction Successfull`,
          variant: 'success',
          status: true,
        });
      }
    }
  };

  const handleProcess = () => {
    setdialogOpen(true);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const dialogClose = () => {
    setdialogOpen(false);
  };

  // eslint-disable-next-line react/prop-types
  const DetailSection = ({ lines, addMoves }) => {
    const filterValue = (inputValue) => odoo.getProductAll(inputValue);

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
          options={{
            paging: true,
            pageSize: 20,
            pageSizeOptions: [20, 30, 50, 75, 100],
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
              title: 'Product',
              field: 'product',
              required: true,
              width: '40%',
              editComponent: (props) => (
                <AsyncSelect
                  id="product"
                  name="product"
                  cacheOptions
                  defaultOptions
                  style={{ width: '100px',  color: '#000', fontWeight: "bold"}}
                  onChange={(value) => {
                    if (value) {
                      // eslint-disable-next-line no-param-reassign,react/prop-types
                      props.rowData.product = value.label;
                      // eslint-disable-next-line max-len
                      // eslint-disable-next-line no-param-reassign,react/prop-types,prefer-destructuring
                      props.rowData.uom = value.uom_id[1];
                      // eslint-disable-next-line max-len
                      // eslint-disable-next-line no-param-reassign,react/prop-types,prefer-destructuring
                      props.rowData.uom_id = value.uom_id[0];
                      // eslint-disable-next-line no-param-reassign,react/prop-types
                      props.rowData.product_id = value.value;
                    }
                  }}
                  loadOptions={filterValue}
                />
              ),
            },
            {
              title: 'Qty',
              field: 'qty',
              type: 'numeric',
              required: true,
            },
            {
              title: 'Uom',
              field: 'uom',
              editable: 'never',
            },
          ]}
          components={{
            EditField: (props) => {
              // eslint-disable-next-line react/destructuring-assignment,react/prop-types
              if (props.columnDef.required && !props.value) {
                return (
                  <MTableEditField {...props} error label="Required Field" />
                );
              }
              return <MTableEditField {...props} />;
            },
          }}
          data={lines}
          editable={
            disabled
              ? false
              : {
                  onRowAdd: (newData) =>
                    // eslint-disable-next-line consistent-return
                    new Promise((resolve, reject) => {
                      resolve();
                      if (
                        !newData.qty ||
                        newData.qty === 0 ||
                        !newData.product
                      ) {
                        return reject();
                      }
                      addMoves('add', newData);
                    }),
                  onRowUpdate: (newData, oldData) =>
                    new Promise((resolve) => {
                      resolve();
                      if (oldData) {
                        addMoves('edit', newData, oldData);
                      }
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

  return (
    <>
      <Head>
        <title>ALUBLESS - Pemakaian</title>
      </Head>
      <div className={classes.root}>
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
                disabled
              />
            </Grid>
            <Grid item xs={6} md={6} sm={12}>
              <Autocomplete
                id="pickingType"
                name="pickingType"
                options={pickingType}
                disabled={disabled}
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
                    fullWidth={15}
                  />
                )}
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
                variant="outlined"
                // value={picking.name}
                // disabled
              />
            </Grid>
          </Grid>
        </>

        <DetailSection addMoves={setMoves} lines={picking.moves} />
        <AlertDialog
          open={dialogopen}
          handleClose={dialogClose}
          process={onValidate}
          title="Info"
          message="Yakin untuk memvalidasi Proses ?"
        />
      </div>
      <div className={classes.exampleWrapper}>
        <SpeedDial
          ariaLabel="SpeedDial action"
          className={classes.speedDial}
          icon={<SpeedDialIcon />}
          onClose={handleClose}
          onOpen={handleOpen}
          hidden={disabled}
          open={open}
        >
          <SpeedDialAction
            key="validate-action"
            icon={<Done />}
            className={classes.speedDialAction}
            FabProps={{ color: 'secondary', size: 'large' }}
            tooltipTitle="Validate"
            tooltipOpen
            disabled={disabled}
            onClick={() => handleProcess()}
          />
        </SpeedDial>
      </div>
    </>
  );
};

ConsumePage.propTypes = {
  setTitle: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  setMsgBox: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default ConsumePage;
