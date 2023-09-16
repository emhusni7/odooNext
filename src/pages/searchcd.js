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
import Router, { useRouter } from 'next/router';
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

const SearchCorr = ({
  id,
  MoName,
  product,
  productionID,
  date,
  code,
  judul,
}) => (
  <Card>
    <CardActionArea>
      <Link
        href={{
          pathname: '/createdie',
          query: {
            code,
            woId: id,
            productionId: productionID,
            judul,
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
  product: PropTypes.string.isRequired,
  productionID: PropTypes.number.isRequired,
  judul: PropTypes.string,
  date: PropTypes.string,
  code: PropTypes.string,
};

SearchCorr.defaultProps = {
  date: '',
  judul: '',
  code: 'cnc',
};

const SearchCdPage = ({ setTitle, setLoading }) => {
  const classes = useStyles();
  const odoo = new OdooLib();

  const [name, setName] = React.useState({ die: '', mo: '' });
  const [nameIP, setNameIP] = React.useState({ die: '', mo: '' });
  const [press, setPress] = React.useState([]);
  const [pressIP, setPressIP] = React.useState([]);
  const [tabValue, setValue] = React.useState(0);
  const route = useRouter();
  const { code, wcId, judul } = route.query;
  const wc = wcId ? `&wcId=${wcId}` : '';
  setTitle(judul || 'Search');

  React.useEffect(() => {
    if (
      !localStorage.getItem('shiftId') ||
      !localStorage.getItem(`${code}MchId`)
    ) {
      Router.push({
        pathname: '/machine',
        query: { type: `searchcd?code=${code}${wc}&judul=${judul}` },
      });
    }
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getCd = async (value, die) => {
    setLoading(true);
    const dt = await odoo.getCD(code, value, die, wcId);
    const result = [];
    dt.forEach((element) => {
      result.push(element);
    });
    setPress(result);
    setLoading(false);
  };

  const getInProgress = async (value, die) => {
    setLoading(true);
    const dt = await odoo.getCDIp(code, value, die, wcId);
    const result = [];
    dt.forEach((element) => {
      result.push(element);
    });
    setPressIP(result);
    setLoading(false);
  };

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
                getCd(name.mo, name.die);
              }}
            >
              <InputBase
                className={classes.input}
                placeholder="Masukkan No MO"
                onChange={(event) =>
                  setName({
                    ...name,
                    mo: event.target.value,
                  })
                }
                value={name.mo}
                name="mo"
                id="mo"
              />

              <IconButton
                className={classes.iconButton}
                aria-label="search"
                onClick={() => {
                  getCd(name.mo, name.die);
                }}
              >
                <SearchIcon />
              </IconButton>
            </Paper>
            <Paper
              component="form"
              className={classes.root}
              onSubmit={(e) => {
                e.preventDefault();
                getCd(name.mo, name.die);
              }}
            >
              <InputBase
                className={classes.input}
                placeholder="Masukkan Die Index"
                onChange={(event) =>
                  setName({
                    ...name,
                    die: event.target.value,
                  })
                }
                value={name.die}
                name="die"
                id="die"
              />

              <IconButton
                className={classes.iconButton}
                aria-label="search"
                onClick={() => {
                  getCd(name.mo, name.die);
                }}
              >
                <SearchIcon />
              </IconButton>
            </Paper>
          </Box>
          <Box className="row">
            <Paper style={{ maxHeight: '100%', overflow: 'auto' }}>
              {press.map((x) => (
                <SearchCorr
                  judul={judul}
                  key={x.id}
                  product={`${x.name} / Qty: ${x.qty}`}
                  MoName={x.product_name}
                  productionID={x.production_id}
                  date={`Date Planned: ${OdooLib.formatDateTime(
                    x.date_planned
                  )}`}
                  code={code}
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
                getInProgress(nameIP.mo, nameIP.die);
              }}
            >
              <InputBase
                className={classes.input}
                placeholder="Masukkan No MO In Progress"
                onChange={(event) =>
                  setNameIP({
                    ...nameIP,
                    mo: event.target.value,
                  })
                }
                value={nameIP.mo}
                name="nameIP"
                id="nameIP"
              />
              <IconButton
                className={classes.iconButton}
                aria-label="search"
                onClick={() => {
                  getInProgress(nameIP.mo, nameIP.die);
                }}
              >
                <SearchIcon />
              </IconButton>
            </Paper>
            <Paper
              component="form"
              className={classes.root}
              onSubmit={(e) => {
                e.preventDefault();
                getInProgress(nameIP.mo, nameIP.die);
              }}
            >
              <InputBase
                className={classes.input}
                placeholder="Masukkan Die Index"
                onChange={(event) =>
                  setNameIP({
                    ...nameIP,
                    die: event.target.value,
                  })
                }
                value={nameIP.die}
                name="dieIP"
                id="dieIP"
              />
              <IconButton
                className={classes.iconButton}
                aria-label="search"
                onClick={() => {
                  getInProgress(nameIP.mo, nameIP.die);
                }}
              >
                <SearchIcon />
              </IconButton>
            </Paper>
          </Box>
          <Box className="row">
            <Paper style={{ maxHeight: '100%', overflow: 'auto' }}>
              {pressIP.map((x) => (
                <SearchCorr
                  judul={judul}
                  key={x.id}
                  product={`${x.name} / Qty: ${x.qty}`}
                  MoName={`${x.product_name}  (In Progress)`}
                  productionID={x.production_id}
                  id={x.id}
                  code={code}
                  date={`Date Start: ${OdooLib.formatDateTime(x.date_start)}`}
                />
              ))}
            </Paper>
          </Box>
        </Box>
      </TabPanel>
    </>
  );
};
export default SearchCdPage;

SearchCdPage.propTypes = {
  setTitle: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
};
