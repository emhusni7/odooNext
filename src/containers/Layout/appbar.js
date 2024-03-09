import React, { useState, useEffect } from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AppBar from '@material-ui/core/AppBar/AppBar';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Router, { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Link from 'next/link';
import MenuIcon from '@material-ui/icons/Menu';
import Divider from '@material-ui/core/Divider';
import OdooLib from '../../models/odoo';

const useStyles = makeStyles(() => ({
  title: {
    flexGrow: 1,
    marginLeft: '10px',
  },
  labelSPB: {
    flexGrow: 1,
    align: 'center',
  },
  titleColor: {
    fontSize: 30,
    background: '-webkit-linear-gradient(25deg, #0000FF 10%, #008000 50%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 800,
  },
}));

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

const AppbarSection = ({ title, setMsgBox }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const odoo = new OdooLib();
  const router = useRouter();
  const open = Boolean(anchorEl);
  const uid = localStorage.getItem('uid');
  const [menu, addMenu] = React.useState([]);

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
    if (Boolean(openMenu) === true) {
      getMenu();
    }
  }, [openMenu]);

  const clickMenu = (event) => {
    setOpenMenu(event.currentTarget);
  };

  const closeMenu = () => {
    setOpenMenu(null);
  };

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
    localStorage.removeItem('treatMchId');
    localStorage.removeItem('treatMchName');
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
    localStorage.removeItem('wcType');
    Router.push('/login');
  };

  const handleCloseComponent = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        {router.pathname === '/' && (
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
          >
            <MenuIcon onClick={(e) => clickMenu(e)} />
            <StyledMenu
              id="customized-menu"
              anchorEl={openMenu}
              keepMounted
              open={Boolean(openMenu)}
              onClose={closeMenu}
            >
              {menu.map((menuItem) => (
                <>
                  <Link href={`${menuItem.comment}`}>
                    <StyledMenuItem onClick={closeMenu}>
                      <ListItemIcon>
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
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body2"
                            style={{ color: '#00BFFF', fontWeight: 800 }}
                          >
                            {menuItem.name.split('.')[1]}
                          </Typography>
                        }
                      />
                    </StyledMenuItem>
                  </Link>
                  <Divider />
                </>
              ))}
            </StyledMenu>
          </IconButton>
        )}
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
            <a className={classes.titleColor}>ALUBLESS</a>
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
  setMsgBox: PropTypes.func.isRequired,
};
