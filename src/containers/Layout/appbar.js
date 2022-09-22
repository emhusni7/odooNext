import React, { useState } from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AppBar from '@material-ui/core/AppBar/AppBar';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Router, { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Link from 'next/link';

const useStyles = makeStyles(() => ({
  title: {
    flexGrow: 1,
    marginLeft: '10px',
  },
  labelSPB: {
    flexGrow: 1,
    align: 'center',
  },
}));

const AppbarSection = ({ title }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    localStorage.removeItem('uid');
    localStorage.removeItem('password');
    localStorage.removeItem('shiftId');
    localStorage.removeItem('shiftName');
    localStorage.removeItem('rollIds');
    localStorage.removeItem('dieMchId');
    localStorage.removeItem('dieMchName');
    localStorage.removeItem('pressMchId');
    localStorage.removeItem('pressMchName');
    localStorage.removeItem('ovenMchId');
    localStorage.removeItem('ovenMchName');
    localStorage.removeItem('rackingMchId');
    localStorage.removeItem('rackingMchName');
    localStorage.removeItem('unrackingMchId');
    localStorage.removeItem('unrackingMchName');
    localStorage.removeItem('drawnMchId');
    localStorage.removeItem('drawnMchName');
    localStorage.removeItem('polishMchId');
    localStorage.removeItem('polishMchName');
    localStorage.removeItem('brushMchId');
    localStorage.removeItem('brushMchName');
    localStorage.removeItem('holeMchId');
    localStorage.removeItem('holeMchName');
    localStorage.removeItem('bendingMchId');
    localStorage.removeItem('bendingMchName');
    localStorage.removeItem('ulirMchId');
    localStorage.removeItem('ulirMchName');
    localStorage.removeItem('anodizeMchId');
    localStorage.removeItem('anodizeMchName');
    localStorage.removeItem('paintingMchId');
    localStorage.removeItem('paintingMchName');
    localStorage.removeItem('etchingMchId');
    localStorage.removeItem('etchingMchName');
    localStorage.removeItem('palletMchId');
    localStorage.removeItem('palletMchName');
    localStorage.removeItem('chromateMchId');
    localStorage.removeItem('chromateMchName');
    localStorage.removeItem('cuttingFabMchId');
    localStorage.removeItem('cuttingFabMchName');
    localStorage.removeItem('preChromateMchId');
    localStorage.removeItem('preChromateMchName');
    localStorage.removeItem('bubutMchId');
    localStorage.removeItem('bubutMchName');
    localStorage.removeItem('cncMchId');
    localStorage.removeItem('cncMchName');
    localStorage.removeItem('potongMchId');
    localStorage.removeItem('potongMchName');
    localStorage.removeItem('fmMchId');
    localStorage.removeItem('fmMchName');
    localStorage.removeItem('hdMchId');
    localStorage.removeItem('hdMchName');
    localStorage.removeItem('finish_bubutMchId');
    localStorage.removeItem('finish_bubutMchName');
    localStorage.removeItem('grindingMchId');
    localStorage.removeItem('gridingMchName');
    localStorage.removeItem('WirecutMchId');
    localStorage.removeItem('WirecutMchName');
    localStorage.removeItem('edmMchId');
    localStorage.removeItem('edmMchName');
    localStorage.removeItem('borMchId');
    localStorage.removeItem('borMchName');
    localStorage.removeItem('millingMchId');
    localStorage.removeItem('millingMchName');
    localStorage.removeItem('nitridMchId');
    localStorage.removeItem('nitridMchName');
    localStorage.removeItem('snblMchId');
    localStorage.removeItem('snblMchName');
    localStorage.removeItem('lotMchId');
    localStorage.removeItem('lotMchName');
    localStorage.removeItem('pickingId');
    localStorage.removeItem('nitridId');
    localStorage.removeItem('username');
    localStorage.removeItem('meltingMchId');
    localStorage.removeItem('meltingMchName');
    localStorage.removeItem('rollMchId');
    localStorage.removeItem('spvId');
    localStorage.removeItem('spvName');
    Router.push('/login');
  };

  const handleCloseComponent = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        {router.pathname !== '/' && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => {
              if (router.pathname === '/machine') {
                Router.push('/');
              } else {
                Router.back();
              }
            }}
          >
            <ArrowBackIosIcon />
          </IconButton>
        )}
        <Link href="/">
          <Typography
            variant="h6"
            className={classes.title}
            style={{ cursor: 'pointer' }}
          >
            <a>Odoo</a>
          </Typography>
        </Link>
        <div className={classes.labelSPB}>
          <Typography variant="h6" className={classes.title}>
            {title}
          </Typography>
        </div>

        <div>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <Typography variant="h6" className={classes.title}>
              {localStorage.getItem('username')}
            </Typography>
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={open}
            onClose={handleCloseComponent}
          >
            <MenuItem onClick={handleClose}>Logout</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default AppbarSection;

AppbarSection.defaultProps = {
  title: '',
};

AppbarSection.propTypes = {
  title: PropTypes.string,
};
