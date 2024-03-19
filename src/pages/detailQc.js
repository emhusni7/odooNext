/* eslint-disable valid-typeof */
/* eslint-disable consistent-return */
/* eslint-disable react/no-typos */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { forwardRef } from 'react';
import Head from 'next/dist/next-server/lib/head';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Autocomplete from '@material-ui/lab/Autocomplete';
import MaterialTable, { MTableEditField } from 'material-table';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import Add from '@material-ui/icons/Add';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import TextField from '@material-ui/core/TextField';
import Remove from '@material-ui/icons/Remove';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import AsyncSelect from 'react-select/async';

import OdooLib from '../models/odoo';
import { object } from 'prop-types';

const tableIcons = {
  Check: forwardRef((props, ref) => <Check ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight ref={ref} />),
  Add: forwardRef((props, ref) => <Add ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear ref={ref} />),
  Search: forwardRef((props, ref) => <Search ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowUpward ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn ref={ref} />),
};

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
    color: 'white',
    width: '50%',
  },
  paperButton: {
    marginTop: 10,
    fontSize: 20,
  },
  textFieldProduct: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(1),
    width: '90%',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

const DetailQcPage = ({ record, idx, addScrap, msg, enabled }) => {
  const classes = useStyles();
  const odoo = new OdooLib();
  const [mvLine, setMvLine] = React.useState(record[idx]);
  const filterValue = (inputValue) => odoo.getProductAll(inputValue);
  // eslint-disable-next-line no-unused-vars
  function renderName(rowData) {
    switch(rowData.resultType) {
      case 'm-potong':
        return 'Mutasi Potong';
      case 'm-finish':
        return 'Mutasi Finish';
      case 'r-proses':
        return 'Reproses';
      default:
        return 'Scrap';
    }
  }

  const [state, setState] = React.useState({
    columns: [
      {
        title: 'Id',
        field: 'id',
        hidden: true,
        required: true,
      },
      {
        field: 'productId',
        hidden: true,
      },
      {
        field: 'uomId',
        hidden: true,
      },
      {
        title: 'Type',
        field: 'resultType',
        required: true,
        render: renderName,
        width: '20%',
        editComponent: (props) => (
          
        <Autocomplete
          options={['scrap','m-potong','m-finish','r-proses']
          }
          onChange={(event, value) => {
            if (value){  
              props.rowData.resultType = value
            }
          }}
          id="resultType"
          getOptionSelected={(option, value) => option === value}
          getOptionLabel={(option) => {
            switch(option) {
              case 'm-potong':
                return 'Mutasi Potong';
              case 'm-finish':
                return 'Mutasi Finish';
              case 'r-proses':
                return 'Reproses';
              default:
                return 'Scrap';
            }
          }}
          
          renderInput={(params) => <TextField {...params} required={true} error={true} label="Type" margin="normal" />}
        />)
      },
      {
        title: 'Scrap Qty',
        field: 'scrapQty',
        type: 'numeric',
        required: true,
      },
      { title: 'Note', field: 'note', required: true },
      {
        title: 'Product',
        field: 'productName',
        required: true,
        width: '40%',
        editComponent: (props) => (
          <AsyncSelect
            id="productName"
            name="productName"
            cacheOptions
            required
            defaultOptions
            
            style={{ width: '100px' }}
            onChange={(value) => {
              if (value) {
                // eslint-disable-next-line no-param-reassign,react/prop-types
                props.rowData.productName = value.label;
                // eslint-disable-next-line max-len
                // eslint-disable-next-line no-param-reassign,react/prop-types,prefer-destructuring
                // eslint-disable-next-line max-len
                // eslint-disable-next-line no-param-reassign,react/prop-types,prefer-destructuring
                props.rowData.uomId = value.uom_id[0];
                // eslint-disable-next-line no-param-reassign,react/prop-types
                props.rowData.productId = value.value;
              }
            }}
            loadOptions={filterValue}
          />
        ),
      },
    ],
    prdQty: 0,
  });

  const editTable = {
    // eslint-disable-next-line consistent-return
    onRowAdd: (newData) =>
      new Promise((resolve, reject) => {
        if (!newData.scrapQty) {
          msg({ variant: 'error', message: 'Field Isian Qty Scrap Harus Di Isi' });
          return reject();
        } else if (!newData.note) {
          msg({ variant: 'error', message: 'Field Note Harus Di Isi' });
          return reject();
        } else if (!newData.resultType) {
          msg({ variant: 'error', message: 'Field Type Harus Di Isi' });
          return reject(); }

        if (['m-potong','m-finish','r-proses'].includes(newData.resultType)){
          if (!newData.productName){
            setTimeout(setLoading(false), 1000);
            msg({
              variant: 'error',
              message: 'Produk Harus Diisi di pilihan Mutasi/Reproses' ,
            });
            return reject();
          }
        }

        if (newData.scrapQty > mvLine.qty) {
          msg({ variant: 'error', message: 'Qty Lebih' });
          return reject();
        }
        setTimeout(() => {
          
          const rqty = mvLine.qty - newData.scrapQty;
          const scrapqty = Number(mvLine.scrapqty) + Number(newData.scrapQty);
          const mv = [...mvLine.lines, newData];
          setMvLine({
            ...mvLine,
            qty: rqty,
            scrapqty,
            lines: mv,
          });
          resolve(addScrap(idx, newData, scrapqty, 'add'));
        }, 300);
      }),
    onRowDelete: (oldData) =>
      new Promise((resolve, reject) => {
        const mv = [...mvLine.lines];
        const index = mv.indexOf(oldData);
        const scrapqty = Number(mvLine.scrapqty) - Number(oldData.scrapQty);
        if (index === -1) {
          reject();
        } else {
          mv.splice(index, 1);
          setTimeout(() => {
            setMvLine((prev) => ({
              ...prev,
              qty: mvLine.qty + Number(oldData.scrapQty),
              scrapqty,
              lines: mv,
            }));
            resolve(addScrap(idx, oldData, scrapqty, 'del'));
          }, 300);
        }
      }),
  };

  return (
    <>
      <Head>
        <title>Odoo Warehouse - List Rack</title>
      </Head>
      <>
        <Grid container spacing={1}>
          <Grid item xs={8} md={8} sm={8}>
            <TextField
              id="product"
              className={classes.textFieldProduct}
              value={mvLine.name_product}
              inputProps={{readOnly: true}}
            />
          </Grid>
          <Grid item xs={4} md={4} sm={4}>
            <TextField
              id="prdQty"
              className={classes.textFieldProduct}
              value={mvLine.qty}
              inputProps={{readOnly: true}}
            />
          </Grid>
        </Grid>
        <MaterialTable
          icons={tableIcons}
          title="Scrap"
          columns={state.columns}
          data={mvLine.lines}
          options={{
            paging: true,
            pageSize: 10,
          }}
          components={{
            EditField: (props) => {
              // eslint-disable-next-line react/destructuring-assignment,react/prop-types
              if (props.columnDef.required && !props.value) {
                return (
                  <MTableEditField {...props} error label="Required Field" />
                );
              }
              return <MTableEditField {...props} />;
            },
          }}
          editable={enabled ? editTable : false}
        />
      </>
    </>
  );
};

export default DetailQcPage;

DetailQcPage.propTypes = {
  // setTitle: PropTypes.func.isRequired,
  // eslint-disable-next-line react/require-default-props
  // eslint-disable-next-line react/no-typos
  // eslint-disable-next-line react/require-default-props
  // setMsgBox: PropTypes.func.isRequire,
};
