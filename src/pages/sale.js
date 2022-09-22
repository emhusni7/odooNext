import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import AsyncSelect from 'react-select/async';
import Table from '@material-ui/core/Table';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import DatePicker from 'react-datepicker';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';

import EditIcon from '@material-ui/icons/Edit';
import { useRouter } from 'next/router';
import OdooLib from '../models/odoo';
import Stepper from '../components/stepForm';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'absolute',
    paddingBlock: 5,
    padding: 5,
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  paper: {
    padding: 20,
    marginTop: 10,
    textAlign: 'left',
    inWidth: '100%',
  },
  textFieldColumn: {
    width: '100%',
    marginTop: 10,
  },
  textFieldTypeInput: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '315px',
    marginTop: 5,
    height: '38px',
  },
}));

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

const OrderItem = ({ loading, Msg, setOrderLine }) => {
  const classes = useStyles();
  const odoo = new OdooLib();
  const filterValue = (inputValue) => odoo.getProductToSale(inputValue);
  const [open, setOpen] = React.useState(false);
  const [item, setItem] = React.useState({
    productId: '',
    productName: '',
    product_qty: 0,
    tonase: 0,
  });

  const handleClose = () => {
    setItem({ productId: '', productName: '', product_qty: 0, tonase: 0 });
    setOpen(false);
  };

  const handleSubmit = async (iteme) => {
    if (!item.productId || iteme.product_qty <= 0) {
      Msg({
        variant: 'error',
        message: 'Field Product dan Qty Harus di Isi',
      });
    } else {
      loading(true);
      const tonase = await odoo.getTonase(iteme.productId, iteme.product_qty);
      if (tonase.faultCode) {
        Msg({
          variant: 'error',
          message: 'Error',
        });
      } else {
        item.tonase = tonase;
        setOrderLine(item);
        loading(false);
        handleClose();
      }
    }
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Add Item
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Product
            </Typography>
          </Toolbar>
        </AppBar>
        <div style={{ marginTop: 30, paddingTop: 50 }}>
          <>
            <form name="contactform">
              <Typography>Please type your work in the below :</Typography>
              <Paper>
                <Grid container spacing={1}>
                  <Grid item xs={12} md={12} sm={12}>
                    {!item.productId ? (
                      <p style={{ color: 'red' }}>Product Required Field</p>
                    ) : (
                      ''
                    )}
                    <AsyncSelect
                      id="productName"
                      name="productName"
                      cacheOptions
                      required
                      defaultOptions
                      isClearable
                      label="Product"
                      placeholder="Product"
                      className={classes.textFieldTypeInput}
                      onChange={(value) => {
                        if (value) {
                          setItem({
                            ...item,
                            productId: value.value,
                            productName: value.label,
                          });
                        } else {
                          setItem({
                            ...item,
                            productId: '',
                            productName: '',
                          });
                        }
                      }}
                      loadOptions={filterValue}
                    />
                  </Grid>

                  <Grid item xs={12} md={12} sm={12}>
                    <TextField
                      id="qtyBtg"
                      name="qtyBtg"
                      className={classes.textFieldTypeInput}
                      label="Qty (Btg)"
                      error={!item.product_qty}
                      autoFocus
                      required
                      onChange={(e) => {
                        setItem({
                          ...item,
                          product_qty: Number(e.target.value),
                        });
                      }}
                      type="number"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                </Grid>
              </Paper>

              <Paper style={{ alignItems: 'center', justify: 'center' }}>
                <Button
                  style={{
                    marginTop: 20,
                  }}
                  variant="contained"
                  color="primary"
                  onClick={() => handleSubmit(item)}
                >
                  Add Item
                </Button>
              </Paper>
            </form>
          </>
        </div>
      </Dialog>
    </div>
  );
};

