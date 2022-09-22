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
import DeleteIcon from '@material-ui/icons/Delete';
// import Tooltip from '@material-ui/core/Tooltip';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import OdooLib from '../models/odoo';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'code',
    numeric: false,
    disablePadding: true,
    label: 'Internal Reference',
  },
  {
    id: 'Machine',
    numeric: false,
    disablePadding: true,
    label: 'Machine',
  },
  {
    id: 'since',
    numeric: true,
    disablePadding: false,
    label: 'Billet Since Nitrid',
  },
  {
    id: 'until',
    numeric: true,
    disablePadding: false,
    label: 'Billet Until Nitrid',
  },
  {
    id: 'time',
    numeric: true,
    disablePadding: false,
    label: 'Times Nitriding',
  },
  { id: 'state', numeric: true, disablePadding: false, label: 'State' },
];

function EnhancedTableHead(props) {
  const { order, orderBy } = props;

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
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
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
  const { numSelected, dateStart, dateFinished, searchDie, page } = props;
  const [criteria, setCriteria] = React.useState('');

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0 && dateStart === '',
      })}
    >
      {numSelected > 0 && dateStart === '' ? (
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
            Nitrid
          </Typography>
          {dateStart && page === 'nitrid' ? (
            <Typography
              className={classes.title}
              variant="h10"
              id="tableTitle"
              component="div"
            >
              Date Start: {dateStart ? OdooLib.formatDateTime(dateStart) : '-'}
            </Typography>
          ) : (
            ''
          )}
          {dateFinished && page === 'nitrid' ? (
            <Typography
              className={classes.title}
              variant="h10"
              id="tableTitle"
              component="div"
            >
              Date End:
              {dateFinished ? OdooLib.formatDateTime(dateFinished) : '-'}
            </Typography>
          ) : (
            ''
          )}
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
              placeholder="Masukkan Die"
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
  dateStart: PropTypes.string,
  dateFinished: PropTypes.string,
  searchDie: PropTypes.func.isRequired,
  page: PropTypes.string,
};

EnhancedTableToolbar.defaultProps = {
  dateStart: '',
  dateFinished: '',
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
    dateStart: '',
    dateFinished: '',
    state: '',
    page: '',
  });
  const [rowsPerPage, setRowsPerPage] = React.useState(0);
  const [rows, setRow] = React.useState([]);

  const startWorking = async () => {
    setLoading(true);
    const res = await odoo.nitridStart(
      Number(localStorage.getItem('nitridId'))
    );
    if (!res.faultCode) {
      setStatus({
        ...status,
        state: res.state,
        dateStart: res.date_start,
      });
      setTitle(res.name);
      setLoading(false);
    } else {
      setLoading(false);
      setMsgBox({ variant: 'error', message: res.message });
    }
  };

  const setDone = async () => {
    setLoading(true);
    const res = await odoo.nitridDone(Number(localStorage.getItem('nitridId')));
    if (!res.faultCode) {
      setStatus({
        ...status,
        state: res.state,
        dateFinished: res.date_finished,
      });
      setLoading(false);
      localStorage.removeItem('nitridId');
    } else {
      setLoading(false);
      setMsgBox({ variant: 'error', message: res.message });
    }
  };

  const getNitrid = async (nm) => {
    setLoading(true);
    const res = await odoo.getNitrid(nm);
    console.log(res);
    if (!res.faultCode) {
      setRow(res);
      setRowsPerPage(res.length);
      setStatus({
        ...status,
        state: '',
        page: 'lookup',
      });
      setLoading(false);
    } else {
      setLoading(false);
      setMsgBox({ variant: 'error', message: res.message });
    }
  };

  const getNitridLines = async (nitridId) => {
    setLoading(true);
    const res = await odoo.getNitridLines(nitridId);
    if (!res.faultCode) {
      setRow(res.lines);
      setRowsPerPage(res.lines.length);
      setStatus({
        ...status,
        state: res.state,
        dateStart: res.dateStart,
        page: 'nitrid',
      });
      setTitle(res.name);
      setLoading(false);
    } else {
      setLoading(false);
      setMsgBox({ variant: 'error', message: res.message });
    }
  };

  React.useEffect(() => {
    let nitridId = Number(localStorage.getItem('nitridId'));
    if (
      !localStorage.getItem('shiftId') ||
      !localStorage.getItem('nitridMchId')
    ) {
      Router.push({
        pathname: '/machine',
        query: { type: 'nitrid' },
      });
    } else if (!nitridId) {
      getNitrid('');
    } else {
      getNitridLines(nitridId);
    }
    return () => {
      nitridId = '';
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
    const res = await odoo.createNitrid(selected);
    if (!res.faultCode) {
      // eslint-disable-next-line no-restricted-globals
      if (!localStorage.getItem('nitridId') && !isNaN(res)) {
        localStorage.setItem('nitridId', Number(res));
      }
      setSelected([]);
      getNitridLines(Number(res));
      setStatus({ ...status, state: 'draft' });
    } else {
      setMsgBox({ variant: 'error', message: res.message });
    }
  };

  const searchDie = (nm) => {
    getNitrid(nm);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          dateStart={status.dateStart}
          dateFinished={status.dateFinished}
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
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${row.id}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        {!status.state ? (
                          <Checkbox
                            checked={isItemSelected}
                            inputProps={{ 'aria-labelledby': labelId }}
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
                        {row.default_code}
                      </TableCell>
                      <TableCell align="left">{row.mch}</TableCell>
                      <TableCell align="right">{row.billet_nitrid}</TableCell>
                      <TableCell align="right">
                        {row.max_billet_nitrid}
                      </TableCell>
                      <TableCell align="right">{row.times_nitrid}</TableCell>
                      <TableCell align="right">
                        {status.page === 'lookup' && !row.tableId ? (
                          row.die_state
                        ) : (
                          <IconButton
                            className={classes.iconButton}
                            aria-label="delete"
                            disabled={status.state !== 'draft'}
                            onClick={async () => {
                              const result = await odoo.delNitLines(
                                row.tableId
                              );
                              const idx = selected.indexOf(row.product_id);
                              setSelected(selected.splice(idx, 1));
                              if (!result.faultCode) {
                                getNitridLines(
                                  Number(localStorage.getItem('nitridId'))
                                );
                              } else {
                                setMsgBox({
                                  variant: 'error',
                                  message: result.message,
                                });
                              }
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </TableCell>
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
      {!status.state ? (
        <Button variant="contained" color="primary" onClick={() => process()}>
          Get Nitrid
        </Button>
      ) : (
        ''
      )}
      {status.state === 'draft' ? (
        <Button
          variant="contained"
          color="primary"
          onClick={() => startWorking()}
        >
          Start Nitrid
        </Button>
      ) : (
        ''
      )}
      {status.page === 'nitrid' &&
      status.state !== 'startworking' &&
      status.state !== 'done' ? (
        <Button
          style={{ margin: 5 }}
          variant="outlined"
          color="primary"
          onClick={() => getNitrid('')}
        >
          Lookup Die
        </Button>
      ) : (
        ''
      )}
      {status.state === 'startworking' ? (
        <Button variant="contained" color="primary" onClick={() => setDone()}>
          Finished Nitrid
        </Button>
      ) : (
        ''
      )}
      {status.state === 'startworking' || status.state === 'draft' ? (
        <Button
          variant="contained"
          style={{ margin: 5 }}
          onClick={async () => {
            await odoo.cancelNitrid(Number(localStorage.getItem('nitridId')));
            localStorage.removeItem('nitridId');
            Router.reload();
          }}
        >
          Cancel Nitrid
        </Button>
      ) : (
        ''
      )}
      {status.state === 'done' ? (
        <Button
          variant="outlined"
          color="primary"
          onClick={() => Router.reload()}
        >
          Reload
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
