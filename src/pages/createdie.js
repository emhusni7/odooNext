/* eslint-disable no-alert */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/dist/next-server/lib/head';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import OdooLib from '../models/odoo';

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
    Width: '50%',
  },
  paper: {
    padding: 20,
    marginTop: 10,
    textAlign: 'left',
    inWidth: '100%',
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
  labelBottom: {
    marginLeft: '10px',
  },
  textField: {
    width: '50%',
    marginTop: 10,
  },
  textFieldColumn: {
    width: '100%',
    marginTop: 10,
  },
  textFieldFull: {
    width: '100%',
    marginTop: 10,
  },
  labelDesign: {
    margin: 'auto',
    width: '100%',
    paddingTop: 20,
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
    color: 'blue',
  },
});

const EtchingPage = ({ setTitle, setMsgBox, setLoading }) => {
  const router = useRouter();
  const odoo = new OdooLib();

  const shiftId = Number(localStorage.getItem('shiftId'));
  // const [inputCorr, setInputCorr] = React.useState('');
  const { woId, code, judul } = router.query;
  const [etching, setCorr] = React.useState({
    id: '',
    shiftId,
    moname: '',
    die_name: '',
    state: '',
    mpo_id: 0,
    woid: woId,
    date_start: '',
    date_finished: '',
  });

  setTitle(etching.name || judul.toUpperCase());
  const setDone = async () => {
    setMsgBox({
      variant: 'success',
      message: '',
    });
    setLoading(true);

    const produce = await odoo.actCreateCD(
      etching,
      Number(localStorage.getItem(`${code}MchId`))
    );
    if (!produce.faultCode) {
      setCorr({
        ...produce,
      });
      setLoading(false);
      setMsgBox({ variant: 'success', message: 'Transaction Has Been Done' });
    } else {
      await setTimeout(setLoading(false), 1000);
      setMsgBox({ variant: 'error', message: produce.faultString });
    }
  };

  const inWork = async () => {
    setMsgBox({ variant: 'success', message: '' });

    setLoading(true);
    const moveLines = await odoo.actCreateCD(
      etching,
      Number(localStorage.getItem(`${code}MchId`))
    );
    if (!moveLines.faultCode) {
      setCorr({
        ...moveLines,
      });
    } else {
      setLoading(false);
      setMsgBox({ variant: 'error', message: moveLines.message });
    }

    setLoading(false);
  };
  const getWo = async () => {
    setLoading(true);
    const woOrder = await odoo.getWoCD(woId);
    if (!woOrder.faultCode) {
      setCorr({ ...woOrder });
    } else {
      setMsgBox({ variant: 'error', message: 'Load data Error' });
    }
    setLoading(false);
  };

  useEffect(() => {
    getWo();
  }, []);

  const classes = useStyles();
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
                {etching.state === 'draft' ? (
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
                {etching.state === 'startworking' ? (
                  <Button variant="contained" onClick={() => setDone()}>
                    End
                  </Button>
                ) : (
                  ''
                )}
              </Paper>
            </Grid>
          </Grid>

          <Typography variant='h6'>
            <Box fontStyle="italic" fontWeight="fontWeightMedium" m={1}>
              Information :
            </Box>
          </Typography>
          <Paper className={classes.paper} elevation={2}>
            <Grid container spacing={2}>
              <Grid item xs={2} className={classes.labelDesign}>
                <Typography variant='h6'>Start Date</Typography>
              </Grid>
              <Grid item xs={3} sm container>
                <Grid item xs container direction="column" spacing={2}>
                  <Grid item xs>
                    <TextField
                      disabled
                      id="dateStart"
                      name="dateStart"
                      variant="outlined"
                      value={
                        etching.date_start
                          ? OdooLib.formatDateTime(etching.date_start)
                          : ''
                      }
                      className={classes.textFieldColumn}
                      InputLabelProps={{
                        shrink: false,
                        readonly: true,
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={2} className={classes.labelDesign}>
                <Typography variant='h6'>End Date</Typography>
              </Grid>
              <Grid item xs={3} sm container>
                <Grid item xs container direction="column" spacing={2}>
                  <Grid item xs>
                    <TextField
                      disabled
                      id="dateEnd"
                      name="dateEnd"
                      variant="outlined"
                      value={
                        etching.date_finished
                          ? OdooLib.formatDateTime(etching.date_finished)
                          : ''
                      }
                      className={classes.textFieldColumn}
                      InputLabelProps={{
                        shrink: false,
                        readonly: true,
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={2} className={classes.labelDesign}>
                <Typography variant='h6'>Machine</Typography>
              </Grid>
              <Grid item xs={3} sm container>
                <Grid item xs container direction="column" spacing={2}>
                  <Grid item xs>
                    <TextField
                      disabled
                      id="mch"
                      name="Machine"
                      variant="outlined"
                      value={localStorage.getItem(`${code}MchName`)}
                      className={classes.textFieldColumn}
                      InputLabelProps={{
                        shrink: false,
                        readonly: true,
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={2} className={classes.labelDesign}>
                <Typography variant='h6'>Shift</Typography>
              </Grid>
              <Grid item xs={3} sm container>
                <Grid item xs container direction="column" spacing={2}>
                  <Grid item xs>
                    <TextField
                      disabled
                      id="shift"
                      name="shift"
                      variant="outlined"
                      value={localStorage.getItem(`shiftName`)}
                      className={classes.textFieldColumn}
                      InputLabelProps={{
                        shrink: false,
                        readonly: true,
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={2} className={classes.labelDesign}>
                <Typography variant='h6'>MO</Typography>
              </Grid>
              <Grid item xs={3} sm container>
                <Grid item xs container direction="column" spacing={2}>
                  <Grid item xs>
                    <TextField
                      disabled
                      id="Mo Name"
                      variant="outlined"
                      value={etching.moname}
                      className={classes.textFieldFull}
                      InputLabelProps={{
                        shrink: false,
                        readonly: true,
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={2} className={classes.labelDesign}>
                <Typography variant='h6'>Die</Typography>
              </Grid>
              <Grid item xs={3} sm container>
                <Grid item xs container direction="column" spacing={2}>
                  <Grid item xs>
                    <TextField
                      disabled
                      placeholder="Die"
                      value={etching.die_name}
                      variant="outlined"
                      className={classes.textFieldFull}
                      InputLabelProps={{
                        shrink: false,
                        readonly: true,
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>

          <br />
          <br />
        </>
      </div>
    </>
  );
};

export default EtchingPage;

EtchingPage.propTypes = {
  setTitle: PropTypes.func.isRequired,
  setMsgBox: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
};
