/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable no-alert */
import React from 'react';
import Head from 'next/dist/next-server/lib/head';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AsyncSelect from 'react-select/async';
import OdooLib from '../models/odoo';

const useStyles = makeStyles({
  table: {
    minWidth: 100,
  },
  root: {
    flexGrow: 1,
    marginLeft: '10px',
    marginRight: '10px',
  },
  paper: {
    height: 50,
  },
  paperAutoComplate: {
    heigth: 50,
    width: '100%',
  },
  paperSave: {
    height: 50,
    backgroundColor: 'red',
    align: 'right',
  },
  paperConsumeBottom: {
    height: 50,
    marginBottom: 20,
  },
  label: {
    paddingTop: 20,
  },
  labelBottom: {
    marginLeft: '10px',
  },
  linkStyle: {
    color: 'blue',
  },
  textField: {
    width: '100%',
    marginTop: 10,
  },
  cardStyle: {
    width: '100%',
  },
  buttonEnd: {
    marginLeft: 10,
    backgroundColor: '#CF4500',
    color: 'white',
    width: '100%',
  },
  buttonPlus: {
    color: 'white',
    background: '#29b3af',
  },
  buttonMinus: {
    color: 'white',
    background: '#29b3af',
  },
  buttonSaveTab: {
    marginTop: 30,
    marginRight: 10,
    align: 'right',
  },
  inputTable: {
    height: 5,
    width: 40,
  },
  paperBottom: {
    marginTop: 5,
    textAlign: 'center',
    height: '100%',
  },
  labelStyle: {
    fontSize: ['0.5rem', '1.5rem'],
  },
});

const PrintSo = ({ setTitle, setMsgBox, setLoading }) => {
  const classes = useStyles();
  const odoo = new OdooLib();
  setTitle('Print Out. Position');
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
  const filterCust = (inputValue) => odoo.getCustomer(inputValue);
  const [forme, setForm] = React.useState({
    customer_id: [],
    customer_name: [],
  });

  const printPreview = async () => {
    setLoading(true);
    if (forme.customer_id.length <= 0) {
      await setTimeout(
        setMsgBox({ variant: 'error', message: 'Field Customer Required' }),
        7000
      );
    } else {
      let blob = null;
      const data = await odoo.printOutSo(forme);
      if (data.faultCode) {
        setMsgBox({ variant: 'error', message: data.message });
      } else {
        blob = b64toBlob(data, 'application/pdf');
        const blobURL = URL.createObjectURL(blob);
        try {
          const theWindow = window.open(blobURL);
          const theDoc = theWindow.document;
          const theScript = document.createElement('script');
          // eslint-disable-next-line no-inner-declarations
          function injectThis() {
            window.print();
          }
          theScript.innerHTML = `window.onload = ${injectThis.toString()};`;
          theDoc.body.appendChild(theScript);
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
        <Grid container spacing={1}>
          <Grid item xs={9} md={9} sm={9}>
            <AsyncSelect
              id="customer"
              name="customer"
              cacheOptions
              required
              defaultOptions
              isMulti
              isClearable
              placeholder="Customer"
              className={classes.textFieldTypeInput}
              onChange={(value) => {
                if (value) {
                  setForm({
                    ...forme,
                    customer_id: value.map((x) => x.value),
                    customer_name: value.map((x) => x.label),
                  });
                } else {
                  setForm({
                    ...forme,
                    customer_name: [],
                    customer_id: [],
                  });
                }
              }}
              loadOptions={filterCust}
            />
            {forme.customer_id.length <= 0 ? (
              <p style={{ color: 'red' }}>Customer Required Field</p>
            ) : (
              ''
            )}
          </Grid>
          <Grid item xs={3} md={3} sm={3}>
            <Button
              onClick={() => printPreview()}
              variant="contained"
              color="primary"
              className={classes.button}
            >
              Print
            </Button>
          </Grid>
        </Grid>
      </div>
    </>
  );
};
export default PrintSo;

PrintSo.propTypes = {
  setTitle: PropTypes.func.isRequired,
  setMsgBox: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
};
