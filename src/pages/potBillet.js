/* eslint-disable react/prop-types */
import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Grid from '@material-ui/core/Grid';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import OdooLib from '../models/odoo';

const useStyles = makeStyles(() => ({
  root: {
    transform: 'translateZ(0px)',
    flexGrow: 1,
    paddingLeft: 1,
    paddingRight: 1,
    margin: 1,
  },
  comboBoxType: {
    width: '100%',
  },
  TextField: {
    padding: 1,
    margin: 1,
  },
}));

const PotBillet = ({ row, act, idx }) => {
  const classes = useStyles();
  const odoo = new OdooLib();
  const [open, setOpen] = React.useState(false);
  const [load, setLoad] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [openC, setOpenC] = React.useState(false);
  const loading = open && options.length === 0;

  React.useEffect(() => {
    let active = true;
    if (!loading) {
      return undefined;
    }

    (async () => {
      const dt = await odoo.getPickingType('%Potongan Billet%');
      if (active) {
        setOptions(dt);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!openC) {
      setOptions([]);
    }
  }, [openC]);
  const [moves, setMoves] = React.useState({
    btg: 1,
    length: 0,
    qty: 0,
    disabled: false,
    error: '',
    state: 'New',
  });
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setMoves({
      btg: 1,
      length: 0,
      qty: 0,
      disabled: false,
      error: '',
      state: 'New',
    });
    setOpen(false);
  };

  const Hitung = async (e) => {
    e.preventDefault();
    setLoad(true);
    const result = await odoo.computeQty(
      row.product_id,
      moves.length,
      moves.btg
    );
    const qtyAv = await odoo.getQtyAvailable(
      row.product_id,
      row.loc_id,
      row.lot_id
    );
    setMoves({
      ...moves,
      qty: parseFloat(result).toFixed(3),
      sisa: parseFloat(qtyAv).toFixed(3),
      error: '',
      state: 'inProgress',
    });
    setLoad(false);
  };

  const MoveQty = () => {
    setLoad(true);
    setMoves({
      ...moves,
      qty: moves.sisa,
    });
    setLoad(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoad(true);
    if (moves.type_id) {
      const res = await act(
        row,
        moves.type_id,
        moves.length,
        moves.btg,
        moves.qty,
        idx
      );
      setLoad(false);
      if (!res.faultCode) {
        setOpen(false);
      } else {
        setMoves({ ...moves, error: res.message });
      }
    } else {
      setMoves({ ...moves, error: 'Type is Required' });
    }
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
      <CompareArrowsIcon onClick={handleClickOpen}>
        Potongan Billet
      </CompareArrowsIcon>
      <Dialog fullWidth open={open} onClose={handleClose}>
        <DialogTitle>Potongan Billet</DialogTitle>
        <DialogContent>
          <Grid container className={classes.root}>
            <Grid item xs={12}>
              <Autocomplete
                id="type_id"
                name="type_id"
                defaultValue={{
                  id: moves.type_id,
                  name: moves.type_name,
                }}
                onOpen={() => {
                  setOpenC(true);
                }}
                onClose={() => {
                  setOpenC(false);
                }}
                onChange={(e, val) => {
                  if (val) {
                    setMoves({
                      ...moves,
                      type_id: val.id,
                      type_name: val.name,
                    });
                  } else {
                    setMoves({
                      ...moves,
                      type_id: 0,
                      type_name: '',
                    });
                  }
                }}
                getOptionSelected={(option, val) => option.name === val.name}
                getOptionLabel={(option) => option.name}
                options={options}
                loading={loading}
                InputProps={{ isRequired: true }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Type"
                    margin="dense"
                    variant="outlined"
                    error={!moves.type_id}
                    className={classes.comboBoxType}
                    fullWidth={15}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                autoFocus
                margin="dense"
                id="length"
                name="length"
                label="Length"
                type="number"
                className={classes.TextField}
                fullWidth
                value={moves.length}
                onChange={(e) => getCompute(Number(e.target.value), moves.btg)}
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                autoFocus
                margin="dense"
                id="btg"
                name="btg"
                label="Btg"
                className={classes.TextField}
                type="number"
                value={moves.btg}
                onChange={(e) =>
                  getCompute(moves.length, Number(e.target.value))
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={2}>
              <Button
                onClick={Hitung}
                variant="contained"
                disabled={load}
                color="primary"
              >
                {load && <CircularProgress size={14} />}
                {!load && 'Hitung'}
              </Button>
            </Grid>
            <Grid item xs={5}>
              <TextField
                margin="dense"
                id="sisa"
                name="sisa"
                label="Sisa Potongan"
                type="number"
                fullWidth
                value={moves.sisa}
                className={classes.TextField}
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                autoFocus
                margin="dense"
                id="kg"
                name="kg"
                className={classes.TextField}
                label="Kg"
                type="number"
                fullWidth
                onChange={(e) => {
                  setMoves({ ...moves, qty: Number(e.target.value) });
                }}
                value={moves.qty}
                InputProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <Button
                onClick={MoveQty}
                variant="contained"
                disabled={load}
                color="primary"
              >
                {load && <CircularProgress size={14} />}
                {!load && 'Copy'}
              </Button>
            </Grid>
            {/* <Grid item xs={3} /> */}
            {moves.error && (
              <div>
                <p style={{ color: 'red' }}>{moves.error}</p>
              </div>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          {moves.state === 'inProgress' ? (
            <>
              <Button
                onClick={handleClose}
                variant="outlined"
                disabled={load}
                color="secondary"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={moves.disabled || load}
                variant="outlined"
                color="primary"
              >
                {load && <CircularProgress size={14} />}
                {!load && 'Process'}
              </Button>
            </>
          ) : (
            ''
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PotBillet;

PotBillet.propTypes = {
  idx: PropTypes.number.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  row: PropTypes.object.isRequired,
  act: PropTypes.func.isRequired,
};
