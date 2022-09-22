import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Link from 'next/link';
import Head from 'next/head';
import Router, { useRouter } from 'next/router';
import AsyncSelect from 'react-select/async';
import { TextField } from '@material-ui/core';
import OdooLib from '../models/odoo';
import TabPanel from '../components/tabPanel';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '5px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
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
}));

const SearchCorr = ({ id, MoName, product, productionID, date, type }) => (
  <Card>
    <CardActionArea>
      <Link
        href={{
          pathname: '/corrective',
          query: {
            woId: id,
            productionId: productionID,
            type,
          },
        }}
      >
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {`${MoName}`}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {product}
          </Typography>
          {date !== '' && (
            <Typography variant="body2" color="textSecondary" component="p">
              {date}
            </Typography>
          )}
        </CardContent>
      </Link>
    </CardActionArea>
  </Card>
);

SearchCorr.propTypes = {
  id: PropTypes.number.isRequired,
  MoName: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  product: PropTypes.string.isRequired,
  productionID: PropTypes.number.isRequired,
  date: PropTypes.string,
};

SearchCorr.defaultProps = {
  date: '',
};

const SearchCorrPage = ({ setTitle, setLoading }) => {
  const classes = useStyles();
  const odoo = new OdooLib();
  const [name, setName] = React.useState('');
  const [nameIP, setNameIP] = React.useState('');
  const [press, setPress] = React.useState([]);
  const [pressIP, setPressIP] = React.useState([]);
  const [tabValue, setValue] = React.useState(0);
  const route = useRouter();
  const { code, type } = route.query;
  setTitle(type === 'corr' ? 'Corrective' : 'Finishing Akhir');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [mch, setMch] = React.useState('');
  const machineVal = (inVal) => odoo.getMachineCorr(inVal);
  const getCorrective = async (value, machine) => {
    setLoading(true);
    const dt = await odoo.getCorrective('corrective', value, machine, code);
    const result = [];
    dt.forEach((element) => {
      result.push(element);
    });
    setPress(result);
    setLoading(false);
  };

  const getInProgress = async (value) => {
    setLoading(true);
    const dt = await odoo.getInProgressCorr(value, 'corrective', mch, code);
    const result = [];
    dt.forEach((element) => {
      result.push(element);
    });
    setPressIP(result);
    setLoading(false);
  };

  React.useEffect(() => {
    if (!localStorage.getItem('shiftId')) {
      Router.push({
        pathname: '/machine',
        query: { type: `searchCorr?code=${code}&type=${type}` },
      });
    }
  }, []);

  return (
    <>
      <Head>
        <title>Odoo App</title>
      </Head>

      <AppBar position="static">
        <Tabs
          value={tabValue}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="New" />
          <Tab label="In Progress" />
        </Tabs>
      </AppBar>
      <TabPanel value={tabValue} index={0}>
        <Box>
          <Box className="row">
            <Paper
              component="form"
              className={classes.root}
              onSubmit={(e) => {
                e.preventDefault();
                getCorrective(name, mch);
              }}
            >
              <TextField
                className={classes.input}
                placeholder="Masukkan No MO / Die Index"
                onChange={(event) => setName(event.target.value)}
                value={name}
                name="name"
                id="name"
              />
              {type === 'corr' ? (
                <AsyncSelect
                  id="machine"
                  name="Machine"
                  cacheOptions
                  required
                  defaultOptions
                  isClearable
                  className={classes.input}
                  placeholder="Machine"
                  onChange={async (value) => {
                    if (value) {
                      setMch(value.value);
                    } else {
                      setMch('');
                    }
                  }}
                  loadOptions={machineVal}
                />
              ) : (
                ''
              )}

              <IconButton
                className={classes.iconButton}
                aria-label="search"
                onClick={() => {
                  getCorrective(name, mch);
                }}
              >
                <SearchIcon />
              </IconButton>
            </Paper>
          </Box>
          <Box className="row">
            <Paper style={{ maxHeight: '100%', overflow: 'auto' }}>
              {press.map((x) =>
                type === 'corr' ? (
                  <SearchCorr
                    key={x.id}
                    product={`${x.name} / qty outstanding: ${x.qty} / Problem: ${x.problem}`}
                    MoName={x.product}
                    productionID={x.production_id}
                    date={`Date Planned: ${OdooLib.formatDateTime(
                      x.date_planned
                    )} / Machine ${x.machine}`}
                    id={x.id}
                    type={type}
                  />
                ) : (
                  <SearchCorr
                    key={x.id}
                    product={`${x.name} / Problem: ${x.problem}`}
                    MoName={x.product}
                    productionID={x.production_id}
                    date={`Date Planned: ${OdooLib.formatDateTime(
                      x.date_planned
                    )} / Machine ${x.machine}`}
                    id={x.id}
                    type={type}
                  />
                )
              )}
            </Paper>
          </Box>
        </Box>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <Box>
          <Box className="row">
            <Paper
              component="form"
              className={classes.root}
              onSubmit={(e) => {
                e.preventDefault();
                getInProgress(nameIP);
              }}
            >
              <TextField
                className={classes.input}
                placeholder="Masukkan No MO / Die Index InProgress "
                onChange={(event) => setNameIP(event.target.value)}
                value={nameIP}
                name="nameIP"
                id="nameIP"
              />
              {type === 'corr' ? (
                <AsyncSelect
                  id="machine"
                  name="Machine"
                  cacheOptions
                  required
                  isClearable
                  defaultOptions
                  className={classes.input}
                  placeholder="Machine"
                  onChange={async (value) => {
                    if (value) {
                      setMch(value.value);
                    } else {
                      setMch('');
                    }
                  }}
                  loadOptions={machineVal}
                />
              ) : (
                ''
              )}

              <IconButton
                className={classes.iconButton}
                aria-label="search"
                onClick={() => {
                  getInProgress(nameIP);
                }}
              >
                <SearchIcon />
              </IconButton>
            </Paper>
          </Box>
          <Box className="row">
            <Paper style={{ maxHeight: '100%', overflow: 'auto' }}>
              {pressIP.map((x) =>
                type === 'corr' ? (
                  <SearchCorr
                    key={x.id}
                    product={`${x.name} / qty outstanding: ${x.qty} / Problem: ${x.problem}`}
                    MoName={`${x.product}  (In Progress)`}
                    productionID={x.production_id}
                    id={x.id}
                    date={`Date Start: ${OdooLib.formatDateTime(
                      x.date_start
                    )}  / Machine ${x.machine} `}
                    type={type}
                  />
                ) : (
                  <SearchCorr
                    key={x.id}
                    product={`${x.name} / Problem: ${x.problem}`}
                    MoName={`${x.product}  (In Progress)`}
                    productionID={x.production_id}
                    id={x.id}
                    date={`Date Start: ${OdooLib.formatDateTime(
                      x.date_start
                    )}  / Machine ${x.machine} `}
                    type={type}
                  />
                )
              )}
            </Paper>
          </Box>
        </Box>
      </TabPanel>
    </>
  );
};
export default SearchCorrPage;

SearchCorrPage.propTypes = {
  setTitle: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
};
