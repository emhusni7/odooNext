/* eslint-disable valid-typeof */
/* eslint-disable consistent-return */
/* eslint-disable react/no-typos */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Head from 'next/dist/next-server/lib/head';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import MenuItem from '@material-ui/core/MenuItem';
import AsyncSelect from 'react-select/async';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import OdooLib from '../models/odoo';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginLeft: '10px',
    marginRight: '10px',
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
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '90%',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  textFieldType: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '30%',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  textFieldTypeInput: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '90%',
    marginTop: 5,
    marginBottom: 5,
  },
  paperType: {
    padding: theme.spacing(2),
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
  },
}));

const DetailScrapPage = ({
  index,
  record,
  addScrap,
  mode,
  onClose,
  loading,
  type,
}) => {
  const classes = useStyles();
  const odoo = new OdooLib();
  const [mvLine, setMvLine] = React.useState({ ...record, scrapType: 'scrap' });
  const filterValue = (inputValue) => odoo.getProductAll(inputValue);
  const handleSubmit = async (e) => {
    e.preventDefault();
    loading(true);
    if (mvLine.qtyScrap > mvLine.qty) {
      // eslint-disable-next-line no-alert
      alert('Qty Over');
    } else {
      const dt = { ...mvLine, scrapId: 0 };
      addScrap(index, dt);
      onClose();
    }
    loading(false);
  };

  return (
    <>
      <Head>
        <title>Odoo Warehouse - List Rack</title>
      </Head>
      <>
        <div className={classes.root}>
          <>
            <form
              name="contactform"
              className="contactform"
              onSubmit={handleSubmit}
            >
              <Typography
                className={classes.textFieldProduct}
                style={{ mariginTop: 30 }}
              >
                Your detail product scrap selected :
              </Typography>
              <Paper className={classes.paperType}>
                <Grid container spacing={1}>
                  <Grid item xs={6} md={6} sm={12}>
                    <TextField
                      id="product"
                      value={mvLine.productname}
                      autoFocus
                      className={classes.textFieldProduct}
                      label="Product"
                      InputProps={{
                        readOnly: true,
                      }}
                      disabled
                    />
                  </Grid>

                  <Grid item xs={6} md={6} sm={12}>
                    {mode === 'end' ? (
                      <TextField
                        id="prdQty"
                        className={classes.textFieldProduct}
                        value={mvLine.qty}
                        InputProps={{
                          readOnly: true,
                        }}
                        label="Qty Produce"
                        disabled
                      />
                    ) : (
                      ''
                    )}
                  </Grid>
                </Grid>
              </Paper>

              <Typography style={{ marginTop: 20, marginLeft: 10 }}>
                Please type your work in the below :
              </Typography>
              <Paper className={classes.paperType}>
                <TextField
                  id="type"
                  name="type"
                  label="Type"
                  defaultValue={mvLine.scrapType}
                  className={classes.textFieldType}
                  onChange={(e) =>
                    setMvLine({ ...mvLine, scrapType: e.target.value })
                  }
                  required
                  select
                >
                  <MenuItem value="scrap">Scrap</MenuItem>
                  <MenuItem
                    value="good"
                    disabled={
                      mode === 'start' &&
                      !['unracking', 'anodize', 'oven', 'preChromate'].includes(
                        type
                      )
                    }
                  >
                    Good
                  </MenuItem>
                  <MenuItem value="reject">Reject</MenuItem>
                </TextField>

                <Grid container spacing={1}>
                  {mvLine.scrapType === 'good' ? (
                    <>
                      <Grid item xs={6} md={6} sm={12}>
                        {// mode === 'end' &&
                        [
                          'unracking',
                          'anodize',
                          'oven',
                          'preChromate',
                        ].includes(type) ? (
                          <AsyncSelect
                            id="productName"
                            name="productName"
                            cacheOptions
                            required
                            defaultOptions
                            placeholder="Product"
                            className={classes.textFieldTypeInput}
                            onChange={(value) => {
                              if (value) {
                                setMvLine({
                                  ...mvLine,
                                  productSId: value.value,
                                  productSName: value.label,
                                });
                              }
                            }}
                            loadOptions={filterValue}
                          />
                        ) : (
                          ''
                        )}
                      </Grid>
                    </>
                  ) : (
                    ''
                  )}

                  <Grid item xs={6} md={6} sm={12}>
                    <TextField
                      id="scrapQty"
                      name="scrapQty"
                      className={classes.textFieldTypeInput}
                      label="Qty"
                      autoFocus
                      required
                      type="number"
                      onChange={(event) => {
                        setMvLine({
                          ...mvLine,
                          qtyScrap: Number(event.target.value),
                        });
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={1}>
                  <Grid item xs={6} md={6} sm={12}>
                    <TextareaAutosize
                      id="note"
                      name="note"
                      rowsMin={6}
                      aria-label="maximum height"
                      placeholder="Note"
                      required
                      defaultValue={
                        ['unracking', 'anodize'].includes(type) &&
                        mode === 'start'
                          ? 'Racking'
                          : ''
                      }
                      className={classes.textFieldTypeInput}
                      onChange={(e) =>
                        setMvLine({ ...mvLine, note: e.target.value })
                      }
                    />
                  </Grid>
                </Grid>

                <Button type="submit">Save</Button>
              </Paper>
            </form>
          </>
        </div>
      </>
    </>
  );
};

export default DetailScrapPage;

DetailScrapPage.propTypes = {
  // setLoading: PropTypes.func.isRequired,
  // setTitle: PropTypes.func.isRequired,
  // eslint-disable-next-line react/require-default-props
  // eslint-disable-next-line react/no-typos
  // eslint-disable-next-line react/require-default-props
  // setMsgBox: PropTypes.func.isRequire,
};
