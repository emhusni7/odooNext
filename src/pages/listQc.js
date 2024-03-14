/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/dist/next-server/lib/head';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import router, { useRouter } from 'next/router';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Box from '@material-ui/core/Box';
import FullScreenDialog from './processQc';
import OdooLib from '../models/odoo';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#2986cc',
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '5',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  table: {
    width: '100%',
    marginTop: '10px',
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
    // backgroundColor: '#722076',
    color: 'white',
    width: '50%',
  },
  paperButton: {
    marginTop: 10,
    fontSize: 20,
  },
}));

const ListQcPage = ({ setTitle, setMsgBox, setLoading }) => {
  const classes = useStyles();
  setTitle('List of QC');
  const odoo = new OdooLib();
  const route = useRouter();
  const [rows, setRow] = React.useState([]);
  const [name, setName] = React.useState([]);
  const [disabled, setDisable] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [status, setStatus] = React.useState('new');
  const [date, setDate] = React.useState({
    minDate: OdooLib.MinDateTime(new Date().toISOString()),
    maxDate: OdooLib.CurrentTime(new Date().toISOString()),
    dateStart: OdooLib.CurrentTime(new Date().toISOString()),
    dateEnd: OdooLib.CurrentTime(new Date().toISOString())
  });


  React.useEffect(() => {
    const getDate = async () => {
      const newDate = await odoo.getDateTolerance(new Date().toISOString());
      setDate({ ...date, minDate: newDate });
    };
    getDate();
  }, [date.minDate]);


  React.useEffect(() => {
    if (!localStorage.getItem('shiftId') || !localStorage.getItem('wcType')) {
      route.push({
        pathname: '/machine',
        query: { type: 'listQc' },
      });
    } else {
      (async () => {
        setLoading(true);
        const result = await odoo.getQcExport('', localStorage.getItem('wcType'));
        const res = result.map((x) => ({
          ...x,
          qty: x.outstanding_qty,
          lines: [],
        }));
        setRow(res);
        setLoading(false);
      })();
    }
  }, []);

  const addScrap = (idx, line, sqty, mode) => {
    const rec = [...rows];
    const dt = { ...rec[idx] };
    dt.scrapqty = sqty;
    if (mode === 'add') {
      dt.qty = Number(dt.qty) - Number(line.scrapQty);
      dt.lines.push(line);
    } else {
      const index = dt.lines.indexOf(line);
      dt.qty = Number(dt.qty) + Number(line.scrapQty);
      dt.lines.splice(index, 1);
    }
    rec[idx] = dt;
    setRow(rec);
  };

  const process = () => {
    setDisable(true);
    const data = rows.filter((x) => x.checked === true);
    setStatus('process');
    setRow(data);
  };

  const qcFilter = async () => {
    setLoading(true);
    const result = await odoo.getQcExport(name, localStorage.getItem('wcType'));
    const res = result.map((x) => ({
      ...x,
      qty: x.outstanding_qty,
      lines: [],
    }));
    setRow(res);
    setLoading(false);
  };

  const validate = async () => {
    setLoading(true);
    setMsgBox({ variant: 'success', message: '' });
    const res = await odoo.createQcExport(rows, OdooLib.OdooDateTime(date.dateStart), OdooLib.OdooDateTime(date.dateEnd));
    if (!res.faultCode) {
      setRow(res);
      setDone(true);
      setStatus('finish');
      setMsgBox({ variant: 'success', message: 'Data telah di process' });
    } else {
      setMsgBox({ variant: 'error', message: res.message });
    }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Odoo Warehouse - List Rack</title>
      </Head>
      {status !== 'new'? (<Grid container spacing={2}>
        <Grid item xs={6} md={6} sm={6}>
                <Paper className={classes.paper} elevation={0}>
                  <TextField
                    id="dateStart"
                    label="Start Date"
                    type="datetime-local"
                    value={date.dateStart ? date.dateStart : ''}
                    onChange={(e) => {
                      setDate({ ...date, dateStart: e.target.value });
                    }}
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      readOnly: status === 'done',
                      inputProps: {
                        min: date.minDate,
                        max: date.maxDate,
                      },
                    }}
                  />
                </Paper>
          </Grid>
          <Grid item xs={6} md={6} sm={6}>
                <Paper className={classes.paper} elevation={0}>
                  <TextField
                    id="dateEnd"
                    label="End Date"
                    type="datetime-local"
                    value={date.dateEnd ? date.dateEnd : ''}
                    onChange={(e) => {
                      setDate({ ...date, dateEnd: e.target.value });
                    }}
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      readOnly: status === 'done',
                      inputProps: {
                        min: date.minDate,
                        max: date.maxDate,
                      },
                    }}
                  />
                </Paper>
          </Grid>
          
          </Grid>) : ''}
      

      {!disabled ? (
        <Box className="row">
          <Paper component="form" className={classes.root}>
            <InputBase
              className={classes.input}
              placeholder="Search Rak / Product Code"
              name="namaProduct"
              id="namaProduct"
              onChange={(event) => {
                setName(event.target.value);
              }}
            />
            <IconButton
              className={classes.iconButton}
              aria-label="search"
              onClick={qcFilter}
            >
              <SearchIcon />
            </IconButton>
          </Paper>
        </Box>
      ) : (
        ''
      )}

      <TableContainer component={Paper} className={classes.table}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              {!disabled ? (
                <StyledTableCell align="center">Check</StyledTableCell>
              ) : (
                ''
              )}

              <StyledTableCell align="center">Image</StyledTableCell>
              <StyledTableCell align="center">MO</StyledTableCell>
              <StyledTableCell align="center">Rack</StyledTableCell>
              {done ? (
                <StyledTableCell align="center">Output</StyledTableCell>
              ) : (
                ''
              )}
              <StyledTableCell align="center">Product</StyledTableCell>
              {done ? (
                <StyledTableCell align="center">Date Finished</StyledTableCell>
              ) : (
                ''
              )}
              <StyledTableCell align="center">Qty</StyledTableCell>
              {disabled ? (
                <>
                  <StyledTableCell align="center">Scrap Qty</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </>
              ) : (
                ''
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <StyledTableRow hover>
                {!disabled ? (
                  <StyledTableCell
                    className={classes.linkStyle}
                    align="center"
                    scope=""
                  >
                    <Checkbox
                      onChange={(e) => {
                        const outs = [...rows];
                        const out = { ...outs[index] };
                        out.checked = e.target.checked;
                        outs[index] = out;
                        setRow(outs);
                      }}
                      inputProps={{ 'aria-label': 'uncontrolled-checkbox' }}
                    />
                  </StyledTableCell>
                ) : (
                  ''
                )}

                <StyledTableCell
                  className={classes.linkStyle}
                  align="center"
                  scope=""
                >
                  <img
                    style={{ width: '50px', height: '50px' }}
                    src={`data:image/jpeg;base64,${row.image}`}
                    alt=""
                  />
                </StyledTableCell>
                <StyledTableCell align="center">{row.name}</StyledTableCell>
                <StyledTableCell align="center">{row.rack}</StyledTableCell>
                {done ? (
                  <StyledTableCell align="center">
                    {row.outname}
                  </StyledTableCell>
                ) : (
                  ''
                )}
                <StyledTableCell align="left">
                  {row.name_product}
                </StyledTableCell>
                {done ? (
                  <StyledTableCell align="center">
                    {OdooLib.formatDateTime(row.date_finished)}
                  </StyledTableCell>
                ) : (
                  ''
                )}
                <StyledTableCell align="center">
                  {status === 'process' ? (
                    <TextField
                      id="qty"
                      name="qty"
                      value={row.qty}
                      onChange={(e) => {
                        if (
                          Number(e.target.value) + row.scrapqty >
                          Number(row.outstanding_qty)
                        ) {
                          setMsgBox({ variant: 'error', message: 'Qty Over' });
                        } else {
                          const ln = [...rows];
                          const lnr = ln[index];
                          lnr.qty = Number(e.target.value);
                          ln[index] = lnr;
                          setRow(ln);
                        }
                      }}
                    />
                  ) : (
                    row.qty
                  )}
                </StyledTableCell>
                {disabled ? (
                  <>
                    <StyledTableCell align="center">
                      {row.scrapqty}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <FullScreenDialog
                        record={rows}
                        idx={index}
                        addScrap={addScrap}
                        msg={setMsgBox}
                        enabled={!done}
                      />
                    </StyledTableCell>
                  </>
                ) : (
                  ''
                )}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Grid container spacing={3}>
        <Grid item xs={3} md={3} sm={3}>
          <Paper className={classes.paperButton} elevation={0}>
            {!disabled ? (
              <Button variant="outlined" onClick={process}>
                Process
              </Button>
            ) : !done && rows ? (
              <Button variant="contained" onClick={validate}>
                Validate
              </Button>
            ) : (
              ''
            )}
            {
              !!done ? (<Button variant="outlined" onClick={router.push('/listQc')}>
              Refresh
            </Button>): ''
            }
            <Button variant="contained"  onClick={(e) => {
              e.preventDefault()
              localStorage.removeItem('shiftId')
              localStorage.removeItem('wcType')
              route.push({
                pathname: '/machine',
                query: { type: 'listQc' },
              })
            }}>
                Ubah QC Tipe
              </Button>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default ListQcPage;

ListQcPage.propTypes = {
  setTitle: PropTypes.func.isRequired,
  setMsgBox: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
};
