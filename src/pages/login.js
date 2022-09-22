import React, { useEffect, useState } from 'react';
import Fade from '@material-ui/core/Fade';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/dist/next-server/lib/head';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import OdooLib from '../models/odoo';
import SnackbarMessage from '../components/snackbar';
// import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  outlineBtnStyle: {
    minWidth: ['60px', '80px', '100px', '120px', '156px'],
    fontSize: ['10px', '12px', '14px'],
    fontWeight: '500',
    textTransform: 'none',
    color: theme.palette.secondary.main,
    marginTop: 10,
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
    maxWidth: 300,
    justifyContent: 'center',
    marginTop: '100px',
  },
  warning: {
    backgroundColor: '#C01743',
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  margin: {
    margin: theme.spacing(1),
  },
  buttonProgressLoading: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -22,
    marginLeft: -12,
  },
  wrapper: {
    position: 'relative',
  },
}));

const Login = () => {
  const classes = useStyles();
  const [state, setState] = useState({
    username: '',
    password: '',
    shift: '',
    shiftName: '',
  });
  const [msgBox, setMsgBox] = useState({ message: '', variant: 'success' });
  const [loading, setLoading] = React.useState(false);
  const timer = React.useRef();
  const router = useRouter();

  useEffect(() => {
    clearTimeout(timer.current);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const odoo = new OdooLib();
      await odoo.login(state.username, state.password);
      setLoading(false);
      router.push('/');
    } catch (err) {
      setMsgBox({ message: err.message, variant: 'error' });
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Odoo App - Login</title>
      </Head>
      <Fade in>
        <Box className={classes.root}>
          <Paper className={classes.paper} elevation={0}>
            <form onSubmit={handleSubmit}>
              <Box className="row">
                <Box className="col">
                  <Box>
                    <Typography variant="h5" component="h5">
                      Odoo App
                    </Typography>
                  </Box>

                  <Box style={{ marginTop: '20px', marginBottom: '10px' }}>
                    Please login with your Odoo account.
                  </Box>

                  <Box>
                    <TextField
                      id="username"
                      name="username"
                      label="Username"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      onChange={(event) => {
                        event.preventDefault();
                        setState({ ...state, username: event.target.value });
                      }}
                    />
                  </Box>

                  <Box className="password">
                    <TextField
                      id="password"
                      name="password"
                      type="password"
                      label="Password"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      onChange={(event) => {
                        event.preventDefault();
                        setState({ ...state, password: event.target.value });
                      }}
                    />
                  </Box>

                  <Box className={classes.wrapper}>
                    <Button
                      className={classes.btnStyle}
                      fullWidth
                      type="submit"
                      disabled={loading}
                    >
                      LOGIN
                    </Button>

                    {loading ? (
                      <CircularProgress
                        size={24}
                        className={classes.buttonProgressLoading}
                      />
                    ) : (
                      <SnackbarMessage
                        message={msgBox.message}
                        variant={msgBox.variant}
                      />
                    )}

                    <Typography
                      color="secondary"
                      type="body1"
                      className={classes.outlineBtnStyle}
                      align="center"
                    >
                      <Link href="/settings" under>
                        Settings
                      </Link>
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </form>
          </Paper>
        </Box>
      </Fade>
    </>
  );
};

export default Login;
