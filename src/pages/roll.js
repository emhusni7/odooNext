/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import Router from 'next/router';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
// import Tooltip from '@material-ui/core/Tooltip';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import Scrap from './scrap';
import OdooLib from '../models/odoo';

const headCells = [
  {
    id: 'mo',
    numeric: false,
    disablePadding: true,
    label: 'MO',
    colSpan: 1,
  },
  {
    id: 'rack',
    numeric: false,
    disablePadding: false,
    label: 'Rack',
    colSpan: 1,
  },
  {
    id: 'outName',
    numeric: false,
    disablePadding: false,
    label: 'Output Name',
    colSpan: 1,
  },
  {
    id: 'product',
    numeric: false,
    disablePadding: false,
    label: 'Product',
    colSpan: 1,
  },
  {
    id: 'qty',
    numeric: true,
    disablePadding: false,
    label: 'Qty',
    colSpan: 1,
  },
  {
    id: 'action',
    numeric: true,
    disablePadding: false,
    label: 'Action',
    colSpan: 2,
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, page } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox" />
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
            colSpan={headCell.colSpan}
          >
            {headCell.id === 'outName'
              ? page === 'lookup'
                ? 'Type'
                : headCell.label
              : headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  page: PropTypes.string.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected, searchDie, page } = props;
  const [criteria, setCriteria] = React.useState('');

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <>
          <Typography
            className={classes.title}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Roll
          </Typography>
        </>
      )}
      {page === 'lookup' ? (
        <Typography
          className={classes.input}
          variant="h10"
          id="tableTitle"
          component="div"
        >
          <Paper
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              searchDie(criteria);
            }}
          >
            <InputBase
              className={classes.input}
              placeholder="Masukkan MO"
              onChange={(event) => setCriteria(event.target.value)}
              name="name"
              id="name"
            />
            <IconButton
              className={classes.iconButton}
              aria-label="search"
              onClick={() => {
                searchDie(criteria);
              }}
            >
              <SearchIcon />
            </IconButton>
          </Paper>
        </Typography>
      ) : (
        ''
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  searchDie: PropTypes.func.isRequired,
  page: PropTypes.string,
};

