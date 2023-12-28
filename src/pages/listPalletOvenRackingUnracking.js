/* eslint-disable no-nested-ternary */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/dist/next-server/lib/head';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { useRouter } from 'next/router';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import Link from 'next/link';
import Scrap from './scrap';
import OdooLib from '../models/odoo';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#0b4be0',
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

const ListPalletOvenRackingUnrackingPage = ({
  setTitle,
  setMsgBox,
  setLoading,
}) => {
  const classes = useStyles();

  const odoo = new OdooLib();
  const route = useRouter();
  const { type, mode, pallet, mchId } = route.query;
  const [rows, setRows] = React.useState([]);
  const [outname, setOutname] = React.useState([]);
  const [disabled, setDisable] = React.useState(false);
  const [date, setDate] = React.useState({
    minDate: OdooLib.MinDateTime(new Date().toISOString()),
    maxDate: OdooLib.CurrentTime(new Date().toISOString()),
    dateNow: new Date().toISOString(),
  });

  useEffect(() => {
    const getDate = async () => {
      const newDate = await odoo.getDateTolerance(new Date().toISOString());
      setDate({ ...date, minDate: newDate, dateNow: OdooLib.CurrentTime(new Date().toISOString()) });
    };
    getDate();
  }, [date.minDate, mode]);

  const getData = async () => {
    setLoading(true);
    const rack = pallet instanceof Array ? pallet : [pallet];
    const data = await odoo.getCompute(
      type,
      rack,
      mode === 'start' ? 'create' : 'read'
    );
    const arrGood = [];
    data.forEach((dt) => {
      setOutname((prevState) => [...prevState, dt.output_name]);
      if (dt.type === 'good') {
        arrGood.push({ ...dt, lines: [] });
      } else {
        const newIdx = arrGood.findIndex(
          (y) => y.type === 'good' && y.output_id === dt.output_id
        );
        if (newIdx >= 0) {
          arrGood[newIdx].lines.push({
            scrapId: dt.id,
            outputId: dt.output_id,
            productname: dt.productname,
            productid: dt.productid,
            // productSName: dt.productname,
            // productSid: dt.productid,
            qtyScrap: dt.qty,
            scrapType: dt.type,
            note: dt.note,
          });
        }
      }
    });
    setRows(arrGood);
    setLoading(false);
  };

  const unique = [...new Set(outname)];
  // setTitle(unique.join(', '));

  if (mode === 'end') {
    setTitle(unique.join(', '));
  } else {
    setTitle(
      `${mode.charAt(0).toUpperCase() + mode.slice(1)} ${type
        .charAt(0)
        .toUpperCase()}${type.slice(1)}`
    );
  }

  const remvLoc = () => {
    localStorage.removeItem('loading');
  };

  const setStart = async () => {
    setLoading(true);
    setDisable(true);
    const rowFilter = rows.filter(
      (x) => x.qty > 0 || (x.qty === 0 && x.lines.length > 0)
    );
    const data = await odoo.setOutput(rowFilter, mchId);
    if (!data.faultCode) {
      setMsgBox({ variant: 'success', message: 'Data has been Validate' });
      setRows(data);
      setLoading(false);
    } else {
      setMsgBox({ variant: 'error', message: data.message });
      setLoading(false);
    }
  };

  const setInwork = (e) => {
    e.preventDefault();
    switch (e.detail) {
      case 1:
        if (!date.dateNow || date.dateNow < date.minDate) {
          setMsgBox({
            variant: 'error',
            message:
              'Tanggal Harus Di Isi / Tanggal Backdate Lebih dari 1 hari',
          });
        } else {
          setStart();
        }
        break;
      case 2:
        console.log('double click');
        break;
      case 3:
        console.log('triple click');
        break;
      default:
    }
  };

  const setDoneS = async () => {
    setMsgBox({ variant: 'success', message: '' });
    let outputIds;
    let errorRack = false;
    const racks = [];
    const scrapbs = [];
    rows.forEach((x) => {
      if (!x.rack || x.rack === '') {
        errorRack = true;
      } else {
        racks.push({ id: x.id, rack: x.rack, hardness: x.hardness });
      }
      x.lines.forEach((y) => {
        if (y.scrapId === 0) {
          scrapbs.push({
            output_id: x.output_id,
            qty: x.qty,
            productid: y.productid,
            qtyScrap: Number(y.qtyScrap),
            note: y.note,
            productSId: y.productSId,
            scrapType: y.scrapType,
            rack: x.rack,
            bs: !!y.productSId,
          });
        }
      });
    });

    if (['unracking', 'anodize', 'painting', 'racking'].includes(type)) {
      outputIds = rows.filter((x) => x.checked).map((x) => x.output_id);
    } else {
      outputIds = rows.map((x) => x.output_id);
    }

    outputIds = [...new Set(outputIds)];

    if (outputIds.length === 0) {
      setMsgBox({
        variant: 'error',
        message: 'Tidak ada Pilihan yang di centang',
      });
    } else if (errorRack) {
      setMsgBox({
        variant: 'error',
        message: 'Rack Required',
      });
    } else {
      setLoading(true);
      localStorage.setItem('loading', true);
      const data = await odoo.actionDone(
        outputIds,
        scrapbs,
        racks,
        OdooLib.OdooDateTime(date.dateNow)
      );
      if (!data.faultCode) {
        const rws = rows
          .filter((x) => outputIds.includes(x.output_id))
          .map((x) => ({
            ...x,
            date_finished: data.find((y) => y.id === x.output_id)
              ? data.find((y) => y.id === x.output_id).date_finished
              : '',
          }));
        setRows(rws);
        setOutname(rws.map((x) => x.output_name));
        setMsgBox({ variant: 'success', message: 'Data has been Validate' });
        setDisable(true);
        setLoading(false);
      } else {
        setMsgBox({ variant: 'error', message: data.message });
        setDisable(true);
        setLoading(false);
      }
    }
  };

  const actionDone = (e) => {
    e.preventDefault();
    const checkHardness = rows.filter((x) => x.error == true).map((x) => x.output_id);
    
    switch (e.detail) {
      case 1:
        if (!date.dateNow || date.dateNow < date.minDate) {
          setMsgBox({
            variant: 'error',
            message:
              'Tanggal Harus Di Isi / Tanggal Backdate Lebih dari 1 hari',
          });
        } else if (checkHardness.length>0){
          setMsgBox({
            variant: 'error',
            message:
              'Isian Hardness Salah Contoh Format Depan;Tengah;Belakang',
          });
        } else {
          setDoneS();
        }

        break;
      case 2:
        console.log('double click');
        break;
      case 3:
        console.log('triple click');
        break;
      default:
    }
  };

  const addScrap = (index, line) => {
    const rec = [...rows];
    let dt = { ...rec[index] };
    dt.qty -= line.qtyScrap;

    if (dt.lines) {
      dt.lines.push(line);
    } else {
      dt = { ...dt, lines: [line] };
    }
    rec[index] = dt;
    setRows(rec);
  };

  const changeQty = (e, index) => {
    e.preventDefault();
    setMsgBox({ variant: 'success', message: '' });
    const outs = [...rows];
    const out = { ...outs[index] };
    const scQty = out.lines.reduce((qtySc, line) => qtySc + line.qtyScrap, 0);
    if (Number(e.target.value) + scQty > Number(out.qtyNett)) {
      setMsgBox({ variant: 'error', message: 'Qty Over' });
    } else {
      out.qty = Number(e.target.value);
      outs[index] = out;
      setRows(outs);
    }
  };

  const pattern = /^[\0-9\.]+;([\0-9]+\;)+\d*$/
  const changeHardnes = (e, index) => {
    e.preventDefault();
    setMsgBox({ variant: 'success', message: '' });
    const outs = [...rows];
    const out = { ...outs[index] };

    if (pattern.test(e.target.value) === false){
      out.error = true;
    } else {
      out.error = false;
    }
    if (!!e.target.value){
    out.hardness = e.target.value;
    outs[index] = out;
    setRows(outs);
  }
  };

  const TextF = (index, qty) => {
    return (
      <TextField
        id="qtyProduce"
        name="qtyProduce"
        type="number"
        disabled={
          disabled ||
          ![
            'anodize',
            'unracking',
            'preChromate',
            'painting',
            'racking',
          ].includes(type)
        }
        value={qty}
        onChange={(e) => changeQty(e, index)}
        onFocus={() => {
          const outs = [...rows];
          const out = { ...outs[index] };
          out.qty = '';
          outs[index] = out;
          setRows(outs);
        }}
        margin="dense"
      />
    );
  };

  const Hardness = (index, str, errors) => {
    console.log(str);
    return (<TextField
      id="hardness"
      name="hardness"
      error={errors}
      disabled={
        disabled ||
        ![
          'oven',
        ].includes(type)
      }
      value={str}
      onChange={(e) => changeHardnes(e, index)}
      
      margin="dense"
    />)
  }

 

  React.useEffect(() => {
    let load = localStorage.getItem('loading');
    getData();
    if (load !== null) {
      setDisable(true);
    } else {
      setDisable(false);
    }
    return () => {
      load = false;
      remvLoc();
    };
  }, [mode]);

  return (
    <>
      <Head>
        <title>Odoo Warehouse - List Rack</title>
      </Head>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          {mode === 'start' ? (
            <TextField
              id="date-start"
              label="Tanggal Awal"
              type="datetime-local"
              value={
                rows.length > 0
                  ? rows[0].date_start
                    ? OdooLib.formatDateTime(rows[0].date_start)
                    : OdooLib.CurrentTime(date.dateNow)
                  : OdooLib.CurrentTime(date.dateNow)
              }
              onChange={(e) => {
                const newRows = rows.map((x) => {
                  return {
                    ...x,
                    date_start: OdooLib.OdooDateTime(e.target.value),
                  };
                });
                setRows(newRows);
                setDate({ ...date, dateNow: e.target.value });
              }}
              required
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                // readOnly: press.status === 'Done',
                inputProps: {
                  min: date.minDate,
                  max: date.maxDate,
                },
              }}
            />
          ) : (
            <TextField
              id="date-finished"
              label="Tanggal Akhir"
              type="datetime-local"
              value={
                rows.length > 0
                  ? rows[0].date_finished
                    ? OdooLib.formatDateTime(rows[0].date_finished)
                    : OdooLib.CurrentTime(date.dateNow)
                  : OdooLib.CurrentTime(date.dateNow)
              }
              onChange={(e) => {
                const newRows = rows.map((x) => {
                  return {
                    ...x,
                    date_finished: OdooLib.OdooDateTime(e.target.value),
                  };
                });
                setRows(newRows);
                setDate({ ...date, dateNow: e.target.value });
              }}
              required
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                // readOnly: press.status === 'Done',
                inputProps: {
                  min: date.minDate,
                  max: date.maxDate,
                },
              }}
            />
          )}
        </Grid>
        <Grid item xs={6} />
        <Grid item xs={12}>
          <TableContainer component={Paper} className={classes.table}>
            <Table className={classes.table} aria-label="customized table">
              <TableHead>
                <TableRow>
                  {mode === 'end' &&
                  ['unracking', 'anodize', 'painting', 'racking'].includes(
                    type
                  ) &&
                  !disabled ? (
                    <StyledTableCell align="center">Check</StyledTableCell>
                  ) : (
                    ''
                  )}
                  <StyledTableCell align="center">Image</StyledTableCell>
                  <StyledTableCell align="center">MO</StyledTableCell>
                  <StyledTableCell align="center">Product</StyledTableCell>
                  {mode === 'end' ? (
                    <StyledTableCell align="center">Start Date</StyledTableCell>
                  ) : (
                    ''
                  )}
                  {mode === 'end' && disabled ? (
                    <StyledTableCell align="center">End Date</StyledTableCell>
                  ) : (
                    ''
                  )}
                  <StyledTableCell align="center">Rack</StyledTableCell>
                  <StyledTableCell align="center">Qty</StyledTableCell>
                  {mode === 'start' ? (
                    <StyledTableCell align="center">
                      Qty Produce
                    </StyledTableCell>
                  ) : (
                    ''
                  )}
                  <StyledTableCell align="center">Type</StyledTableCell>
                  <StyledTableCell align="center">Note</StyledTableCell>
                  {(mode === 'end' ) && ['oven'].includes(type)? (<StyledTableCell align="center">Hardness</StyledTableCell>): ''}
                  {(mode === 'end' && !disabled) ||
                  (mode === 'start' &&
                    [
                      'painting',
                      'anodize',
                      'unracking',
                      'preChromate',
                      'racking',
                    ].includes(type) &&
                    !disabled) ? (
                    <StyledTableCell align="center">Action</StyledTableCell>
                  ) : (
                    ''
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .sort((a, b) =>
                    // eslint-disable-next-line no-nested-ternary
                    a.output_id > b.output_id
                      ? 1
                      : a.output_id < b.output_id
                      ? -1
                      : 0
                  )
                  .map((row, index) => (
                    <>
                      <StyledTableRow hover>
                        {mode === 'end' &&
                        row.type === 'good' &&
                        [
                          'anodize',
                          'painting',
                          'racking',
                          'unracking',
                        ].includes(type) &&
                        !disabled ? (
                          <StyledTableCell align="center">
                            <Checkbox
                              onChange={(e) => {
                                const out = { ...rows[index] };
                                out.checked = e.target.checked;
                                rows[index] = out;
                                setRows(rows);
                              }}
                              disabled={disabled}
                              value={row.checked}
                              inputProps={{ 'aria-label': 'Check' }}
                            />
                          </StyledTableCell>
                        ) : mode === 'end' &&
                          row.type !== 'good' &&
                          // eslint-disable-next-line prettier/prettier
                          ['unracking', 'anodize', 'painting', 'racking']
                            // eslint-disable-next-line prettier/prettier
                            .includes(type) ? (
                          <StyledTableCell align="center" />
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
                        <StyledTableCell align="center">
                          {row.moname}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.productname}
                        </StyledTableCell>

                        {mode === 'end' ? (
                          <StyledTableCell align="center">
                            {row.datestart
                              ? OdooLib.formatDateTime(row.datestart)
                              : ''}
                          </StyledTableCell>
                        ) : (
                          ''
                        )}
                        {mode === 'end' && disabled ? (
                          <StyledTableCell align="center">
                            {OdooLib.formatDateTime(row.date_finished)}
                          </StyledTableCell>
                        ) : (
                          ''
                        )}
                        <StyledTableCell align="center">
                          {(row.wc_type === 'F' || type === 'anodize') &&
                          mode === 'end' &&
                          !disabled ? (
                            <TextField
                              id="rack"
                              name="rack"
                              value={row.rack}
                              onChange={(e) => {
                                const ln = [...rows];
                                const lnr = ln[index];
                                lnr.rack = e.target.value;
                                ln[index] = lnr;
                                setRows(ln);
                              }}
                            />
                          ) : (
                            row.rack
                          )}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {mode === 'end' ? row.qty : row.qtyNett}
                        </StyledTableCell>
                        {mode === 'start' ? (
                          <StyledTableCell align="right">
                            {TextF(index, row.qty)}
                          </StyledTableCell>
                        ) : (
                          ''
                        )}
                        <StyledTableCell align="center">
                          {row.type}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.note}
                        </StyledTableCell>
                        {(mode === 'end' && ['oven'].includes(type)) ? <StyledTableCell align="center">{Hardness(index, row.hardness, row.error)}</StyledTableCell> : ''} 
                        {(row.type === 'good' &&
                          mode === 'end' &&
                          row.note !== 'Roll' &&
                          !disabled) ||
                        (mode === 'start' &&
                          [
                            'painting',
                            'anodize',
                            'unracking',
                            'racking',
                            'preChromate',
                          ].includes(type) &&
                          !disabled &&
                          row.type === 'good') ? (
                          <StyledTableCell align="center">
                            <Scrap
                              index={index}
                              record={{
                                qty: row.qty,
                                productid: row.productid,
                                productname: row.productname,
                                id: row.id,
                                output_id: row.output_id,
                              }}
                              addScrap={addScrap}
                              mode={mode}
                              loading={setLoading}
                              type={type}
                            />
                          </StyledTableCell>
                        ) : (
                          ''
                        )}
                      </StyledTableRow>
                      {row.lines
                        ? row.lines.map((x, idx) => (
                            <StyledTableRow>
                              {mode === 'end' &&
                              row.type === 'good' &&
                              // eslint-disable-next-line prettier/prettier
                              [
                                'unracking',
                                'anodize',
                                'painting',
                                'racking',
                              ].includes(
                                // eslint-disable-next-line prettier/prettier
                                type
                              ) &&
                              !disabled ? (
                                <StyledTableCell align="center" />
                              ) : mode === 'end' &&
                                row.type !== 'good' &&
                                // eslint-disable-next-line prettier/prettier
                                [
                                  'unracking',
                                  'anodize',
                                  'painting',
                                  'racking',
                                ].includes(
                                  // eslint-disable-next-line prettier/prettier
                                  type
                                ) &&
                                !disabled ? (
                                <StyledTableCell align="center" />
                              ) : (
                                ''
                              )}
                              <StyledTableCell />
                              <StyledTableCell />
                              <StyledTableCell>
                                {x.productSName}
                              </StyledTableCell>
                              <StyledTableCell />
                              {mode === 'end' && disabled ? (
                                <StyledTableCell align="center" />
                              ) : (
                                ''
                              )}
                              <StyledTableCell />
                              <StyledTableCell align="right">
                                {x.qtyScrap}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {x.scrapType}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {x.note}
                              </StyledTableCell>
                            
                              {disabled ? (
                                ''
                              ) :  (
                                <StyledTableCell>
                                  <IconButton
                                    className={classes.iconButton}
                                    aria-label="delete"
                                    onClick={async () => {
                                      setMsgBox({
                                        variant: 'success',
                                        message: '',
                                      });
                                      setLoading(true);
                                      const data = [...rows];
                                      const rec = { ...data[index] };
                                      const line = [...rec.lines];
                                      rec.qty += Number(x.qtyScrap);
                                      let result = false;
                                      if (line[idx].scrapId > 0) {
                                        result = await odoo.addScrapOLine(
                                          'del',
                                          'scrap',
                                          0,
                                          false,
                                          Number(x.qtyScrap) +
                                            Number(rec.qtyNett),
                                          rec.id,
                                          line[idx].scrapId,
                                          false
                                        );
                                        if (!result.faultCode) {
                                          result = true;
                                        }
                                      } else {
                                        result = true;
                                      }
                                      if (result) {
                                        line.splice(idx, 1);
                                        rec.lines = line;
                                        data[index] = rec;
                                        console.log(data[index]);
                                        setRows(data);
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
                                </StyledTableCell>
                              )}
                            </StyledTableRow>
                          ))
                        : ''}
                    </>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={3} md={3} sm={3}>
          <Paper className={classes.paperButton} elevation={0}>
            {disabled || rows.length === 0 ? (
              ''
            ) : mode === 'start' ? (
              <Button variant="contained" onClick={(e) => setInwork(e)}>
                Start
              </Button>
            ) : mode === 'end' ? (
              <Button variant="contained" onClick={actionDone}>
                Finished
              </Button>
            ) : (
              ''
            )}
          </Paper>
        </Grid>
        <Grid item xs={3} md={3} sm={3}>
          {mode === 'start' && disabled ? (
            <Link
              href={{
                pathname: '/listPalletOvenRackingUnracking',
                query: {
                  type,
                  mode: 'end',
                  pallet,
                  mchId,
                },
              }}
            >
              Go TO Finished
            </Link>
          ) : (
            ''
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default ListPalletOvenRackingUnrackingPage;

ListPalletOvenRackingUnrackingPage.propTypes = {
  setTitle: PropTypes.func.isRequired,
  setMsgBox: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  row: PropTypes.shape({
    type: PropTypes.string,
    checked: PropTypes.bool,
    image: PropTypes.string,
    productname: PropTypes.string,
    datestart: PropTypes.string,
    date_finished: PropTypes.string,
    qty: PropTypes.number,
    qtyNett: PropTypes.number,
    rack: PropTypes.string,
    note: PropTypes.string,
    id: PropTypes.number,
    output_id: PropTypes.number,
    lines: PropTypes.arrayOf(
      PropTypes.shape({
        qty: PropTypes.number.isRequired,
        type: PropTypes.string.isRequired,
        note: PropTypes.string.isRequired,
      })
    ).isRequired,
    moname: PropTypes.string,
  }).isRequired,
};
