import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import PropTypes from 'prop-types';
import React from 'react';
import OdooLib from '../models/odoo';

const AutoCProduct = ({ id, name, label, row, change, disabled, key }) => {
  const odoo = new OdooLib();
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);

  const loading = open && options.length === 0;

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const dt = await odoo.getProductMUI(row ? row.name : '');
      if (active) {
        setOptions(dt);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      key={key}
      id={id}
      name={name}
      open={open}
      style={{ minWidth: '300px' }}
      defaultValue={{
        id: row.product_id,
        name: row.product,
        uomId: row.product_uom,
      }}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      onChange={change}
      onInputChange={async (event, newInputValue) => {
        const dt = await odoo.getProductMUI(newInputValue);
        if (dt) {
          setOptions(dt);
        } else {
          setOptions([]);
        }
      }}
      disabled={disabled}
      getOptionSelected={(option, value) => option.name === value.name}
      getOptionLabel={(option) => option.name}
      options={options}
      loading={loading}
      InputProps={{ isRequired: true }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={!row.product_id}
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
  );
};

AutoCProduct.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.bool,
  row: PropTypes.objectOf(PropTypes.any).isRequired,
  change: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  key: PropTypes.string,
};

AutoCProduct.defaultProps = {
  id: '',
  name: '',
  label: '',
  key: '',
};

export default AutoCProduct;
