import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Head from 'next/head';
import Paper from '@material-ui/core/Paper';
import { useRouter } from 'next/router';
import Button from '@material-ui/core/Button';

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

const StartEndOvenRackingUnrackingPage = ({ setTitle }) => {
  const classes = useStyles();
  const route = useRouter();
  const { type } = route.query;
  setTitle(type.toUpperCase());

  const cekMch = () => {
    let result;
    if (type === 'oven') {
      result = localStorage.getItem('ovenMchId');
    } else if (type === 'racking') {
      result = localStorage.getItem('rackingMchId');
    } else if (type === 'unracking') {
      result = localStorage.getItem('unrackingMchId');
    } else if (type === 'drawn') {
      result = localStorage.getItem('drawnMchId');
    } else if (type === 'polish') {
      result = localStorage.getItem('polishMchId');
    } else if (type === 'brush') {
      result = localStorage.getItem('brushMchId');
    } else if (type === 'hole') {
      result = localStorage.getItem('holeMchId');
    } else if (type === 'bending') {
      result = localStorage.getItem('bendingMchId');
    } else if (type === 'ulir') {
      result = localStorage.getItem('ulirMchId');
    } else if (type === 'anodize') {
      result = localStorage.getItem('anodizeMchId');
    } else if (type === 'painting') {
      result = localStorage.getItem('paintingMchId');
    } else if (type === 'cutting') {
      result = localStorage.getItem('cuttingMchId');
    } else if (type === 'preChromate') {
      result = localStorage.getItem('preChromateMchId');
    } else if (type === 'sandblasting') {
      result = localStorage.getItem('snblMchId');
    }
    return result;
  };

  React.useEffect(() => {
    if (!localStorage.getItem('shiftId') || !cekMch()) {
      route.push({
        pathname: '/machine',
        query: { type: `startEndOvenRackingUnracking?type=${type}` },
      });
    }
  }, []);
  return (
    <>
      <Head>
        <title>Odoo Warehouse</title>
      </Head>
      <Box className={classes.root}>
        <Paper component="form" className={classes.paper}>
          <Box className="row">
            <Box className="col">
              <Box className={classes.wrapper}>
                <Button
                  className={classes.button}
                  variant="contained"
                  onClick={() =>
                    route.push({
                      pathname: '/inputPalletOvenRackingUnracking',
                      query: {
                        type,
                        mode: 'start',
                      },
                    })
                  }
                >
                  Start
                </Button>
                <Button
                  className={classes.button}
                  variant="contained"
                  onClick={() =>
                    route.push({
                      pathname: '/inputPalletOvenRackingUnracking',
                      query: {
                        type,
                        mode: 'end',
                      },
                    })
                  }
                >
                  End
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </>
  );
};
export default StartEndOvenRackingUnrackingPage;

StartEndOvenRackingUnrackingPage.propTypes = {
  setTitle: PropTypes.func.isRequired,
};
