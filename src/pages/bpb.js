import React, { useEffect, useState } from 'react';
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
import CardActions from '@material-ui/core/CardActions';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';
import OdooLib from '../models/odoo';
import BottomNavbarSection from '../containers/Layout/bottomNavbar';

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

const SPBCard = ({ noSpb, noPo, Supplier, id }) => (
  <Card>
    <CardActionArea>
      <Link href={`/edit?id=${id}`}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {`${noPo} - ${noSpb}`}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {Supplier}
          </Typography>
        </CardContent>
      </Link>
    </CardActionArea>
    <CardActions>
      {/* <Button size="small" color="primary"> */}
      <Link href={`/edit?id=${id}`}>
        <a>Edit</a>
      </Link>
      {/* </Button> */}
    </CardActions>
  </Card>
);

SPBCard.defaultProps = {
  noSpb: '',
  noPo: '',
  Supplier: '',
};

SPBCard.propTypes = {
  noSpb: PropTypes.string,
  noPo: PropTypes.string,
  Supplier: PropTypes.string,
  id: PropTypes.number.isRequired,
};

const BpbPage = ({ setTitle, setLoading, setMsgBox }) => {
  const classes = useStyles();
  const [picking, getPicking] = useState([]);
  const [poName, setPO] = useState('');
  const router = useRouter();
  const { po } = router.query;
  const odoo = new OdooLib();
  setTitle('Search SPB');

  const getPickingIds = async (query) => {
    setMsgBox({ message: '', variant: 'warning' });
    setLoading(true);
    if (!query) {
      setLoading(false);
      return false;
    }
    const picks = await odoo.getListPickingbyPOName(query);
    const items = [];
    if (picks instanceof Error) {
      setMsgBox({ message: picks.message, variant: 'error' });
    } else if (picks) {
      picks.forEach((pick) => {
        const item = {
          id: pick.id,
          origin: pick.origin,
          supplier: pick.partner_id[1],
          spb: pick.name,
        };
        items.push(item);
      });
    } else {
      setMsgBox({ message: 'Data not found', variant: 'warning' });
    }
    getPicking(items);
    setLoading(false);
    return true;
  };

  useEffect(() => {
    if (po) {
      setPO(po);
      getPickingIds(po);
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
            getPickingIds(poName);
          }}
        >
          <InputBase
            className={classes.input}
            placeholder="Masukkan No PO"
            name="poName"
            id="poName"
            onChange={(event) => {
              setPO(event.target.value);
            }}
            value={poName}
          />
          <IconButton
            className={classes.iconButton}
            aria-label="search"
            onClick={() => {
              getPickingIds(poName);
            }}
          >
            <SearchIcon />
          </IconButton>
        </Paper>
      </Box>
      <Box className="row">
        <Paper style={{ maxHeight: '100%', overflow: 'auto' }}>
          {picking.map((x) => (
            <SPBCard
              key={x.id}
              noPo={x.origin}
              noSpb={x.spb}
              Supplier={x.supplier}
              state="AVAILABLE"
              id={x.id}
            />
          ))}
        </Paper>
      </Box>
      <BottomNavbarSection />
    </>
  );
};
export default BpbPage;

BpbPage.propTypes = {
  setTitle: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  setMsgBox: PropTypes.func.isRequired,
};
