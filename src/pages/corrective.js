/* eslint-disable no-alert */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/dist/next-server/lib/head';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import AsyncSelect from 'react-select/async';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import OdooLib from '../models/odoo';
import CorrActDialog from './corrective_act';

const useStyles = makeStyles({
  table: {
    minWidth: 750,
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
  const filterValue = (inputValue) => odoo.getActCorr(inputValue);
  const { woId, type } = router.query;
  const [etching, setCorr] = React.useState({
    id: '',
    shiftId,
    moname: '',
    problem: '',
    holes: '',
    die_state: '',
    corrname: '',
    corrid: '',
    rack: '',
    die_name: '',
    state: '',
    warning: '',
    mpo_id: 0,
    note: '',
    type: '',
    woid: woId,
    date_start: '',
    date_finished: '',
    corrCreate: false,
  });

  setTitle(
    // eslint-disable-next-line no-nested-ternary
    etching.name
      ? etching.name
      : type === 'corr'
      ? 'Corrective'
      : 'Finishing Akhir'
  );

  const setDone = async () => {
    setMsgBox({
      variant: 'success',
      message: '',
    });
    setLoading(true);
    if (!etching.corrid || !etching.die_state) {
      await setTimeout(setLoading(false), 1000);
      setMsgBox({
        variant: 'error',
        message: 'Field Required Harus di isi',
      });
    } else {
      const produce = await odoo.actCreateCorr(etching);
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
    }
  };

  const addCorrAct = async (code, name, note) => {
    if (!code || !name || !note) {
      return { variant: 'error', message: 'Required Field Harus diisi' };
    }
    const res = await odoo.addCorrAct(code, name, note);
    if (!res.faultCode) {
      setCorr({
        ...etching,
        corrname: res.name,
        corrid: res.id,
        corrCreate: true,
      });
      return { variant: 'success' };
    }
    return { variant: 'error', message: 'Required Field Harus diisi' };
  };

  const inWork = async () => {
    setMsgBox({ variant: 'success', message: '' });

    setLoading(true);
    const moveLines = await odoo.actCreateCorr(etching);
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
    const woOrder = await odoo.getWoCorrective(woId, type);
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
        <title>Odoo App</title>
      </Head>

      <div className={classes.root}>
        <>
          <Grid container spacing={1}>
            <Grid item xs={3} md={3} sm={3}>
              <Paper className={classes.paper} elevation={0}>
                {etching.state === 'draft' ? (
                  <Button onClick={() => inWork()}>Start</Button>
                ) : (
                  ''
                )}
              </Paper>
            </Grid>

            <Grid item xs={3} md={3} sm={3}>
              <Paper className={classes.paper} elevation={0}>
                {etching.state === 'startworking' ? (
                  <Button onClick={() => setDone()}>End</Button>
                ) : (
                  ''
                )}
              </Paper>
            </Grid>
          </Grid>
          <Grid item xs={12} md={12} sm={12}>
            {etching.warning ? (
              <div>
                <h2 style={{ color: 'red', textAlign: 'center' }}>
                  {etching.warning}
                </h2>
              </div>
            ) : (
              ''
            )}
          </Grid>
          <Typography>
            <Box fontStyle="italic" fontWeight="fontWeightMedium" m={1}>
              Information :
            </Box>
          </Typography>
          <Paper className={classes.paper} elevation={2}>
            <Grid container spacing={2}>
              <Grid item xs={2} className={classes.labelDesign}>
                <Typography>MO</Typography>
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
                <Typography>Start Date</Typography>
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
                <Typography>End Date</Typography>
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
                <Typography>Die</Typography>
              </Grid>
              <Grid item xs={3} sm container>
                <Grid item xs container direction="column" spacing={2}>
                  <TextField
                    disabled
                    id="outlined-basic"
                    variant="outlined"
                    value={etching.die_name}
                    className={classes.textFieldColumn}
                    InputLabelProps={{ shrink: false, readonly: 1 }}
                  />
                </Grid>
              </Grid>
              <Grid item xs={2} className={classes.labelDesign}>
                <Typography>Hole</Typography>
              </Grid>
              <Grid item xs={3} sm container>
                <Grid item xs container direction="column" spacing={2}>
                  <Grid item xs>
                    <TextField
                      disabled
                      id="outlined-basic"
                      variant="outlined"
                      type="number"
                      className={classes.textFieldColumn}
                      value={etching.holes}
                      InputLabelProps={{ shrink: false, readonly: true }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            {type === 'corr' ? (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={2} className={classes.labelDesign}>
                    <Typography>Times Nitriding</Typography>
                  </Grid>
                  <Grid item xs={3} sm container>
                    <Grid item xs container direction="column" spacing={2}>
                      <TextField
                        disabled
                        id="outlined-basic"
                        variant="outlined"
                        value={etching.times_nitrid}
                        className={classes.textFieldColumn}
                        InputLabelProps={{ shrink: false, readonly: 1 }}
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={2} className={classes.labelDesign}>
                    <Typography>Weight Act</Typography>
                  </Grid>
                  <Grid item xs={3} sm container>
                    <Grid item xs container direction="column" spacing={2}>
                      <Grid item xs>
                        <TextField
                          disabled
                          id="outlined-basic"
                          variant="outlined"
                          type="number"
                          className={classes.textFieldColumn}
                          value={etching.act_weight}
                          InputLabelProps={{ shrink: false, readonly: true }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={2} className={classes.labelDesign}>
                    <Typography>Billet Since Nitriding</Typography>
                  </Grid>
                  <Grid item xs={3} sm container>
                    <Grid item xs container direction="column" spacing={2}>
                      <TextField
                        disabled
                        id="outlined-basic"
                        variant="outlined"
                        value={etching.billet_nitrid}
                        className={classes.textFieldColumn}
                        InputLabelProps={{ shrink: false, readonly: 1 }}
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={2} className={classes.labelDesign}>
                    <Typography>Billet Until Nitriding</Typography>
                  </Grid>
                  <Grid item xs={3} sm container>
                    <Grid item xs container direction="column" spacing={2}>
                      <Grid item xs>
                        <TextField
                          disabled
                          id="outlined-basic"
                          variant="outlined"
                          type="number"
                          className={classes.textFieldColumn}
                          value={etching.max_billet_nitrid}
                          InputLabelProps={{ shrink: false, readonly: true }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={2} className={classes.labelDesign}>
                    <Typography>Problem</Typography>
                  </Grid>
                  <Grid item xs={3} sm container>
                    <Grid item xs container direction="column" spacing={2}>
                      <Grid item xs>
                        <TextField
                          disabled
                          placeholder="Problem"
                          value={etching.problem}
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
              </>
            ) : (
              ''
            )}
          </Paper>
          {type === 'corr' ? (
            <>
              <Typography style={{ marginTop: '40px' }}>
                <Box fontStyle="italic" fontWeight="fontWeightMedium" m={1}>
                  History Corrective :
                </Box>
              </Typography>
              <Paper
                className={classes.paper}
                // elevation={2}
                style={{ marginTop: '10px' }}
              >
                <TableContainer component={Paper}>
                  <Table
                    size="small"
                    aria-label="a dense table"
                    className={classes.table}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Start Date</TableCell>
                        <TableCell>End Date</TableCell>
                        <TableCell>Problem</TableCell>
                        <TableCell>Corrective Act</TableCell>
                        <TableCell />
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {etching.history
                        ? etching.history.map((row) => (
                            <TableRow key={row.name}>
                              <TableCell
                                style={{ width: '10vw' }}
                                component="th"
                                scope="row"
                              >
                                {row.name}
                              </TableCell>
                              <TableCell style={{ width: '10vw' }}>
                                {OdooLib.formatDateTime(row.date_start)}
                              </TableCell>
                              <TableCell style={{ width: '10vw' }}>
                                {OdooLib.formatDateTime(row.date_finished)}
                              </TableCell>
                              <TableCell style={{ width: '10vw' }}>
                                {row.problem}
                              </TableCell>
                              <TableCell style={{ width: '5vw' }} colSpan={2}>
                                {row.corrective_action}
                              </TableCell>
                              <TableCell style={{ width: '10vw' }}>
                                {row.state}
                              </TableCell>
                            </TableRow>
                          ))
                        : ''}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </>
          ) : (
            ''
          )}

          <Typography style={{ marginTop: '40px' }}>
            <Box fontStyle="italic" fontWeight="fontWeightMedium" m={1}>
              Please input your work in the below :
            </Box>
          </Typography>
          <Paper
            className={classes.paper}
            elevation={2}
            style={{ marginTop: '10px' }}
          >
            <Grid container spacing={2}>
              <Grid item xs={2} className={classes.labelDesign}>
                <Typography>Corrective Action</Typography>
              </Grid>
              <Grid item xs={3} sm container>
                <Grid item xs container direction="column" spacing={2}>
                  <Grid item xs={9}>
                    <FormControl
                      className={classes.formControl}
                      error={!etching.corrid}
                    >
                      <AsyncSelect
                        id="corrId"
                        name="corrId"
                        cacheOptions
                        required
                        defaultOptions
                        isClearable
                        isDisabled={
                          etching.state === 'done' ||
                          etching.state === 'draft' ||
                          type !== 'corr'
                        }
                        value={{
                          label: etching.corrname,
                          value: etching.corrid,
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        // eslint-disable-next-line no-shadow
                        onChange={(value) => {
                          if (value) {
                            setCorr({
                              ...etching,
                              corrname: value.label,
                              corrid: value.value,
                            });
                          } else {
                            setCorr({
                              ...etching,
                              corrname: '',
                              corrid: '',
                            });
                          }
                        }}
                        //   isDisabled={disable || mvLine.consume.length > 0}
                        isSearchable
                        placeholder="Corrective Action"
                        loadOptions={filterValue}
                      />
                      <FormHelperText>
                        {!etching.corrid && etching.state === 'startworking'
                          ? 'Required'
                          : ''}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <CorrActDialog
                      name=""
                      disabled={
                        etching.state === 'done' ||
                        etching.state === 'draft' ||
                        type !== 'corr'
                      }
                      handleSave={addCorrAct}
                      setMsgBox={setMsgBox}
                      setLoading={setLoading}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={2} className={classes.labelDesign}>
                <Typography>Die State</Typography>
              </Grid>
              <Grid item xs={3} sm container>
                <Grid item xs container direction="column" spacing={2}>
                  <Grid item xs>
                    <FormControl
                      className={classes.formControl}
                      error={
                        !etching.die_state && etching.state === 'startworking'
                      }
                      variant="outlined"
                    >
                      <Select
                        labelId="die_state"
                        id="die_state"
                        disabled={
                          etching.state === 'done' || etching.state === 'draft'
                        }
                        value={etching.die_state}
                        onChange={(e) => {
                          setCorr({
                            ...etching,
                            die_state: e.target.value,
                          });
                        }}
                        defaultValue={etching.die_state}
                      >
                        <MenuItem value="ready">Ready</MenuItem>
                        <MenuItem value="notok">Not Ok</MenuItem>
                        <MenuItem value="nitrid">Need Nitriding</MenuItem>
                      </Select>
                      <FormHelperText>
                        {!etching.die_state && etching.state === 'startworking'
                          ? 'Required'
                          : ''}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={2} className={classes.labelDesign}>
                <Typography>Rak</Typography>
              </Grid>
              <Grid item xs={3} sm container>
                <Grid item xs container direction="column" spacing={2}>
                  <Grid item xs>
                    <TextField
                      id="rack"
                      name="rack"
                      onChange={(e) => {
                        setCorr({
                          ...etching,
                          rack: e.target.value,
                        });
                      }}
                      placeholder="Rack"
                      value={etching.rack}
                      variant="outlined"
                      className={classes.textFieldFull}
                      disabled={
                        etching.state === 'done' || etching.state === 'draft'
                      }
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
