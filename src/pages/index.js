import React, { useEffect } from 'react';
import Head from 'next/head';
// eslint-disable-next-line no-unused-vars
import Link from 'next/link';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActionArea from '@material-ui/core/CardActionArea';

import Divider from '@material-ui/core/Divider';
import PropTypes from 'prop-types';
import OdooLib from '../models/odoo';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    margin: '4px',
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

const IndexPage = ({ setTitle, setMsgBox }) => {
  const classes = useStyles();
  setTitle('');
  const uid = localStorage.getItem('uid');
  const [menu, addMenu] = React.useState([]);
  const odoo = new OdooLib();

  const getMenu = async () => {
    const dashboard = await odoo.getAccessUser(uid);

    const data = [];
    try {
      dashboard.forEach((item) => {
        data.sort().push(item);
      });
      addMenu(data);
    } catch (e) {
      setMsgBox({ variant: 'error', message: e.message });
    }
  };

  useEffect(() => {
    getMenu();
  }, []);

  return (
    <div>
      <Head>
        <title>ALUBLESS</title>
      </Head>
      <Grid container className={classes.root} spacing={1}>
        <Grid item xs={12}>
          <Grid container justify="center" spacing={2}>
            {menu.map((menuItem) => (
              <Card className={classes.root} hover>
                <CardActionArea href={menuItem.comment}>
                  <CardHeader
                    avatar={
                      <img
                        src={`/static/${
                          menuItem.name
                            .toLowerCase()
                            .replace(' ', '')
                            .split('.')[1]
                        }.png`}
                        width={35}
                        height={30}
                        alt={menuItem.name.replace(' ', '').split('.')[1]}
                      />
                    }
                    title={
                      <Typography style={{ color: '#0719fd', fontWeight: 700 }}>
                        {menuItem.name.split('.')[1]}
                      </Typography>
                    }
                  />
                  <Divider />
                </CardActionArea>
              </Card>
            ))}
            {/* {menu.map((menuItem) => (
              <Grid key={menuItem.name} item>
                <Link href={`${menuItem.comment}`}>
                  <Paper className={classes.paper}>
                    <img
                      src={`/static/${
                        menuItem.name
                          .toLowerCase()
                          .replace(' ', '')
                          .split('.')[1]
                      }.png`}
                      width="100%"
                      alt={menuItem.name.replace(' ', '').split('.')[1]}
                    />
                    <Typography
                      variant="body"
                      color="textSecondary"
                      component="h4"
                      align="center"
                    >
                      {menuItem.name.split('.')[1]}
                    </Typography>
                  </Paper>
                </Link>
              </Grid>
            ))} */}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

IndexPage.propTypes = {
  setTitle: PropTypes.func.isRequired,
  setMsgBox: PropTypes.func.isRequired,
};

export default IndexPage;
