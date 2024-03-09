import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/dist/next-server/lib/head';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { useRouter } from 'next/router';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import OdooLib from '../models/odoo';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#2986cc',
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '5',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
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
    // backgroundColor: '#722076',
    color: 'white',
    width: '50%',
  },
  paperButton: {
    marginTop: 10,
    fontSize: 20,
  },
}));

const RackPage = ({ setTitle, setMsgBox, setLoading }) => {
  const router = useRouter();
  const { rack } = router.query;
  const classes = useStyles();
  const odoo = new OdooLib();
  setTitle(`Pallet ${rack}`);

  const [output, setOutput] = React.useState([]);
  const [disable, setDisable] = React.useState(false);

  const process = async () => {
    setLoading(true);
    const data = output.filter((out) => out.checked === true);
    const result = await odoo.processRack(data, rack);
    if (!result.faultCode) {
      setDisable(true);
      setOutput(data);
      setLoading(false);
      setMsgBox({ variant: 'success', message: 'Transaction Has Been Done' });
    } else {
      setLoading(false);
      setMsgBox({ variant: 'error', message: result.message });
    }
  };

  const getPress = async () => {
    setLoading(true);
    const out = await odoo.getOutputRack();
    out.forEach((outObj) => {
      setOutput((prevState) => [
        ...prevState,
        {
          dateStart: outObj.date_start,
          dateFinished: outObj.date_finished,
          moName: outObj.moname,
          outName: outObj.name,
          id: outObj.id,
          outId: outObj.output_id,
          name: outObj.product,
          qty: outObj.product_qty,
          transQty: outObj.product_qty,
          mode: 'off',
          checked: false,
          note: outObj.note,
        },
      ]);
    });
    setLoading(false);
  };

  React.useEffect(() => {
    getPress();
  }, []);

  return (
    <>
      <Head>
        <title>ALUBLESS - List Rack</title>
      </Head>
      <>
        <TableContainer component={Paper} className={classes.table}>
          <Table className={classes.table} aria-label="customized table">
            <TableHead>
              <TableRow>
                {!disable ? (
                  <StyledTableCell align="center">Edit</StyledTableCell>
                ) : (
                  ''
                )}

                <StyledTableCell align="center">MO</StyledTableCell>
                <StyledTableCell align="center">Output</StyledTableCell>
                <StyledTableCell align="center">Product</StyledTableCell>
                <StyledTableCell align="center">Start</StyledTableCell>
                <StyledTableCell align="center">Finish</StyledTableCell>
                <StyledTableCell align="center">Qty</StyledTableCell>
                <StyledTableCell align="center">Note</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {output
                .sort((a, b) =>
                  // eslint-disable-next-line no-nested-ternary
                  a.dateFinished > b.dateFinished
                    ? -1
                    : a.dateFinished < b.dateFinished
                    ? 1
                    : 0
                )
                .map((xy, index) => (
                  <StyledTableRow hover>
                    {!disable ? (
                      <StyledTableCell align="center">
                        <Checkbox
                          onChange={(e) => {
                            const outs = [...output];
                            const out = { ...outs[index] };
                            out.checked = e.target.checked;
                            if (e.target.checked) {
                              out.mode = 'on';
                              outs[index] = out;
                            } else {
                              out.mode = 'off';
                              outs[index] = out;
                            }
                            setOutput(outs);
                          }}
                          disabled={disable}
                          value={xy.checked}
                          color="secondary"
                          inputProps={{ 'aria-label': 'Check' }}
                        />
                      </StyledTableCell>
                    ) : (
                      ''
                    )}

                    <StyledTableCell
                      className={classes.linkStyle}
                      align="center"
                      scope="row"
                    >
                      {xy.moName}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {xy.outName}
                    </StyledTableCell>
                    <StyledTableCell align="left">{xy.name}</StyledTableCell>
                    <StyledTableCell align="center">
                      {OdooLib.formatDateTime(xy.dateStart)}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {OdooLib.formatDateTime(xy.dateFinished)}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <TextField
                        id="qty"
                        disabled={xy.mode === 'off' || disable}
                        value={xy.transQty}
                        onChange={(e) => {
                          const outs = [...output];
                          const out = { ...outs[index] };
                          setMsgBox({ variant: 'success', message: '' });
                          if (e.target.value > out.qty) {
                            setMsgBox({
                              variant: 'error',
                              message: 'Qty Over Limit',
                            });
                          } else {
                            out.transQty = e.target.value;
                            outs[index] = out;
                            setOutput(outs);
                          }
                        }}
                        margin="dense"
                      />
                    </StyledTableCell>
                    <StyledTableCell>{xy.note}</StyledTableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Grid container spacing={3}>
          <Grid item xs={3} md={3} sm={3}>
            <Paper className={classes.paperButton} elevation={0}>
              {disable === false ? (
                <Button
                  className={classes.button}
                  variant="contained"
                  onClick={(e) => process(e)}
                  disabled={disable}
                >
                  PROCESS
                </Button>
              ) : (
                ''
              )}
            </Paper>
          </Grid>
        </Grid>
      </>
    </>
  );
};

export default RackPage;

RackPage.propTypes = {
  setTitle: PropTypes.func.isRequired,
  setMsgBox: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
};
