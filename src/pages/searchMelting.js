import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
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
import Router from 'next/router';
import BottomNavbarPressSection from '../containers/Layout/bottomNavbarPress';
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

const SearchMeltingCard = ({ id, MoName, product, productionID, date }) => (
  <Card>
    <CardActionArea>
      <Link
        href={{
          pathname: '/melting',
          query: {
            woId: id,
            productionId: productionID,
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

SearchMeltingCard.propTypes = {
  id: PropTypes.number.isRequired,
  MoName: PropTypes.string.isRequired,
  product: PropTypes.string.isRequired,
  productionID: PropTypes.number.isRequired,
  date: PropTypes.string,
};

SearchMeltingCard.defaultProps = {
  date: '',
};

const SearchMeltingPage = ({ setTitle, setLoading }) => {
  const classes = useStyles();
  const odoo = new OdooLib();
  setTitle('Search MELTING');
  const [name, setName] = React.useState('');
  const [nameIP, setNameIP] = React.useState('');
  const [melting, setMelting] = React.useState([]);
  const [meltingIP, setMeltingIP] = React.useState([]);
  const [tabValue, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getProductionMelting = async (value) => {
    setLoading(true);
    const dt = await odoo.getProductionMelting(value);
    const result = [];
    dt.forEach((element) => {
      result.push(element);
    });
    setMelting(result);
    setLoading(false);
  };

  const getInProgress = async (value) => {
    setLoading(true);
    const dt = await odoo.getInProgressWO(
      value,
      'melting',
      Number(localStorage.getItem('meltingMchId'))
    );
    const result = [];
    dt.forEach((element) => {
      result.push(element);
    });
    setMeltingIP(result);
    setLoading(false);
  };

  React.useEffect(() => {
    if (
      !localStorage.getItem('shiftId') ||
      !localStorage.getItem('meltingMchId')
    ) {
      Router.push({
        pathname: '/machine',
        query: { type: 'searchMelting' },
      });
    }
  }, []);

  return (
    <>
      <Head>
        <title>ALUBLESS</title>
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
                getProductionMelting(name);
              }}
            >
              <InputBase
                className={classes.input}
                placeholder="Masukkan No MO"
                onChange={(event) => setName(event.target.value)}
                value={name}
                name="name"
                id="name"
              />
              <IconButton
                className={classes.iconButton}
                aria-label="search"
                onClick={() => {
                  getProductionMelting(name);
                }}
              >
                <SearchIcon />
              </IconButton>
            </Paper>
          </Box>
          <Box className="row">
            <Paper style={{ maxHeight: '100%', overflow: 'auto' }}>
              {melting.map((x) => (
                <SearchMeltingCard
                  key={x.id}
                  product={`${x.product_name} / Qty: ${x.qty.toString()} ${
                    x.uom_name
                  }`}
                  MoName={x.name}
                  productionID={x.production_id}
                  date={`Date Planned: ${OdooLib.formatDateTime(
                    x.date_planned
                  )}`}
                  id={x.id}
                />
              ))}
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
              <InputBase
                className={classes.input}
                placeholder="Masukkan No MO In Progress"
                onChange={(event) => setNameIP(event.target.value)}
                value={nameIP}
                name="nameIP"
                id="nameIP"
              />
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
              {meltingIP.map((x) => (
                <SearchMeltingCard
                  key={x.id}
                  product={`${x.product} / Qty: ${x.qty.toString()} ${x.uom}`}
                  MoName={`${x.name}  (In Progress)`}
                  productionID={x.production_id}
                  id={x.id}
                  date={`Date Start: ${OdooLib.formatDateTime(x.date_start)}`}
                />
              ))}
            </Paper>
          </Box>
        </Box>
      </TabPanel>

      <BottomNavbarPressSection />
    </>
  );
};
export default SearchMeltingPage;

SearchMeltingPage.propTypes = {
  setTitle: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
};
