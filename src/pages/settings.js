import React, { useEffect, useState } from 'react';
import Fade from '@material-ui/core/Fade';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';
import SnackbarMessage from '../components/snackbar';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },

  btnStyle: {
    minWidth: ['60px', '80px', '100px', '120px', '156px'],
    fontSize: ['10px', '12px', '14px'],
    fontWeight: '500',
    marginTop: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: '300px',
    justifyContent: 'center',
    marginTop: '100px',
  },
  margin: {
    margin: theme.spacing(1),
  },
}));

const Settings = () => {
  const classes = useStyles();
  const [state, setState] = useState({
    host: '',
    database: '',
    printhost: '',
    errCode: 0,
  });
  const [msgBox, setMsgBox] = useState({ message: '', variant: 'success' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.setItem('odoo_url', state.host);
    localStorage.setItem('odoo_db', state.database);
    localStorage.setItem('odoo_print', state.printhost);
    setMsgBox({ message: 'Data has been  saved', variant: 'success' });
  };

  useEffect(() => {
    setState({
      ...state,
      host: localStorage.getItem('odoo_url'),
      database: localStorage.getItem('odoo_db'),
      printhost: localStorage.getItem('odoo_print'),
    });
  }, [null]);

  return (
    <Fade in>
      <Box className={classes.root}>
        <Paper className={classes.paper} elevation={0}>
          <form onSubmit={handleSubmit}>
            <Box className="row">
              <Box className="col">
                <Box>
                  <Typography
                    variant="h5"
                    component="h5"
                    style={{ fontWeight: 500 }}
                    align="center"
                  >
                    Settings
                  </Typography>
                </Box>

                <Box>
                  <TextField
                    id="host"
                    name="host"
                    label="Host"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    onChange={(event) => {
                      event.preventDefault();
                      setState({ ...state, host: event.target.value });
                    }}
                    value={state.host}
                  />
                </Box>

                <Box>
                  <TextField
                    id="database"
                    name="database"
                    label="Database"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    onChange={(event) => {
                      event.preventDefault();
                      setState({ ...state, database: event.target.value });
                    }}
                    value={state.database}
                  />
                </Box>
                <Box>
                  <TextField
                    id="printhost"
                    name="printhost"
                    label="Print Id"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    onChange={(event) => {
                      event.preventDefault();
                      setState({ ...state, printhost: event.target.value });
                    }}
                    value={state.printhost}
                  />
                </Box>

                <Box>
                  {/* {state.errCode===0&&( */}
                  <Button
                    className={classes.btnStyle}
                    variant="contained"
                    type="submit"
                  >
                    SAVE
                  </Button>
                  {/* )} */}

                  {/* {state.errCode===1&&( */}
                  <Link href="/login">
                    <Button
                      className={classes.btnStyle}
                      variant="outlined"
                      type="submit"
                      href="/login"
                    >
                      Back To Login
                    </Button>
                  </Link>
                  {/* )} */}
                </Box>

                <SnackbarMessage
                  message={msgBox.message}
                  variant={msgBox.variant}
                />
              </Box>
            </Box>
          </form>
        </Paper>
      </Box>
    </Fade>
  );
};

export default Settings;
