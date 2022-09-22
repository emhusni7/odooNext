import React, { forwardRef, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
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
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import Done from '@material-ui/icons/Done';
import PropTypes from 'prop-types';
import Backdrop from '@material-ui/core/Backdrop';
import Head from 'next/dist/next-server/lib/head';
import OdooLib from '../models/odoo';

const tableIcons = {
  Check: forwardRef((props, ref) => <Check ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight ref={ref} />),
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
    flexGrow: 1,
  },
  textField: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    width: '90%',
  },

  speedDial: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    marginBottom: theme.spacing(6),
  },
  speedDialAction: {
    color: 'white',
    background: '#29b3af', // 'linear-gradient(45deg, #29b3af 30%, #7c476d 90%)',
    '&:hover': {
      backgroundColor: 'rgb(41,179,175)',
      'no-tabs': 0,
    },
  },
}));

const EditPage = ({ setTitle, setLoading, setMsgBox, loading }) => {
  const classes = useStyles();
  const router = useRouter();
  const { id } = router.query;
  const odoo = new OdooLib();
  const [open, setOpen] = useState(false);
  const [state, setState] = useState({
    data: [],
    readOnly: false,
    supplier: '',
    po_number: '',
    no_spb: '',
    picking_id: '',
    custRef: '',
    sopir: '',
    noPol: '',
  });

  const columnDef = [
    { title: 'Description', field: 'description', editable: 'never' },
    {
      title: 'Qty todo',
      field: 'ostd_qty',
      type: 'numeric',
      editable: 'never',
    },
    {
      title: 'UOM',
      field: 'trans_uom',
      type: 'string',
      editable: 'never',
      render: (rowData) => <div>{rowData.trans_uom[1]}</div>,
    },
    {
      title: 'Qty',
      field: 'trans_qty',
      render: (rowData) => {
        if (rowData.state === 'done') {
          return <div>{rowData.trans_qty}</div>;
        }
        return (
          <TextField
            defaultValue={rowData.trans_qty}
            onChange={(event) => {
              const data = rowData;
              data.trans_qty = event.target.value;
              data.qty_done = event.target.value;
            }}
            type="number"
            step="0.01"
          />
        );
      },
    },
  ];

  async function getProduct(ids) {
    if (ids) {
      const result = await odoo.getPackOperation(ids);
      if (result) {
        const data = [];
        result.forEach((item) => {
          setState((prevState) => {
            data.push(item);
            return { ...prevState, data };
          });
        });
      }
    }
    setLoading(false);
  }

  async function getData() {
    if (id) {
      setLoading(true);
      const respick = await odoo.getPicking(parseInt(id, 10));
      if (respick) {
        setState({
          ...state,
          supplier: respick.partner_id[1],
          po_number: respick.origin,
          no_spb: respick.display_name,
          picking_id: respick.id,
          custRef: !respick.cust_ref ? null : respick.cust_ref,
          sopir: !respick.sopir ? null : respick.sopir,
          noPol: !respick.no_polisi ? null : respick.no_polisi,
          readOnly: respick.state !== 'assigned',
        });
        setTitle(respick.display_name);
        getProduct(respick.pack_operation_ids);
      } else {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    getData();
  }, [null]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onValidate = async () => {
    setLoading(true);
    setMsgBox({ message: '', variant: 'success' });
    setOpen(false);
    const res = await odoo.setPackOperation(
      state.data,
      state.picking_id,
      state.custRef,
      state.noPol,
      state.sopir
    );
    if (res instanceof Error) {
      const message = res instanceof Error ? res.message : res;
      setLoading(false);
      setMsgBox({ message, variant: 'error' });
    } else {
      setState({
        ...state,
        supplier: res.supplier,
        po_number: res.po_number,
        no_spb: res.no_spb,
        picking_id: res.picking_id,
        custRef: res.custRef,
        sopir: res.sopir,
        noPol: res.nopol,
        readOnly: res.readOnly,
        data: res.data,
      });
      setTitle(res.no_spb);
      setLoading(false);
      setMsgBox({ message: 'Data has been validated', variant: 'success' });
    }
  };

  const actions = [{ icon: <Done />, name: 'Validate', act: onValidate }];

  const DetailSection = () => {
    if (state.readOnly) {
      return (
        <div
          style={{
            maxWidth: '100%',
            maxHeight: '60%',
            marginLeft: '10px',
            marginRight: '10px',
            marginTop: '10px',
            marginBottom: '90px',
            paddingBottom: '10%',
          }}
        >
          <MaterialTable
            icons={tableIcons}
            title="Detail"
            columns={columnDef}
            data={state.data}
            options={{
              paging: false,
            }}
          />
        </div>
      );
    }
    return (
      <div
        style={{
          maxWidth: '100%',
          maxHeight: '60%',
          marginLeft: '10px',
          marginRight: '10px',
          marginTop: '10px',
          marginBottom: '90px',
          paddingBottom: '10%',
        }}
      >
        <MaterialTable
          icons={tableIcons}
          title="Detail"
          columns={columnDef}
          data={state.data}
          options={{
            paging: false,
          }}
        />
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Odoo App - Validate</title>
      </Head>
      <div className={classes.root}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={12} sm={12}>
            <TextField
              label="Supplier"
              id="supplier"
              placeholder="Supplier"
              className={classes.textField}
              margin="dense"
              variant="outlined"
              value={state.supplier}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={12} sm={6}>
            <TextField
              label="PO Number"
              id="number"
              placeholder="PO Number"
              className={classes.textField}
              margin="dense"
              variant="outlined"
              value={state.po_number}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={12} sm={6}>
            <TextField
              label="Cust Ref"
              margin="dense"
              variant="outlined"
              className={classes.textField}
              placeholder="Cust Reference"
              value={state.custRef}
              name="custRef"
              id="custRef"
              onChange={(event) => {
                event.preventDefault();
                setState({ ...state, custRef: event.target.value });
              }}
              // disabled={loading || state.readOnly}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="No. Polisi"
              id="nopol"
              placeholder="No. Polisi"
              className={classes.textField}
              name="noPol"
              key="noPol"
              autoComplete="noPol"
              value={state.noPol}
              margin="dense"
              variant="outlined"
              onChange={(event) => {
                setState({ ...state, noPol: event.target.value });
              }}
              disabled={loading || state.readOnly}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Sopir"
              id="sopir"
              placeholder="Sopir"
              className={classes.textField}
              variant="outlined"
              name="Sopir"
              value={state.sopir}
              defaultValue={state.sopir}
              margin="dense"
              onChange={(event) => {
                setState({ ...state, sopir: event.target.value });
              }}
              disabled={loading || state.readOnly}
            />
          </Grid>
        </Grid>
        <DetailSection />
        <Backdrop open={open} style={{ zIndex: 20 }} />
        <SpeedDial
          ariaLabel="SpeedDial action"
          className={classes.speedDial}
          icon={<SpeedDialIcon />}
          onClose={handleClose}
          onOpen={handleOpen}
          hidden={loading || state.readOnly}
          open={open}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              className={classes.speedDialAction}
              FabProps={{ color: 'primary', size: 'large' }}
              tooltipTitle={action.name}
              tooltipOpen
              onClick={action.act}
            />
          ))}
        </SpeedDial>
      </div>
    </>
  );
};

EditPage.propTypes = {
  setTitle: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  setMsgBox: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default EditPage;
