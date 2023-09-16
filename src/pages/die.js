import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/dist/next-server/lib/head';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Link from 'next/link';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Router from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import TabPanel from '../components/tabPanel';
import OdooLib from '../models/odoo';

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
}));

const SearchDieCard = ({
  id,
  MoName,
  product,
  date,
  mchId,
  mchName,
  productId,
  status,
  wcId,
}) => (
  <Card>
    <CardActionArea>
      <Link
        href={{
          pathname: '/dieDetail',
          query: {
            id,
            mchId,
            mchName,
            moName: MoName,
            product,
            prodID: productId,
            state: status,
            wcId,
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

SearchDieCard.propTypes = {
  id: PropTypes.number.isRequired,
  MoName: PropTypes.string.isRequired,
  product: PropTypes.string.isRequired,
  date: PropTypes.string,
  mchId: PropTypes.number.isRequired,
  mchName: PropTypes.string.isRequired,
  productId: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  wcId: PropTypes.number.isRequired,
};

SearchDieCard.defaultProps = {
  date: '',
};

const DiePage = ({ setTitle, setMsgBox, setLoading }) => {
  const odoo = new OdooLib();
  const mchId = localStorage.getItem('dieMchId');
  const mchName = localStorage.getItem('dieMchName');
  setTitle(mchName);

  const date = new Date();
  const [production, setProduction] = useState([]);
  const [filterState, setFilterState] = useState('');
  const [tabValue, setValue] = React.useState('draft');
  const eDate = `${
    new Date(date.getFullYear(), date.getMonth(), date.getDate() + 4, 7, 0, 0)
      .toISOString()
      .split('T')[0]
  } 17:00:00`;
  const sDate = `${
    new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0)
      .toISOString()
      .split('T')[0]
  } 17:00:00`;

  const classes = useStyles();

  const getProductionDie = async () => {
    setLoading(true);
    const prod = await odoo.getProductionDie(
      sDate,
      eDate,
      Number(mchId),
      filterState,
      tabValue
    );
    try {
      setProduction([]);
      prod.forEach((element) => {
        setProduction((prevState) => [
          ...prevState,
          {
            dateStart: element.date_start,
            product_id: element.product[0],
            prodName: element.product[1],
            output_ids: element.output_ids,
            MoName: element.production_id[1],
            datePlanned: OdooLib.formatDateTime(
              new Date(`${element.date_planned}`).toString()
            ),
            wcId: element.workcenter_id[0],
            id: element.id,
            state: element.state,
          },
        ]);
      });
    } catch (e) {
      setMsgBox({ variant: 'error', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (!localStorage.getItem('shiftId') || !localStorage.getItem('dieMchId')) {
      Router.push({
        pathname: '/machine',
        query: { type: 'die' },
      });
    }
  }, []);

  return (
    <>
      <Head>
        <title>ALUBLESS - List MO Die</title>
      </Head>

      <>
        <AppBar position="static">
          <Tabs
            value={tabValue}
            onChange={handleChange}
            aria-label="simple tabs example"
          >
            <Tab label="New" value="draft" />
            <Tab label="In Progress" value="startworking" />
          </Tabs>
        </AppBar>
        <TabPanel value={tabValue} index="draft">
          <Box>
            <Box className="row">
              <Paper
                component="form"
                className={classes.root}
                onSubmit={(e) => {
                  e.preventDefault();
                  getProductionDie();
                }}
              >
                <InputBase
                  className={classes.input}
                  placeholder="Masukkan No MO"
                  onChange={(event) => setFilterState(event.target.value)}
                  value={filterState}
                  name="name"
                  id="name"
                />
                <IconButton
                  className={classes.iconButton}
                  aria-label="search"
                  onClick={() => {
                    getProductionDie();
                  }}
                >
                  <SearchIcon />
                </IconButton>
              </Paper>
            </Box>
            <Box className="row">
              <Paper style={{ maxHeight: '100%', overflow: 'auto' }}>
                {production
                  .filter((x) => x.state === tabValue)
                  .map((x) => (
                    <SearchDieCard
                      key={x.id}
                      product={x.prodName}
                      MoName={x.MoName}
                      date={`Date Planned: ${x.datePlanned}`}
                      id={x.id}
                      mchId={mchId}
                      mchName={mchName}
                      productId={x.product_id}
                      status={x.state}
                      wcId={x.wcId}
                    />
                  ))}
              </Paper>
            </Box>
          </Box>
        </TabPanel>
        <TabPanel value={tabValue} index="startworking">
          <Box>
            <Box className="row">
              <Paper
                component="form"
                className={classes.root}
                onSubmit={(e) => {
                  e.preventDefault();
                  getProductionDie();
                }}
              >
                <InputBase
                  className={classes.input}
                  placeholder="Masukkan No MO"
                  onChange={(event) => setFilterState(event.target.value)}
                  value={filterState}
                  name="name"
                  id="name"
                />
                <IconButton
                  className={classes.iconButton}
                  aria-label="search"
                  onClick={() => {
                    getProductionDie();
                  }}
                >
                  <SearchIcon />
                </IconButton>
              </Paper>
            </Box>
            <Box className="row">
              <Paper style={{ maxHeight: '100%', overflow: 'auto' }}>
                {production
                  .filter((x) => x.state === tabValue)
                  .map((x) => (
                    <SearchDieCard
                      key={x.id}
                      product={x.prodName}
                      MoName={x.MoName}
                      date={`Date Planned: ${x.datePlanned}`}
                      id={x.id}
                      mchId={mchId}
                      mchName={mchName}
                      productId={x.product_id}
                      status={x.state}
                      wcId={x.wcId}
                    />
                  ))}
              </Paper>
            </Box>
          </Box>
        </TabPanel>
      </>
    </>
  );
};

export default DiePage;

DiePage.propTypes = {
  setTitle: PropTypes.func.isRequired,
  setMsgBox: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
};
