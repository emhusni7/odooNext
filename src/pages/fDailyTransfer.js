import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Head from 'next/head';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import DailyTransfer from './dailyTransfer';
import OdooLib from '../models/odoo';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
  textField: {
    margin: '10px',
    width: '90%',
  },
  button: {
    width: '20%',
    fontSize: ['10px', '12px', '14px'],
    fontWeight: '500',
    margin: 'auto',
  },
  wrapper: {
    position: 'relative',
  },
  paper: {
    padding: theme.spacing(1),
    margin: 'auto',
    maxWidth: 1000,
    height: 'auto',
    position: 'relative',
    justifyContent: 'center',
    marginTop: '150px',
  },
}));

const PDTransfer = ({ submit, msg }) => {
  const odoo = new OdooLib();
  const classes = useStyles();
  const date = new Date();
  const [form, setForm] = React.useState({
    target_lokal: 0,
    target_export: 0,
    vol_lokal: 0,
    vol_export: 0,
    month: date.getMonth(),
  });

  const getData = async () => {
    const result = await odoo.getPickTarget();
    setForm({
      ...form,
      target_lokal: result[1].target_g,
      target_export: result[0].target_g,
      vol_lokal: result[1].capacity_per_cycle,
      vol_export: result[0].capacity_per_cycle,
    });
  };

  React.useEffect(() => {
    getData();
  }, []);

  const formSubmit = (e) => {
    if (
      form.target_lokal === '' ||
      typeof form.target_lokal === 'undefined' ||
      form.target_export === '' ||
      typeof form.target_export === 'undefined' ||
      form.vol_lokal === '' ||
      typeof form.vol_lokal === 'undefined' ||
      form.vol_export === '' ||
      typeof form.vol_export === 'undefined'
    ) {
      msg({ variant: 'error', message: 'Required Field Must be Field' });
    } else {
      submit(e, form);
    }
  };

  const inputChangeHandler = (event) => {
    const { id, value } = event.target;
    if (typeof id === 'undefined') {
      setForm((prevState) => ({ ...prevState, month: value }));
    } else {
      setForm((prevState) => ({ ...prevState, [id]: value }));
    }
  };
  return (
    <>
      <Head>
        <title>Odoo App</title>
      </Head>
      <Box className={classes.root}>
        <Paper component="form" className={classes.paper}>
          <form>
            <Grid container direction="row" sm={12}>
              <Grid item sm={6}>
                <TextField
                  error={
                    form.target_lokal === '' ||
                    typeof form.target_lokal === 'undefined'
                  }
                  id="target_lokal"
                  name="target_lokal"
                  type="number"
                  label="Target Lokal"
                  value={form.target_lokal}
                  onChange={(e) => inputChangeHandler(e)}
                  className={classes.textField}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ pattern: '[A-Za-z0-9]+' }}
                />
              </Grid>
              <Grid item sm={6}>
                <TextField
                  error={
                    form.target_export === '' ||
                    typeof form.target_export === 'undefined'
                  }
                  id="target_export"
                  name="target_export"
                  type="number"
                  label="Target Export"
                  onChange={(e) => inputChangeHandler(e)}
                  value={form.target_export}
                  className={classes.textField}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ pattern: '[A-Za-z0-9]+' }}
                />
              </Grid>
            </Grid>
            <Grid container direction="row" sm={12}>
              <Grid item sm={6}>
                <TextField
                  error={
                    form.vol_lokal === '' ||
                    typeof form.vol_lokal === 'undefined'
                  }
                  id="vol_lokal"
                  name="vol_lokal"
                  type="number"
                  label="Tonase / Hari(Ton)"
                  onChange={(e) => inputChangeHandler(e)}
                  value={form.vol_lokal}
                  className={classes.textField}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ pattern: '[A-Za-z0-9]+' }}
                />
              </Grid>
              <Grid item sm={6}>
                <TextField
                  error={
                    form.vol_export === '' ||
                    typeof form.vol_export === 'undefined'
                  }
                  id="vol_export"
                  name="vol_export"
                  type="number"
                  label="Tonase / Container(Ton)"
                  value={form.vol_export}
                  onChange={(e) => inputChangeHandler(e)}
                  className={classes.textField}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ pattern: '[A-Za-z0-9]+' }}
                />
              </Grid>
            </Grid>
            <Grid container direction="row" sm={12}>
              <Grid item sm={6}>
                <Select
                  labelId="month"
                  id="month"
                  name="month"
                  label="Month"
                  className={classes.textField}
                  value={form.month}
                  onChange={inputChangeHandler}
                  InputLabelProps={{ shrink: true }}
                >
                  <MenuItem value={0}>Januari</MenuItem>
                  <MenuItem value={1}>Febuary</MenuItem>
                  <MenuItem value={2}>Maret</MenuItem>
                  <MenuItem value={3}>April</MenuItem>
                  <MenuItem value={4}>Mei</MenuItem>
                  <MenuItem value={5}>Juni</MenuItem>
                  <MenuItem value={6}>Juli</MenuItem>
                  <MenuItem value={7}>Agustus</MenuItem>
                  <MenuItem value={8}>September</MenuItem>
                  <MenuItem value={9}>Oktober</MenuItem>
                  <MenuItem value={10}>November</MenuItem>
                  <MenuItem value={11}>Desember</MenuItem>
                </Select>
              </Grid>
            </Grid>
            <Grid
              container
              sm={12}
              direction="row"
              justify="center"
              alignItems="center"
            >
              <Button
                variant="outlined"
                color="primary"
                className={classes.button}
                onClick={(e) => formSubmit(e)}
              >
                Print
              </Button>
            </Grid>
          </form>
        </Paper>
      </Box>
    </>
  );
};
PDTransfer.propTypes = {
  submit: PropTypes.func.isRequired,
  msg: PropTypes.func.isRequired,
};

const fDailyTransfer = ({ setTitle, setLoading, setMsgBox }) => {
  setTitle('Daily Transfer');
  const [disable, setDisable] = React.useState(false);
  const [params, setParam] = React.useState({});
  const handleSubmit = (e, form) => {
    e.preventDefault();
    setParam(form);
    setDisable(true);
    // try {
    //   setLoading(false);
    //   Router.push({
    //     pathname: '/rack',
    //     query: { rack: rackName },
    //   });
    // } catch (err) {
    //   setLoading(false);
    // }
  };

  if (disable) {
    return <DailyTransfer loading={setLoading} params={params} />;
  }
  return <PDTransfer submit={handleSubmit} msg={setMsgBox} />;
};

export default fDailyTransfer;

fDailyTransfer.propTypes = {
  setTitle: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  setMsgBox: PropTypes.func.isRequired,
};
