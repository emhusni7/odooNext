/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable no-alert */
import React from 'react';
import Head from 'next/dist/next-server/lib/head';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import AsyncSelect from 'react-select/async';
import FormControl from '@material-ui/core/FormControl';
import OdooLib from '../models/odoo';

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

const InvReport = ({ setTitle, setMsgBox, setLoading }) => {
  const classes = useStyles();
  const odoo = new OdooLib();
  setTitle('Bahan Baku & Pembantu');
  const filterLoc = (inputValue) => odoo.asyncgetLocation(inputValue);
  const filterProduct = (inputValue) => odoo.getProductAll(inputValue);
  const filterCategory = (inputValue) => odoo.getProductCategory(inputValue);
  const [params, setParams] = React.useState({
    locId: 0,
    locName: '',
    prdId: 0,
    prdName: '',
    categId: [],
    categName: [],
    status: 'new',
  });
  const b64toBlob = (content, contentType) => {
    const sliceSize = 512;
    // method which converts base64 to binary
    const byteCharacters = window.atob(content);

    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, {
      type: contentType,
    }); // statement which creates the blob
    return blob;
  };

  const printPreview = async () => {
    setLoading(true);
    if (params.locId === 0 || params.locId === '') {
      await setTimeout(
        setMsgBox({ variant: 'error', message: 'Field Lokasi Harus Di Isi' }),
        7000
      );
    } else {
      let blob = null;
      const data = await odoo.printInvReport(params);
      if (data.faultCode) {
        setMsgBox({ variant: 'error', message: data.message });
      } else {
        blob = b64toBlob(data, 'application/pdf');
        const blobURL = URL.createObjectURL(blob);
        try {
          const link = document.createElement('a');
          link.href = blobURL;
          const m = new Date();
          const dateString = `${m.getUTCFullYear()}/${`0${`0${m.getUTCMonth() +
            1}`.slice(-2)}`.slice(-2)}/${`0${m.getUTCDate()}`.slice(-2)}`;
          link.setAttribute('download', `Inventory Report_${dateString}`);
          document.body.appendChild(link);
          link.click();
          //   const theWindow = window.open(blobURL);
          //   const theDoc = theWindow.document;
          //   const theScript = document.createElement('script');
          //   // eslint-disable-next-line no-inner-declarations
          //   function injectThis() {
          //     window.print();
          //   }
          //   theScript.innerHTML = `window.onload = ${injectThis.toString()};`;
          //   theDoc.body.appendChild(theScript);
        } catch (e) {
          setMsgBox({ variant: 'error', message: e });
        }
      }
    }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>ALUBLESS</title>
      </Head>

      <div className={classes.root}>
        <Paper className={classes.paper2} elevation={2}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6} sm={12}>
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
            </Grid>
            <Grid item xs={12} md={6} sm={12}>
              <FormControl className={classes.formControl}>
                <AsyncSelect
                  id="categId"
                  name="categId"
                  cacheOptions
                  required
                  isMulti
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
                        categName: value.map((x) => x.label),
                        categId: value.map((x) => x.value),
                      });
                    } else {
                      setParams({
                        ...params,
                        categName: [],
                        categId: [],
                      });
                    }
                  }}
                  isSearchable
                  placeholder="Internal Category"
                  loadOptions={filterCategory}
                />
                <FormHelperText>
                  {/* {!etching.corrid && etching.state === 'startworking'
                      ? 'Required'
                      : ''} */}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={9} md={9} sm={9}>
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

            <Grid item xs={3} sm={3} md={3}>
              <Button
                onClick={() => printPreview()}
                variant="contained"
                color="primary"
                //   disabled={disabled}
              >
                Print
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </div>
    </>
  );
};
export default InvReport;

InvReport.propTypes = {
  setTitle: PropTypes.func.isRequired,
  setMsgBox: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
};
