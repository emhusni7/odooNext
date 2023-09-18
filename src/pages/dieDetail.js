import React, { useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import Head from 'next/dist/next-server/lib/head';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router';
import OdooLib from '../models/odoo';

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
  root: {
    flexGrow: 1,
    marginLeft: '10px',
    marginRight: '10px',
  },
  paper: {
    height: 50,
  },
  buttonEnd: {
    marginLeft: 10,
  },
  label: {
    paddingTop: 20,
  },
});

const DieDetailPage = ({ setTitle, setLoading, setMsgBox }) => {
  const router = useRouter();
  const {
    mchId,
    mchName,
    moName,
    product,
    state,
    prodID,
    id,
    wcId,
  } = router.query;
  const odoo = new OdooLib();
  const minDate = OdooLib.MinDateTime(new Date().toISOString());
  const maxDate = OdooLib.CurrentTime(new Date().toISOString());
  const [die, setDie] = React.useState({
    dieId: Number(prodID),
    woId: Number(id),
    machine: Number(mchId),
    status: state === 'draft' ? 'New' : 'InProgress',
    workCid: Number(wcId),
    dateStart: '',
    name: 'Die Detail',
    statusDie: '',
    dateEnd: '',
    id: false,
  });
  setTitle(die.name);

  const setDone = async () => {
    if (die.dateStart > die.dateEnd) {
      setMsgBox({
        variant: 'error',
        message: 'Tanggal Start > dari Tanggal Finished',
      });
    } else {
      setMsgBox({ variant: 'success', message: '' });
      setLoading(true);
      const result = await odoo.setDoneDie(
        die.id,
        OdooLib.OdooDateTime(die.dateStart),
        OdooLib.OdooDateTime(die.dateEnd)
      );
      const statusDies = await odoo.dieState(prodID);
      try {
        if (!result.faultCode) {
          setDie({
            ...die,
            statusDie: statusDies,
            status: 'Finished',
            dateEnd: OdooLib.formatDateTime(result[0].date_finished),
          });
          setLoading(false);
          setMsgBox({ variant: 'success', message: 'Data Has Been Saved' });
        } else {
          setLoading(false);
          setMsgBox({ variant: 'error', message: result.message });
        }
      } catch (e) {
        setMsgBox({ variant: 'error', message: e.message });
      }
    }
  };

  const getOutput = async (prdId) => {
    const statusDies = await odoo.dieState(prdId);
    const out = await odoo.getOutput(Number(id));
    try {
      if (out.length > 0) {
        setDie({
          ...die,
          status: out[0].state !== 'draft' ? 'InProgress' : 'New',
          dateStart:
            out[0].date_start === false
              ? ''
              : OdooLib.formatDateTime(out[0].date_start),
          dateEnd:
            out[0].date_finished === false
              ? ''
              : OdooLib.formatDateTime(out[0].date_finished),
          name: out[0].name,
          id: out[0].id,
          statusDie: statusDies,
        });
      } else {
        setDie({
          ...die,
          statusDie: statusDies,
        });
      }
    } catch (e) {
      setMsgBox({ variant: 'error', message: e.message });
    }
  };

  useEffect(() => {
    getOutput(prodID);
  }, []);

  const onStart = async () => {
    setLoading(true);
    const result = await odoo.addProdOutput({
      ...die,
      dateStart: OdooLib.OdooDateTime(die.dateStart),
    });
    const statusDies = await odoo.dieState(prodID);
    try {
      if (!result.faultCode) {
        setDie({
          ...die,
          statusDie: statusDies,
          status: 'InProgress',
          dateStart: OdooLib.formatDateTime(result[0].date_start),
          name: result[0].name,
          id: result[0].id,
        });
        setLoading(false);
        setMsgBox({ variant: 'success', message: 'Data Has Been Saved' });
      } else {
        setLoading(false);
        setMsgBox({ variant: 'error', message: result.message });
      }
    } catch (e) {
      setLoading(false);
      setMsgBox({ variant: 'error', message: e.message });
    }
  };

  const classes = useStyles();
  let buttons;
  if (die.status === 'New') {
    buttons = (
      <Button variant="contained" onClick={() => onStart(die)}>
        Start
      </Button>
    );
  }

  return (
    <>
      <Head>
        <title>ALUBLESS - Detail Die Machine</title>
      </Head>

      <div className={classes.root}>
        <>
          <Grid container spacing={1}>
            <Grid item xs={3} md={3} sm={3}>
              <Paper className={classes.paper} elevation={0} spacing={1}>
                {buttons}
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={1}>
            <Grid item xs={3} md={3} sm={3}>
              <Paper className={classes.paper} elevation={0}>
                <Typography className={classes.label}>Machine Name</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} md={6} sm={6}>
              <Paper elevation={0}>
                <Typography className={classes.label}>
                  {`: ${mchName}`}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={1}>
            <Grid item xs={3} md={3} sm={3}>
              <Paper className={classes.paper} elevation={0}>
                <Typography className={classes.label}>MO</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} md={6} sm={6}>
              <Paper elevation={0}>
                <Typography className={classes.label}>
                  {`: ${moName}`}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={1}>
            <Grid item xs={3} md={3} sm={3}>
              <Paper className={classes.paper} elevation={0}>
                <Typography className={classes.label}>Die Index</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} md={6} sm={6}>
              <Paper elevation={0}>
                <Typography className={classes.label}>
                  {`: ${product}`}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={1}>
            <Grid item xs={3} md={3} sm={3}>
              <Paper className={classes.paper} elevation={0}>
                <Typography className={classes.label}>Doc Status</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} md={6} sm={6}>
              <Paper elevation={0}>
                <Typography className={classes.label}>
                  {`: ${die.status}`}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={1}>
            <Grid item xs={3} md={3} sm={3}>
              <Paper className={classes.paper} elevation={0}>
                <Typography className={classes.label}>Status Die</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} md={6} sm={6}>
              <Paper elevation={0}>
                <Typography className={classes.label}>
                  {`: ${die.statusDie}`}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={1}>
            <Grid item xs={3} md={3} sm={3}>
              <Paper className={classes.paper} elevation={0}>
                <Typography className={classes.label}>Start Date</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} md={6} sm={6}>
              <TextField
                id="date"
                label=""
                type="datetime-local"
                value={
                  die.dateStart
                    ? die.dateStart
                    : OdooLib.CurrentTime(new Date().toISOString())
                }
                onChange={(e) => {
                  setDie({ ...die, dateStart: e.target.value });
                }}
                required
                className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  readOnly: die.status === 'Finished',
                  inputProps: {
                    min: minDate,
                    max: maxDate,
                  },
                }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={1}>
            <Grid item xs={3} md={3} sm={3}>
              <Paper className={classes.paper} elevation={0}>
                <Typography className={classes.label}>End Date</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} md={6} sm={6}>
              <TextField
                id="date"
                label=""
                type="datetime-local"
                value={
                  die.dateEnd
                    ? die.dateEnd
                    : OdooLib.CurrentTime(new Date().toISOString())
                }
                onChange={(e) => {
                  setDie({ ...die, dateEnd: e.target.value });
                }}
                required
                className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  readOnly: die.status !== 'InProgress',
                  inputProps: {
                    min: minDate,
                    max: maxDate,
                  },
                }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={1}>
            <Grid item xs={3} md={3} sm={3}>
              {die.status === 'InProgress' ? (
                <Button
                  variant="contained"
                  onClick={() => setDone()}
                  className={classes.buttonEnd}
                >
                  End
                </Button>
              ) : (
                ''
              )}
            </Grid>
          </Grid>
        </>
      </div>
    </>
  );
};

export default DieDetailPage;

DieDetailPage.propTypes = {
  setTitle: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  setMsgBox: PropTypes.func.isRequired,
};
