/* eslint-disable jsx-a11y/alt-text */
import React, { forwardRef } from 'react';
import MaterialTable from 'material-table';
import RefreshIcon from '@material-ui/icons/Refresh';
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
import PropTypes from 'prop-types';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import OdooLib from '../models/odoo';

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

const RefreshData = ({ setTitle, setMsgBox }) => {
  const tableRef = React.createRef();
  const odoo = new OdooLib();
  setTitle('');
  return (
    <MaterialTable
      icons={tableIcons}
      title="Product To Sale"
      tableRef={tableRef}
      options={{
        pageSize: 10,
        pageSizeOptions: [10, 20, 50],
        totalCount: 400,
        sorting: false,
      }}
      columns={[
        { title: 'Code Product', field: 'default_code' },
        { title: 'Qty', field: 'qty' },
      ]}
      data={(query) =>
        // eslint-disable-next-line no-unused-vars

        new Promise((resolve, reject) => {
          odoo
            .getSaleProduct(
              query.page,
              query.pageSize,
              query.search,
              query.orderBy
            )
            .then((result) => {
              if (!result.faultCode) {
                resolve({
                  data: result.data,
                  page: result.page,
                  totalCount: result.total,
                });
              } else {
                reject();
                setMsgBox({
                  variant: 'error',
                  message: 'errpr',
                });
              }
            })
            .catch((err) =>
              setMsgBox({
                variant: 'error',
                message: err,
              })
            );
        })
      }
      actions={[
        {
          icon: RefreshIcon,
          tooltip: 'Refresh Data',
          isFreeAction: true,
          onClick: () => tableRef.current && tableRef.current.onQueryChange(),
        },
      ]}
    />
  );
};

RefreshData.propTypes = {
  setTitle: PropTypes.func.isRequired,
  setMsgBox: PropTypes.func.isRequired,
};

export default RefreshData;