const DetailForm = ({
  setLoading,
  setMsgBox,
  order,
  setOrderLine,
  delLine,
}) => {
  const Total = order.lines
    ? order.lines.reduce(
        (totalCalories, meal) => totalCalories + meal.tonase,
        0
      )
    : 0;
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell colSpan={4}>
              <OrderItem
                loading={setLoading}
                Msg={setMsgBox}
                order={order}
                setOrderLine={(val) => setOrderLine(val)}
              >
                Create
              </OrderItem>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell align="right">Order (Btg)</TableCell>
            <TableCell align="right">Tonase</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {order.lines.map((row, idx) => (
            <TableRow
              // eslint-disable-next-line react/no-array-index-key
              key={`${row.id};${idx}`}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.productName}
              </TableCell>
              <TableCell align="right">{row.product_qty}</TableCell>
              <TableCell align="right">{row.tonase}</TableCell>
              <TableCell>
                <IconButton aria-label="delete" onClick={() => delLine(idx)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableRow>
          {/* <TableCell rowSpan={1} /> */}
          <TableCell colSpan={2}>Total Tonase </TableCell>
          <TableCell align="right">{parseFloat(Total.toFixed(3))}</TableCell>
        </TableRow>
      </Table>
    </TableContainer>
  );
};

const CustForm = ({ changeCust, changeType, changeDate, order }) => {
  const classes = useStyles();
  const odoo = new OdooLib();
  const filterCust = (inputValue) => odoo.getCustomer(inputValue);
  const filterType = (inputValue) => odoo.getSoType(inputValue);
  return (
    <div>
      <div>
        {!order.customer_id ? (
          <p style={{ color: 'red' }}>Customer Required Field</p>
        ) : (
          ''
        )}
        <AsyncSelect
          id="customer"
          name="customer"
          cacheOptions
          required
          defaultOptions
          isClearable
          value={
            order.customer_id
              ? {
                  label: order.customer_name,
                  value: order.customer_id,
                }
              : ''
          }
          placeholder="Customer"
          className={classes.textFieldTypeInput}
          onChange={(value) => changeCust(value)}
          loadOptions={filterCust}
        />
      </div>

      <div>
        {!order.type_id ? (
          <p style={{ color: 'red' }}>Type Required Field</p>
        ) : (
          ''
        )}
        <AsyncSelect
          id="type_id"
          name="type_id"
          cacheOptions
          required
          defaultOptions
          isClearable
          value={
            order.type_id
              ? {
                  label: order.type_name,
                  value: order.type_id,
                }
              : ''
          }
          placeholder="Type"
          className={classes.textFieldTypeInput}
          onChange={(value) => changeType(value)}
          loadOptions={filterType}
        />
      </div>
      <div>
        {!order.validity_date ? (
          <p style={{ color: 'red' }}>Schedule Date is Required Field</p>
        ) : (
          ''
        )}
        <DatePicker
          className={classes.textFieldTypeInput}
          onChange={(date) => changeDate(date)}
          dateFormat="dd-MM-yyyy"
          placeholderText="Schedule Date"
          selected={order.validity_date}
        />
      </div>
    </div>
  );
};

const OrderDetail = ({ setLoading, setMsgBox, onClick, delSo }) => {
  //   const classes = useStyles();
  const odoo = new OdooLib();

  const [rows, setSo] = React.useState([]);
  const getOrderSale = async () => {
    setLoading(true);
    const res = await odoo.getOrderSale();
    setLoading(false);
    if (!res.faultCode) {
      setSo([...res]);
    } else {
      setMsgBox({ variant: 'error', message: res.message });
    }
  };

  const deleteSo = async (id) => {
    await delSo(id);
    getOrderSale();
  };

  React.useEffect(() => {
    getOrderSale();
    return () => {};
  }, []);
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell colSpan={4}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => onClick('create')}
              >
                Create Quotations
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Customer</TableCell>
            <TableCell>Date Order</TableCell>
            <TableCell colSpan={2} align="center">
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.customer_name}
              </TableCell>
              <TableCell component="th" scope="row">
                {OdooLib.formatDateTime(row.date_order)}
              </TableCell>
              <TableCell component="th" scope="row">
                <IconButton aria-label="edit" onClick={() => onClick(row)}>
                  <EditIcon />
                </IconButton>
              </TableCell>
              <TableCell component="th" scope="row">
                <IconButton
                  aria-label="delete"
                  onClick={() => deleteSo(row.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const SaleForm = ({ setTitle, setLoading, setMsgBox }) => {
  const odoo = new OdooLib();
  const router = useRouter();
  const [mode, setMode] = React.useState('');
  const [order, setOrder] = React.useState({
    customer_id: '',
    customer_name: '',
    type_id: '',
    type_name: '',
    lines: [],
  });

  const { id } = router.query;
  React.useEffect(() => {
    if (id && mode === 'create') {
      router.reload('/sale');
    }
    if (!id && mode === 'edit') {
      router.reload('/sale');
    }
    return () => {};
  }, [id]);

  setTitle(order.name);

  const setCustomer = (value) => {
    if (value) {
      setOrder({
        ...order,
        customer_id: value.value,
        customer_name: value.label,
      });
    } else {
      setOrder({
        ...order,
        customer_id: '',
        customer_name: '',
      });
    }
  };

  const setType = (value) => {
    if (value) {
      setOrder({
        ...order,
        type_id: value.value,
        type_name: value.label,
      });
    } else {
      setOrder({
        ...order,
        type_id: '',
        type_name: '',
      });
    }
  };

  const setDate = (value) => {
    console.log(value);
    if (value) {
      setOrder({
        ...order,
        validity_date: value,
      });
    } else {
      setOrder({
        ...order,
        validity_date: '',
      });
    }
  };

  const setOrderLine = (line) => {
    const ol = {
      product_qty: line.product_qty,
      productName: line.productName,
      productId: line.productId,
      id: 0,
      tonase: line.tonase,
    };
    setOrder((prevState) => ({
      ...prevState,
      lines: [...prevState.lines, ol],
    }));
  };

  const delLine = (idx) => {
    // console.log(idx);
    const data = [...order.lines];
    setOrder({
      ...order,
      lines: data.filter((item, x) => x !== idx),
    });
  };

  const delSo = async (soId) => {
    setLoading(true);
    const res = await odoo.delSo(soId);
    setLoading(false);
    if (!res.faultCode) {
      setMsgBox({ variant: 'success', message: 'Data berhasil di hapus' });
    } else {
      setMsgBox({ variant: 'error', message: 'Error' });
    }
  };

  const createOrder = async () => {
    if (!id) {
      const res = await odoo.createOrder(false, order);
      return res;
    }
    const res = await odoo.createOrder(Number(id), order);
    return res;
  };

  const changeMode = (val) => {
    if (val === 'create') {
      router.push({
        pathname: '/sale',
      });
      setMode('create');
    } else {
      setLoading(true);
      setOrder({
        ...order,
        customer_id: val.customer_id,
        customer_name: val.customer_name,
        id: val.id,
        name: val.name,
        type_id: val.type_id,
        type_name: val.type_name,
        validity_date: val.validity_date ? new Date(val.validity_date) : '',
        lines: [...val.lines],
      });
      setMode('edit');
      router.push({
        pathname: '/sale',
        query: { id: val.id },
      });
      setLoading(false);
    }
  };

  const reloadSale = () => {
    if (id) {
      router.push({
        pathname: '/sale',
      });
    } else {
      router.reload();
    }
  };

  if (mode === 'create' || mode === 'edit') {
    return (
      <Stepper
        CustForm={CustForm}
        DetailForm={DetailForm}
        ChangeCust={(value) => setCustomer(value)}
        ChangeType={(value) => setType(value)}
        ChangeDate={(value) => setDate(value)}
        setOrderLine={(val) => setOrderLine(val)} // add item sale order
        Order={order}
        delLine={(val) => delLine(val)}
        createOrder={() => createOrder()}
        setMsgBox={setMsgBox}
        setLoading={setLoading}
        setTitle={setTitle}
        backReload={() => reloadSale()}
      />
    );
  }

  return (
    <OrderDetail
      setLoading={setLoading}
      setMsgBox={setMsgBox}
      onClick={(val) => changeMode(val)}
      delSo={(val) => delSo(val)}
    />
  );
};

export default SaleForm;

SaleForm.propTypes = {
  setTitle: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  setMsgBox: PropTypes.func.isRequired,
};

OrderItem.propTypes = {
  loading: PropTypes.func.isRequired,
  Msg: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types

  setOrderLine: PropTypes.func.isRequired,
};

OrderDetail.propTypes = {
  setLoading: PropTypes.func.isRequired,
  setMsgBox: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  delSo: PropTypes.func.isRequired,
};

CustForm.propTypes = {
  changeCust: PropTypes.func.isRequired,
  changeType: PropTypes.func.isRequired,
  changeDate: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  order: PropTypes.object.isRequired,
};

DetailForm.propTypes = {
  setLoading: PropTypes.func.isRequired,
  setMsgBox: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  order: PropTypes.object.isRequired,
  setOrderLine: PropTypes.func.isRequired,
  delLine: PropTypes.func.isRequired,
};
