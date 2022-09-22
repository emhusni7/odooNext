/* eslint-disable react/prop-types */
import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DialogTitle from '@material-ui/core/DialogTitle';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';
import OdooLib from '../models/odoo';

const useStyles = makeStyles((theme) => ({
  root: {
    transform: 'translateZ(0px)',
    flexGrow: 1,
  },
  comboBoxType: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(1),
    width: '90%',
    marginTop: theme.spacing(2),
  },
}));

const LossDialog = ({ row, act, idx }) => {
  const classes = useStyles();
  const odoo = new OdooLib();
  const [open, setOpen] = React.useState(false);
  const [moves, setMoves] = React.useState(row);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (moves.type_id && moves.qty_available) {
      act(moves, idx);
      setOpen(false);
    } else {
      if (moves.qty_available <= 0) {
        alert('Qty On Hand harus lebih dari 0');
      }
      alert('Type harus diisi');
    }
  };

  const [options, setOptions] = React.useState([]);
  const [openC, setOpenC] = React.useState(false);
  const loading = open && options.length === 0;

  React.useEffect(() => {
    let active = true;
    if (!loading) {
      return undefined;
    }

    (async () => {
      const dt = await odoo.getPickingType('%loss%');
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

  return (
    <div>
      <CompareArrowsIcon onClick={handleClickOpen}>Loss</CompareArrowsIcon>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Loss</DialogTitle>
        <DialogContent>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="outlined" color="primary">
            Process
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LossDialog;

LossDialog.propTypes = {
  idx: PropTypes.number.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  row: PropTypes.object.isRequired,
  act: PropTypes.func.isRequired,
};
