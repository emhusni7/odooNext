import React, { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import OdooLib from '../models/odoo';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingTop: '100px',
  },
  paper: {
    height: 150,
    width: 100,
  },
  control: {
    padding: theme.spacing(2),
  },
}));

const IndexPage = ({ setTitle, setMsgBox }) => {
  const classes = useStyles();
  setTitle('Main Menu');
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
        <title>Odoo App</title>
      </Head>
      <Grid container className={classes.root} spacing={1}>
        <Grid item xs={12}>
          <Grid container justify="center" spacing={2}>
            {menu.map((menuItem) => (
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
            ))}
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
