import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Router from 'next/router';
import Head from 'next/head';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import BottomNavbarRackSection from '../containers/Layout/bottomNavbarRack';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
  textField: {
    margin: '20px',
    width: '90%',
  },
  button: {
    width: '90%',
    fontSize: ['10px', '12px', '14px'],
    fontWeight: '500',
    marginTop: '10px',
    marginLeft: '20px',
    marginRight: '20px',
    marginBottom: '20px',
    justifyContent: 'center',
  },
  wrapper: {
    position: 'relative',
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 400,
    height: 200,
    justifyContent: 'center',
    marginTop: '150px',
  },
}));

const SearchRackPage = ({ setTitle }) => {
  const classes = useStyles();
  setTitle('Input Pallet');
  const [rackName, setRack] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  useEffect(() => {
    if (
      !localStorage.getItem('shiftId') ||
      !localStorage.getItem('palletMchId')
    ) {
      Router.push({
        pathname: '/machine',
        query: { type: 'searchRack' },
      });
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      setLoading(false);
      Router.push({
        pathname: '/rack',
        query: { rack: rackName },
      });
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Odoo App</title>
      </Head>
      <Box className={classes.root}>
        <Paper component="form" className={classes.paper}>
          <form onSubmit={handleSubmit}>
            <Box className="row">
              <Box className="col">
                <Box className="input">
                  <TextField
                    variant="outlined"
                    id="rack"
                    name="rack"
                    label="Input Pallet"
                    onChange={(e) => {
                      setRack(e.target.value);
                    }}
                    className={classes.textField}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ pattern: '[A-Za-z0-9]+' }}
                    required
                  />
                </Box>

                <Box className={classes.wrapper}>
                  <Button
                    type="submit"
                    className={classes.button}
                    disabled={loading}
                  >
                    Process Pallet
                  </Button>
                </Box>
              </Box>
            </Box>
          </form>
        </Paper>
      </Box>

      <BottomNavbarRackSection />
    </>
  );
};
export default SearchRackPage;

SearchRackPage.propTypes = {
  setTitle: PropTypes.func.isRequired,
};
