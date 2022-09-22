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
import AsyncSelect from 'react-select/async';
import FormHelperText from '@material-ui/core/FormHelperText';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
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
    id: 'nb',
    numeric: false,
    disablePadding: true,
    label: 'Nama Barang',
  },
  {
    id: 'lot',
    disablePadding: false,
    label: 'Lot',
  },
  {
    id: 'length',
    numeric: true,
    disablePadding: false,
    label: 'Panjang (CM)',
  },
  {
    id: 'qty_btg',
    numeric: true,
    disablePadding: false,
    label: 'Qty (Btg)',
  },
  {
    id: 'pot_kg',
    numeric: true,
    disablePadding: false,
    label: 'Sisa Potongan (Kg)',
  },
  {
    id: 'pot_cm',
    numeric: true,
    disablePadding: false,
    label: 'Sisa Potongan (Cm)',
  },
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
  paper2: {
    padding: 10,
    marginTop: 2,
    textAlign: 'left',
    inWidth: '100%',
  },
  paperAutoComplate: {
    heigth: 50,
    width: '100%',
  },
}));

const EnhancedTableToolbar = () => {
  const classes = useToolbarStyles();

  return <Toolbar className={clsx(classes.root)} />;
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
  formControl: {
    minWidth: '100%',
    Width: '50%',
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
  textFieldFull: {
    width: '100%',
    marginTop: 10,
  },
  textField: {
    width: '50%',
    marginTop: 10,
  },
  labelDesign: {
    margin: 'auto',
    width: '100%',
    paddingTop: 20,
    paddingLeft: 10,
    marginLeft: 10,
  },
}));

const EnhancedTable = ({ setTitle, setLoading, setMsgBox }) => {
  const classes = useStyles();
  const odoo = new OdooLib();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('default_code');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  setTitle('Inventory Lot');
  const [status, setStatus] = React.useState({
    dateStart: '',
    dateFinished: '',
    state: '',
    page: '',
  });

  const [params, setParams] = React.useState({
    locId: 0,
    locName: '',
    prdId: 0,
    prdName: '',
    status: 'new',
  });

  const [rowsPerPage, setRowsPerPage] = React.useState(0);
  const [rows, setRow] = React.useState([]);
  const filterLoc = (inputValue) => odoo.asyncgetLocation(inputValue);
  const filterProduct = (inputValue) => odoo.getProductAll(inputValue);

  const getInvLot = async () => {
    setLoading(true);
    const res = await odoo.getInvLot(params.locId, params.prdId);
    if (!res.faultCode) {
      setRow(res);
      setRowsPerPage(res.length);
      setStatus({
        ...status,
        state: 'Done',
      });
      setLoading(false);
    } else {
      setLoading(false);
      setMsgBox({ variant: 'error', message: res.message });
    }
  };
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

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper2} elevation={2}>
        <Grid container spacing={2}>
          <Grid item xs={3} sm container className={classes.labelDesign}>
            <Grid item xs={9}>
              <FormControl className={classes.formControl}>
                <AsyncSelect
                  id="locId"
                  name="locId"
                  cacheOptions
                  required
                  defaultOptions
                  isClearable
                  isDisabled={params.status === 'done'}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(value) => {
                    if (value) {
                      setParams({
                        ...params,
                        locName: value.label,
                        locId: value.value,
                      });
                    } else {
                      setParams({
                        ...params,
                        locName: '',
                        locId: 0,
                      });
                    }
                  }}
                  //   isDisabled={disable || mvLine.consume.length > 0}
                  isSearchable
                  placeholder="Location"
                  loadOptions={filterLoc}
                />
                <FormHelperText>
                  {/* {!etching.corrid && etching.state === 'startworking'
                      ? 'Required'
                      : ''} */}
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={3} sm container className={classes.labelDesign}>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs={9}>
                <FormControl className={classes.formControl}>
                  <AsyncSelect
                    id="productId"
                    name="productId"
                    cacheOptions
                    required
                    defaultOptions
                    isClearable
                    isDisabled={params.status === 'done'}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(value) => {
                      if (value) {
                        setParams({
                          ...params,
                          prdName: value.label,
                          prdId: value.value,
                        });
                      } else {
                        setParams({
                          ...params,
                          prdName: '',
                          prdId: 0,
                        });
                      }
                    }}
                    isSearchable
                    placeholder="Product"
                    loadOptions={filterProduct}
                  />
                  <FormHelperText>
                    {/* {!etching.corrid && etching.state === 'startworking'
                      ? 'Required'
                      : ''} */}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <Button
                  onClick={() => getInvLot()}
                  variant="contained"
                  color="primary"
                  //   disabled={disabled}
                >
                  Process
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          numSelected={selected.length}
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
                      <TableCell />
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {`[${row.default_code}] ${row.name_template}`}
                      </TableCell>
                      <TableCell align="left">{row.lot_name}</TableCell>
                      <TableCell align="right">{row.length_billet}</TableCell>
                      <TableCell align="right">
                        {row.qty_batang.toLocaleString(undefined, {
                          maximumFractionDigits: 3,
                        })}
                      </TableCell>
                      <TableCell align="right">
                        {row.qty_adjus.toLocaleString(undefined, {
                          maximumFractionDigits: 3,
                        })}
                      </TableCell>
                      <TableCell align="right">
                        {row.qty_adjus_cm.toLocaleString(undefined, {
                          maximumFractionDigits: 3,
                        })}
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
    </div>
  );
};
export default EnhancedTable;

EnhancedTable.propTypes = {
  setTitle: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  setMsgBox: PropTypes.func.isRequired,
};
