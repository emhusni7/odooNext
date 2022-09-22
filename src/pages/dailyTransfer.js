/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import OdooLib from '../models/odoo';

const useStyles = makeStyles({
  table: {
    // minWidth: 700,
  },
});

const DailyTransfer = ({ loading, params }) => {
  const odoo = new OdooLib();
  const classes = useStyles();
  const [data, setData] = React.useState({
    local: [],
    export: [],
  });
  const getData = async () => {
    loading(true);
    const result = await odoo.getDailyTransferData(
      Number(params.month),
      Number(params.target_lokal),
      Number(params.target_export),
      Number(params.vol_lokal),
      Number(params.vol_export)
    );
    if (!result.faultCode) {
      setData({
        ...result,
      });
    }
    loading(false);
    // return result;
  };
  React.useEffect(() => {
    getData();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="spanning table">
        <TableHead>
          <TableRow>
            <TableCell align="center" colSpan={3}>
              {`Lokal ( Target = ${params.target_lokal} (Ton) , Tonase/Hari = ${params.vol_lokal} (Ton))`}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align="right">Pengriman(Ton)</TableCell>
            <TableCell align="right">Total (Ton)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.local &&
            data.local.map((row) => (
              <TableRow key={row.date_done}>
                <TableCell>{row.date_done}</TableCell>
                <TableCell align="right">{row.product_qty}</TableCell>
                <TableCell align="right">{row.total}</TableCell>
              </TableRow>
            ))}

          <TableRow>
            <TableCell colSpan={1} />
            <TableCell>Minus Target</TableCell>
            <TableCell align="right">{data.minus_local}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={1} />
            <TableCell>Hari</TableCell>
            <TableCell align="right">{data.hari}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Table className={classes.table} size="small" aria-label="spanning table">
        <TableHead>
          <TableRow>
            <TableCell align="center" colSpan={3}>
              {`Export ( Target = ${params.target_export} (Ton) , Tonase/Pengiriman = ${params.vol_export} (Ton))`}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align="right">Pengriman(Ton)</TableCell>
            <TableCell align="right">Total (Ton)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.export &&
            data.export.map((row) => (
              <TableRow key={row.date_done}>
                <TableCell>{row.date_done}</TableCell>
                <TableCell align="right">{row.product_qty}</TableCell>
                <TableCell align="right">{row.total}</TableCell>
              </TableRow>
            ))}

          <TableRow>
            <TableCell colSpan={1} />
            <TableCell>Minus Target</TableCell>
            <TableCell align="right">{data.minus_export}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={1} />
            <TableCell>Kontainer</TableCell>
            <TableCell align="right">{data.kontainer}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

DailyTransfer.propTypes = {
  loading: PropTypes.func.isRequired,
  params: PropTypes.object,
};
export default DailyTransfer;
