/* eslint-disable react/prop-types */
import React from 'react';
// import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import ExposureOutlinedIcon from '@material-ui/icons/ExposureOutlined';
import Grid from '@material-ui/core/Grid';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import OdooLib from '../models/odoo';

// const useStyles = makeStyles((theme) => ({
//   form: {
//     display: 'flex',
//     flexDirection: 'column',
//     margin: 'auto',
//     width: 'fit-content',
//   },
//   formControl: {
//     marginTop: theme.spacing(2),
//     minWidth: 80,
//   },
//   formControlLabel: {
//     marginTop: theme.spacing(1),
//   },
// }));

const CalcDialog = ({ row, act, idx, setLoading }) => {
  const odoo = new OdooLib();
  const [open, setOpen] = React.useState(false);
  const [moves, setMoves] = React.useState({
    btg: row.btg,
    length: row.length,
    qty: 0,
    disabled: false,
  });
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await odoo.computeQty(
      row.productId,
      moves.length,
      moves.btg
    );
    setMoves({ ...moves, qty: parseFloat(result).toFixed(3) });
    act(moves, idx, parseFloat(result).toFixed(3));
    setLoading(false);
    setOpen(false);
  };

  const getCompute = async (length, btg) => {
    setMoves({
      ...moves,
      disabled: false,
      length,
      btg,
    });
  };

  return (
    <>
      <ExposureOutlinedIcon onClick={handleClickOpen}>
        Calculate
      </ExposureOutlinedIcon>
      <Dialog fullWidth open={open} onClose={handleClose}>
        <DialogTitle>Calculate</DialogTitle>
        <DialogContent>
          <Grid>
            <TextField
              autoFocus
              margin="dense"
              id="length"
              name="length"
              label="Length"
              type="number"
              fullWidth
              value={moves.length}
              onChange={(e) => getCompute(Number(e.target.value), moves.btg)}
            />
            <TextField
              autoFocus
              margin="dense"
              id="btg"
              name="btg"
              label="Btg"
              type="number"
              value={moves.btg}
              onChange={(e) => getCompute(moves.length, Number(e.target.value))}
              fullWidth
            />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={moves.disabled}
            variant="outlined"
            color="secondary"
          >
            Process
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CalcDialog;

CalcDialog.propTypes = {
  idx: PropTypes.number.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  row: PropTypes.object.isRequired,
  act: PropTypes.func.isRequired,
};