EnhancedTableToolbar.defaultProps = {
  page: '',
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

const EnhancedTable = ({ setTitle, setLoading, setMsgBox }) => {
  const classes = useStyles();
  const odoo = new OdooLib();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('default_code');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [status, setStatus] = React.useState({
    state: '',
    page: '',
  });
  const [rowsPerPage, setRowsPerPage] = React.useState(0);
  const [rows, setRow] = React.useState([]);
  const [outname, setOutname] = React.useState([]);

  setTitle(outname.join(', '));
  const addScrap = (index, line) => {
    const rec = [...rows];
    const dt = { ...rec[index] };
    dt.qty -= line.qtyScrap;
    const idx = rec.map((x) => x.output_id).lastIndexOf(line.output_id);
    if (idx > -1) {
      rec.splice(idx + 1, 0, {
        ...dt,
        qty: line.qtyScrap,
        result_type: line.scrapType,
        line_id: dt.id,
        id: 0,
        note: line.note,
      });
      rec[index] = dt;
      setRowsPerPage(rowsPerPage + 1);
    }
    setRow(rec);
  };

  const getRoll = async (nm) => {
    setLoading(true);
    const res = await odoo.getRoll(nm);
    setLoading(false);
    if (!res.faultCode) {
      setRow(res);
      setRowsPerPage(res.length);
    } else {
      setMsgBox({ variant: 'error', message: 'Load Data Error' });
    }

    setStatus({
      ...status,
      state: '',
      page: 'lookup',
    });
  };

  const getRollLines = async (rollId) => {
    setLoading(true);
    const res = await odoo.getRollIp(rollId);
    if (!res.faultCode) {
      const rollIds = res.map((roll) => roll.output_id);
      if (rollIds.length <= 0) {
        localStorage.removeItem('rollIds');
        getRoll();
      } else {
        localStorage.setItem('rollIds', JSON.stringify(rollIds));
        setOutname((prevState) => [
          ...prevState,
          res.map((x) => x.output_name),
        ]);
        setRow(res);
        setRowsPerPage(res.length);
        setStatus({
          ...status,
          state: 'start',
          page: 'roll',
        });
        setTitle(res.name);
      }
      setLoading(false);
    } else {
      setLoading(false);
      setMsgBox({ variant: 'error', message: res.message });
    }
  };

  React.useEffect(() => {
    let rollId = localStorage.getItem('rollIds');
    if (
      !localStorage.getItem('shiftId') ||
      !localStorage.getItem('rollMchId')
    ) {
      Router.push({
        pathname: '/machine',
        query: { type: 'roll' },
      });
    } else if (rollId) {
      getRollLines(rollId);
    } else {
      getRoll();
    }
    return () => {
      rollId = '';
    };
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const process = async () => {
    setLoading(true);
    setMsgBox({ variant: 'success', message: '' });
    const selRow = rows.filter((row) => selected.indexOf(row.id) !== -1);
    const res = await odoo.createRoll(selRow);
    setLoading(false);
    if (!res.faultCode) {
      localStorage.setItem('rollIds', JSON.stringify(res));
      const result = await odoo.getRollIp(JSON.stringify(res));
      if (!result.faultCode) {
        setOutname((prevState) => [
          ...prevState,
          result.map((x) => x.output_name),
        ]);
        setRow(result);
        setSelected([]);
        setRowsPerPage(result.length);
        setStatus({
          state: 'start',
          page: 'roll',
        });
      }
    } else {
      setMsgBox({ variant: 'error', message: res.message });
    }
  };

  const setDoneRoll = async () => {
    setLoading(true);
    setMsgBox({ variant: 'success', message: '' });
    const res = await odoo.setDoneRoll(rows);
    setLoading(false);
    if (!res.faultCode) {
      localStorage.removeItem('rollIds');
      setStatus({ ...status, state: 'done' });
      setMsgBox({ variant: 'success', message: 'Transaction Has Been Done' });
    } else {
      setMsgBox({ variant: 'error', message: res.message });
    }
  };

  const searchDie = (nm) => {
    getRoll(nm);
  };

  const delItem = (index) => {
    setMsgBox({
      variant: 'success',
      message: '',
    });
    setLoading(true);
    const data = [...rows];
    const rec = { ...data[index] };
    const idx = rows.findIndex((x) => x.id === rec.line_id);
    if (idx > -1) {
      data.splice(index, 1);
      data[idx].qty += Number(rec.qty);
      setRow(data);
      setRowsPerPage(rowsPerPage - 1);
    }

    setLoading(false);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          searchDie={searchDie}
          page={status.page}
        />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              page={status.page}
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {rows
                // eslint-disable-next-line func-names
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${row.id}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        {!status.state && status.page === 'lookup' ? (
                          <Checkbox
                            checked={isItemSelected}
                            inputProps={{ 'aria-labelledby': labelId }}
                            onClick={(event) => handleClick(event, row.id)}
                          />
                        ) : (
                          ''
                        )}
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.id !== 0 ? row.mo : ''}
                      </TableCell>
                      <TableCell align="left">
                        {row.id !== 0 ? (
                          <TextField
                            id="rack"
                            name="rack"
                            value={row.rack}
                            disabled={
                              status.page === 'lookup' ||
                              status.state === 'done'
                            }
                            onChange={(e) => {
                              e.preventDefault();
                              setMsgBox({ variant: 'success', message: '' });
                              const outs = [...rows];
                              const out = { ...outs[index] };
                              out.rack = e.target.value;
                              outs[index] = out;
                              setRow(outs);
                            }}
                            margin="dense"
                          />
                        ) : (
                          ''
                        )}
                      </TableCell>
                      <TableCell align="left">
                        {status.page === 'roll' ? row.output_name : row.type}
                      </TableCell>
                      <TableCell align="left">{row.product_name}</TableCell>
                      <TableCell align="right">{row.qty}</TableCell>
                      <TableCell align="left">{row.note}</TableCell>
                      {status.page !== 'lookup' ? (
                        <TableCell align="right">
                          {row.id !== 0 &&
                          status.page === 'roll' &&
                          status.state === 'start' ? (
                            <Scrap
                              index={index}
                              record={{
                                qty: row.qty,
                                productid: row.product_id,
                                productname: row.product_name,
                                id: row.id,
                                output_id: row.output_id,
                              }}
                              addScrap={addScrap}
                              loading={setLoading}
                            />
                          ) : row.id === 0 &&
                            status.page === 'roll' &&
                            status.state !== 'done' ? (
                            <IconButton
                              className={classes.iconButton}
                              aria-label="delete"
                              onClick={() => delItem(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          ) : (
                            ''
                          )}
                        </TableCell>
                      ) : (
                        ''
                      )}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 33 }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      {!status.state && status.page === 'lookup' ? (
        <Button variant="contained" color="secondary" onClick={() => process()}>
          Start roll
        </Button>
      ) : (
        ''
      )}
      {status.state === 'start' && status.page === 'roll' ? (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setDoneRoll()}
        >
          Set Done
        </Button>
      ) : (
        ''
      )}
    </div>
  );
};
export default EnhancedTable;

EnhancedTable.propTypes = {
  setTitle: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  setMsgBox: PropTypes.func.isRequired,
};
