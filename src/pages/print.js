/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable no-alert */
import React from 'react';
import Head from 'next/dist/next-server/lib/head';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
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

const PrintBarcode = () => {
  const classes = useStyles();
  const odoo = new OdooLib();
  const [form, setForm] = React.useState({});

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
    let blob = null;
    const data = await odoo.printPicking();
    blob = b64toBlob(data, 'application/pdf');
    const blobURL = URL.createObjectURL(blob);
    const theWindow = window.open(blobURL);
    const theDoc = theWindow.document;
    const theScript = document.createElement('script');
    function injectThis() {
      window.print();
    }
    theScript.innerHTML = `window.onload = ${injectThis.toString()};`;
    theDoc.body.appendChild(theScript);
  };

  return (
    <>
      <Head>
        <title>ALUBLESS</title>
      </Head>

      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={6} md={6} sm={6}>
            <Paper className={classes.paper} elevation={0}>
              <TextField
                id="outlined-basic"
                label="Prefix"
                name="prefix"
                className={classes.textField}
                value={form.prefix}
                onInput={(e) =>
                  setForm({
                    ...form,
                    prefix: e.target.value,
                  })
                }
                InputLabelProps={{ shrink: true }}
              />
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={6} md={6} sm={6}>
            <Paper className={classes.paper} elevation={0}>
              <TextField
                id="startNumber"
                name="startNumber"
                label="Start No"
                type="number"
                value={form.startNumber}
                onInput={(e) =>
                  setForm({
                    ...form,
                    startNumber: Number(e.target.value),
                  })
                }
                required
                className={classes.textField}
                InputLabelProps={{ shrink: true }}
              />
            </Paper>
          </Grid>

          <Grid item xs={6} md={6} sm={6}>
            <Paper className={classes.paper} elevation={0}>
              <TextField
                id="endNumber"
                name="endNumber"
                label="End Number"
                type="number"
                value={form.endNumber}
                onInput={(e) =>
                  setForm({
                    ...form,
                    endNumber: Number(e.target.value),
                  })
                }
                required
                className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Paper>
          </Grid>
          <br />
          <br />
          <br />
          <br />
        </Grid>
        <br />
        <br />
        <Grid>
          <Button onClick={() => printPreview()} className={classes.button}>
            Generate Barcode
          </Button>
        </Grid>
      </div>
    </>
  );
};
export default PrintBarcode;
