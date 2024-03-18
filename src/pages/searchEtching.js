/* eslint-disable import/no-named-as-default */
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
import Link from 'next/link';
import Head from 'next/head';
import Router, { useRouter } from 'next/router';
import OdooLib from '../models/odoo';
import BottomNavbarEtching from '../containers/Layout/bottomNavbarEtching';

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
    "&::placeholder": {
      color: "#000"
    },
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

const SearchEtchingCard = ({ id, MoName, product, productionID, type }) => (
  <Card>
    <CardActionArea>
      <Link
        href={{
          pathname: '/etching',
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
          <Typography variant="body2" style={{fontSize: 'bold'}} color="#000" component="p">
            {product}
          </Typography>
        </CardContent>
      </Link>
    </CardActionArea>
  </Card>
);

SearchEtchingCard.propTypes = {
  id: PropTypes.number.isRequired,
  MoName: PropTypes.string.isRequired,
  product: PropTypes.string.isRequired,
  productionID: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
};

const SearchEtchingPage = ({ setTitle, setLoading }) => {
  const classes = useStyles();
  const odoo = new OdooLib();
  setTitle('Search MO');
  const [name, setName] = React.useState('');
  const [press, setPress] = React.useState([]);
  const route = useRouter();
  const { type } = route.query;

  // const mchId = () => {
  //   if (type === 'etching') {
  //     return localStorage.getItem('etchingMchId');
  //   }
  //   if (type === 'cutting_fab') {
  //     return localStorage.getItem('cuttingFabMchId');
  //   }
  //   return localStorage.getItem('chromaticMchId');
  // };

  const getProductionEtching = async (value) => {
    setLoading(true);
    const dt = await odoo.getProductionEtching(value, type);
    setPress(dt);
    setLoading(false);
  };

  const checkMch = () => {
    if (type === 'etching') {
      return !localStorage.getItem('etchingMchId');
    }
    if (type === 'cutting_fab') {
      return !localStorage.getItem('cuttingFabMchId');
    }
    return !localStorage.getItem('chromateMchId');
  };

  React.useEffect(() => {
    if (!localStorage.getItem('shiftId') || checkMch()) {
      Router.push({
        pathname: '/machine',
        query: { type: `searchEtching?type=${type}` },
      });
    }
  }, []);

  return (
    <>
      <Head>
        <title>ALUBLESS</title>
      </Head>
      <Box className="row">
        <Paper
          component="form"
          className={classes.root}
          onSubmit={(e) => {
            e.preventDefault();
            getProductionEtching(name);
          }}
        >
          <InputBase
            className={classes.input}
            placeholder="Masukkan No MO"
            onChange={(event) => setName(event.target.value)}
            value={name}
            name="name"
            id="name"
            colorSecondary
            inputProps={{
              style: {
                color: '#000'
              }
            }}
          />
          <IconButton
            className={classes.iconButton}
            aria-label="search"
            onClick={() => {
              getProductionEtching(name);
            }}
          >
            <SearchIcon />
          </IconButton>
        </Paper>
      </Box>
      <Box className="row">
        <Paper
          style={{ maxHeight: '100%', overflow: 'auto' }}
          onSubmit={(e) => {
            e.preventDefault();
            getProductionEtching(name);
          }}
        >
          {press.map((x) => (
            <SearchEtchingCard
              key={x.id}
              product={`${x.product[1]} ${x.qty.toString()} ${x.uom[1]}`}
              MoName={x.production_id[1]}
              moveLines={x.move_lines}
              productionID={x.production_id[0]}
              id={x.id}
              type={type}
            />
          ))}
        </Paper>
      </Box>
      <BottomNavbarEtching />
    </>
  );
};
export default SearchEtchingPage;

SearchEtchingPage.propTypes = {
  setTitle: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
};
